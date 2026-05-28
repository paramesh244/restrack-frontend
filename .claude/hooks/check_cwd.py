#!/usr/bin/env python3
"""
PreToolUse hook for Claude Code.
Blocks any tool call that accesses paths outside the current working directory.

How it works:
- Receives tool call JSON on stdin from Claude Code
- Extracts file paths from the tool input
- Resolves them to absolute paths
- Blocks (exit 2) if path is outside CWD
- Allows (exit 0) if path is inside CWD or no path detected

Setup:
  1. Place this file at: .claude/hooks/check_cwd.py
  2. chmod +x .claude/hooks/check_cwd.py
  3. Add hooks config to .claude/settings.json (see bottom of file)
"""

import json
import os
import sys
import re

# ============================================================
# CONFIGURATION
# ============================================================

# Paths that are ALWAYS allowed (even outside CWD)
# Add paths Claude legitimately needs for your workflow
WHITELIST = [
    "/tmp",
    "/dev/null",
    # "/etc/nginx",          # uncomment if needed
    # "/var/log/myapp",      # uncomment if needed
]

# Paths that are ALWAYS blocked (even if inside CWD)
BLACKLIST = [
    os.path.expanduser("~/.ssh"),
    os.path.expanduser("~/.aws"),
    os.path.expanduser("~/.env"),
    os.path.expanduser("~/Downloads"),
    os.path.expanduser("~/Documents"),
    os.path.expanduser("~/Desktop"),
    "/etc/shadow",
    "/etc/passwd",
]

# Bash commands that are always safe (no path checking needed)
SAFE_BASH_COMMANDS = [
    "echo", "date", "whoami", "pwd", "which", "node --version",
    "npm --version", "python3 --version", "git status", "git log",
    "git branch", "git diff", "tsc --version",
]

# Bash command patterns that are ALWAYS blocked (process-killing / system-wide impact).
# Each entry is a regex matched (case-insensitive) against the command string.
# `_CMD_POS` matches command-position only: start-of-string, or after a shell
# separator (`;`, `&&`, `||`, `|`, `&`, `(`, backtick, newline) plus optional
# whitespace. This prevents false positives where the keyword appears as an
# argument (e.g. `npm install pm2-something` should not match `pm2`).
_CMD_POS = r'(?:^|[;&|`(\n])\s*'
BLOCKED_BASH_PATTERNS = [
    (_CMD_POS + r'pkill\s+-f\b',                  "pkill -f is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'pkill\b',                       "pkill is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'xargs\b[^\n;&|`]*\bkill\b',     "xargs kill is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'fuser\s+[^\n;&|`]*-k\b',        "fuser -k is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'(?:[\w./-]*/)?pm2\b',           "pm2 commands are blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'kill\s+-9\b',                   "kill -9 is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
    (_CMD_POS + r'kill\s+-SIGKILL\b',             "kill -SIGKILL is blocked, to restart backend use the restart-backend.sh or run-backend.sh as per system instructions"),
]

# ============================================================
# LOGIC
# ============================================================

def get_cwd():
    """Get the current working directory."""
    return os.getcwd()

def is_path_under(path, parent):
    """Check if resolved path is under parent directory."""
    try:
        path = os.path.realpath(os.path.expanduser(path))
        parent = os.path.realpath(parent)
        return path.startswith(parent + os.sep) or path == parent
    except (ValueError, OSError):
        return False

def is_whitelisted(path):
    """Check if path is in the whitelist."""
    resolved = os.path.realpath(os.path.expanduser(path))
    for w in WHITELIST:
        w_resolved = os.path.realpath(os.path.expanduser(w))
        if resolved.startswith(w_resolved + os.sep) or resolved == w_resolved:
            return True
    return False

def is_blacklisted(path):
    """Check if path is in the blacklist."""
    resolved = os.path.realpath(os.path.expanduser(path))
    for b in BLACKLIST:
        b_resolved = os.path.realpath(os.path.expanduser(b))
        if resolved.startswith(b_resolved + os.sep) or resolved == b_resolved:
            return True
    return False

def extract_paths_from_bash(command):
    """Extract file paths from a bash command string."""
    paths = []
    
    # Common patterns that reference files
    # Matches absolute paths, ~/ paths, and ../ paths
    path_patterns = [
        r'(?:^|\s)(\/[\w.\-\/]+)',           # /absolute/path
        r'(?:^|\s)(~\/[\w.\-\/]+)',           # ~/home/path
        r'(?:^|\s)(\.\.\/[\w.\-\/]*)',        # ../parent/path
        r'(?:cat|less|head|tail|wc|grep|find|ls|cd|cp|mv|rm|touch|mkdir|chmod|chown|vi|vim|nano|code|diff)\s+["\']?([\/~\.][^\s"\'|;>&]+)',
        r'>\s*([\/~\.][^\s"\'|;>&]+)',        # redirect: > /path
        r'>>\s*([\/~\.][^\s"\'|;>&]+)',       # append: >> /path
        r'<\s*([\/~\.][^\s"\'|;>&]+)',        # input: < /path
    ]
    
    for pattern in path_patterns:
        matches = re.findall(pattern, command)
        for m in matches:
            if isinstance(m, tuple):
                paths.extend([p for p in m if p])
            else:
                paths.append(m)
    
    return paths

def check_path(path, cwd, tool_name=""):
    """
    Check if a path is allowed.
    Returns (allowed: bool, reason: str)
    """
    if not path or path.strip() == '':
        return True, ""
    
    # Always block blacklisted paths
    if is_blacklisted(path):
        return False, f"Path is blacklisted: {path}"
    
    # Always allow whitelisted paths
    if is_whitelisted(path):
        return True, ""
    
    # Check if path is under CWD
    if is_path_under(path, cwd):
        return True, ""
    
    # Relative paths without ../ are fine (they resolve under CWD)
    if not path.startswith('/') and not path.startswith('~') and '..' not in path:
        return True, ""
    
    # Everything else is blocked
    return False, f"Path is outside working directory ({cwd}): {path}"

def is_safe_bash(command):
    """Check if a bash command is inherently safe."""
    cmd_stripped = command.strip()
    for safe in SAFE_BASH_COMMANDS:
        if cmd_stripped == safe or cmd_stripped.startswith(safe + ' '):
            return True
    return False

def check_blocked_bash(command):
    """
    Check if a bash command matches any blocked pattern.
    Returns (blocked: bool, reason: str)
    """
    for pattern, reason in BLOCKED_BASH_PATTERNS:
        if re.search(pattern, command, flags=re.IGNORECASE):
            return True, reason
    return False, ""

def main():
    cwd = get_cwd()
    
    # Read hook input from stdin
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            sys.exit(0)  # No input, allow
        hook_input = json.loads(raw)
    except (json.JSONDecodeError, Exception):
        # Can't parse input, allow (fail open)
        sys.exit(0)
    
    tool_name = hook_input.get('tool_name', '') or hook_input.get('name', '')
    tool_input = hook_input.get('tool_input', {}) or hook_input.get('input', {})
    
    if isinstance(tool_input, str):
        try:
            tool_input = json.loads(tool_input)
        except json.JSONDecodeError:
            tool_input = {}
    
    # --- Handle Bash tool ---
    if tool_name.lower() in ('bash', 'execute_bash', 'shell', 'terminal'):
        command = tool_input.get('command', '') or tool_input.get('cmd', '')

        # Block dangerous process-killing / system-wide commands first,
        # before any safe-list short-circuit or path checks.
        blocked, reason = check_blocked_bash(command)
        if blocked:
            result = {
                "decision": "block",
                "reason": f"Blocked: {reason}\nCommand: {command}"
            }
            print(json.dumps(result), file=sys.stderr)
            sys.exit(2)

        if is_safe_bash(command):
            sys.exit(0)

        paths = extract_paths_from_bash(command)
        for path in paths:
            allowed, reason = check_path(path, cwd, tool_name)
            if not allowed:
                result = {
                    "decision": "block",
                    "reason": f"Blocked: {reason}\nCommand: {command}"
                }
                print(json.dumps(result), file=sys.stderr)
                sys.exit(2)
        
        sys.exit(0)
    
    # --- Handle Read/Edit/Write tools ---
    if tool_name.lower() in ('read', 'file_read', 'readfile',
                              'write', 'edit', 'file_write', 'file_edit',
                              'writefile', 'editfile', 'str_replace_editor',
                              'create_file'):
        path = (tool_input.get('path', '') or 
                tool_input.get('file_path', '') or 
                tool_input.get('filePath', ''))
        
        if path:
            allowed, reason = check_path(path, cwd, tool_name)
            if not allowed:
                result = {
                    "decision": "block",
                    "reason": f"Blocked: {reason}"
                }
                print(json.dumps(result), file=sys.stderr)
                sys.exit(2)
    
    # --- Handle Grep/Glob/Search tools ---
    if tool_name.lower() in ('grep', 'search', 'glob', 'find', 'list_dir'):
        path = (tool_input.get('path', '') or 
                tool_input.get('directory', '') or
                tool_input.get('dir', ''))
        
        if path:
            allowed, reason = check_path(path, cwd, tool_name)
            if not allowed:
                result = {
                    "decision": "block",
                    "reason": f"Blocked: {reason}"
                }
                print(json.dumps(result), file=sys.stderr)
                sys.exit(2)
    
    # Allow everything else
    sys.exit(0)

if __name__ == '__main__':
    main()


# ============================================================
# SETUP INSTRUCTIONS
# ============================================================
#
# 1. Create the hooks directory:
#      mkdir -p .claude/hooks
#
# 2. Copy this file:
#      cp check_cwd.py .claude/hooks/check_cwd.py
#      chmod +x .claude/hooks/check_cwd.py
#
# 3. Add to .claude/settings.json:
#
# {
#   "hooks": {
#     "PreToolUse": [
#       {
#         "matcher": "Bash",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "Read",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "Edit",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "Write",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "Grep",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "Glob",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       },
#       {
#         "matcher": "WebFetch",
#         "hooks": [{ "type": "command", "command": "python3 .claude/hooks/check_cwd.py" }]
#       }
#     ]
#   }
# }
#
# 4. Test it:
#      claude -p "check ~/Downloads" --dangerously-skip-permissions
#      # Should be BLOCKED
#
#      claude -p "list files in src/" --dangerously-skip-permissions
#      # Should WORK
#
# ============================================================
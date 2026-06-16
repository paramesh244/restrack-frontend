import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { userService, User } from '@/lib/api/userService';

const ROLES = ['Engineer', 'Super Admin'];

const ROLE_STYLES: Record<string, string> = {
  'Super Admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Engineer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Team = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.list({
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setUsers(res.data ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Team</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Directory of workspace members</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Member</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3" colSpan={5}>
                    <div className="flex items-center gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-full bg-muted flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No team members found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[user.role] ?? 'bg-muted text-muted-foreground'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {formatDate(user.date_joined)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">
                    {formatDate(user.last_active)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && users.length > 0 && (
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            {users.length} member{users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;

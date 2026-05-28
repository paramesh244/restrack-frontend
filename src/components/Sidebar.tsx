import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMockAuth, AppRole } from "@/contexts/MockAuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FilePlus,
  MessageSquare,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const APP_NAME = "ResTrack";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: AppRole[];
}

/*
 * TODO: Real API binding
 * import { apiService } from '@/lib/api';
 * const response = await apiService.get({ endpoint: '/auth/me' });
 * Replace useMockAuth().role with response.data.role for real role-based nav filtering.
 */
const mainNavItems: NavItem[] = [
  { label: "Dashboard",      href: "/dashboard",      icon: LayoutDashboard, roles: ["Super Admin", "Engineer"] },
  { label: "Add Resolution", href: "/add-resolution", icon: FilePlus,        roles: ["Super Admin", "Engineer"] },
  { label: "AI Chat",        href: "/ai-chat",        icon: MessageSquare,   roles: ["Super Admin", "Engineer"] },
  { label: "Admin Panel",    href: "/admin",          icon: ShieldCheck,     roles: ["Super Admin"] },
];

const footerNavItems: NavItem[] = [];

function NavContent({
  isCollapsed,
  onNavClick,
}: {
  isCollapsed: boolean;
  onNavClick?: () => void;
}) {
  const location = useLocation();
  const { themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const { role: mockRole } = useMockAuth();
  const role: AppRole = (user?.role as AppRole) || mockRole;
  const isDark = themeMode === "dark";

  const navLinkClass = (href: string) => {
    const isActive =
      location.pathname === href || location.pathname.startsWith(href + "/");
    return cn(
      "flex items-center gap-3 mx-2 rounded-lg text-sm font-medium transition-colors py-2.5",
      isCollapsed ? "justify-center px-0" : "px-3",
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );
  };

  const visibleMain = mainNavItems.filter((item) => item.roles.includes(role));
  const visibleFooter = footerNavItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        {visibleMain.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={isCollapsed ? item.label : undefined}
            onClick={onNavClick}
            className={navLinkClass(item.href)}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border pt-2 pb-3 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={() => setThemeMode(isDark ? "light" : "dark")}
          title={isCollapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined}
          className={cn(
            "flex items-center gap-3 mx-2 rounded-lg text-sm font-medium transition-colors py-2.5 w-full",
            isCollapsed ? "justify-center px-0" : "px-3",
            "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {isDark ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        {/* Footer nav items (role-filtered) */}
        {visibleFooter.map((item) => {
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.label : undefined}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 mx-2 rounded-lg text-sm font-medium transition-colors py-2.5",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* User info card — expanded only */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mx-2 px-3 py-2 rounded-lg bg-muted/50">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              title={isCollapsed ? "Logout" : undefined}
              className={cn(
                "flex items-center gap-3 mx-2 rounded-lg text-sm font-medium transition-colors py-2.5 w-full",
                isCollapsed ? "justify-center px-0" : "px-3",
                "text-destructive hover:bg-destructive/10"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Logout</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        title="Open menu"
        className="md:hidden fixed top-3 left-3 z-50 h-9 w-9 rounded-md flex items-center justify-center bg-background border border-border shadow-sm hover:bg-muted transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile: backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile: slide-in drawer */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 h-screen w-[var(--sidebar-width,256px)] flex flex-col bg-card border-r border-border transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <span className="text-lg font-bold text-foreground truncate">{APP_NAME}</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            title="Close menu"
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <NavContent isCollapsed={false} onNavClick={() => setIsMobileOpen(false)} />
      </aside>

      {/* Desktop: collapsible sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 shrink-0",
          isCollapsed ? "w-16" : "w-[var(--sidebar-width,256px)]"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!isCollapsed && (
            <span className="text-lg font-bold text-foreground truncate">{APP_NAME}</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <NavContent isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}

export const MobileHeader = () => null;

export default Sidebar;

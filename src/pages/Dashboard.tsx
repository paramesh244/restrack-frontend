import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, AlertTriangle, Tag, Clock } from 'lucide-react';
import { dashboardService, DashboardStats, ActivityItem, Resolution } from '@/lib/api/dashboardService';
import AddResolution from './AddResolution';

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

function timeAgo(dateStr: string) {
  const ts = new Date(dateStr).getTime();
  if (!dateStr || isNaN(ts)) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dashboardService.getStats(),
      dashboardService.getRecentActivity(5),
      dashboardService.getRecentResolutions(5),
    ]).then(([statsResult, activityResult, resolutionsResult]) => {
      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (activityResult.status === 'fulfilled') setActivity(activityResult.value ?? []);
      if (resolutionsResult.status === 'fulfilled') setResolutions(resolutionsResult.value ?? []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
    <AddResolution
      open={addOpen}
      onClose={() => setAddOpen(false)}
    />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex gap-3">
          <Button onClick={() => setAddOpen(true)}>Add Resolution</Button>
          <Button variant="outline" onClick={() => navigate('/ai-chat')}>Open Chat</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Resolutions"
          value={loading ? '—' : stats?.total_resolutions ?? 0}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="This Month"
          value={loading ? '—' : stats?.resolutions_this_month ?? 0}
          sub="new resolutions added"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Open Issues"
          value={loading ? '—' : stats?.open_issues ?? 0}
          sub="pending resolution"
        />
        <StatCard
          icon={<Tag className="w-5 h-5" />}
          label="Top Tags"
          value={loading ? '—' : (stats?.most_used_tags?.slice(0, 2).join(', ') || '—')}
          sub={stats?.most_used_tags?.slice(2).join(', ')}
        />
      </div>

      {/* Main content: resolutions table + activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Resolutions */}
        <div className="xl:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Resolutions</h2>
            <button
              onClick={() => navigate('/resolutions')}
              className="text-xs text-primary hover:underline"
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex gap-4 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : resolutions.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">No resolutions yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {resolutions.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/resolutions/${r.id}`)}
                  className="px-5 py-3 flex items-center gap-4 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {r.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                      <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      SEVERITY_STYLES[r.severity] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {r.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>

          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex gap-3 animate-pulse">
                  <div className="w-7 h-7 bg-muted rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">No recent activity.</p>
          ) : (
            <div className="divide-y divide-border">
              {activity.map((a) => (
                <div key={a.id} className="px-5 py-3 flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {a.user_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">
                      <span className="font-medium">{a.user_name}</span>{' '}
                      <span className="text-muted-foreground">{a.action}</span>{' '}
                      <button
                        onClick={() => navigate(`/resolutions/${a.resolution_id}`)}
                        className="font-medium hover:underline truncate"
                      >
                        {a.resolution_title}
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(a.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;

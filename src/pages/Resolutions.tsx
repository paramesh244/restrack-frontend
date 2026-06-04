import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { dashboardService, Resolution } from '@/lib/api/dashboardService';
import AddResolution from './AddResolution';

const SEVERITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

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

const Resolutions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const severity = searchParams.get('severity') ?? '';

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getResolutions({ search, severity });
      setResolutions(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [search, severity]);

  useEffect(() => { fetch(); }, [fetch]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const hasFilters = search || severity;

  return (
    <>
      <AddResolution
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => { setAddOpen(false); fetch(); }}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Resolutions</h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-0.5">{total} resolution{total !== 1 ? 's' : ''}</p>
            )}
          </div>
          <Button onClick={() => setAddOpen(true)}>Add Resolution</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by title, tag, or hardware…"
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
            />
          </div>

          <Select value={severity || 'all'} onValueChange={(v) => setParam('severity', v === 'all' ? '' : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {SEVERITY_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex gap-4 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : resolutions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {hasFilters ? 'No resolutions match your filters.' : 'No resolutions yet.'}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-2 text-sm text-primary hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {resolutions.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/resolutions/${r.id}`)}
                  className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {r.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                      {r.hardware_reference && (
                        <span className="text-xs text-muted-foreground">{r.hardware_reference}</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{timeAgo(r.created_at)}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${SEVERITY_STYLES[r.severity] ?? 'bg-muted text-muted-foreground'}`}>
                    {r.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resolutions;

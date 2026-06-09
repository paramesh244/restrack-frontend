import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { dashboardService, ResolutionFull } from '@/lib/api/dashboardService';
import AddResolution from './AddResolution';

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section = ({ label, children }: SectionProps) => (
  <div className="space-y-1.5">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
    <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{children}</div>
  </div>
);

const ResolutionDetail = () => {
  const { resolutionId } = useParams<{ resolutionId: string }>();
  const navigate = useNavigate();

  const [resolution, setResolution] = useState<ResolutionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!resolutionId) return;
    setLoading(true);
    setNotFound(false);
    try {
      const data = await dashboardService.getResolutionById(resolutionId);
      setResolution(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [resolutionId]);

  const handleDelete = async () => {
    if (!resolutionId) return;
    setDeleting(true);
    try {
      await dashboardService.deleteResolution(resolutionId);
      navigate('/resolutions', { replace: true });
    } catch {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-6 bg-muted rounded w-2/3" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !resolution) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Resolution not found.</p>
          <button onClick={() => navigate('/resolutions')} className="mt-2 text-sm text-primary hover:underline">
            Back to Resolutions
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AddResolution
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editData={resolution}
        onUpdated={() => { setEditOpen(false); load(); }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resolution</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{resolution.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>

        {/* Title + Severity */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground flex-1">{resolution.title}</h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 mt-1 ${SEVERITY_STYLES[resolution.severity] ?? 'bg-muted text-muted-foreground'}`}>
              {resolution.severity}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {resolution.hardware_reference && (
              <span>HW: <span className="text-foreground font-medium">{resolution.hardware_reference}</span></span>
            )}
            {resolution.firmware_version && (
              <span>FW: <span className="text-foreground font-medium">{resolution.firmware_version}</span></span>
            )}
            {resolution.created_by?.name && (
              <span>By: <span className="text-foreground font-medium">{resolution.created_by.name}</span></span>
            )}
          </div>

          {/* Tags */}
          {resolution.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resolution.tags.map((t) => (
                <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content sections */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {resolution.problem && (
            <div className="px-5 py-4">
              <Section label="Problem">{resolution.problem}</Section>
            </div>
          )}
          {resolution.root_cause && (
            <div className="px-5 py-4">
              <Section label="Root Cause">{resolution.root_cause}</Section>
            </div>
          )}
          {resolution.solution && (
            <div className="px-5 py-4">
              <Section label="Solution">{resolution.solution}</Section>
            </div>
          )}
          {resolution.extra_notes && (
            <div className="px-5 py-4">
              <Section label="Extra Notes">{resolution.extra_notes}</Section>
            </div>
          )}
        </div>

        {/* Footer timestamps */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground pb-4">
          <span>Created: {formatDate(resolution.created_at)}</span>
          <span>Last updated: {formatDate(resolution.updated_at)}</span>
        </div>
      </div>
    </>
  );
};

export default ResolutionDetail;

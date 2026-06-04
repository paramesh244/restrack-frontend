import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dashboardService, CreateResolutionPayload } from '@/lib/api/dashboardService';

interface AddResolutionProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

const SEVERITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const empty: CreateResolutionPayload = {
  title: '',
  problem: '',
  root_cause: '',
  solution: '',
  tags: [],
  hardware_reference: '',
  firmware_version: '',
  extra_notes: '',
  severity: '',
};

const AddResolution = ({ open, onClose, onCreated }: AddResolutionProps) => {
  const [form, setForm] = useState<CreateResolutionPayload>(empty);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof CreateResolutionPayload, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleClose = () => {
    setForm(empty);
    setTagsInput('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.severity) { setError('Severity is required.'); return; }
    setError('');
    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const result = await dashboardService.createResolution({ ...form, tags });
      onCreated?.(result.id);
      handleClose();
    } catch {
      setError('Failed to save resolution. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Resolution</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Brief title for this resolution"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="severity">Severity <span className="text-destructive">*</span></Label>
              <Select value={form.severity} onValueChange={(v) => set('severity', v)}>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="firmware, sensor, I2C (comma separated)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hardware_reference">Hardware Reference</Label>
              <Input
                id="hardware_reference"
                value={form.hardware_reference}
                onChange={(e) => set('hardware_reference', e.target.value)}
                placeholder="e.g. HW-REV-4B"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="firmware_version">Firmware Version</Label>
              <Input
                id="firmware_version"
                value={form.firmware_version}
                onChange={(e) => set('firmware_version', e.target.value)}
                placeholder="e.g. v3.2.1"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="problem">Problem</Label>
              <Textarea
                id="problem"
                rows={3}
                value={form.problem}
                onChange={(e) => set('problem', e.target.value)}
                placeholder="Describe the problem"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="root_cause">Root Cause</Label>
              <Textarea
                id="root_cause"
                rows={3}
                value={form.root_cause}
                onChange={(e) => set('root_cause', e.target.value)}
                placeholder="Explain the root cause"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                rows={3}
                value={form.solution}
                onChange={(e) => set('solution', e.target.value)}
                placeholder="Describe the solution"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="extra_notes">Extra Notes</Label>
              <Textarea
                id="extra_notes"
                rows={2}
                value={form.extra_notes}
                onChange={(e) => set('extra_notes', e.target.value)}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Resolution'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddResolution;

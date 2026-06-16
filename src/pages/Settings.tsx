import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsService } from '@/lib/api/settingsService';
import { toast } from '@/lib/toast';

const Settings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [sendgridKey, setSendgridKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<'openai' | 'sendgrid' | null>(null);
  const [testResults, setTestResults] = useState<Record<'openai' | 'sendgrid', boolean | null>>({
    openai: null,
    sendgrid: null,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await settingsService.detail();
        setOpenaiKey(data.openai_api_key || '');
        setSendgridKey(data.sendgrid_api_key || '');
      } catch {
        // error toast handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!openaiKey.trim() || !sendgridKey.trim()) {
      toast.error('Both API keys are required');
      return;
    }
    setSaving(true);
    try {
      await settingsService.update({
        openai_api_key: openaiKey.trim(),
        sendgrid_api_key: sendgridKey.trim(),
      });
      toast.success('Settings saved');
    } catch {
      // error toast handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (integration: 'openai' | 'sendgrid') => {
    setTesting(integration);
    setTestResults((prev) => ({ ...prev, [integration]: null }));
    try {
      const res = await settingsService.testConnection({ integration });
      setTestResults((prev) => ({ ...prev, [integration]: res.success }));
    } catch {
      setTestResults((prev) => ({ ...prev, [integration]: false }));
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage API keys for AI chat and email integrations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Configure the credentials used by the AI assistant and outbound email.
            Existing keys are stored masked; replacing a key requires entering the new value in full.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <div className="flex items-center gap-2">
                {testResults.openai === true && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                )}
                {testResults.openai === false && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Failed
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest('openai')}
                  disabled={testing === 'openai'}
                >
                  {testing === 'openai' && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Test
                </Button>
              </div>
            </div>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-…"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
              <div className="flex items-center gap-2">
                {testResults.sendgrid === true && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                )}
                {testResults.sendgrid === false && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Failed
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest('sendgrid')}
                  disabled={testing === 'sendgrid'}
                >
                  {testing === 'sendgrid' && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Test
                </Button>
              </div>
            </div>
            <Input
              id="sendgrid-key"
              type="password"
              placeholder="SG.…"
              value={sendgridKey}
              onChange={(e) => setSendgridKey(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

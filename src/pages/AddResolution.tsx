import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AddResolution = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Add Resolution</h1>

      {saved ? (
        <div className="rounded-md border bg-muted/50 p-6 space-y-4">
          <p className="text-sm text-foreground font-medium">Resolution saved successfully.</p>
          <div className="flex gap-3">
            <Button onClick={() => setSaved(false)}>Add Another</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <Button type="submit">Save Resolution</Button>
        </form>
      )}
    </div>
  );
};

export default AddResolution;

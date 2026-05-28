import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ResolutionDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-semibold text-foreground">Resolution Detail</h1>
    </div>
  );
};

export default ResolutionDetail;

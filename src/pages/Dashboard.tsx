import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const mockResolutions = [
  { id: '1', title: 'STM32 UART Init Failure', severity: 'HIGH', tags: ['UART', 'STM32'], created_at: '2024-01-15' },
  { id: '2', title: 'CAN Bus Timeout on Boot', severity: 'CRITICAL', tags: ['CAN', 'Boot'], created_at: '2024-01-14' },
  { id: '3', title: 'ADC Calibration Drift', severity: 'MEDIUM', tags: ['ADC'], created_at: '2024-01-13' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/add-resolution')}>Add Resolution</Button>
          <Button variant="outline" onClick={() => navigate('/ai-chat')}>Open Chat</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Severity</th>
              <th className="px-4 py-3 text-left font-medium">Tags</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {mockResolutions.map((row) => (
              <tr
                key={row.id}
                className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/resolutions/${row.id}`)}
              >
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="px-4 py-3">{row.severity}</td>
                <td className="px-4 py-3">{row.tags.join(', ')}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

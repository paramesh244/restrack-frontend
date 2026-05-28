import { useNavigate } from 'react-router-dom';

const mockResolutions = [
  { id: '1', title: 'STM32 UART Init Failure', severity: 'HIGH', created_by: 'Alice', created_at: '2024-01-15' },
  { id: '2', title: 'CAN Bus Timeout on Boot', severity: 'CRITICAL', created_by: 'Bob', created_at: '2024-01-14' },
  { id: '3', title: 'ADC Calibration Drift', severity: 'MEDIUM', created_by: 'Carol', created_at: '2024-01-13' },
];

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Severity</th>
              <th className="px-4 py-3 text-left font-medium">Author</th>
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
                <td className="px-4 py-3">{row.created_by}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;

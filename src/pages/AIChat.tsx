import { useNavigate } from 'react-router-dom';

const mockSources = [
  { id: '1', title: 'STM32 UART Init Failure', excerpt: 'The UART peripheral failed to initialize due to incorrect clock configuration...' },
  { id: '2', title: 'CAN Bus Timeout on Boot', excerpt: 'CAN bus entered error-passive state during early boot because...' },
];

const AIChat = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">AI Chat</h1>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sources</p>
        {mockSources.map((source) => (
          <div
            key={source.id}
            className="rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate(`/resolutions/${source.id}`)}
          >
            <p className="font-medium text-sm">{source.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{source.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIChat;

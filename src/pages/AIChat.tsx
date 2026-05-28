import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Bot, User, Sparkles } from 'lucide-react';
import { chatService, ChatSource, ChatSuggestion } from '@/lib/api/chatService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  message_id?: string;
  sources?: ChatSource[];
  feedback?: 'up' | 'down';
  sourcesOpen?: boolean;
}

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatService.getSuggestions().then(setSuggestions).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  const buildHistory = () =>
    messages.map((m) => ({ role: m.role, content: m.content }));

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const result = await chatService.sendMessage(trimmed, buildHistory());
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.response,
          message_id: result.message_id,
          sources: result.sources,
          sourcesOpen: false,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const toggleSources = (index: number) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, sourcesOpen: !m.sourcesOpen } : m))
    );
  };

  const giveFeedback = async (index: number, rating: 'up' | 'down') => {
    const msg = messages[index];
    if (!msg.message_id || msg.feedback) return;
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, feedback: rating } : m))
    );
    try {
      await chatService.sendFeedback(msg.message_id, rating);
    } catch {
      // silently ignore
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col -m-4 md:-m-6 h-[calc(100%+2rem)] md:h-[calc(100%+3rem)] bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 pb-8 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">How can I help you?</h2>
              <p className="text-muted-foreground text-sm text-center max-w-sm">
                Ask anything about your resolutions, error logs, or engineering issues.
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => send(s.question)}
                    className="text-left rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground hover:bg-muted/60 transition-colors"
                  >
                    {s.question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="flex flex-col gap-2 w-full">
                      {/* Sources accordion */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleSources(i)}
                            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/40 transition-colors"
                          >
                            <span>{msg.sources.length} source{msg.sources.length > 1 ? 's' : ''}</span>
                            {msg.sourcesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {msg.sourcesOpen && (
                            <div className="divide-y divide-border">
                              {msg.sources.map((src) => (
                                <div
                                  key={src.id}
                                  onClick={() => navigate(`/resolutions/${src.id}`)}
                                  className="px-3 py-2 cursor-pointer hover:bg-muted/40 transition-colors"
                                >
                                  <p className="text-xs font-medium text-foreground">{src.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{src.excerpt}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Feedback */}
                      {msg.message_id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => giveFeedback(i, 'up')}
                            disabled={!!msg.feedback}
                            className={`p-1.5 rounded-md transition-colors ${
                              msg.feedback === 'up'
                                ? 'text-green-500'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => giveFeedback(i, 'down')}
                            disabled={!!msg.feedback}
                            className={`p-1.5 rounded-md transition-colors ${
                              msg.feedback === 'down'
                                ? 'text-red-500'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Chat..."
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[24px] max-h-[180px] leading-6"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

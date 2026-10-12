import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, FileChip, CodeSnippet } from '../types';
import {
  FileCode,
  Copy,
  Check,
  Send,
  Trash2,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';

interface RepoChatPanelProps {
  initialMessages: ChatMessage[];
  onSelectFileChip?: (filePath: string) => void;
}

const PREBAKED_RESPONSES: Record<
  string,
  {
    thinking: string;
    content: string;
    fileChips: FileChip[];
    codeSnippets: CodeSnippet[];
  }
> = {
  'Explain repo entrypoint': {
    thinking: `Analyzing entrypoint AST across project root.
Traced main bootstrap sequence in src/index.ts and src/server.ts.
Identified HTTP listener initialization, graceful SIGTERM termination handler, and middleware pipeline attachment.`,
    content: `The repository entrypoint initializes an asynchronous server runtime and attaches the core middleware pipeline:

1. **Bootstrap Phase**: Reads configuration from environment variables with Zod validation.
2. **Middleware Pipeline**: Attaches CORS, JWT authentication guards, and the sliding-window rate limiter.
3. **Graceful Shutdown**: Intercepts \`SIGINT\` and \`SIGTERM\` to cleanly drain pending HTTP connections and flush Redis connection pools.`,
    fileChips: [
      { path: 'src/server.ts', lines: 'L1-L45', status: 'modified' },
      { path: 'src/config/env.ts', lines: 'L12-L28', status: 'modified' },
    ],
    codeSnippets: [
      {
        language: 'typescript',
        filename: 'src/server.ts',
        code: `export async function bootstrapServer(): Promise<Server> {
  const app = express();
  app.use(helmet());
  app.use(authLimiter);
  app.use('/api/v1/auth', authRouter);
  
  const server = app.listen(PORT, () => {
    logger.info(\`Server running on port \${PORT}\`);
  });

  setupGracefulShutdown(server);
  return server;
}`,
      },
    ],
  },
  'Inspect memory leaks': {
    thinking: `Scanning heap allocation profiles and event listener registrations.
Found an unmanaged event emitter inside src/cache/pool.ts that retains active client socket references when connections terminate abnormally.`,
    content: `Detected a potential **memory leak hazard** in \`src/cache/pool.ts\` under high concurrent turnover:

- The \`ConnectionPool\` attaches an \`on('error')\` listener per client session without unregistering upon client disconnect.
- Over 10,000 requests, leaked socket handles retain ~180MB of uncollected heap buffers.

### Remediation:
Implement RAII or an explicit cleanup hook in \`releaseConnection()\`:`,
    fileChips: [
      { path: 'src/cache/pool.ts', lines: 'L54-L82', status: 'modified' },
      { path: 'src/db/connectionPool.rs', lines: 'L120-L148', status: 'modified' },
    ],
    codeSnippets: [
      {
        language: 'typescript',
        filename: 'src/cache/pool.ts',
        code: `// Safe connection cleanup with listener detachment
export function releaseConnection(conn: PooledConnection): void {
  conn.removeAllListeners('data');
  conn.removeAllListeners('error');
  if (conn.isHealthy()) {
    availablePool.push(conn);
  } else {
    conn.destroy();
  }
}`,
      },
    ],
  },
  'Generate PR test checklist': {
    thinking: `Synthesizing automated test coverage checklist based on modified files (src/auth/session.ts and rateLimiter.ts).
Checked existing unit and integration test matrix.`,
    content: `Here is the recommended automated test validation checklist for this pull request:

- [ ] **Unit Tests**: Verify Compare-And-Swap (CAS) token rotation invalidates old tokens immediately.
- [ ] **Concurrency Race Test**: Dispatch 20 concurrent requests with the identical refresh token; verify only 1 succeeds and 19 return 401.
- [ ] **Rate Limiter Threshold**: Assert client IP receives \`429 Too Many Requests\` after 5 consecutive requests within 60s.
- [ ] **Redis Fallback Test**: Verify graceful degradation with fallback error logging if Redis node loses quorum.`,
    fileChips: [
      { path: 'tests/auth_stress.test.ts', lines: 'L1-L60', status: 'added' },
      { path: 'src/auth/session.ts', lines: 'L42-L88', status: 'modified' },
    ],
    codeSnippets: [
      {
        language: 'typescript',
        filename: 'tests/auth_stress.test.ts',
        code: `it('prevents double-spend replay attacks under 50 concurrent requests', async () => {
  const token = await generateInitialToken(testUser.id);
  const requests = Array.from({ length: 50 }).map(() =>
    request(app).post('/api/v1/auth/refresh').send({ token })
  );
  const responses = await Promise.all(requests);
  const successful = responses.filter(r => r.status === 200);
  expect(successful.length).toBe(1);
});`,
      },
    ],
  },
};

export const RepoChatPanel: React.FC<RepoChatPanelProps> = ({
  initialMessages,
  onSelectFileChip,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message or thinking state change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const toggleThinking = (msgId: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const renderMessageContent = (content: string, msgId: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = content.slice(lastIndex, match.index);
        elements.push(
          <div
            key={`text-${blockIndex}`}
            className="leading-relaxed whitespace-pre-wrap font-sans text-xs text-[#0f172a] font-normal"
          >
            {textChunk}
          </div>
        );
      }

      const lang = match[1] || 'typescript';
      const code = match[2].trim();
      const snippetId = `${msgId}-inline-${blockIndex}`;
      const isCopied = copiedSnippetId === snippetId;

      elements.push(
        <div
          key={`code-${blockIndex}`}
          className="bg-black text-[#00FF88] rounded-xl p-4 font-mono text-xs border border-zinc-900 shadow-inner relative group my-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2 text-zinc-400 text-[11px]">
            <span>{lang} snippet</span>
            <button
              onClick={() => handleCopyCode(code, snippetId)}
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-800 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-[#00FF88]" />
                  <span className="text-[#00FF88]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
            {code}
          </pre>
        </div>
      );

      lastIndex = codeBlockRegex.lastIndex;
      blockIndex++;
    }

    if (lastIndex < content.length) {
      elements.push(
        <div
          key="text-end"
          className="leading-relaxed whitespace-pre-wrap font-sans text-xs text-[#0f172a] font-normal"
        >
          {content.slice(lastIndex)}
        </div>
      );
    }

    return elements;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Simulate 1-second typing state
    setTimeout(() => {
      let matched = PREBAKED_RESPONSES[text];

      if (!matched) {
        // Fallback for custom user questions
        matched = {
          thinking: `Inspecting AST nodes and call graph for query: "${text}".
Analyzed project symbol table and current git diff.`,
          content: `I've analyzed the repository context regarding **"${text}"**. 

Based on the indexed symbols in \`src/auth/session.ts\` and the active working diff, all async call paths are verified for concurrency safety with non-blocking promises.`,
          fileChips: [
            { path: 'src/auth/session.ts', lines: 'L42-L88', status: 'modified' },
          ],
          codeSnippets: [
            {
              language: 'typescript',
              filename: 'src/auth/session.ts',
              code: `// Verified non-blocking AST execution path
export async function verifyInvariant(ctx: RequestContext): Promise<boolean> {
  const valid = await sessionCache.validate(ctx.sessionId);
  return valid && !ctx.isRevoked;
}`,
            },
          ],
        };
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinking: matched.thinking,
        content: matched.content,
        fileChips: matched.fileChips,
        codeSnippets: matched.codeSnippets,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1000);
  };

  const quickPrompts = [
    'Explain repo entrypoint',
    'Inspect memory leaks',
    'Generate PR test checklist',
  ];

  return (
    <div className="rounded-3xl bg-[#F4F4F0] p-6 text-[#0f172a] shadow-2xl flex flex-col border border-zinc-200/50 h-full overflow-hidden">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0f172a]">
            REPO AI COMPANION
          </span>
          {/* Indexed file count badge */}
          <span className="bg-black text-white font-mono text-xs px-2.5 py-0.5 rounded-full font-semibold">
            14 Files Indexed
          </span>
        </div>

        {/* Clear chat icon button on top right */}
        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-200/80 text-zinc-600 hover:text-black transition-colors"
          title="Clear Conversation Stream"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Message Stream Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto py-3 space-y-4 pr-1 panel-scroll"
      >
        {messages.length === 0 && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 font-mono text-xs space-y-2">
            <BrainCircuit className="w-8 h-8 text-zinc-400 stroke-1" />
            <p className="font-semibold text-zinc-600">Conversation stream cleared</p>
            <p className="text-[11px] text-zinc-500">
              Select a quick prompt below or ask any question about the codebase.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Timestamp & Role indicator */}
              <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-zinc-400 select-none">
                <span>{isUser ? 'You' : 'Gemma-2-9B AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              {isUser ? (
                /* User Bubble: Dark rounded-2xl card aligned right with white text */
                <div className="bg-zinc-900 text-white rounded-2xl p-4 max-w-[85%] shadow-sm text-xs leading-relaxed font-sans">
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Optional user file chips */}
                  {msg.fileChips && msg.fileChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-zinc-800">
                      {msg.fileChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectFileChip && onSelectFileChip(chip.path)}
                          className="bg-black text-white text-[11px] font-mono px-2 py-0.5 rounded-lg flex items-center gap-1 hover:bg-zinc-800 transition cursor-pointer border border-zinc-800"
                        >
                          <FileCode className="w-3 h-3 text-[#00FF88]" />
                          <span>{chip.path}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* AI Bubble: Light ivory card aligned left with sharp dark text */
                <div className="bg-white text-[#0f172a] rounded-2xl p-4 max-w-[95%] border border-zinc-200/90 shadow-xs text-xs space-y-3">
                  {/* File Reference Chips Above Message */}
                  {msg.fileChips && msg.fileChips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-zinc-100">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase mr-1">
                        Referenced:
                      </span>
                      {msg.fileChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectFileChip && onSelectFileChip(chip.path)}
                          className="bg-black text-white text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 transition cursor-pointer shadow-xs"
                          title={`Jump to ${chip.path}`}
                        >
                          <FileCode className="w-3 h-3 text-[#00FF88]" />
                          <span className="font-semibold">{chip.path}</span>
                          {chip.lines && (
                            <span className="text-zinc-400 text-[10px]">{chip.lines}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Thinking Section */}
                  {msg.thinking && (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden text-[11px] font-mono">
                      <button
                        onClick={() => toggleThinking(msg.id)}
                        className="w-full px-3 py-1.5 flex items-center justify-between text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-semibold text-zinc-800">
                          <BrainCircuit className="w-3.5 h-3.5 text-zinc-900" />
                          <span>Thinking Process</span>
                        </span>
                        {expandedThinking[msg.id] ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {expandedThinking[msg.id] && (
                        <div className="p-3 bg-zinc-100/70 border-t border-zinc-200 text-zinc-700 whitespace-pre-wrap leading-relaxed">
                          {msg.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Response Text & Embedded Code */}
                  <div className="space-y-2">
                    {renderMessageContent(msg.content, msg.id)}
                  </div>

                  {/* Embedded Code Blocks */}
                  {msg.codeSnippets &&
                    msg.codeSnippets.map((snippet, idx) => {
                      const snippetId = `${msg.id}-${idx}`;
                      const isCopied = copiedSnippetId === snippetId;

                      return (
                        <div
                          key={idx}
                          className="bg-black text-[#00FF88] rounded-xl p-4 font-mono text-xs border border-zinc-900 shadow-inner relative group mt-2"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2 text-zinc-400 text-[11px]">
                            <span>{snippet.filename || `${snippet.language} snippet`}</span>
                            {/* Copy Code button */}
                            <button
                              onClick={() => handleCopyCode(snippet.code, snippetId)}
                              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-800 transition-colors"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-[#00FF88]" />
                                  <span className="text-[#00FF88]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
                            {snippet.code}
                          </pre>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}

        {/* Animated Pulsing Wave Indicator when generating */}
        {isGenerating && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 px-1">
              Gemma-2-9B reasoning over AST...
            </span>
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs flex items-center gap-2">
              <div className="flex items-center gap-1.5 h-4">
                <span className="w-1.5 h-3.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-3.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-3.5 bg-black rounded-full animate-bounce" />
              </div>
              <span className="font-mono text-xs text-zinc-700 font-medium pl-1">
                Parsing call graph & tokens...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Chat Input Console */}
      <div className="pt-3 border-t border-zinc-200/80 shrink-0 space-y-2.5">
        {/* Input Bar with Transmit Button */}
        <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-2xl p-1.5 pl-4 shadow-xs focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about repository structure, bug diagnosis, or diffs..."
            className="flex-1 bg-transparent text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isGenerating}
            className="bg-black hover:bg-zinc-800 disabled:opacity-40 text-white font-mono font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
          >
            <span>TRANSMIT</span>
            <span>→</span>
          </button>
        </div>

        {/* 3 Quick-Prompt Pill Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              disabled={isGenerating}
              className="bg-white hover:bg-zinc-100 disabled:opacity-50 text-zinc-800 font-mono text-[11px] font-medium border border-zinc-300 rounded-full px-3 py-1 transition-colors active:scale-95 shadow-2xs cursor-pointer truncate"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

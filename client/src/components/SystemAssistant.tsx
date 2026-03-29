import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASHA_SYSTEM_PROMPT, ASHA_QUICK_CHIPS } from '@/data/ashaData';
import { X, Send, Copy, Check, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

// ─── Markdown helpers ─────────────────────────────────────────────────────────
function formatInline(text: string): string {
  // Escape HTML to prevent XSS
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return escaped
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#00f5ff;text-decoration:underline">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ff6eb4">$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(233,30,140,0.15);color:#00f5ff;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>');
}

function renderMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  // Handle both complete and partial code blocks
  const re = /```(\w*)\n?([\s\S]*?)(?:```|$)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(<span key={`text-${last}`} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(last, m.index)) }} />);
    }
    const isComplete = m[0].endsWith('```');
    parts.push(
      <CodeBlock 
        key={`code-${m.index}`} 
        code={m[2].trim()} 
        language={m[1] || 'code'} 
        isStreaming={!isComplete}
      />
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(<span key={`text-${last}`} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(last)) }} />);
  }
  return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />;
}

function CodeBlock({ code, language, isStreaming }: { code: string; language: string; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, margin: '8px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 12px', background: 'rgba(0,245,255,0.05)', borderBottom: '1px solid rgba(0,245,255,0.1)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#00f5ff', opacity: 0.6 }}>{language}</span>
        {!isStreaming && (
          <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#ff6eb4' : '#00f5ff', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <pre style={{ margin: 0, padding: '12px', overflowX: 'auto', fontFamily: 'monospace', fontSize: 13, color: '#fdf0ff', lineHeight: 1.6 }}>
        <code>{code}{isStreaming && <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#e91e8c', marginLeft: 2, animation: 'ashaBlink 1s infinite', verticalAlign: 'text-bottom' }} />}</code>
      </pre>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SystemAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm **ASHA** — *Ayushi's Synthetic Hub Assistant*. I'm Ayushi's personal AI assistant. Ask me anything about her work, projects, or skills — or ask me any general question. I'm here to help.",
    id: 'welcome',
  }]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isAtBottom = useRef(true);

  const [tryingModel, setTryingModel] = useState<string | null>(null);

  // Auto-scroll logic: only scroll if the user was already at the bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    isAtBottom.current = atBottom;
  };

  useEffect(() => { 
    if (isAtBottom.current) {
      scrollToBottom(isStreaming ? 'auto' : 'smooth'); 
    }
  }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const stopGeneration = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      setIsStreaming(false);
      setTryingModel(null);
    }
  };

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isStreaming) return;

    const userMsg: Message = { role: 'user', content: userText, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    isAtBottom.current = true; // Force scroll to bottom when user sends a message

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantId }]);

    const key = (import.meta.env.VITE_OPENROUTER_API_KEY || '') as string;

    if (!key) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === assistantId
          ? { ...m, content: 'ASHA is offline — no API key detected. Please configure the `VITE_OPENROUTER_API_KEY` environment variable.' }
          : m));
        setIsStreaming(false);
      }, 600);
      return;
    }

    const cacheKey = `asha_cache_${userText.trim().toLowerCase()}`;
    const cachedResponse = sessionStorage.getItem(cacheKey);

    if (cachedResponse) {
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < cachedResponse.length) {
          const chunk = cachedResponse.slice(currentIdx, currentIdx + 5);
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
          currentIdx += 5;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 20);
      return;
    }

    // Waterfall model list: try each in order if prev returns 429/503
    const MODEL_FALLBACKS = [
      'google/gemini-2.0-flash-lite-preview-02-05:free',
      'deepseek/deepseek-r1:free',
      'stepfun/step-3.5-flash:free',
      'nvidia/nemotron-4-340b-instruct:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'qwen/qwen-2.5-coder-32b-instruct:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'google/gemma-3-27b-it:free',
      'microsoft/phi-3-medium-128k-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemma-2-9b-it:free',
      'openrouter/auto', // Smart auto-router as last resort
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    const history = messages.slice(1).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const requestBody = {
      stream: true,
      messages: [
        { role: 'system', content: ASHA_SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: userText },
      ],
      temperature: 0.7,
    };

    let fullContent = '';
    let succeeded = false;

    for (const model of MODEL_FALLBACKS) {
      if (controller.signal.aborted) break;
      setTryingModel(model.split('/')[1] || model); // Show simplified model name
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ASHA Assistant',
          },
          signal: controller.signal,
          body: JSON.stringify({ ...requestBody, model }),
        });

        // If rate limited or server overloaded on this model, try next immediately
        if (res.status === 429 || res.status === 503 || res.status === 408) continue; 
        
        if (!res.ok) {
          // Log other errors but keep trying if possible
          console.warn(`Model ${model} failed with ${res.status}`);
          continue;
        }

        const reader = res.body!.getReader();
        const dec = new TextDecoder();
        let buf = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') continue;
            try {
              const data = JSON.parse(raw);
              const chunk = data?.choices?.[0]?.delta?.content ?? '';
              if (chunk) {
                fullContent += chunk;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
              }
            } catch { /* skip partial JSON */ }
          }
        }
        
        if (fullContent) {
          succeeded = true;
          break; // Success — stop trying other models
        }
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') break;
        console.error(`Network attempt failed for ${model}:`, err);
        continue;
      }
    }

    if (fullContent) sessionStorage.setItem(cacheKey, fullContent);

    if (!succeeded && !controller.signal.aborted) {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ All systems are currently at peak capacity across 15+ providers. Please wait 1-2 minutes for the global rate limits to reset.' } : m));
    }

    setIsStreaming(false);
    setTryingModel(null);
    abortRef.current = null;
  }, [messages, isStreaming]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleChipClick = (chip: typeof ASHA_QUICK_CHIPS[0]) => {
    if (chip.prompt) {
      sendMessage(chip.prompt);
    } else {
      inputRef.current?.focus();
    }
  };

  // ─── Styles (inline) ────────────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    position: 'fixed', bottom: 100, right: 24,
    width: 'min(420px, calc(100vw - 32px))',
    height: 'min(600px, calc(100vh - 130px))',
    background: 'rgba(13,10,20,0.97)',
    border: '1px solid rgba(233,30,140,0.3)',
    borderRadius: 16, display: 'flex', flexDirection: 'column',
    zIndex: 200,
    boxShadow: '0 0 40px rgba(233,30,140,0.2), 0 0 80px rgba(155,89,182,0.1)',
    backdropFilter: 'blur(20px)',
    animation: 'ashaSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    overflow: 'hidden',
  };

  return (
    <>
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {!isOpen && (
        <>
          <div className="asha-pulse-ring" style={{ position: 'absolute', bottom: -10, right: -10, width: 80, height: 80 }} />
          <div className="asha-pulse-ring-delayed" style={{ position: 'absolute', bottom: -10, right: -10, width: 80, height: 80 }} />
          <div style={{ background: 'rgba(13,10,20,0.9)', border: '1px solid rgba(233,30,140,0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 10, fontFamily: 'monospace', color: '#ff6eb4', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, backdropFilter: 'blur(10px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5ff', boxShadow: '0 0 6px #00f5ff', display: 'inline-block' }} />
            ASHA ONLINE
          </div>
        </>
      )}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="group relative"
        style={{ 
          width: 70, height: 70, borderRadius: '50%', 
          background: 'rgba(13,10,20,0.8)', 
          border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 0 30px rgba(233,30,140,0.2)', transition: 'all 0.5s ease',
          pointerEvents: 'auto',
          overflow: 'visible'
        }}
        title="Chat with ASHA"
      >
        {/* Holographic Orb SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="animate-pulse">
                <defs>
                    <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ff6eb4" stopOpacity="0.8" />
                        <stop offset="70%" stopColor="#e91e8c" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <motion.circle
                    cx="50" cy="50"
                    r="35"
                    fill="url(#orbGradient)"
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0.9, 0.6],
                        translateX: [-2, 2, -2],
                        translateY: [-2, 2, -2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    filter="url(#glow)"
                />
                <motion.circle
                    cx="50" cy="50"
                    r="20"
                    stroke="#00f5ff"
                    strokeWidth="0.5"
                    fill="none"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </svg>
        </div>

        {isOpen
          ? <ChevronDown size={28} color="#ff6eb4" className="z-10" />
          : <div className="z-10 flex flex-col items-center">
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 13, color: '#fff', letterSpacing: 2, textShadow: '0 0 10px #e91e8c' }}>ASHA</span>
              <div className="w-8 h-[1px] bg-[#00f5ff] opacity-40 mt-1" />
            </div>
        }
      </button>
    </div>

      {/* Chat panel */}
      {isOpen && (
        <div style={panelStyle}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(233,30,140,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(233,30,140,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e91e8c', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(233,30,140,0.1)', boxShadow: '0 0 10px rgba(233,30,140,0.3)' }}>
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 10, background: 'linear-gradient(135deg, #e91e8c, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ASHA</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 13, color: '#fdf0ff' }}>ASHA</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00f5ff', opacity: 0.7, letterSpacing: '0.1em' }}>Ayushi's Synthetic Hub Assistant</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isStreaming && (
                <button 
                  onClick={stopGeneration}
                  style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)', borderRadius: 4, padding: '2px 6px', color: '#ff6eb4', fontSize: 10, fontFamily: 'monospace', cursor: 'pointer' }}
                >
                  STOP
                </button>
              )}
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff6eb4', opacity: 0.6 }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div style={{ padding: '10px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid rgba(155,89,182,0.1)' }}>
            {ASHA_QUICK_CHIPS.map(chip => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                style={{ padding: '4px 10px', background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.25)', borderRadius: 20, color: '#ff6eb4', fontFamily: 'monospace', fontSize: 11, cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            data-lenis-prevent
            style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(233,30,140,0.3), rgba(155,89,182,0.2))' : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user' ? '1px solid rgba(233,30,140,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: '#fdf0ff', fontSize: 14, lineHeight: 1.6,
                }}>
                  {msg.content === '' && isStreaming ? (
                    <div className="flex flex-col gap-2">
                       {tryingModel && (
                        <div className="text-[9px] uppercase tracking-widest text-[#00f5ff] opacity-60 font-mono animate-pulse">
                          Switching Neural Node: {tryingModel}
                        </div>
                      )}
                      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                        {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#e91e8c', animation: `ashaBounce 1s ${i * 0.2}s infinite` }} />)}
                      </span>
                    </div>
                  ) : (
                    <div style={{ wordBreak: 'break-word' }}>
                      {renderMarkdown(msg.content)}
                      {isStreaming && msg.id === messages[messages.length - 1].id && msg.role === 'assistant' && (
                        <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#e91e8c', marginLeft: 2, animation: 'ashaBlink 1s infinite', verticalAlign: 'text-bottom' }} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(233,30,140,0.15)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask ASHA anything..."
              rows={1}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,30,140,0.25)', borderRadius: 12, padding: '10px 14px', color: '#fdf0ff', fontFamily: 'inherit', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() && !isStreaming ? 'linear-gradient(135deg, #e91e8c, #9b59b6)' : 'rgba(255,255,255,0.05)', border: 'none', cursor: input.trim() && !isStreaming ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() && !isStreaming ? '0 0 15px rgba(233,30,140,0.4)' : 'none' }}
            >
              <Send size={16} color={input.trim() && !isStreaming ? '#fff' : '#666'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ashaSlideUp { from { opacity:0; transform:translateY(20px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ashaBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ashaBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        .asha-pulse-ring { border: 2px solid #e91e8c; border-radius: 50%; animation: ashaPulse 2s infinite; opacity: 0; }
        .asha-pulse-ring-delayed { border: 2px solid #9b59b6; border-radius: 50%; animation: ashaPulse 2s 1s infinite; opacity: 0; }
        @keyframes ashaPulse { 
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}

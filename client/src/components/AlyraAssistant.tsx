import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Copy, Check, Square } from 'lucide-react';
import { ALYRA_SYSTEM_PROMPT, ALYRA_QUICK_CHIPS } from '@/data/alyraData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────
function formatInline(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--aurora-teal);text-decoration:underline">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--primary)">$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(233,30,140,0.12);color:var(--aurora-teal);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>');
}

function CodeBlock({ code, language, isStreaming }: { code: string; language: string; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="my-2 rounded-xl overflow-hidden border border-[var(--glass-border)]">
      <div className="flex justify-between items-center px-4 py-2 bg-[var(--muted)] border-b border-[var(--glass-border)]">
        <span className="text-[10px] font-mono text-[var(--foreground)] opacity-50 uppercase tracking-widest">{language || 'code'}</span>
        {!isStreaming && (
          <button onClick={copy} className="flex items-center gap-1 text-[10px] font-mono text-[var(--aurora-teal)] hover:opacity-80 transition-opacity">
            {copied ? <Check size={11} /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <pre className="m-0 p-4 overflow-x-auto font-mono text-[13px] text-[var(--foreground)] leading-relaxed bg-[var(--background)]/60">
        <code>{code}{isStreaming && <span className="inline-block w-[2px] h-[1em] bg-[var(--primary)] ml-[2px] align-text-bottom animate-pulse" />}</code>
      </pre>
    </div>
  );
}

function renderMarkdown(text: string, isStreaming = false): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /```(\w*)\n?([\s\S]*?)(?:```|$)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={`t${last}`} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(last, m.index)) }} />);
    const complete = m[0].endsWith('```');
    parts.push(<CodeBlock key={`c${m.index}`} code={m[2].trim()} language={m[1]} isStreaming={!complete && isStreaming} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<span key={`t${last}`} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(last)) }} />);
  return parts.length > 0 ? parts : <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AlyraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm **Alyra**, Ayushi's personal AI assistant. Ask me anything about her work, skills, and projects — or ask me any general question. I'm powered by Google Gemini. 🚀",
    id: 'welcome',
  }]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const atBottom = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (atBottom.current) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 100); }, [isOpen]);

  const stop = () => { abortRef.current?.abort(); setIsStreaming(false); };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg: Message = { role: 'user', content: text, id: Date.now().toString() };
    const asstId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '', id: asstId }]);
    setInput('');
    setIsStreaming(true);
    atBottom.current = true;

    const geminiKey = (import.meta.env.VITE_GEMINI_API_KEY || '') as string;
    const orKey = (import.meta.env.VITE_OPENROUTER_API_KEY || '') as string;

    const controller = new AbortController();
    abortRef.current = controller;

    // Build conversation history for context
    const history = messages.slice(1).map(m => ({ role: m.role, parts: [{ text: m.content }] }));

    let succeeded = false;

    // ── Strategy 1: Gemini via REST streaming ──────────────────────────────
    if (geminiKey) {
      try {
        const geminiHistory = history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: h.parts
        }));

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${geminiKey}&alt=sse`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: ALYRA_SYSTEM_PROMPT }] },
              contents: [
                ...geminiHistory,
                { role: 'user', parts: [{ text }] }
              ],
              generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
            }),
          }
        );

        if (res.ok) {
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
              if (!raw || raw === '[DONE]') continue;
              try {
                const data = JSON.parse(raw);
                const chunk = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (chunk) {
                  setMessages(prev => prev.map(m => m.id === asstId ? { ...m, content: m.content + chunk } : m));
                }
              } catch { /* skip malformed chunks */ }
            }
          }
          succeeded = true;
        }
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') { setIsStreaming(false); return; }
        console.warn('Gemini failed, trying fallback:', err);
      }
    }

    // ── Strategy 2: OpenRouter fallback ───────────────────────────────────
    if (!succeeded && orKey && !controller.signal.aborted) {
      try {
        const orHistory = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${orKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Alyra Assistant',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
            stream: true,
            messages: [
              { role: 'system', content: ALYRA_SYSTEM_PROMPT },
              ...orHistory,
              { role: 'user', content: text },
            ],
            temperature: 0.7,
          }),
        });

        if (res.ok) {
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
                if (chunk) setMessages(prev => prev.map(m => m.id === asstId ? { ...m, content: m.content + chunk } : m));
              } catch { /* skip */ }
            }
          }
          succeeded = true;
        }
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') { setIsStreaming(false); return; }
        console.error('OpenRouter fallback also failed:', err);
      }
    }

    if (!succeeded && !controller.signal.aborted) {
      setMessages(prev => prev.map(m => m.id === asstId
        ? { ...m, content: '⚠️ Both Gemini and the fallback are temporarily unavailable. Please try again in a moment.' }
        : m));
    }

    setIsStreaming(false);
    abortRef.current = null;
  }, [messages, isStreaming]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const lastMsgId = messages[messages.length - 1]?.id;

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl flex items-center gap-2 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--aurora-teal)] shadow-[0_0_8px_var(--aurora-teal)] animate-pulse" />
            <span className="text-[9px] font-mono font-black tracking-[0.25em] text-[var(--aurora-teal)] uppercase">Alyra Online</span>
          </motion.div>
        )}

        <button
          onClick={() => setIsOpen(o => !o)}
          className="relative w-[72px] h-[72px] rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl cursor-pointer flex items-center justify-center shadow-[0_0_30px_rgba(233,30,140,0.2)] hover:shadow-[0_0_40px_rgba(233,30,140,0.35)] transition-shadow duration-500"
          title="Chat with Alyra"
        >
          {/* Pulse rings */}
          {!isOpen && <>
            <span className="absolute inset-[-8px] rounded-full border border-[var(--primary)] opacity-0 animate-[alyra-pulse_2.5s_ease-out_infinite]" />
            <span className="absolute inset-[-8px] rounded-full border border-[var(--secondary)] opacity-0 animate-[alyra-pulse_2.5s_ease-out_infinite_1.2s]" />
          </>}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} className="text-[var(--primary)]" />
              </motion.span>
            ) : (
              <motion.div key="logo" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-0.5">
                <span className="font-orbitron font-black text-[11px] tracking-[0.15em]" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ALYRA
                </span>
                <div className="w-7 h-[1px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-60" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-[100px] right-6 z-[9998] flex flex-col rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25),0_0_40px_rgba(233,30,140,0.08)] overflow-hidden"
            style={{ width: 'min(440px, calc(100vw - 24px))', height: 'min(620px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)] bg-[var(--muted)]/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[var(--primary)] flex items-center justify-center shadow-[0_0_12px_rgba(233,30,140,0.3)]" style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(155,89,182,0.1))' }}>
                  <span className="font-orbitron font-black text-[8px] tracking-wider" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
                </div>
                <div>
                  <div className="font-orbitron font-bold text-sm text-[var(--foreground)] tracking-wider">ALYRA</div>
                  <div className="text-[10px] font-mono text-[var(--aurora-teal)] opacity-70 tracking-widest">Powered by Google Gemini</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isStreaming && (
                  <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-[10px] font-mono font-black tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all">
                    <Square size={9} fill="currentColor" /> STOP
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-opacity">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 flex-wrap px-4 py-3 border-b border-[var(--glass-border)] flex-shrink-0">
              {ALYRA_QUICK_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={() => send(chip.prompt)}
                  disabled={isStreaming}
                  className="px-3 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--muted)] text-[var(--foreground)] text-[10px] font-mono font-bold tracking-wide hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              onScroll={() => {
                if (!scrollRef.current) return;
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                atBottom.current = scrollHeight - scrollTop - clientHeight < 60;
              }}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth"
            >
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-[18px_18px_4px_18px] text-white'
                        : 'rounded-[18px_18px_18px_4px] text-[var(--foreground)] border border-[var(--glass-border)] bg-[var(--muted)]/50'
                    }`}
                    style={msg.role === 'user' ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))' } : {}}
                  >
                    {msg.content === '' && isStreaming ? (
                      <span className="inline-flex gap-1 items-center py-1">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </span>
                    ) : (
                      <div className="break-words">
                        {renderMarkdown(msg.content, isStreaming && msg.id === lastMsgId && msg.role === 'assistant')}
                        {isStreaming && msg.id === lastMsgId && msg.role === 'assistant' && msg.content && (
                          <span className="inline-block w-[2px] h-[1em] bg-[var(--primary)] ml-[2px] align-text-bottom animate-pulse" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3 items-end px-4 py-4 border-t border-[var(--glass-border)] bg-[var(--muted)]/30 flex-shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKey}
                placeholder="Ask Alyra anything… (Shift+Enter for newline)"
                rows={1}
                className="flex-1 resize-none rounded-xl px-4 py-3 text-sm font-[inherit] text-[var(--foreground)] outline-none border border-[var(--glass-border)] bg-[var(--background)]/50 placeholder:text-[var(--foreground)] placeholder:opacity-30 focus:border-[var(--primary)] transition-colors leading-normal"
                style={{ maxHeight: 120, overflowY: 'auto' }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || isStreaming}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: input.trim() && !isStreaming
                    ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                    : 'var(--muted)',
                  boxShadow: input.trim() && !isStreaming ? '0 0 20px rgba(233,30,140,0.4)' : 'none'
                }}
              >
                <Send size={15} className={input.trim() && !isStreaming ? 'text-white' : 'text-[var(--foreground)]'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes alyra-pulse {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </>
  );
}

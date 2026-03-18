'use client';

import { useState, useRef, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getAgentById } from '@/lib/agents/agent-config';
import { Message } from '@/components/chat/MessageBubble';
import { ChevronLeft, Send, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

const SAMPLE_PROMPTS: Record<string, string[]> = {
  tactician: [
    'How would you set up against a high press?',
    'Best formation for Canada at WC2026?',
    "Break down Spain's build-up play",
    'Explain inverted wingers in modern football',
  ],
  'data-scientist': [
    "What's Brazil's xG in recent qualifiers?",
    'Who leads expected assists in Europe?',
    'Explain PPDA and pressing metrics',
    'Which keeper has the best PSxG-GA?',
  ],
  fantasy: [
    'Best budget differential for WC fantasy?',
    'Who should I captain in gameweek 1?',
    'Top 3 defenders for clean sheet potential',
    'Which premium forward is worth it?',
  ],
  referee: [
    'Was that last-man tackle a red card?',
    'Explain the new handball rule changes',
    'When does VAR intervene vs not?',
    'Offside: what counts as a body part?',
  ],
  historian: [
    'Greatest World Cup upset of all time?',
    'Compare Maradona vs Pelé at the World Cup',
    "Retell Italy's 1982 campaign",
    'Most dramatic finals in WC history?',
  ],
  scout: [
    'Top 5 wonderkids to watch at WC2026?',
    "Analyze Lamine Yamal's strengths",
    'Best defensive midfielder right now?',
    'Who is the next Erling Haaland?',
  ],
  commentator: [
    'Commentate a 90th minute winner!',
    'Build up to a penalty shootout',
    "Narrate Canada's first WC2026 goal",
    'Do a post-match interview with the hero',
  ],
  fan: [
    "Who's winning WC2026 and why?",
    'Most overrated team at the tournament?',
    'Hot take: Messi era is over',
    "Canada's chances — be honest!",
  ],
};

const DEFAULT_PROMPTS = [
  'Tell me about WC2026',
  'Who are the favourites?',
  'Surprise me with a football fact',
  'What should I watch for?',
];

// Typing bubble dots
function TypingIndicator() {
  return (
    <div className="flex gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
        />
      ))}
    </div>
  );
}

// Single message row
function ChatMessage({
  msg,
  agentAvatar,
  agentName,
}: {
  msg: Message;
  agentAvatar: string;
  agentName: string;
}) {
  const isUser = msg.role === 'user';
  const isLoading = msg.id === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-2`}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-base mr-3 mt-1 shadow-lg backdrop-blur-md">
          {agentAvatar}
        </div>
      )}
      <div
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}
      >
        {!isUser && (
          <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-60">
            {agentName}
          </span>
        )}
        <div
          className={`relative px-5 py-3.5 rounded-[2rem] text-sm leading-relaxed shadow-xl backdrop-blur-xl border transition-all duration-300 ${
            isUser
              ? 'bg-[var(--accent)] text-black border-[var(--accent)]/20 rounded-tr-md font-semibold'
              : 'bg-[var(--card)]/40 text-[var(--text)] border-[var(--border)] rounded-tl-md'
          }`}
        >
          {isLoading ? (
            <TypingIndicator />
          ) : (
            <div
              className={`prose prose-sm dark:prose-invert max-w-none ${isUser ? 'text-black' : ''} prose-p:my-0 prose-p:mb-2 last:prose-p:mb-0`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AgentChatPage({
  params,
}: {
  params: { agentId: string };
}) {
  const router = useRouter();
  const agent = getAgentById(params.agentId);
  const { team } = useFavoriteTeam();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;
  const prompts = SAMPLE_PROMPTS[params.agentId] ?? DEFAULT_PROMPTS;

  useEffect(() => {
    if (hasMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasMessages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
    }
  }, [input]);

  if (!agent) notFound();

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          messages: [...messages, userMsg],
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Neural handshake failed. Please re-engage.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[var(--bg)] text-[var(--text)] z-[100] isolate overflow-hidden">
      {/* ── IMMERSIVE ENVIRONMENT ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at 50% -20%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[var(--bg)] to-transparent z-10" />
      </div>

      {/* ── TOP NAV ── */}
      <header className="relative z-50 flex items-center h-20 px-6 border-b border-[var(--border)] backdrop-blur-2xl bg-[var(--bg)]/60">
        <button
          onClick={() => router.push('/agents')}
          className="group w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/60 transition-all active:scale-95 mr-4"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-[var(--border)] relative overflow-hidden"
            style={{
              backgroundColor: `color-mix(in srgb, var(--accent) 10%, var(--card))`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent opacity-50" />
            <span className="relative z-10">{agent.avatar}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-display text-lg leading-none tracking-tight truncate">
              {agent.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] opacity-80 truncate">
                {agent.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={() => {
                if (confirm('Purge neural data?')) setMessages([]);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--card)]/40 border border-[var(--border)] hover:bg-[var(--card)]/60 text-[var(--muted)] hover:text-[var(--text)] transition-all active:scale-90"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:block px-3 py-1.5 rounded-full bg-[var(--card)]/40 border border-[var(--border)] text-[8px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
            Sync: Optimal
          </div>
        </div>
      </header>

      {/* ── CHAT SCROLL ── */}
      <main className="relative z-20 flex-1 overflow-y-auto no-scrollbar scroll-smooth pt-4">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-[var(--accent)]/20 blur-[60px] rounded-full scale-150 animate-pulse" />
                <div className="relative w-32 h-32 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-6xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                  {agent.avatar}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-4xl mb-3 tracking-tighter">
                  Initialize Link with {agent.name}
                </h2>
                <p className="text-[var(--text-2)] text-lg mb-10 leading-relaxed balance opacity-80 font-medium">
                  {agent.description} I am ready to provide deep insights
                  tailored to your requirements.
                </p>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24">
                  {prompts.map((p, i) => (
                    <motion.button
                      key={p}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      onClick={() => sendMessage(p)}
                      className="group flex flex-col items-start p-5 rounded-3xl bg-[var(--card)]/40 border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/60 transition-all text-left relative overflow-hidden active:scale-[0.98]"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Send className="w-3 h-3 text-[var(--accent)]" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--muted)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                        Suggested Query
                      </span>
                      <span className="text-sm text-[var(--text)] font-semibold leading-tight line-clamp-2">
                        {p}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2 pb-48 max-w-4xl mx-auto w-full"
            >
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  agentAvatar={agent.avatar}
                  agentName={agent.name}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  msg={{ id: 'loading', role: 'assistant', content: '' }}
                  agentAvatar={agent.avatar}
                  agentName={agent.name}
                />
              )}
              <div ref={messagesEndRef} className="h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── INPUT SYSTEM ── */}
      <footer className="relative z-50 p-6 pt-2 border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="group relative flex items-end gap-3 bg-[var(--card)]/40 border border-[var(--border)] rounded-[2.5rem] p-2 pl-6 focus-within:border-[var(--accent)]/40 transition-all duration-500 shadow-2xl"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Communicate with ${agent.name}...`}
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-[var(--text)] resize-none outline-none py-4 text-[16px] placeholder-[var(--text)]/20 max-h-[130px] no-scrollbar font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-1 mr-1 ${
                input.trim() && !isLoading
                  ? 'bg-[var(--accent)] text-[var(--team-text)] shadow-[0_0_20px_rgba(0,229,160,0.4)] scale-100 rotate-0'
                  : 'bg-[var(--card)]/20 text-[var(--text)]/20 scale-90 rotate-12'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <div className="flex items-center justify-between px-6 mt-3">
            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--muted)] animate-pulse">
              System Online • Encrypted Channel
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--muted)]/40">
              Neural content may vary
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

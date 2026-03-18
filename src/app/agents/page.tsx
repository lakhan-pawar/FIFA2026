'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AGENTS } from '@/lib/agents/agent-config';

const SAMPLE_PREVIEWS: Record<string, { q: string; a: string }> = {
  tactician:     { q: 'How should Canada set up vs. a high press?', a: 'Switch to a 4-5-1 mid-block, invite pressure wide, and exploit the channels with Eustáquio threading through-balls...' },
  'data-scientist': { q: "What's Belgium's xG trend in knockouts?", a: "Belgium avg xG 1.4 per knockout game at WC2022, but their xGA (0.8) tells the real story — elite defensive shape..." },
  fantasy:       { q: 'Best budget pick for WC fantasy?', a: 'Akira Ueda (Japan) is massively under-priced at 4.5M. Plays in all group games, high chance of clean sheet bonus...' },
  referee:       { q: 'Was that handball a penalty under IFAB?', a: 'Under Law 12, the arm must be in an "unnatural position" — if the arm extended above shoulder during the cross, yes: penalty.' },
  historian:     { q: 'Greatest World Cup upset of all time?', a: "USA 1-0 England in 1950. A part-time postman scored the only goal. The English press thought the scoreline was a typo." },
  scout:         { q: 'Name a wonderkid to watch in 2026?', a: "Endrick (Brazil) will be 20 at tournament time. Already showing elite movement in tight areas — could be the tournament's breakout star." },
  commentator:   { q: 'Build the Final as a commentator!', a: "AND IT'S THERE! A LATE WINNER! THE STADIUM HAS ERUPTED — 87,000 souls witnessing history as the ball hits the net in injury time..." },
  fan:           { q: "What's your prediction?", a: "Brazil or bust, always. Anyone who says otherwise hasn't watched football. The Seleção are built DIFFERENT this cycle, trust me fam 🇧🇷🔥" },
};

const AGENT_OF_THE_DAY_ID = 'data-scientist';

export default function AgentsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const agentOfTheDay = AGENTS.find(a => a.id === AGENT_OF_THE_DAY_ID);

  return (
    <div className="w-full pb-32 bg-[var(--bg)] min-h-screen">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[var(--accent-2)]/5 blur-[100px] rounded-full" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 px-6 pt-16 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Next-Gen Intelligence</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-5xl md:text-7xl mb-4 tracking-tight leading-none"
          >
            MEET YOUR <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[var(--text)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">AI ELITE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-base md:text-lg max-w-2xl leading-relaxed"
          >
            The world's most advanced football minds, reconstructed with neural precision. 
            Select an expert to begin your strategic immersion.
          </motion.p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── AGENT OF THE DAY: CINEMATIC HERO ── */}
        {agentOfTheDay && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl tracking-tight text-[var(--text)] flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[var(--accent)] rounded-full" />
                  Featured Analyst
                </h2>
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                  Refresh in <span className="text-[var(--text)] tabular-nums">14:22:05</span>
                </div>
              </div>
              
              <Link
                href={`/agents/${agentOfTheDay.id}`}
                className="group relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[var(--card)] to-[var(--bg-2)] border border-[var(--accent)]/30 hover:border-[var(--accent)]/60 transition-all duration-500 overflow-hidden block shadow-[0_0_80px_rgba(0,229,160,0.05)] isolate"
              >
                {/* Immersive FX */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
                <div className="absolute -top-1/2 -right-1/4 w-[150%] h-[150%] bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent blur-[120px] group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-1000" />
                
                <div className="relative shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[var(--accent)]/20 blur-3xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-700" />
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-[var(--bg)] border border-[var(--accent)]/30 flex items-center justify-center text-7xl md:text-9xl shadow-2xl group-hover:rotate-6 transition-transform duration-500 z-10">
                    {agentOfTheDay.avatar}
                  </div>
                  {/* Decorative orbital ring */}
                  <div className="absolute w-[140%] h-[140%] border border-[var(--accent)]/10 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
                </div>

                <div className="relative flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--accent)] bg-[var(--accent)]/10 px-4 py-1.5 rounded-full border border-[var(--accent)]/20 backdrop-blur-md">
                      System Selected
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--muted)] bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md italic">
                      Lvl 99 Authority
                    </span>
                  </div>
                  <h3 className="font-display text-4xl md:text-6xl text-[var(--text)] mb-2 tracking-tighter">{agentOfTheDay.name}</h3>
                  <p className="text-lg font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-4">{agentOfTheDay.role}</p>
                  <p className="text-[var(--text-2)] text-base md:text-lg leading-relaxed mb-8 max-w-2xl balance">
                    {agentOfTheDay.description} Available for deep architectural analysis and predictive modelling of the upcoming fixtures.
                  </p>
                  
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-[var(--accent)] text-black font-bold tracking-tight hover:shadow-[0_0_30px_rgba(0,229,160,0.4)] transition-all active:scale-95">
                    Connect to Neural Link
                    <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </section>
        )}

        {/* ── ALL AGENTS GRID ── */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl tracking-tight text-[var(--text)] flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[var(--muted)] rounded-full" />
            Registry
          </h2>
          <div className="flex gap-2">
            {['All', 'Strategy', 'Data', 'Legacy'].map(tag => (
              <button key={tag} className="px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {AGENTS.map((agent, index) => {
            const preview = SAMPLE_PREVIEWS[agent.id];
            const isHovered = hoveredId === agent.id;

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + (index * 0.03), ease: "easeOut" }}
                className="group h-full"
                onMouseEnter={() => setHoveredId(agent.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link
                  href={`/agents/${agent.id}`}
                  className="relative flex flex-col h-full p-6 rounded-[2rem] bg-[var(--card)]/40 backdrop-blur-xl border border-white/5 hover:border-[var(--accent)]/30 transition-all duration-500 overflow-hidden shadow-sm"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                      style={{ 
                        backgroundColor: `color-mix(in srgb, var(--accent) 15%, var(--bg))`,
                        boxShadow: `0 8px 16px -4px rgba(0,229,160,0.1)` 
                      }}
                    >
                      <span className="drop-shadow-md">{agent.avatar}</span>
                    </div>
                    <div className="text-[8px] font-black tracking-[0.2em] uppercase text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5">
                      {agent.id.replace('-', ' ')}
                    </div>
                  </div>

                  <div className="relative z-10 mb-4">
                    <h3 className="font-display text-xl text-[var(--text)] leading-tight mb-1">{agent.name}</h3>
                    <p className="text-[10px] font-black text-[var(--accent)] tracking-[0.2em] uppercase opacity-80">{agent.role}</p>
                  </div>

                  <p className="text-[var(--text-2)] text-sm leading-relaxed mb-6 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {agent.description}
                  </p>

                  <div className="relative mt-auto">
                    <AnimatePresence>
                      {isHovered && preview ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-10 left-0 right-0 z-20"
                        >
                          <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--accent)]/20 shadow-2xl">
                            <p className="text-[10px] font-bold text-[var(--accent)] mb-1 uppercase tracking-tighter">Typical Inquiry</p>
                            <p className="text-xs font-medium text-[var(--text)] italic leading-snug">"{preview.q}"</p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-[var(--accent)]/20 transition-colors">
                      <span className="text-[10px] font-bold text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors uppercase tracking-widest">Initialise Chat</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

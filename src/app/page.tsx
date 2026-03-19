'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AGENTS } from '@/lib/agents/agent-config';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import BallRollingLoader from '@/components/BallRollingLoader';
import LivePulseRing from '@/components/LivePulseRing';
import GoalCelebration from '@/components/GoalCelebration';
import FloodlightSweep from '@/components/FloodlightSweep';

// --- Countdown Hook ---
function useCountdown(target: Date) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        days: Math.floor(diff / 864e5),
        hours: Math.floor((diff % 864e5) / 36e5),
        minutes: Math.floor((diff % 36e5) / 6e4),
        seconds: Math.floor((diff % 6e4) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const WC_KICKOFF = new Date('2026-06-11T18:00:00Z');

const FEATURED_IDS = [
  'tactician',
  'data-scientist',
  'commentator',
  'historian',
];

export default function Home() {
  const { team } = useFavoriteTeam();
  const t = useCountdown(WC_KICKOFF);

  const pulseStats = [
    { label: 'Teams', value: '48', icon: '🌍', color: 'var(--accent)' },
    { label: 'Groups', value: '12', icon: '🔢', color: 'var(--accent-2)' },
    { label: 'Matches', value: '104', icon: '⚽', color: 'var(--accent-3)' },
    { label: 'Host Cities', value: '16', icon: '🏙️', color: 'var(--gold)' },
    {
      label: team ? 'Rank' : 'AI Agents',
      value: team ? '#1' : '8',
      icon: team ? '🏆' : '🤖',
      color: 'var(--accent)',
    },
    {
      label: team ? 'Status' : 'Toronto Venues',
      value: team ? 'Qualified' : '10+',
      icon: team ? '✅' : '🍁',
      color: 'var(--accent-2)',
    },
  ];

  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [goalActive, setGoalActive] = useState(false);
  const [goalData, setGoalData] = useState({
    homeTeam: '',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    scorer: '',
  });
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setPageLoaded(true);

    // Simulate initial content load
    const timer = setTimeout(() => {
      setContentLoading(false);
    }, 1800);

    const id = setInterval(
      () => setFeaturedIdx((i: number) => (i + 1) % FEATURED_IDS.length),
      8000
    );
    return () => {
      clearInterval(id);
      clearTimeout(timer);
    };
  }, []);

  const triggerGoalDemo = () => {
    setGoalData({
      homeTeam: team?.name || 'Canada',
      awayTeam: 'Mexico',
      homeScore: 2,
      awayScore: 1,
      scorer: team ? `${team.name} Pride 73'` : "Alphonso Davies 73'",
    });
    setGoalActive(true);
  };

  const featuredAgent = AGENTS.find((a) => a.id === FEATURED_IDS[featuredIdx]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Floodlight — fires once on page load */}
      <FloodlightSweep trigger={pageLoaded} duration={2200} />

      {/* Goal celebration overlay */}
      <GoalCelebration
        active={goalActive}
        homeTeam={goalData.homeTeam}
        awayTeam={goalData.awayTeam}
        homeScore={goalData.homeScore}
        awayScore={goalData.awayScore}
        scorer={goalData.scorer}
        onComplete={() => setGoalActive(false)}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-12 md:pt-20 overflow-hidden">
        {/* background glows - Team Immersive Light Leaks */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-[var(--accent)]/20 blur-[120px] sm:blur-[160px] rounded-full opacity-60" />
          <div className="absolute top-1/4 -left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[var(--accent-2)]/10 blur-[100px] sm:blur-[140px] rounded-full opacity-40" />
          <div className="absolute bottom-1/4 -right-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[var(--accent-3)]/10 blur-[100px] sm:blur-[140px] rounded-full opacity-30" />
        </div>

        {/* Pre-headline badge */}
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(var(--team-primary-rgb),0.1)]">
          <LivePulseRing
            color="var(--accent)"
            size={7}
            label={
              team
                ? `${team.name} · ROAD TO 2026`
                : 'FIFA World Cup 2026 · North America'
            }
            showLabel={true}
          />
        </div>

        {/* Main headline */}
        <h1 className="relative z-10 font-display tracking-tighter mb-4 leading-[0.85] sm:leading-none">
          <span className="block text-[clamp(2.5rem,15vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-br from-[var(--text)] via-[var(--text)] to-[var(--text-2)]">
            THE
          </span>
          <span className="block text-[clamp(2.5rem,15vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-2)] drop-shadow-[0_0_80px_rgba(var(--team-primary-rgb),0.4)]">
            BEAUTIFUL
          </span>
          <span className="block text-[clamp(2.5rem,15vw,7.5rem)] text-transparent bg-clip-text bg-gradient-to-br from-[var(--text)] via-[var(--text)] to-[var(--text-2)]">
            GAME
          </span>
        </h1>

        <p className="relative z-10 text-[var(--muted)] text-sm sm:text-lg max-w-[280px] sm:max-w-md mt-2 mb-8 sm:mb-12 leading-relaxed">
          {team
            ? `Track ${team.name}'s journey to the finals with AI-powered tactical depth.`
            : 'AI-powered football intelligence for WC 2026. Zero sign-ups. Pure data, pure passion.'}
        </p>

        {/* Countdown */}
        {mounted && (
          <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3 mb-10 w-full max-w-[260px] sm:max-w-sm">
            {[
              { v: t.days, l: 'Days' },
              { v: String(t.hours).padStart(2, '0'), l: 'Hrs' },
              { v: String(t.minutes).padStart(2, '0'), l: 'Min' },
              { v: String(t.seconds).padStart(2, '0'), l: 'Sec' },
            ].map((seg, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-xl sm:rounded-2xl py-3 sm:py-4 px-1 backdrop-blur-sm shadow-sm"
              >
                <span
                  className={`font-display text-2xl sm:text-4xl font-bold tabular-nums leading-none ${i === 3 ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  {seg.v}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[var(--muted)] uppercase tracking-widest mt-1">
                  {seg.l}
                </span>
              </div>
            ))}
            <div className="col-span-4 text-center text-[9px] text-[var(--muted)] uppercase tracking-[0.2em] mt-1 opacity-60">
              Until June 11, 2026 · Estadio Azteca
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-[260px] sm:max-w-none">
          <Link
            href="/brackets"
            className="h-11 sm:h-12 px-8 flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-black font-bold text-sm shadow-[0_0_30px_rgba(0,229,160,0.3)] hover:shadow-[0_0_50px_rgba(0,229,160,0.45)] hover:scale-105 transition-all active:scale-95 touch-manipulation"
          >
            🏆 Predict Bracket
          </Link>
          <Link
            href="/agents"
            className="h-11 sm:h-12 px-8 flex items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-semibold text-sm hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)] transition-all active:scale-95 touch-manipulation"
          >
            🤖 Chat with AI
          </Link>

          {/* Goal Demo Trigger */}
          <button
            onClick={triggerGoalDemo}
            className="h-11 sm:h-12 px-6 flex items-center justify-center rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold text-xs hover:bg-[var(--accent)]/20 hover:scale-105 transition-all shadow-sm active:scale-95"
            title="Trigger goal celebration demo"
          >
            ⚽ GOAL!
          </button>
        </div>
      </section>

      {/* ── PULSE STRIP ── */}
      <section className="relative px-0 py-8 overflow-hidden border-y border-[var(--border)] bg-[var(--card)]/10">
        {contentLoading ? (
          <div className="py-2">
            <BallRollingLoader size="md" label="Updating statistics..." />
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar scrollbar-hide px-6 pb-1 md:justify-center animate-in fade-in duration-700">
            {pulseStats.map((s) => (
              <div
                key={s.label}
                className="shrink-0 flex flex-col items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-3.5 min-w-[110px] sm:min-w-[120px] hover:border-[var(--border-hover)] transition-all cursor-default shadow-sm"
              >
                <span className="text-xl sm:text-2xl mb-1">{s.icon}</span>
                <span
                  className="font-display text-2xl sm:text-3xl font-bold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">
                  {s.label}
                </span>
              </div>
            ))}
            <div className="shrink-0 w-3" />
          </div>
        )}
      </section>

      {/* ── FEATURED AGENT ── */}
      <section className="px-5 py-12 md:py-20 max-w-[900px] mx-auto text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 mb-8 sm:mb-6">
          <h2 className="font-display text-2xl md:text-3xl">
            Agent <span className="text-[var(--accent)]">Spotlight</span>
          </h2>
          <div className="flex items-center gap-4">
            <LivePulseRing
              color="#22c55e"
              size={6}
              label="Online"
              showLabel={true}
            />
            <Link
              href="/agents"
              className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              All 8 agents →
            </Link>
          </div>
        </div>

        {contentLoading ? (
          <div className="py-20 flex justify-center">
            <BallRollingLoader size="lg" label="Waking up the experts..." />
          </div>
        ) : (
          featuredAgent && (
            <Link
              href={`/agents/${featuredAgent.id}`}
              className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 p-5 sm:p-7 rounded-[28px] bg-gradient-to-br from-[var(--card)] to-[var(--bg-2)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all group overflow-hidden block shadow-sm animate-in slide-in-from-bottom-4 duration-700"
              key={featuredAgent.id}
            >
              {/* glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent-2)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/20 border border-[var(--border)] flex items-center justify-center text-5xl shadow-lg relative z-10 transition-transform group-hover:scale-110">
                {featuredAgent.avatar}
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="inline-block self-center sm:self-start text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
                    Featured Agent
                  </span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--border)]" />
                  <span className="text-[11px] text-[var(--accent-2)] font-bold uppercase tracking-widest">
                    {featuredAgent.role}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-[var(--text)] mb-2">
                  {featuredAgent.name}
                </h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed max-w-md mx-auto sm:mx-0">
                  {featuredAgent.description}
                </p>
              </div>
              <div className="hidden sm:flex shrink-0 self-center w-10 h-10 items-center justify-center rounded-full bg-[var(--bg-2)] border border-[var(--border)] text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:translate-x-1 transition-all relative z-10 shadow-inner">
                →
              </div>
            </Link>
          )
        )}

        {/* Agent dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {FEATURED_IDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setFeaturedIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === featuredIdx ? 'w-6 h-1 bg-[var(--accent)]' : 'w-1.5 h-1 bg-[var(--border)]'}`}
              aria-label={`Agent ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── QUICK NAV GRID ── */}
      <section className="px-5 pb-20 max-w-[900px] mx-auto text-center sm:text-left">
        <h2 className="font-display text-2xl md:text-3xl mb-8 sm:mb-6">
          Explore <span className="text-[var(--accent-2)]">KickoffTo</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              href: '/schedule',
              emoji: '📅',
              label: 'Schedule',
              sub: 'WC2026 timeline',
              color: 'var(--accent)',
            },
            {
              href: '/groups',
              emoji: '🗂️',
              label: 'The 12 Groups',
              sub: 'All 48 teams',
              color: 'var(--accent-2)',
            },
            {
              href: '/watch-parties',
              emoji: '🍁',
              label: 'Watch Parties',
              sub: 'Toronto venues',
              color: '#ff4d6d',
            },
            {
              href: '/fan-pulse',
              emoji: '🔥',
              label: 'Fan Pulse',
              sub: 'Reddit buzz',
              color: 'var(--accent-3)',
            },
            {
              href: '/stats',
              emoji: '📊',
              label: 'Stats',
              sub: 'xG & advanced',
              color: 'var(--accent)',
            },
            {
              href: '/teams',
              emoji: '🌍',
              label: 'Nations',
              sub: 'All 48 teams',
              color: 'var(--gold)',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 sm:p-5 rounded-[22px] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)] transition-all touch-manipulation active:scale-[0.97] shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl filter drop-shadow-sm">
                  {item.emoji}
                </span>
                <div className="hidden sm:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--accent)] text-xs">
                  →
                </div>
              </div>
              <span className="block font-display text-sm sm:text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                {item.label}
              </span>
              <span className="block text-[10px] text-[var(--muted)] mt-1 tracking-wide">
                {item.sub}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

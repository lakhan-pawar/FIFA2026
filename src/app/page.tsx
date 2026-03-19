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
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-12 md:pt-20 overflow-hidden bg-[var(--c-bg-base)]">
        {/* background glows - Team Immersive Light Leaks */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-[var(--c-accent)]/10 blur-[120px] rounded-full opacity-60" />
        </div>

        {/* Pre-headline badge */}
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--c-bg-surface)] border border-[var(--c-border)] text-[12px] font-medium text-[var(--c-text-tertiary)] uppercase tracking-[0.2em] shadow-sm">
          <LivePulseRing
            color="var(--c-accent)"
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
        <h1 className="relative z-10 hero-title mb-4 tracking-tighter text-[var(--c-text-primary)]">
          <span className="block opacity-90">BATTLE FOR THE</span>
          <span className="hero-gradient-text block">BEAUTIFUL GAME</span>
        </h1>

        <p className="relative z-10 text-[18px] text-[var(--c-text-secondary)] font-medium max-w-2xl mb-10 leading-relaxed px-4">
          {team
            ? `Track ${team.name}'s journey to the finals with AI-powered tactical depth and real-time insights.`
            : 'Experience the first 48-team World Cup with AI-powered tactical insights, real-time pulse, and your elite scouting inner circle.'}
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
                className="flex flex-col items-center justify-center bg-[var(--c-bg-surface)] border border-[var(--c-border)] rounded-lg py-3 sm:py-4 px-1 shadow-sm"
              >
                <span
                  className={`score-text tabular-nums leading-none ${i === 3 ? 'text-[var(--c-accent)]' : 'text-[var(--c-text-primary)]'}`}
                >
                  {seg.v}
                </span>
                <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest mt-1">
                  {seg.l}
                </span>
              </div>
            ))}
            <div className="col-span-4 text-center text-[11px] text-[var(--c-text-tertiary)] font-medium uppercase tracking-[0.2em] mt-1 opacity-60">
              Until June 11, 2026 · Estadio Azteca
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/agents"
            className="px-7 py-3 bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded-lg text-[15px] font-semibold hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center justify-center"
          >
            Meet Your AI Elite
          </Link>
          <Link
            href="/schedule"
            className="px-7 py-3 bg-transparent border-[1.5px] border-[var(--c-accent)] text-[var(--c-accent)] rounded-lg text-[15px] font-semibold hover:bg-[var(--c-accent)]/5 transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            Explore KickoffTo
          </Link>
          {/* Goal Demo Trigger */}
          <button
            onClick={triggerGoalDemo}
            className="px-4 py-3 bg-[var(--c-accent-subtle)] border border-[var(--c-accent-subtle)] text-[var(--c-accent-subtle-text)] rounded-lg text-[11px] font-bold hover:opacity-80 transition-all shadow-sm active:scale-95"
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
                className="shrink-0 flex flex-col items-center justify-center bg-[var(--c-bg-surface)] border border-[var(--c-border)] rounded-xl px-5 py-3.5 min-w-[110px] sm:min-w-[120px] hover:border-[var(--c-border-strong)] transition-all cursor-default shadow-sm"
              >
                <span className="text-xl sm:text-2xl mb-1">{s.icon}</span>
                <span
                  className="font-semibold text-2xl sm:text-3xl"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
                <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest mt-0.5">
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
              className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 p-5 sm:p-7 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] hover:border-[var(--c-accent)]/30 transition-all group overflow-hidden block shadow-sm animate-in slide-in-from-bottom-4 duration-700"
              key={featuredAgent.id}
            >
              {/* glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/5 to-[var(--c-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[var(--c-bg-subtle)] border border-[var(--c-border)] flex items-center justify-center text-5xl relative z-10 transition-transform group-hover:scale-110">
                {featuredAgent.avatar}
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="inline-block self-center sm:self-start badge-text uppercase tracking-widest text-[var(--c-accent)] bg-[var(--c-accent-subtle)] px-2 py-0.5 rounded-full">
                    Featured Agent
                  </span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--c-border)]" />
                  <span className="badge-text text-[var(--c-accent)] uppercase tracking-widest">
                    {featuredAgent.role}
                  </span>
                </div>

                <h3 className="section-title text-[var(--c-text-primary)] mb-2">
                  {featuredAgent.name}
                </h3>
                <p className="body-text text-[var(--c-text-secondary)] leading-relaxed max-w-md mx-auto sm:mx-0">
                  {featuredAgent.description}
                </p>
              </div>
              <div className="hidden sm:flex shrink-0 self-center w-10 h-10 items-center justify-center rounded-full bg-[var(--c-bg-subtle)] border border-[var(--c-border)] text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] group-hover:border-[var(--c-accent)]/30 group-hover:translate-x-1 transition-all relative z-10">
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
              className="group p-4 sm:p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] hover:border-[var(--c-accent)]/30 hover:bg-[var(--c-bg-subtle)] transition-all touch-manipulation active:scale-[0.97] shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl filter drop-shadow-sm">
                  {item.emoji}
                </span>
                <div className="hidden sm:block opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[var(--c-accent)] text-xs">
                  →
                </div>
              </div>
              <span className="block card-title text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)] transition-colors leading-tight">
                {item.label}
              </span>
              <span className="block meta-text text-[var(--c-text-tertiary)] mt-1 tracking-wide">
                {item.sub}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

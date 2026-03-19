'use client';

import { useEffect, useState, useMemo } from 'react';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { cn } from '@/utils';

function useCountdown(target: Date) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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

function RelativePill({ date }: { date: string }) {
  const d = new Date(date);
  const diff = d.getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);

  if (days < 0) return <span className="badge-text text-[var(--c-text-tertiary)] bg-[var(--c-bg-subtle)] px-2 py-0.5 rounded-full">Passed</span>;
  if (days === 0) return <span className="badge-text text-[var(--c-accent)] bg-[var(--c-accent-subtle)] px-2 py-0.5 rounded-full animate-pulse">TODAY</span>;
  return <span className="badge-text text-[var(--c-accent)] bg-[var(--c-accent-subtle)] px-2 py-0.5 rounded-full font-bold">In {days} days</span>;
}

const WC_PHASES = [
  { label: 'Group Stage', dates: 'Jun 11 – Jun 27', emoji: '🔵', note: '48 teams, 12 groups' },
  { label: 'Round of 32', dates: 'Jun 28 – Jul 2', emoji: '⚡', note: '32 teams remaining' },
  { label: 'Round of 16', dates: 'Jul 4 – Jul 7', emoji: '🔥', note: 'Knockout begins' },
  { label: 'Quarter-Finals', dates: 'Jul 9 – Jul 10', emoji: '💥', note: 'Last 8 standing' },
  { label: 'Semi-Finals', dates: 'Jul 14 – Jul 15', emoji: '🏆', note: 'Final four' },
  { label: 'The Final', dates: 'Jul 19, 2026', emoji: '👑', note: 'MetLife Stadium, NJ' },
];

const FIXTURES = [
  { opponent: 'TBD (Group Draw Q4 2025)', date: '2026-06-12T15:00:00Z', venue: 'Vancouver/Toronto', status: 'Draw Pending' },
  { opponent: 'TBD (Group Draw Q4 2025)', date: '2026-06-16T20:00:00Z', venue: 'Seattle/Boston', status: 'Draw Pending' },
  { opponent: 'TBD (Group Draw Q4 2025)', date: '2026-06-21T18:00:00Z', venue: 'Kansas City/Dallas', status: 'Draw Pending' },
];

export default function LivePage() {
  const { team } = useFavoriteTeam();
  const t = useCountdown(WC_KICKOFF);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const displayTeam = team || { name: 'Canada', flag: '🍁', flagCode: 'ca' };
  const isCanada = displayTeam.name === 'Canada';

  const KEY_DATES = [
    { icon: '🌐', title: 'Group Stage Draw', iso: '2025-12-05', date: 'Dec 5, 2025', note: 'Find out all 12 groups' },
    { icon: '🏟️', title: 'Opening Match', iso: '2026-06-11', date: 'June 11, 2026', note: 'Estadio Azteca, Mexico City' },
    { icon: displayTeam.flag, title: `${displayTeam.name} Debut`, iso: '2026-06-12', date: 'June 12, 2026', note: 'First group stage match' },
    { icon: '👑', title: 'World Cup Final', iso: '2026-07-19', date: 'July 19, 2026', note: 'MetLife Stadium, New Jersey' },
  ];

  const formatMatchTime = (isoDate: string) => {
    const d = new Date(isoDate);
    const diff = d.getTime() - Date.now();
    if (diff > 0 && diff < 86400000) {
      const hrs = Math.floor(diff / 36e5);
      const mins = Math.floor((diff % 36e5) / 6e4);
      const secs = Math.floor((diff % 6e4) / 1000);
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-10 pb-24">
      {/* HEADER */}
      <div className="mb-10 lg:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-accent-subtle)] border border-[var(--c-accent)]/20 badge-text text-[var(--c-accent)] uppercase tracking-widest mb-4">
          <Clock className="w-3.5 h-3.5" />
          Live Tournament Pulse
        </div>
        <h1 className="page-title text-[var(--c-text-primary)] mb-2">
          World Cup <span className="text-[var(--c-accent)]">2026</span>
        </h1>
        <p className="body-text text-[var(--c-text-secondary)] max-w-xl">
          Track every match, every goal, and the road to the final across three host nations.
        </p>
      </div>

      {/* HERO COUNTDOWN */}
      {mounted && (
        <div className="relative p-8 md:p-12 lg:p-16 rounded-[2rem] border border-[var(--c-border)] bg-[var(--c-bg-surface)] shadow-2xl overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--c-accent)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--c-gold)]/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="badge-text uppercase tracking-[0.3em] text-[var(--c-text-tertiary)] mb-6">Kickoff Countdown</span>
            <div className="grid grid-cols-4 gap-3 md:gap-6 mb-8 w-full max-w-xl">
              {[
                { v: t.days, l: 'Days' },
                { v: String(t.hours).padStart(2, '0'), l: 'Hours' },
                { v: String(t.minutes).padStart(2, '0'), l: 'Mins' },
                { v: String(t.seconds).padStart(2, '0'), l: 'Secs' },
              ].map((seg, i) => (
                <div key={i} className="flex flex-col items-center bg-[var(--c-bg-subtle)]/50 backdrop-blur rounded-2xl py-6 border border-[var(--c-border)] shadow-sm">
                  <span className={cn(
                    "score-text tabular-nums leading-none mb-2",
                    i === 3 ? "text-[var(--c-accent)]" : "text-[var(--c-text-primary)]"
                  )}>
                    {seg.v}
                  </span>
                  <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-[0.15em]">{seg.l}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 body-text text-[var(--c-text-secondary)]">
              <Calendar className="w-4 h-4 text-[var(--c-accent)]" />
              <span>June 11, 2026 · Estadio Azteca · Mexico City</span>
            </div>
          </div>
        </div>
      )}

      {/* MATCHES */}
      <section className="mb-12">
        <h2 className="section-title text-[var(--c-text-primary)] mb-6 flex items-center gap-3">
          <span className="text-2xl">{displayTeam.flag}</span>
          {displayTeam.name}&apos;s Fixtures
        </h2>
        <div className="grid gap-3">
          {mounted ? FIXTURES.map((f, i) => (
            <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-5 rounded-2xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent)]/30 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[var(--c-bg-subtle)] border border-[var(--c-border)] flex items-center justify-center text-2xl shrink-0">
                {isCanada ? '🍁' : (
                  <img src={`https://flagcdn.com/w160/${displayTeam.flagCode}.png`} className="w-full h-full object-cover rounded-lg" alt="" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="card-title text-[var(--c-text-primary)]">Match {i + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--c-bg-subtle)] border border-[var(--c-border)] badge-text text-[var(--c-text-tertiary)]">Group Stage</span>
                </div>
                <div className="body-text text-[var(--c-text-secondary)] mb-1">Against {f.opponent.split(' (')[0]}</div>
                <div className="flex items-center gap-3 meta-text text-[var(--c-text-tertiary)]">
                   <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(f.date).toLocaleDateString()}</div>
                   <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.venue}</div>
                </div>
              </div>
              <div className="w-full sm:w-auto flex flex-col items-end gap-1 shrink-0">
                <span className="badge-text bg-[var(--c-accent)]/10 text-[var(--c-accent)] border border-[var(--c-accent)]/20 px-3 py-1 rounded-full font-bold">
                  {formatMatchTime(f.date)}
                </span>
                <span className="meta-text text-[var(--c-text-tertiary)]">TBD post-draw</span>
              </div>
            </div>
          )) : (
            <div className="h-64 animate-pulse bg-[var(--c-bg-surface)] rounded-2xl border border-[var(--c-border)]" />
          )}
        </div>
      </section>

      {/* KEY DATES */}
      <section>
        <h2 className="section-title text-[var(--c-text-primary)] mb-6">Tournament <span className="text-[var(--c-gold)]">Key Dates</span></h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mounted ? KEY_DATES.map((d, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] hover:border-[var(--c-accent)]/40 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--c-bg-subtle)] border border-[var(--c-border)] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {d.icon}
                </div>
                <RelativePill date={d.iso} />
              </div>
              <h3 className="card-title text-[var(--c-text-primary)] mb-1">{d.title}</h3>
              <p className="body-text text-[var(--c-text-secondary)] mb-4">{d.note}</p>
              <div className="flex items-center gap-2 font-bold text-[var(--c-accent)]">
                <Calendar className="w-4 h-4" />
                <span>{d.date}</span>
              </div>
            </div>
          )) : (
            <>
              <div className="h-40 animate-pulse bg-[var(--c-bg-surface)] rounded-2xl border border-[var(--c-border)]" />
              <div className="h-40 animate-pulse bg-[var(--c-bg-surface)] rounded-2xl border border-[var(--c-border)]" />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

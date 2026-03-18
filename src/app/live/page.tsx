'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

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

const WC_PHASES = [
  {
    label: 'Group Stage',
    dates: 'Jun 11 – Jun 27',
    emoji: '🔵',
    note: '48 teams, 12 groups',
  },
  {
    label: 'Round of 32',
    dates: 'Jun 28 – Jul 2',
    emoji: '⚡',
    note: '32 teams remaining',
  },
  {
    label: 'Round of 16',
    dates: 'Jul 4 – Jul 7',
    emoji: '🔥',
    note: 'Knockout begins',
  },
  {
    label: 'Quarter-Finals',
    dates: 'Jul 9 – Jul 10',
    emoji: '💥',
    note: 'Last 8 standing',
  },
  {
    label: 'Semi-Finals',
    dates: 'Jul 14 – Jul 15',
    emoji: '🏆',
    note: 'Final four',
  },
  {
    label: 'The Final',
    dates: 'Jul 19, 2026',
    emoji: '👑',
    note: 'MetLife Stadium, NJ',
  },
];

const FIXTURES = [
  {
    opponent: 'TBD (Group Draw Q4 2025)',
    date: 'Mid-June 2026',
    venue: 'TBD',
    status: 'Draw Pending',
  },
  {
    opponent: 'TBD (Group Draw Q4 2025)',
    date: 'Mid-June 2026',
    venue: 'TBD',
    status: 'Draw Pending',
  },
  {
    opponent: 'TBD (Group Draw Q4 2025)',
    date: 'Mid-June 2026',
    venue: 'TBD',
    status: 'Draw Pending',
  },
];

export default function LivePage() {
  const { team } = useFavoriteTeam();
  const t = useCountdown(WC_KICKOFF);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const displayTeam = team || { name: 'Canada', flag: '🍁', flagCode: 'ca' };
  const isCanada = displayTeam.name === 'Canada';

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 py-8 pb-24">
      {/* ── PAGE HEADER ── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse inline-block" />
          Tournament Countdown
        </div>
        <h1 className="font-display text-4xl md:text-5xl mb-2">
          WC 2026 <span className="text-[var(--accent)]">Schedule</span>
        </h1>
        <p className="text-sm text-[var(--muted)]">
          The biggest World Cup in history. 48 teams. 3 nations. One trophy.
        </p>
      </div>

      {/* ── HERO COUNTDOWN ── */}
      {mounted && (
        <section className="relative rounded-3xl overflow-hidden mb-10 border border-[var(--border)]">
          {/* bg layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--card)] via-[var(--bg-2)] to-[var(--bg)]" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--accent)]/8 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[var(--accent-2)]/6 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 px-6 py-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)] mb-2">
              Kickoff in
            </p>
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-4">
              {[
                { v: t.days, l: 'Days' },
                { v: String(t.hours).padStart(2, '0'), l: 'Hours' },
                { v: String(t.minutes).padStart(2, '0'), l: 'Mins' },
                { v: String(t.seconds).padStart(2, '0'), l: 'Secs' },
              ].map((seg, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-[var(--bg)]/60 backdrop-blur-sm border border-[var(--border)] rounded-2xl py-5"
                >
                  <span
                    className={`font-display text-4xl md:text-5xl font-bold tabular-nums leading-none ${i === 3 ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}
                  >
                    {seg.v}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-2">
                    {seg.l}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--muted)]">
              ⚽ <strong className="text-[var(--text)]">June 11, 2026</strong> ·
              Estadio Azteca · Mexico City
            </p>
          </div>
        </section>
      )}

      {/* ── TEAM'S JOURNEY ── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{displayTeam.flag}</span>
          <h2 className="font-display text-2xl">
            {displayTeam.name}'s{' '}
            <span className="text-[var(--accent-2)]">Journey</span>
          </h2>
        </div>
        <div
          className={`rounded-2xl bg-gradient-to-br border border-[var(--border)] overflow-hidden ${
            isCanada
              ? 'from-[#cc0000]/10 via-[var(--card)] to-[var(--bg-2)]'
              : 'from-[var(--accent)]/10 via-[var(--card)] to-[var(--bg-2)]'
          }`}
        >
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              Group Stage Fixtures
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-2)]/10 text-[var(--accent-2)] font-bold border border-[var(--accent-2)]/20">
              Draw Pending
            </span>
          </div>
          {FIXTURES.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border)]/50 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-xl shrink-0 overflow-hidden">
                {isCanada ? (
                  '🍁'
                ) : (
                  <img
                    src={`https://flagcdn.com/w80/${displayTeam.flagCode}.png`}
                    className="w-full h-full object-cover"
                    alt={displayTeam.name}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[var(--text)] mb-0.5">
                  Match {i + 1} vs {f.opponent.split(' (')[0]}
                </div>
                <div className="text-[10px] text-[var(--muted)]">
                  {f.date} · {f.venue}
                </div>
              </div>
              <span className="text-[10px] font-medium text-[var(--muted)] bg-[var(--bg-2)] px-2 py-1 rounded-full border border-[var(--border)] shrink-0">
                TBD
              </span>
            </div>
          ))}
          <div className="px-5 py-3 text-[11px] text-[var(--muted)] bg-[var(--bg-2)]/50">
            🎯 {displayTeam.name}{' '}
            {isCanada
              ? 'qualified for their second ever World Cup'
              : 'enters the world stage as a heavy-weight contender'}
            . Group draw expected Q4 2025.
          </div>
        </div>
      </section>

      {/* ── WC PHASE TIMELINE ── */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-5">
          Tournament <span className="text-[var(--accent-3)]">Timeline</span>
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
          {WC_PHASES.map((phase, i) => (
            <div
              key={i}
              className="shrink-0 flex flex-col p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all min-w-[160px] max-w-[180px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)]">
                  {i + 1}
                </div>
                {i < WC_PHASES.length - 1 && (
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
                )}
              </div>
              <span className="text-2xl mb-2">{phase.emoji}</span>
              <h3 className="font-display text-sm text-[var(--text)] leading-tight mb-1">
                {phase.label}
              </h3>
              <p className="text-[11px] font-bold text-[var(--accent)] mb-1">
                {phase.dates}
              </p>
              <p className="text-[10px] text-[var(--muted)] leading-snug">
                {phase.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY DATES ── */}
      <section>
        <h2 className="font-display text-2xl mb-5">
          Key <span className="text-[var(--gold)]">Dates</span>
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: '🌐',
              title: 'Group Stage Draw',
              date: 'Q4 2025 (TBC)',
              note: 'Find out all 12 groups',
            },
            {
              icon: '🏟️',
              title: 'Opening Match',
              date: 'June 11, 2026',
              note: 'Estadio Azteca — the iconic start',
            },
            {
              icon: displayTeam.flag,
              title: `${displayTeam.name} First Match`,
              date: 'Mid-June 2026',
              note: 'Group stage — exact date TBD post-draw',
            },
            {
              icon: '👑',
              title: 'World Cup Final',
              date: 'July 19, 2026',
              note: 'MetLife Stadium, New Jersey',
            },
          ].map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-xl shrink-0">
                {d.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text)] mb-0.5">
                  {d.title}
                </div>
                <div className="text-[11px] text-[var(--muted)]">{d.note}</div>
              </div>
              <span className="text-[11px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20 shrink-0 text-right">
                {d.date}
              </span>
            </div>
          ))}
        </div>

        <a
          href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--card-hover)] transition-colors group cursor-pointer"
        >
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">
              Official FIFA Info & Tickets
            </div>
            <div className="text-xs text-[var(--muted)]">
              Visit FIFA.com for registrations
            </div>
          </div>
          <span className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all text-lg">
            →
          </span>
        </a>
      </section>
    </div>
  );
}

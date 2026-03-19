'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, MapPin, RotateCcw, Network } from 'lucide-react';

interface MatchSlot {
  id: string;
  pairing: [string, string];
  date: string;
  venue: string;
  city: string;
}

const KNOCKOUT_PHASES: { key: string; label: string; matches: MatchSlot[] }[] =
  [
    {
      key: 'R32',
      label: 'Round of 32',
      matches: [
        {
          id: '73',
          pairing: ['2A', '2B'],
          date: 'June 28',
          venue: 'SoFi Stadium',
          city: 'Los Angeles',
        },
        {
          id: '74',
          pairing: ['1E', '3A/B/C/D/F'],
          date: 'June 29',
          venue: 'Gillette Stadium',
          city: 'Boston',
        },
        {
          id: '75',
          pairing: ['1F', '2C'],
          date: 'June 29',
          venue: 'Monterrey Stadium',
          city: 'Monterrey',
        },
        {
          id: '76',
          pairing: ['1C', '2F'],
          date: 'June 30',
          venue: 'NRG Stadium',
          city: 'Houston',
        },
        {
          id: '77',
          pairing: ['1I', '3C/D/F/G/H'],
          date: 'June 30',
          venue: 'MetLife Stadium',
          city: 'New York',
        },
        {
          id: '78',
          pairing: ['2E', '2I'],
          date: 'July 1',
          venue: 'Mercedes-Benz Stadium',
          city: 'Atlanta',
        },
        {
          id: '79',
          pairing: ['1A', '3C/E/F/H/I'],
          date: 'July 1',
          venue: 'Estadio Azteca',
          city: 'Mexico City',
        },
        {
          id: '80',
          pairing: ['1L', '3E/H/I/J/K'],
          date: 'July 2',
          venue: 'BC Place',
          city: 'Vancouver',
        },
      ],
    },
    {
      key: 'R16',
      label: 'Round of 16',
      matches: [
        {
          id: '89',
          pairing: ['W73', 'W74'],
          date: 'July 4',
          venue: 'Lincoln Financial Field',
          city: 'Philadelphia',
        },
        {
          id: '90',
          pairing: ['W75', 'W76'],
          date: 'July 5',
          venue: 'NRG Stadium',
          city: 'Houston',
        },
        {
          id: '91',
          pairing: ['W77', 'W78'],
          date: 'July 6',
          venue: 'Lumen Field',
          city: 'Seattle',
        },
        {
          id: '92',
          pairing: ['W79', 'W80'],
          date: 'July 7',
          venue: 'AT&T Stadium',
          city: 'Dallas',
        },
      ],
    },
    {
      key: 'QF',
      label: 'Quarter-Finals',
      matches: [
        {
          id: '97',
          pairing: ['W89', 'W90'],
          date: 'July 9',
          venue: 'Gillette Stadium',
          city: 'Boston',
        },
        {
          id: '98',
          pairing: ['W91', 'W92'],
          date: 'July 10',
          venue: 'SoFi Stadium',
          city: 'Los Angeles',
        },
      ],
    },
    {
      key: 'SF',
      label: 'Semi-Finals',
      matches: [
        {
          id: '101',
          pairing: ['W97', 'W98'],
          date: 'July 14',
          venue: 'AT&T Stadium',
          city: 'Dallas',
        },
        {
          id: '102',
          pairing: ['W98', 'W97'],
          date: 'July 15',
          venue: 'MetLife Stadium',
          city: 'New York',
        },
      ],
    },
    {
      key: 'Final',
      label: 'The Final',
      matches: [
        {
          id: '104',
          pairing: ['W101', 'W102'],
          date: 'July 19',
          venue: 'MetLife Stadium',
          city: 'New York/NJ',
        },
      ],
    },
  ];

const TOTAL_MATCHES = KNOCKOUT_PHASES.reduce(
  (acc, p) => acc + p.matches.length,
  0
);

export default function BracketsPage() {
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [champion, setChampion] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('fifa2026_predictions');
    if (saved) setPredictions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isMounted)
      localStorage.setItem('fifa2026_predictions', JSON.stringify(predictions));
    const champ = predictions['104'];
    if (champ && champ !== champion) {
      setChampion(champ);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [predictions, isMounted, champion]);

  const getLabel = useCallback(
    (matchId: string, pairing: [string, string], idx: number): string => {
      const raw = pairing[idx];
      if (raw.startsWith('W')) return predictions[raw.substring(1)] || raw;
      return raw;
    },
    [predictions]
  );

  const selectWinner = (matchId: string, winner: string) => {
    setPredictions((prev) => ({ ...prev, [matchId]: winner }));
  };

  const resetPredictions = () => {
    if (confirm('Clear all your predictions?')) {
      setPredictions({});
      setChampion(null);
    }
  };

  const completedCount = Object.keys(predictions).length;
  const progress = Math.round((completedCount / TOTAL_MATCHES) * 100);

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-[1300px] mx-auto px-4 py-10 pb-24 overflow-x-hidden">
      {/* ── CONFETTI OVERLAY ── */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                fontSize: `${16 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.8}s`,
              }}
            >
              {
                ['🎉', '🏆', '⭐', '🌟', '🥇', '🎊'][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-gold)]/10 border border-[var(--c-gold)]/20 badge-text text-[var(--c-gold)] uppercase mb-3">
            Live Simulation Mode
          </div>
          <h1 className="page-title mb-2 text-[var(--c-text-primary)]">
            Tournament <span className="text-[var(--c-gold)]">Bracket</span>
          </h1>
          <p className="body-text text-[var(--c-text-secondary)]">
            Tap a team to pick the winner. Build your road to New Jersey.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetPredictions}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] badge-text text-[var(--c-text-tertiary)] hover:border-rose-500/40 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent)] text-[var(--c-accent-text)] badge-text shadow-lg shadow-[var(--c-accent)]/20 hover:scale-105 transition-transform border-0">
            <Network className="w-3.5 h-3.5" /> AI Simulate
          </button>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="mb-10 p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="badge-text text-[var(--c-text-primary)]">
            Bracket completion
          </span>
          <span className="badge-text text-[var(--c-accent)] font-mono">
            {completedCount} / {TOTAL_MATCHES} matches
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--c-bg-subtle)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="badge-text text-[var(--c-accent)] mt-3">
            🎉 Bracket complete! Your prediction is saved.
          </p>
        )}
      </div>

      {/* ── BRACKET FLOW (horizontal scroll, all rounds visible) ── */}
      <div className="overflow-x-auto pb-8">
        <div className="flex gap-6 min-w-max">
          {KNOCKOUT_PHASES.map((phase, phaseIdx) => (
            <div key={phase.key} className="flex flex-col">
              {/* Phase header */}
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-bg-surface)] border border-[var(--c-border)] badge-text text-[var(--c-text-tertiary)] shadow-sm uppercase">
                  <span className="text-[var(--c-gold)] font-mono">
                    {phaseIdx + 1}
                  </span>
                  {phase.label}
                </div>
              </div>

              {/* Matches column */}
              <div className="flex flex-col gap-4 justify-around flex-1">
                {phase.matches.map((match) => {
                  const labelA = getLabel(match.id, match.pairing, 0);
                  const labelB = getLabel(match.id, match.pairing, 1);
                  const winner = predictions[match.id];
                  const isTbdA = labelA.startsWith('W');
                  const isTbdB = labelB.startsWith('W');

                  return (
                    <div
                      key={match.id}
                      className={`w-[200px] rounded-xl border-[0.5px] transition-all overflow-hidden ${winner ? 'border-[var(--c-gold)] shadow-lg shadow-[var(--c-gold)]/10' : 'border-[var(--c-border)]'} bg-[var(--c-bg-surface)]`}
                    >
                      {/* Slot A */}
                      <button
                        onClick={() =>
                          !isTbdA && selectWinner(match.id, labelA)
                        }
                        disabled={isTbdA}
                        className={`w-full flex items-center gap-2 px-3 py-3 border-b [0.5px] border-[var(--c-border)] transition-all text-left ${
                          winner === labelA
                            ? 'bg-[var(--c-gold)]/10 text-[var(--c-gold)]'
                            : isTbdA
                              ? 'opacity-30 cursor-default'
                              : 'hover:bg-[var(--c-bg-subtle)] cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${winner === labelA ? 'bg-[var(--c-gold)] border-[var(--c-gold)]' : 'border-[var(--c-border)] bg-[var(--c-bg-subtle)]'}`}
                        >
                          {winner === labelA && (
                            <Trophy className="w-2.5 h-2.5 text-black" />
                          )}
                        </div>
                        <span
                          className={`badge-text truncate leading-none ${winner === labelA ? 'text-[var(--c-gold)]' : 'text-[var(--c-text-primary)]'}`}
                        >
                          {isTbdA ? 'TBD' : labelA}
                        </span>
                      </button>

                      {/* Slot B */}
                      <button
                        onClick={() =>
                          !isTbdB && selectWinner(match.id, labelB)
                        }
                        disabled={isTbdB}
                        className={`w-full flex items-center gap-2 px-3 py-3 transition-all text-left ${
                          winner === labelB
                            ? 'bg-[var(--c-gold)]/10 text-[var(--c-gold)]'
                            : isTbdB
                              ? 'opacity-30 cursor-default'
                              : 'hover:bg-[var(--c-bg-subtle)] cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${winner === labelB ? 'bg-[var(--c-gold)] border-[var(--c-gold)]' : 'border-[var(--c-border)] bg-[var(--c-bg-subtle)]'}`}
                        >
                          {winner === labelB && (
                            <Trophy className="w-2.5 h-2.5 text-black" />
                          )}
                        </div>
                        <span
                          className={`badge-text truncate leading-none ${winner === labelB ? 'text-[var(--c-gold)]' : 'text-[var(--c-text-primary)]'}`}
                        >
                          {isTbdB ? 'TBD' : labelB}
                        </span>
                      </button>

                      {/* Footer */}
                      <div className="px-3 py-1.5 flex items-center gap-1 bg-[var(--c-bg-subtle)]/50">
                        <MapPin className="w-2.5 h-2.5 text-[var(--c-text-tertiary)] shrink-0" />
                        <span className="meta-text text-[var(--c-text-tertiary)] truncate">
                          {match.city} · {match.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHAMPION REVEAL ── */}
      {champion && (
        <div className="mt-12 max-w-sm mx-auto p-10 rounded-xl bg-[var(--c-bg-surface)] border-2 border-[var(--c-gold)] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[var(--c-gold)]/5 blur-3xl" />
          <Trophy className="w-16 h-16 text-[var(--c-gold)] mx-auto mb-4 relative z-10 drop-shadow-xl" />
          <h2 className="page-title mb-2 relative z-10 text-[var(--c-text-primary)]">
            {champion}
          </h2>
          <div className="badge-text text-[var(--c-gold)] uppercase relative z-10 font-bold">
            Your 2026 World Champion 🏆
          </div>
        </div>
      )}
    </div>
  );
}

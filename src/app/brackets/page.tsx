'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, MapPin, RotateCcw, Share2, ChevronRight, ChevronLeft } from 'lucide-react';
import { MAJOR_TEAMS, Team } from '@/lib/teams';
import { cn } from '@/utils';

// Types
interface Match {
  id: string;
  round: number;
  pairing: [string, string];
  nextMatchId?: string;
  nextMatchSlot?: 0 | 1;
}

// Generate the 6-round structure
// Round 1: 24 matches (48 teams)
// Round 2: 16 matches (R32) - wait, 24 winners -> 12 matches? 
// To keep it simple and follow "Group Stage -> R32", we'll do:
// R1: 16 matches (32 teams playing, 16 teams get byes) = 48 teams.
// But the user wants a "6 round UI".
// Let's do:
// Round 1: Group Stage (24 match slots, 48 teams) -> 24 winners
// Round 2: Round of 32 (16 match slots). 24 winners + 8 byes = 32 teams.
// Round 3: Round of 16 (8 matches)
// Round 4: Quarter Finals (4 matches)
// Round 5: Semi Finals (2 matches)
// Round 6: Final (1 match)

const ROUND_LABELS = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter-Finals',
  'Semi-Finals',
  'The Final',
];

// Initialize teams: 23 real + 25 TBD
const INITIAL_TEAMS: string[] = [
  ...MAJOR_TEAMS.map((t) => t.name),
  ...Array(48 - MAJOR_TEAMS.length).fill('TBD'),
].sort(() => Math.random() - 0.5);

export default function BracketsPage() {
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [champion, setChampion] = useState<string | null>(null);

  // Initialize matches
  const generateMatches = useCallback(() => {
    const matches: Match[] = [];
    
    // Round 1 (id: 1-24)
    for (let i = 0; i < 24; i++) {
      matches.push({
        id: `r1-${i}`,
        round: 0,
        pairing: [INITIAL_TEAMS[i * 2], INITIAL_TEAMS[i * 2 + 1]],
        nextMatchId: `r2-${Math.floor(i / 2)}`, // This is tricky, 24 -> 16...
      });
    }

    // Simplified logic: Standard 32-team bracket where Round 1 is the "Play-in/Group"
    // To make a proper tree, let's just use 32 teams for the main knockout and 
    // have the first round be the "Group Stage" that fills those 32 slots.
    
    // Let's actually use a 32-team tree and map 48 teams into it.
    // Round 1: 16 matches (32 teams).
    // The other 16 teams are "Seeded" and wait in Round 2.
    // This gives 32 teams in Round 2 (16 winners + 16 seeded).
    
    return matches;
  }, []);

  // Correct Tournament Tree Logic
  // We need 32 slots in R2.
  // 16 slots are winners of R1 (16 matches, 32 teams).
  // 16 slots are "Byes" (the remaining 16 teams from 48).
  
  const [matches] = useState(() => {
    const m: Match[] = [];
    
    // Round 1: 16 matches (Matches 0-15)
    for (let i = 0; i < 16; i++) {
      m.push({
        id: `m1-${i}`,
        round: 0,
        pairing: [INITIAL_TEAMS[i * 2], INITIAL_TEAMS[i * 2 + 1]],
        nextMatchId: `m2-${i}`,
        nextMatchSlot: 0,
      });
    }

    // Round 2 (R32): 16 matches (Matches 16-31)
    // Pairing: Winner of R1 vs a seeded team
    for (let i = 0; i < 16; i++) {
      m.push({
        id: `m2-${i}`,
        round: 1,
        pairing: ['TBD', INITIAL_TEAMS[32 + i]],
        nextMatchId: `m3-${Math.floor(i / 2)}`,
        nextMatchSlot: (i % 2) as 0 | 1,
      });
    }

    // Round 3 (R16): 8 matches
    for (let i = 0; i < 8; i++) {
      m.push({
        id: `m3-${i}`,
        round: 2,
        pairing: ['TBD', 'TBD'],
        nextMatchId: `m4-${Math.floor(i / 2)}`,
        nextMatchSlot: (i % 2) as 0 | 1,
      });
    }

    // Round 4 (QF): 4 matches
    for (let i = 0; i < 4; i++) {
      m.push({
        id: `m4-${i}`,
        round: 3,
        pairing: ['TBD', 'TBD'],
        nextMatchId: `m5-${Math.floor(i / 2)}`,
        nextMatchSlot: (i % 2) as 0 | 1,
      });
    }

    // Round 5 (SF): 2 matches
    for (let i = 0; i < 2; i++) {
      m.push({
        id: `m5-${i}`,
        round: 4,
        pairing: ['TBD', 'TBD'],
        nextMatchId: `m6-0`,
        nextMatchSlot: (i % 2) as 0 | 1,
      });
    }

    // Round 6 (Final): 1 match
    m.push({
      id: `m6-0`,
      round: 5,
      pairing: ['TBD', 'TBD'],
    });

    return m;
  });

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('fifa2026_bracket_v2');
    const urlParams = new URLSearchParams(window.location.search);
    const shared = urlParams.get('state');

    if (shared) {
      try {
        setPredictions(JSON.parse(atob(shared)));
      } catch (e) {
        console.error('Failed to load shared state');
      }
    } else if (saved) {
      setPredictions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('fifa2026_bracket_v2', JSON.stringify(predictions));
      setChampion(predictions['m6-0'] || null);
    }
  }, [predictions, isMounted]);

  const selectWinner = (matchId: string, winner: string) => {
    const newPredictions = { ...predictions, [matchId]: winner };
    
    // Clear subsequent matches if the winner changed
    const currentMatch = matches.find(m => m.id === matchId);
    let nextId = currentMatch?.nextMatchId;
    while (nextId) {
      delete newPredictions[nextId];
      nextId = matches.find(m => m.id === nextId)?.nextMatchId;
    }

    setPredictions(newPredictions);
  };

  const getTeamName = (matchId: string, slot: 0 | 1) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return 'TBD';

    const raw = match.pairing[slot];
    if (match.round === 0) return raw;

    // For Rounds 1-5, slots might depend on previous matches
    if (match.round === 1 && slot === 0) {
      return predictions[`m1-${match.id.split('-')[1]}`] || 'TBD';
    }
    if (match.round === 1 && slot === 1) return raw;

    // Standard knockout logic for higher rounds
    const prevMatches = matches.filter(m => m.nextMatchId === matchId && m.nextMatchSlot === slot);
    if (prevMatches.length > 0) {
      return predictions[prevMatches[0].id] || 'TBD';
    }

    return raw;
  };

  const resetBracket = () => {
    if (confirm('Are you sure you want to reset your bracket?')) {
      setPredictions({});
      localStorage.removeItem('fifa2026_bracket_v2');
    }
  };

  const shareBracket = () => {
    const state = btoa(JSON.stringify(predictions));
    const url = `${window.location.origin}${window.location.pathname}?state=${state}`;
    navigator.clipboard.writeText(url);
    alert('Bracket link copied to clipboard!');
  };

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-[var(--c-bg-base)] pb-24">
      {/* ── HEADER ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--c-border)] mb-10">
        <div>
          <h1 className="page-title text-[var(--c-text-primary)] mb-1">Bracket <span className="text-[var(--c-accent)]">Predictor</span></h1>
          <p className="body-text text-[var(--c-text-secondary)]">Predict the path to the 2026 World Cup Final.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetBracket}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] text-sm font-semibold hover:bg-[var(--c-bg-subtle)] transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button 
            onClick={shareBracket}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--c-accent)] text-[var(--c-accent-text)] text-sm font-bold shadow-lg shadow-[var(--c-accent)]/20 hover:scale-105 transition-transform"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* ── BRACKET AREA ── */}
      <div className="max-w-[1600px] mx-auto px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 min-w-max md:min-w-0 md:pb-10">
          {ROUND_LABELS.map((label, roundIdx) => (
            <div key={label} className="flex flex-col gap-6 w-full md:w-[240px]">
              <div className="sticky top-0 z-10 bg-[var(--c-bg-base)] py-2 mb-2">
                <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest border-b border-[var(--c-border)] pb-2">
                  Round {roundIdx + 1}: {label}
                </div>
              </div>

              <div className="flex flex-col gap-4 justify-around h-full">
                {matches.filter(m => m.round === roundIdx).map(match => {
                  const teamA = getTeamName(match.id, 0);
                  const teamB = getTeamName(match.id, 1);
                  const winner = predictions[match.id];

                  return (
                    <div 
                      key={match.id}
                      className={cn(
                        "rounded-xl border transition-all overflow-hidden bg-[var(--c-bg-surface)] shadow-sm",
                        winner ? "border-[var(--c-accent)]/50 shadow-md shadow-[var(--c-accent)]/5" : "border-[var(--c-border)]"
                      )}
                    >
                      {[teamA, teamB].map((team, i) => (
                        <button
                          key={i}
                          disabled={team === 'TBD'}
                          onClick={() => selectWinner(match.id, team)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-3 text-sm font-semibold transition-all border-b last:border-b-0 border-[var(--c-border)]/50",
                            winner === team ? "bg-[var(--c-accent)]/10 text-[var(--c-accent)]" : "text-[var(--c-text-primary)] hover:bg-[var(--c-bg-subtle)]",
                            team === 'TBD' && "opacity-30 cursor-default"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              winner === team ? "bg-[var(--c-accent)]" : "bg-[var(--c-border)]"
                            )} />
                            <span className="truncate">{team}</span>
                          </div>
                          {winner === team && <Trophy className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHAMPION REVEAL ── */}
      {champion && champion !== 'TBD' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="px-8 py-4 rounded-full bg-[var(--c-bg-surface)] border-2 border-[var(--c-gold)] shadow-2xl flex items-center gap-4">
            <Trophy className="w-8 h-8 text-[var(--c-gold)]" />
            <div>
              <div className="badge-text text-[var(--c-gold)] uppercase font-bold tracking-widest">Your Champion</div>
              <div className="text-xl font-bold text-[var(--c-text-primary)]">{champion}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

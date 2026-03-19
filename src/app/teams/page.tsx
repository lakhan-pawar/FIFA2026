'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MAJOR_TEAMS } from '@/lib/teams';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { Users, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/utils';

const REGIONS = ['ALL', 'CONCACAF', 'CONMEBOL', 'UEFA', 'CAF', 'AFC', 'OFC'];

export default function TeamsPage() {
  const { team: favoriteTeam } = useFavoriteTeam();
  const [activeRegion, setActiveRegion] = useState('ALL');

  // Count teams per region
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: MAJOR_TEAMS.length };
    REGIONS.slice(1).forEach(r => {
      counts[r] = MAJOR_TEAMS.filter(t => t.region === r).length;
    });
    return counts;
  }, []);

  // Filter and Sort
  const filteredTeams = useMemo(() => {
    let teams = activeRegion === 'ALL' 
      ? [...MAJOR_TEAMS] 
      : MAJOR_TEAMS.filter(t => t.region === activeRegion);

    return teams.sort((a, b) => {
      if (a.id === favoriteTeam?.id) return -1;
      if (b.id === favoriteTeam?.id) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [activeRegion, favoriteTeam]);

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-10 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title text-[var(--c-text-primary)] mb-2">
          Tournament <span className="text-[var(--c-accent)]">Nations</span>
        </h1>
        <p className="body-text text-[var(--c-text-secondary)] max-w-xl">
          Explore the 48 participating nations, their current squads, and AI-powered scouting reports.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 text-[var(--c-text-tertiary)]">
          <Filter className="w-3.5 h-3.5" />
          <span className="badge-text uppercase tracking-widest">Filter by Confederation</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {REGIONS.map((region) => {
            const isActive = activeRegion === region;
            const count = regionCounts[region] || 0;
            
            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-[13px] transition-all",
                  isActive 
                    ? "bg-[var(--c-accent)] border-[var(--c-accent)] text-[var(--c-accent-text)] shadow-lg shadow-[var(--c-accent)]/20" 
                    : "bg-[var(--c-bg-surface)] border-[var(--c-border)] text-[var(--c-text-secondary)] hover:border-[var(--c-accent)]/30"
                )}
              >
                <span>{region}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-md",
                  isActive ? "bg-white/20" : "bg-[var(--c-bg-subtle)] text-[var(--c-text-tertiary)]"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filteredTeams.map((team) => {
          const isFavorite = team.id === favoriteTeam?.id;

          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={cn(
                "group relative flex items-center justify-between p-5 rounded-2xl border bg-[var(--c-bg-surface)] transition-all duration-300 shadow-sm",
                isFavorite 
                  ? "border-[var(--c-accent)] ring-1 ring-[var(--c-accent)]/20" 
                  : "border-[var(--c-border)] hover:border-[var(--c-accent)]/40 hover:translate-y-[-2px]"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-[var(--c-border)] shadow-sm transition-all",
                  isFavorite && "border-[var(--c-accent)]"
                )}>
                  <img
                    src={`https://flagcdn.com/w160/${team.flagCode}.png`}
                    alt={`${team.name} flag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)] transition-colors">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-wider">
                      {team.region}
                    </span>
                    {isFavorite && (
                      <span className="bg-[var(--c-accent)]/10 text-[var(--c-accent)] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[var(--c-accent)]/20 uppercase tracking-widest">
                        Your Team
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--c-bg-subtle)] text-[var(--c-text-tertiary)] group-hover:text-[var(--c-text-primary)] transition-colors">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Squad</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-all transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="py-20 text-center">
          <p className="body-text text-[var(--c-text-tertiary)]">No teams found for this region.</p>
        </div>
      )}
    </div>
  );
}

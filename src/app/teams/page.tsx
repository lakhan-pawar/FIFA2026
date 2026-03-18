'use client';

import Link from 'next/link';
import { MAJOR_TEAMS } from '@/lib/teams';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { Users, ChevronRight } from 'lucide-react';

export default function TeamsPage() {
  const { team: favoriteTeam } = useFavoriteTeam();

  // Sort so the user's favorite team is always first if in the list
  const sortedTeams = [...MAJOR_TEAMS].sort((a, b) => {
    if (a.id === favoriteTeam?.id) return -1;
    if (b.id === favoriteTeam?.id) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl">
          Tournament <span className="text-[var(--live)]">Teams</span>
        </h1>
      </div>

      <p className="text-sm text-[var(--muted)] mb-8">
        Explore the 48 participating nations, their current squads, and
        AI-powered scouting reports for every player.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {sortedTeams.map((team) => {
          const isFavorite = team.id === favoriteTeam?.id;

          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className={`
                group relative flex items-center justify-between p-4 rounded-2xl 
                border bg-[var(--card)] transition-all duration-300
                ${
                  isFavorite
                    ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/50'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    w-12 h-12 rounded-full overflow-hidden flex items-center justify-center
                    border-2 shadow-sm
                    ${isFavorite ? 'border-[var(--accent)]' : 'border-[var(--border)] group-hover:border-[var(--accent)]/50'}
                  `}
                >
                  <img
                    src={`https://flagcdn.com/w160/${team.flagCode}.png`}
                    alt={`${team.name} flag`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                      {team.region}
                    </span>
                    {isFavorite && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                        YOUR TEAM
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-2)] text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold">Squad</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-all transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

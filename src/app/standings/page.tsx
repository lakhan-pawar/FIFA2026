'use client';

import { useState, useEffect } from 'react';
import { Search, Info, Star } from 'lucide-react';
import { MAJOR_TEAMS, Team } from '@/lib/teams';
import Link from 'next/link';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const TOTAL_PER_GROUP = 4;
const CANADA_GROUP = 'B';

function getTeamsInGroup(g: string) {
  return MAJOR_TEAMS.filter((t) => t.group === g);
}

function GroupCard({
  groupLetter,
  delay,
  favoriteTeamName,
}: {
  groupLetter: string;
  delay: number;
  favoriteTeamName?: string;
}) {
  const teams = getTeamsInGroup(groupLetter);
  const filled = teams.length;
  const fillPercent = Math.round((filled / TOTAL_PER_GROUP) * 100);
  const isCanadaGroup = groupLetter === CANADA_GROUP;
  const isFavGroup = teams.some((t) => t.name === favoriteTeamName);

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm transition-all hover:shadow-md ${
        isFavGroup
          ? 'border-[var(--accent)]/40 shadow-[0_0_20px_rgba(var(--team-primary-rgb),0.1)]'
          : isCanadaGroup
            ? 'border-[#cc0000]/40 shadow-[0_0_20px_rgba(204,0,0,0.08)]'
            : 'border-[var(--border)] hover:border-[var(--border-hover)]'
      } bg-[var(--card)]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex justify-between items-center ${
          isFavGroup
            ? 'border-[var(--accent)]/20 bg-[var(--accent)]/5'
            : isCanadaGroup
              ? 'border-[#cc0000]/20 bg-[#cc0000]/5'
              : 'border-[var(--border)] bg-[var(--bg-2)]'
        }`}
      >
        <div className="flex items-center gap-2">
          {isFavGroup ? (
            <Star className="w-3.5 h-3.5 text-[var(--accent)] fill-[var(--accent)]" />
          ) : isCanadaGroup ? (
            <span className="text-base">🍁</span>
          ) : null}
          <h3
            className={`font-display text-lg ${isFavGroup ? 'text-[var(--accent)]' : isCanadaGroup ? 'text-[#ff4d6d]' : ''}`}
          >
            Group {groupLetter}
          </h3>
          {isFavGroup && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full border border-[var(--accent)]/20">
              Your Team's Group
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[var(--muted)]">
            {filled}/{TOTAL_PER_GROUP}
          </span>
        </div>
      </div>

      {/* Fill progress bar */}
      <div className="h-1 bg-[var(--bg-2)]">
        <div
          className={`h-full transition-all duration-700 rounded-full ${
            isFavGroup
              ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]'
              : isCanadaGroup
                ? 'bg-gradient-to-r from-[#cc0000] to-[#ff4d6d]'
                : 'bg-gradient-to-r from-[var(--accent-3)] to-[var(--accent)]'
          }`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Teams */}
      <div className="divide-y divide-[var(--border)]/50">
        {teams.map((team, idx) => {
          const isUserFavorite = team.name === favoriteTeamName;
          const isCanada = team.name === 'Canada';

          return (
            <Link
              href={`/teams/${team.id}`}
              key={team.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-2)] transition-colors group cursor-pointer ${
                isUserFavorite
                  ? 'bg-[var(--accent)]/5'
                  : isCanada
                    ? 'bg-[#cc0000]/5'
                    : ''
              }`}
            >
              <span className="text-xs font-bold text-[var(--muted)] w-4 italic">
                {idx + 1}
              </span>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                <img
                  src={`https://flagcdn.com/w80/${team.flagCode}.png`}
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`flex-1 font-semibold text-sm transition-colors ${
                  isUserFavorite
                    ? 'text-[var(--accent)] group-hover:text-[var(--accent)]'
                    : isCanada
                      ? 'text-[#ff4d6d] group-hover:text-[#ff6b85]'
                      : 'group-hover:text-[var(--accent)]'
                }`}
              >
                {isCanada ? '🍁 Canada' : team.name}
                {isUserFavorite && (
                  <span className="ml-2 text-[10px] opacity-70">
                    (Selected)
                  </span>
                )}
              </span>
              <div className="flex gap-3 text-[10px] font-mono text-[var(--muted)]">
                <span>P:0</span>
                <span>W:0</span>
                <span>L:0</span>
                <span className="font-bold text-[var(--text-2)]">0pts</span>
              </div>
              <span className="text-[var(--border)] group-hover:text-[var(--accent)] text-sm transition-colors">
                ›
              </span>
            </Link>
          );
        })}

        {Array.from({ length: TOTAL_PER_GROUP - filled }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 px-4 py-3 opacity-25"
          >
            <span className="text-xs font-bold text-[var(--muted)] w-4">
              {filled + i + 1}
            </span>
            <div className="w-7 h-7 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)]">
              ?
            </div>
            <span className="flex-1 text-xs italic text-[var(--muted)]">
              Qualifying TBD
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StandingsPage() {
  const { team: favTeam } = useFavoriteTeam();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const favGroupLetter = favTeam
    ? MAJOR_TEAMS.find((t) => t.name === favTeam.name)?.group
    : null;

  const filteredGroups = GROUPS.filter((g) => {
    const teams = getTeamsInGroup(g);
    return (
      teams.some(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          g.toLowerCase().includes(search.toLowerCase())
      ) || !search
    );
  }).filter((g) => {
    if (!search) return true;
    const teams = getTeamsInGroup(g);
    return teams.some(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        `group ${g}`.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Reorder groups: Favorite team's group first, then everything else
  const sortedGroups = [...new Set(filteredGroups)].sort((a, b) => {
    if (a === favGroupLetter) return -1;
    if (b === favGroupLetter) return 1;
    return 0; // maintain relative order
  });

  const spotlightGroup = favGroupLetter || CANADA_GROUP;
  const isFavSpotlight = !!favGroupLetter;

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 py-8 pb-24">
      {/* ── HEADER ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-3)]/10 border border-[var(--accent-3)]/20 text-[10px] font-bold text-[var(--accent-3)] uppercase tracking-widest mb-4">
          FIFA World Cup 2026
        </div>
        <h1 className="font-display text-4xl mb-2">
          The 48 <span className="text-[var(--accent-3)]">Groups</span>
        </h1>
        <p className="text-sm text-[var(--muted)]">
          The road to glory. 12 groups, 4 teams each. Top 2 + 8 best
          third-placed teams advance.
        </p>
      </div>

      {/* ── SPOTLIGHT ── */}
      <div
        className={`mb-8 p-5 rounded-2xl bg-gradient-to-br border relative overflow-hidden ${
          isFavSpotlight
            ? 'from-[var(--accent)]/15 via-[var(--card)] to-[var(--bg-2)] border-[var(--accent)]/30'
            : 'from-[#cc0000]/15 via-[var(--card)] to-[var(--bg-2)] border-[#cc0000]/30'
        }`}
      >
        <div
          className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl rounded-full pointer-events-none ${
            isFavSpotlight ? 'bg-[var(--accent)]/8' : 'bg-[#cc0000]/8'
          }`}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl border flex items-center justify-center text-3xl shrink-0 ${
              isFavSpotlight
                ? 'bg-[var(--accent)]/20 border-[var(--accent)]/30'
                : 'bg-[#cc0000]/20 border-[#cc0000]/30'
            }`}
          >
            {isFavSpotlight ? favTeam?.flag : '🍁'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="font-display text-xl text-[var(--text)]">
                {isFavSpotlight
                  ? `${favTeam?.name}'s Journey`
                  : "Canada's Path to Glory"}
              </h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              {isFavSpotlight
                ? `${favTeam?.name} will compete in `
                : 'Canada drew '}
              <strong
                className={
                  isFavSpotlight ? 'text-[var(--accent)]' : 'text-[#ff4d6d]'
                }
              >
                Group {spotlightGroup}
              </strong>
              .{isFavSpotlight && ` Support them as they chase the dream!`}
              {!isFavSpotlight &&
                ` Their 2nd World Cup appearance — and first on home soil.`}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {getTeamsInGroup(spotlightGroup).map((t) => (
                <Link
                  href={`/teams/${t.id}`}
                  key={t.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-2)] border border-[var(--border)] transition-colors text-xs font-semibold ${
                    t.name === favTeam?.name
                      ? 'border-[var(--accent)]/40 text-[var(--accent)]'
                      : t.name === 'Canada'
                        ? 'border-[#ff4d6d]/40 text-[#ff4d6d]'
                        : 'hover:border-[var(--accent)]/20 shadow-sm'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${t.flagCode}.png`}
                    className="w-4 h-4 rounded-full object-cover"
                    alt={t.name}
                  />
                  {t.name === 'Canada' ? '🍁 Canada' : t.name}
                  {t.name === favTeam?.name && (
                    <span className="text-[8px] opacity-70 ml-1">★</span>
                  )}
                </Link>
              ))}
              {Array.from({
                length:
                  TOTAL_PER_GROUP - getTeamsInGroup(spotlightGroup).length,
              }).map((_, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-[var(--bg-2)] border border-[var(--border)] text-xs text-[var(--muted)] italic"
                >
                  TBD
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO BANNER ── */}
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--accent-3)]/8 border border-[var(--accent-3)]/20 mb-8">
        <div className="p-2 rounded-xl bg-[var(--accent-3)]/15 text-[var(--accent-3)] shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[var(--text)] mb-0.5">
            Expanded 48-Team Format
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            FIFA WC 2026 features{' '}
            <strong className="text-[var(--text)]">12 groups of 4</strong>. Top
            2 from each + 8 best 3rd-placed teams advance to the{' '}
            <strong className="text-[var(--text)]">Round of 32</strong>.
          </p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search team or group (e.g. 'Brazil', 'Group C')…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] focus:border-[var(--accent-3)] focus:outline-none transition-all text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
        />
      </div>

      {/* ── GROUPS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedGroups.map((g, i) => (
          <GroupCard
            key={g}
            groupLetter={g}
            delay={mounted ? i * 40 : 0}
            favoriteTeamName={favTeam?.name}
          />
        ))}
      </div>

      {sortedGroups.length === 0 && (
        <div className="py-20 text-center text-[var(--muted)] border border-[var(--border)] border-dashed rounded-3xl">
          <p className="text-xl mb-2">🔍</p>
          <p className="text-sm">No results for "{search}"</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Search, Info, Star } from 'lucide-react';
import { MAJOR_TEAMS } from '@/lib/teams';
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
      className={`rounded-xl border-[0.5px] overflow-hidden shadow-sm transition-all hover:shadow-md ${
        isFavGroup
          ? 'border-[var(--c-accent)]/40 shadow-sm'
          : isCanadaGroup
            ? 'border-red-500/40 shadow-sm'
            : 'border-[var(--c-border)]'
      } bg-[var(--c-bg-surface)]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex justify-between items-center ${
          isFavGroup
            ? 'border-[var(--c-accent)]/20 bg-[var(--c-accent-subtle)]'
            : isCanadaGroup
              ? 'border-red-500/20 bg-red-500/5'
              : 'border-[var(--c-border)] bg-[var(--c-bg-subtle)]'
        }`}
      >
        <div className="flex items-center gap-2">
          {isFavGroup ? (
            <Star className="w-3.5 h-3.5 text-[var(--c-accent)] fill-[var(--c-accent)]" />
          ) : isCanadaGroup ? (
            <span className="text-base">🍁</span>
          ) : null}
          <h3
            className={`card-title ${isFavGroup ? 'text-[var(--c-accent)]' : isCanadaGroup ? 'text-red-500' : 'text-[var(--c-text-primary)]'}`}
          >
            Group {groupLetter}
          </h3>
          {isFavGroup && (
            <span className="badge-text uppercase tracking-widest text-[var(--c-accent)] bg-[var(--c-accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--c-accent)]/20">
              Selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="meta-text text-[var(--c-text-tertiary)]">
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
              className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--c-bg-subtle)] transition-colors group cursor-pointer ${
                isUserFavorite
                  ? 'bg-[var(--c-accent-subtle)]'
                  : isCanada
                    ? 'bg-red-500/5'
                    : ''
              }`}
            >
              <span className="badge-text text-[var(--c-text-tertiary)] w-4 italic">
                {idx + 1}
              </span>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--c-border)] shrink-0 shadow-sm">
                <img
                  src={`https://flagcdn.com/w80/${team.flagCode}.png`}
                  alt={team.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`flex-1 font-semibold text-[13px] transition-colors ${
                  isUserFavorite
                    ? 'text-[var(--c-accent)] group-hover:text-[var(--c-accent)]'
                    : isCanada
                      ? 'text-red-600 group-hover:text-red-500'
                      : 'text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)]'
                }`}
              >
                {isCanada ? '🍁 Canada' : team.name}
              </span>
              <div className="flex gap-3 meta-text text-[var(--c-text-tertiary)]">
                <span>P:0</span>
                <span>W:0</span>
                <span>L:0</span>
                <span className="font-bold text-[var(--c-text-primary)]">0pts</span>
              </div>
              <span className="text-[var(--c-border)] group-hover:text-[var(--c-accent)] text-sm transition-colors">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-accent-subtle)] border border-[var(--c-accent)]/20 badge-text text-[var(--c-accent)] uppercase tracking-widest mb-4">
          FIFA World Cup 2026
        </div>
        <h1 className="page-title mb-2">
          The 12 <span className="text-[var(--c-accent)]">Groups</span>
        </h1>
        <p className="body-text text-[var(--c-text-secondary)]">
          The road to glory. 12 groups, 48 teams. Top 2 + 8 best
          third-placed teams advance.
        </p>
      </div>

      {/* ── SPOTLIGHT ── */}
      <div
        className={`mb-8 p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] relative overflow-hidden shadow-sm ${
          isFavSpotlight
            ? 'border-[var(--c-accent)]/30'
            : 'border-red-500/30'
        }`}
      >
        <div className="relative z-10 flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl border flex items-center justify-center text-3xl shrink-0 ${
              isFavSpotlight
                ? 'bg-[var(--c-accent-subtle)] border-[var(--c-accent)]/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {isFavSpotlight ? favTeam?.flag : '🍁'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="section-title text-[var(--c-text-primary)]">
                {isFavSpotlight
                  ? `${favTeam?.name}'s Journey`
                  : "Canada's Path to Glory"}
              </h2>
            </div>
            <p className="body-text text-[var(--c-text-secondary)] mb-3">
              {isFavSpotlight
                ? `${favTeam?.name} will compete in `
                : 'Canada drew '}
              <strong
                className={
                  isFavSpotlight ? 'text-[var(--c-accent)]' : 'text-red-500'
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--c-bg-subtle)] border border-[var(--c-border)] transition-colors text-[11px] font-semibold ${
                    t.name === favTeam?.name
                      ? 'border-[var(--c-accent)]/40 text-[var(--c-accent)]'
                      : t.name === 'Canada'
                        ? 'border-red-500/40 text-red-500'
                        : 'text-[var(--c-text-secondary)] hover:border-[var(--c-accent)]/20 shadow-sm'
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
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO BANNER ── */}
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--c-accent-subtle)] border border-[var(--c-accent)]/20 mb-8">
        <div className="p-2 rounded-lg bg-[var(--c-accent)]/10 text-[var(--c-accent)] shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="card-title text-[var(--c-text-primary)] mb-0.5">
            Expanded 48-Team Format
          </h4>
          <p className="body-text text-[var(--c-text-secondary)] leading-relaxed">
            FIFA WC 2026 features{' '}
            <strong className="text-[var(--c-text-primary)]">12 groups of 4</strong>. Top
            2 from each + 8 best 3rd-placed teams advance to the{' '}
            <strong className="text-[var(--c-text-primary)]">Round of 32</strong>.
          </p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-text-tertiary)]" />
        <input
          type="text"
          placeholder="Search team or group (e.g. 'Brazil', 'Group C')…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] focus:border-[var(--c-accent)] focus:outline-none transition-all text-sm text-[var(--c-text-primary)] placeholder:text-[var(--c-text-tertiary)] shadow-sm"
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
          <p className="text-sm">No results for &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}

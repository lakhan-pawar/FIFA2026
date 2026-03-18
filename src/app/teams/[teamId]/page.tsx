'use client';

import { useEffect, useState } from 'react';
import { getTeamById } from '@/lib/teams';
import {
  fetchTeamDetails,
  fetchTeamSquad,
  SportsDBPlayer,
  SportsDBTeam,
} from '@/lib/sportsdb';
import { ArrowLeft, Users, User, Shield, Target, Trophy } from 'lucide-react';
import Link from 'next/link';
import { PlayerModal } from '@/components/teams/PlayerModal';
import { HOST_SCHEDULES, TournamentMatch } from '@/lib/schedule';
import { MapPin, Calendar as CalendarIcon, Info } from 'lucide-react';

export default function TeamProfilePage({
  params,
}: {
  params: { teamId: string };
}) {
  const team = getTeamById(params.teamId);
  const [details, setDetails] = useState<SportsDBTeam | null>(null);
  const [squad, setSquad] = useState<SportsDBPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<SportsDBPlayer | null>(
    null
  );

  useEffect(() => {
    if (!team) return;

    async function load() {
      setLoading(true);
      const [tDetails, tSquad] = await Promise.all([
        fetchTeamDetails(team!.id),
        fetchTeamSquad(team!.id),
      ]);
      setDetails(tDetails);
      setSquad(tSquad);
      setLoading(false);
    }

    load();
  }, [team]);

  if (!team) {
    return <div className="p-8 text-center">Team not found</div>;
  }

  // Group squad by position
  const goalkeepers = squad.filter((p) => p.strPosition === 'Goalkeeper');
  const defenders = squad.filter((p) => p.strPosition === 'Defender');
  const midfielders = squad.filter((p) => p.strPosition === 'Midfielder');
  const forwards = squad.filter((p) => p.strPosition === 'Forward');

  const renderPositionGroup = (
    title: string,
    players: SportsDBPlayer[],
    icon: React.ReactNode
  ) => {
    if (players.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="font-display text-lg mb-3 flex items-center gap-2 text-[var(--accent)]">
          {icon} {title}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {players.map((p) => (
            <button
              key={p.idPlayer}
              onClick={() => setSelectedPlayer(p)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-2)] overflow-hidden shrink-0">
                {p.strCutout ? (
                  <img
                    src={p.strCutout}
                    alt={p.strPlayer}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text)] truncate">
                  {p.strPlayer}
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  {p.strNumber && <span>#{p.strNumber}</span>}
                  <span className="truncate">{p.strKit || 'Unknown Kit'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-6">
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </Link>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden">
        {/* Background Hint */}
        <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
          <img
            src={`https://flagcdn.com/w320/${team.flagCode}.png`}
            alt={`${team.name} flag background`}
            className="w-64 h-64 object-cover rounded-full"
          />
        </div>

        <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-[var(--bg)] shadow-lg relative z-10">
          <img
            src={`https://flagcdn.com/w160/${team.flagCode}.png`}
            alt={team.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center sm:text-left flex-1 z-10">
          <h1 className="font-display text-4xl mb-2">{team.name}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="px-3 py-1 rounded-full bg-[var(--bg-2)] text-xs font-semibold tracking-wider uppercase text-[var(--muted)]">
              {team.region}
            </span>
            {details?.strManager && (
              <span className="text-sm font-medium text-[var(--text-2)]">
                Manager:{' '}
                <span className="text-[var(--text)]">{details.strManager}</span>
              </span>
            )}
            {details?.strStadium && (
              <span className="text-sm font-medium text-[var(--text-2)]">
                Stadium:{' '}
                <span className="text-[var(--text)]">{details.strStadium}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--text-2)]" />
            Current Squad
          </h2>

          {squad.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[var(--border)] text-[var(--muted)]">
              Squad roster is currently unavailable for {team.name}.
            </div>
          ) : (
            <>
              {renderPositionGroup(
                'Goalkeepers',
                goalkeepers,
                <Shield className="w-5 h-5" />
              )}
              {renderPositionGroup(
                'Defenders',
                defenders,
                <Shield className="w-5 h-5" />
              )}
              {renderPositionGroup(
                'Midfielders',
                midfielders,
                <Target className="w-5 h-5" />
              )}
              {renderPositionGroup(
                'Forwards',
                forwards,
                <Trophy className="w-5 h-5" />
              )}
            </>
          )}
        </div>
      )}

      {/* Tournament Schedule Section */}
      <div className="mt-12 mb-12">
        <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-[var(--accent)]" />
          Tournament Schedule
        </h2>

        {HOST_SCHEDULES[team.id] ? (
          <div className="flex flex-col gap-4">
            {HOST_SCHEDULES[team.id].map((match: TournamentMatch) => (
              <div
                key={match.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-[var(--card)] to-[var(--bg-2)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        {match.stage}
                      </span>
                      <span className="text-xs font-medium text-[var(--muted)]">
                        {match.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-display">
                      {team.name}{' '}
                      <span className="text-[var(--muted)] mx-2">vs</span>{' '}
                      {match.opponent}
                    </h3>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text)]">
                      <MapPin className="w-4 h-4 text-[var(--accent)]" />
                      {match.venue}
                    </div>
                    <div className="text-xs text-[var(--muted)] sm:text-right">
                      {match.city},{' '}
                      {team.region === 'CONCACAF'
                        ? 'North America'
                        : team.region}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[var(--card)] shrink-0 shadow-sm border border-[var(--border)]">
              <Info className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--text)] text-sm mb-1">
                Schedule TBD
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Specific match dates and opponents for {team.name} will be
                finalized during the
                <strong> Group Stage Draw in December 2025</strong>. Host
                nations and top-seeded teams are placed in groups A-L.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Scouting Report Modal */}
      <PlayerModal
        player={selectedPlayer}
        teamName={team.name}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
}

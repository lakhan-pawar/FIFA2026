'use client';

import { useEffect, useState, useMemo } from 'react';
import { getTeamById, MAJOR_TEAMS } from '@/lib/teams';
import {
  fetchTeamDetails,
  fetchTeamSquad,
  SportsDBPlayer,
  SportsDBTeam,
} from '@/lib/sportsdb';
import { 
  ArrowLeft, 
  Users, 
  User, 
  Shield, 
  Target, 
  Trophy, 
  Zap, 
  Globe, 
  TrendingUp, 
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Info,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { PlayerModal } from '@/components/teams/PlayerModal';
import { HOST_SCHEDULES, TournamentMatch } from '@/lib/schedule';
import { cn } from '@/utils';

export default function TeamProfilePage({
  params,
}: {
  params: { teamId: string };
}) {
  const team = getTeamById(params.teamId);
  const [details, setDetails] = useState<SportsDBTeam | null>(null);
  const [squad, setSquad] = useState<SportsDBPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<SportsDBPlayer | null>(null);

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

  const keyPlayers = useMemo(() => {
    // Pick 5 players, prioritising those with images (strCutout)
    return [...squad]
      .sort((a, b) => (b.strCutout ? 1 : 0) - (a.strCutout ? 1 : 0))
      .slice(0, 5);
  }, [squad]);

  const groupOpponents = useMemo(() => {
    if (!team?.group) return [];
    return MAJOR_TEAMS.filter(t => t.group === team.group && t.id !== team.id);
  }, [team]);

  if (!team) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-[var(--card)] rounded-2xl flex items-center justify-center mb-4 border border-[var(--border)]">
          <Info className="w-8 h-8 text-[var(--muted)]" />
        </div>
        <h1 className="text-2xl font-display mb-2">Team not found</h1>
        <Link href="/teams" className="text-[var(--accent)] hover:underline">Back to all teams</Link>
      </div>
    );
  }

  const scoutQuery = encodeURIComponent(`Give me a complete WC2026 scouting report for ${team.name} — strengths, weaknesses, key players, and predicted group stage performance.`);

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Nations
      </Link>      {/* ── HERO SECTION ── */}
      <section className="relative rounded-2xl overflow-hidden border border-[var(--c-border)] bg-[var(--c-bg-surface)] shadow-lg mb-10">
        {/* Blurred Flag Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={`https://flagcdn.com/w1280/${team.flagCode}.png`}
            alt=""
            className="w-full h-full object-cover scale-110 blur-[80px] opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg-surface)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Main Flag/Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[var(--c-accent)] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-[var(--c-bg-base)] shadow-xl relative z-10 transition-transform duration-500">
              <img
                src={`https://flagcdn.com/w640/${team.flagCode}.png`}
                alt={team.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[var(--c-accent-subtle)] border border-[var(--c-accent-subtle)] text-[var(--c-accent-subtle-text)] badge-text uppercase tracking-widest">
                {team.region}
              </span>
              {team.rank && (
                <span className="px-3 py-1 rounded-full bg-[var(--c-bg-subtle)] border border-[var(--c-border)] text-[var(--c-text-tertiary)] badge-text uppercase tracking-widest">
                  FIFA Rank: #{team.rank}
                </span>
              )}
            </div>
            <h1 className="page-title text-[var(--c-text-primary)] mb-4">{team.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
               <div className="flex items-center gap-2">
                 <Trophy className="w-5 h-5 text-amber-500" />
                 <span className="text-[13px] font-medium">
                   <span className="text-[var(--c-text-primary)] font-bold">{team.titles || 0}</span>
                   <span className="text-[var(--c-text-secondary)] ml-1">World Cup Titles</span>
                 </span>
               </div>
               {details?.strManager && (
                 <div className="flex items-center gap-2">
                   <User className="w-5 h-5 text-[var(--c-accent)]" />
                   <span className="text-[13px] font-medium">
                     <span className="text-[var(--c-text-secondary)]">Manager:</span>
                     <span className="text-[var(--c-text-primary)] font-bold ml-1">{details.strManager}</span>
                   </span>
                 </div>
               )}
            </div>
          </div>

          {/* AI Scout CTA */}
          <Link
            href={`/agents/scout?query=${scoutQuery}`}
            className="w-full md:w-auto px-7 py-3 bg-[var(--c-accent)] text-[var(--c-accent-text)] rounded-lg text-[15px] font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <BrainCircuit className="w-5 h-5" />
            Scouting Report
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* ── TEAM PROFILE ── */}
          <section>
            <h2 className="section-title mb-6 flex items-center gap-2 text-[var(--c-text-primary)]">
              <Zap className="w-6 h-6 text-[var(--c-accent)]" />
              Tactical Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Formation & Style */}
               <div className="p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
                 <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest mb-4">Preferred Systems</div>
                 <div className="flex items-center justify-between mb-6">
                   <div className="score-text text-[var(--c-accent)]">{team.formation || 'TBD'}</div>
                   <div className="flex gap-2">
                     {team.style?.map(s => (
                       <span key={s} className="px-2 py-1 rounded-md bg-[var(--c-bg-subtle)] text-[11px] font-bold text-[var(--c-text-secondary)] border border-[var(--c-border)] whitespace-nowrap">
                         {s}
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="h-1.5 w-full bg-[var(--c-bg-subtle)] rounded-full overflow-hidden">
                   <div className="h-full bg-[var(--c-accent)] w-[75%]" />
                 </div>
                 <p className="meta-text text-[var(--c-text-tertiary)] mt-2 uppercase tracking-wide">Tactical Cohesion: High</p>
               </div>

               {/* Recent Form */}
               <div className="p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
                 <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest mb-4">Recent Form (Last 5)</div>
                 <div className="flex items-center gap-2 mb-6">
                   {team.recentForm?.map((f, i) => (
                     <div 
                       key={i} 
                       className={cn(
                         "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border shadow-sm",
                         f === 'W' ? "bg-[var(--c-success-bg)] text-[var(--c-success-text)] border-[var(--c-success-text)]/20" : 
                         f === 'L' ? "bg-[var(--c-live-bg)] text-[var(--c-live-text)] border-[var(--c-live-text)]/20" : 
                         "bg-[var(--c-warning-bg)] text-[var(--c-warning-text)] border-[var(--c-warning-text)]/20"
                       )}
                     >
                       {f}
                     </div>
                   ))}
                 </div>
                 <div className="flex items-center gap-2 text-[var(--c-text-secondary)] text-xs">
                    <TrendingUp className="w-4 h-4 text-[var(--c-success-text)]" />
                    <span className="meta-text">Rising performance metrics</span>
                 </div>
               </div>
            </div>
          </section>

          {/* ── KEY PLAYERS ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2 text-[var(--c-text-primary)]">
                <Users className="w-6 h-6 text-[var(--c-accent)]" />
                Key Players
              </h2>
              <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest">Scouted Roster</span>
            </div>
            
            {loading ? (
              <div className="h-40 flex items-center justify-center bg-[var(--c-bg-surface)] rounded-xl border border-[var(--c-border)] border-dashed">
                <div className="w-6 h-6 border-2 border-[var(--c-accent)] border-t-transparent animate-spin rounded-full" />
              </div>
            ) : squad.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyPlayers.map(p => (
                  <button
                    key={p.idPlayer}
                    onClick={() => setSelectedPlayer(p)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] hover:border-[var(--c-accent)]/40 transition-all text-left group shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[var(--c-bg-subtle)] overflow-hidden shrink-0 border border-[var(--c-border)] group-hover:scale-105 transition-transform">
                      {p.strCutout ? (
                        <img src={p.strCutout} alt={p.strPlayer} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--c-text-tertiary)]"><User className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="badge-text text-[var(--c-accent)] uppercase tracking-widest mb-0.5">{p.strPosition}</div>
                      <h4 className="card-title text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)] transition-colors truncate">{p.strPlayer}</h4>
                      <div className="flex items-center gap-2 meta-text text-[var(--c-text-tertiary)] mt-1">
                        <span className="font-bold italic">#{p.strNumber || '?'}</span>
                        <span className="truncate opacity-75">{p.strKit}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center rounded-xl border border-dashed border-[var(--c-border)] bg-[var(--c-bg-surface)] text-[var(--c-text-secondary)] body-text italic">
                Roster sync in progress for {team.name}...
              </div>
            )}
          </section>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="space-y-8">
           {/* Group Info */}
           <div className="p-6 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-[0.2em] mb-1">WC2026 Phase</div>
                  <h3 className="section-title text-[var(--c-text-primary)]">Group {team.group || '?'}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[var(--c-accent-subtle)] flex items-center justify-center border border-[var(--c-accent-subtle)]">
                  <Globe className="w-6 h-6 text-[var(--c-accent)]" />
                </div>
             </div>
             
             <div className="space-y-3">
                <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest border-b border-[var(--c-border)] pb-2 mb-3">Rivals in Group</div>
                {groupOpponents.length > 0 ? (
                  groupOpponents.map(opp => (
                    <Link 
                      key={opp.id} 
                      href={`/teams/${opp.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--c-bg-subtle)] transition-colors group"
                    >
                      <img src={`https://flagcdn.com/w40/${opp.flagCode}.png`} className="w-8 h-5 object-cover rounded shadow-sm" alt={opp.name} />
                      <span className="text-sm font-medium text-[var(--c-text-secondary)] group-hover:text-[var(--c-text-primary)]">{opp.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="meta-text text-[var(--c-text-tertiary)] italic py-2">Group rivals will appear after the final draw.</div>
                )}
             </div>
           </div>

           {/* Next Match */}
           <div className="p-6 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
             <div className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-widest mb-4">Upcoming Fixture</div>
             {HOST_SCHEDULES[team.id] ? (
               <div className="space-y-4">
                 <div className="p-4 rounded-lg bg-[var(--c-bg-subtle)] border border-[var(--c-border)]">
                   <div className="badge-text text-[var(--c-accent)] mb-1 uppercase tracking-tight">{HOST_SCHEDULES[team.id][0].stage}</div>
                   <div className="card-title text-[var(--c-text-primary)] mb-1">{team.name} <span className="text-[var(--c-text-tertiary)] text-sm">vs</span> {HOST_SCHEDULES[team.id][0].opponent}</div>
                   <div className="flex items-center gap-1.5 meta-text text-[var(--c-text-secondary)]">
                     <CalendarIcon className="w-3 h-3" /> {HOST_SCHEDULES[team.id][0].date}
                   </div>
                 </div>
               </div>
             ) : (
               <div className="body-text text-[var(--c-text-tertiary)] leading-relaxed italic">
                 Official schedule to be confirmed following the December draw.
               </div>
             )}
           </div>
        </aside>
      </div>

      {/* Full Squad Section (Fallback) */}
      <section className="mt-16 pt-10 border-t border-[var(--c-border)]">
         <h2 className="section-title mb-8 opacity-60 text-[var(--c-text-primary)]">Full Provisional Roster</h2>
         {loading ? (
           <div className="py-10 text-center text-[var(--muted)]">Syncing roster...</div>
         ) : squad.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {squad.map(p => (
               <button key={p.idPlayer} onClick={() => setSelectedPlayer(p)} className="text-left group">
                 <div className="aspect-square rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] overflow-hidden mb-2 group-hover:border-[var(--accent)] transition-colors">
                    {p.strCutout ? (
                      <img src={p.strCutout} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={p.strPlayer} />
                    ) : <div className="w-full h-full flex items-center justify-center text-[var(--muted)]"><User className="w-4 h-4 opacity-50" /></div>}
                 </div>
                 <div className="text-[10px] font-bold text-[var(--text)] truncate">{p.strPlayer}</div>
                 <div className="text-[9px] text-[var(--muted)] uppercase">{p.strPosition}</div>
               </button>
             ))}
           </div>
         ) : null}
      </section>

      {/* Modal Overlay */}
      <PlayerModal
        player={selectedPlayer}
        teamName={team.name}
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
}

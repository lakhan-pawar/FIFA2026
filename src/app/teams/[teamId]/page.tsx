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
      </Link>

      {/* ── HERO SECTION ── */}
      <section className="relative rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl mb-10">
        {/* Blurred Flag Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={`https://flagcdn.com/w1280/${team.flagCode}.png`}
            alt=""
            className="w-full h-full object-cover scale-110 blur-[60px] opacity-20 dark:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Main Flag/Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[var(--accent)] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-[var(--bg)] shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <img
                src={`https://flagcdn.com/w640/${team.flagCode}.png`}
                alt={team.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest">
                {team.region}
              </span>
              {team.rank && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--muted)] text-[10px] font-bold uppercase tracking-widest">
                  FIFA Rank: #{team.rank}
                </span>
              )}
            </div>
            <h1 className="font-display text-5xl sm:text-7xl mb-4 tracking-tighter">{team.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
               <div className="flex items-center gap-2">
                 <Trophy className="w-5 h-5 text-[var(--gold)]" />
                 <span className="text-sm font-medium">
                   <span className="text-[var(--text)] font-bold">{team.titles || 0}</span>
                   <span className="text-[var(--muted)] ml-1">World Cup Titles</span>
                 </span>
               </div>
               {details?.strManager && (
                 <div className="flex items-center gap-2">
                   <User className="w-5 h-5 text-[var(--accent-2)]" />
                   <span className="text-sm font-medium">
                     <span className="text-[var(--muted)]">Manager:</span>
                     <span className="text-[var(--text)] font-bold ml-1">{details.strManager}</span>
                   </span>
                 </div>
               )}
            </div>
          </div>

          {/* AI Scout CTA */}
          <Link
            href={`/agents/scout?query=${scoutQuery}`}
            className="w-full md:w-auto px-8 py-4 bg-[var(--accent)] text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--team-primary-rgb),0.3)] active:scale-95"
          >
            <BrainCircuit className="w-5 h-5" />
            Get AI Scouting Report
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* ── TEAM PROFILE ── */}
          <section>
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-[var(--accent)]" />
              Tactical Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Formation & Style */}
               <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                 <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4">Preferred Systems</div>
                 <div className="flex items-center justify-between mb-6">
                   <div className="text-3xl font-display text-[var(--accent)]">{team.formation || 'TBD'}</div>
                   <div className="flex gap-2">
                     {team.style?.map(s => (
                       <span key={s} className="px-2 py-1 rounded-md bg-[var(--bg-2)] text-[10px] font-bold text-[var(--text-2)] border border-[var(--border)] whitespace-nowrap">
                         {s}
                       </span>
                     ))}
                   </div>
                 </div>
                 <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                   <div className="h-full bg-[var(--accent)] w-[75%]" />
                 </div>
                 <p className="text-[10px] text-[var(--muted)] mt-2 uppercase tracking-wide">Tactical Cohesion: High</p>
               </div>

               {/* Recent Form */}
               <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                 <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4">Recent Form (Last 5)</div>
                 <div className="flex items-center gap-2 mb-6">
                   {team.recentForm?.map((f, i) => (
                     <div 
                       key={i} 
                       className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shadow-sm",
                         f === 'W' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                         f === 'L' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                         "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                       )}
                     >
                       {f}
                     </div>
                   ))}
                 </div>
                 <div className="flex items-center gap-2 text-[var(--muted)] text-xs">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Rising performance metrics</span>
                 </div>
               </div>
            </div>
          </section>

          {/* ── KEY PLAYERS ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Users className="w-6 h-6 text-[var(--accent-2)]" />
                Key Players
              </h2>
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Scouted Roster</span>
            </div>
            
            {loading ? (
              <div className="h-40 flex items-center justify-center bg-[var(--card)] rounded-3xl border border-[var(--border)] border-dashed">
                <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent animate-spin rounded-full" />
              </div>
            ) : squad.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyPlayers.map(p => (
                  <button
                    key={p.idPlayer}
                    onClick={() => setSelectedPlayer(p)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all text-left group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[var(--bg-2)] overflow-hidden shrink-0 border border-[var(--border)] group-hover:scale-105 transition-transform">
                      {p.strCutout ? (
                        <img src={p.strCutout} alt={p.strPlayer} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)]"><User className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest mb-0.5">{p.strPosition}</div>
                      <h4 className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">{p.strPlayer}</h4>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-1">
                        <span className="font-bold italic">#{p.strNumber || '?'}</span>
                        <span className="truncate opacity-75">{p.strKit}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)] text-[var(--muted)] text-sm italic">
                Roster sync in progress for {team.name}...
              </div>
            )}
          </section>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="space-y-8">
           {/* Group Info */}
           <div className="p-6 rounded-[28px] bg-gradient-to-br from-[var(--card)] to-[var(--bg-2)] border border-[var(--border)] shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] mb-1">WC2026 Phase</div>
                  <h3 className="text-2xl font-display">Group {team.group || '?'}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                  <Globe className="w-6 h-6 text-[var(--accent)]" />
                </div>
             </div>
             
             <div className="space-y-3">
                <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 mb-3">Rivals in Group</div>
                {groupOpponents.length > 0 ? (
                  groupOpponents.map(opp => (
                    <Link 
                      key={opp.id} 
                      href={`/teams/${opp.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--accent)]/5 transition-colors group"
                    >
                      <img src={`https://flagcdn.com/w40/${opp.flagCode}.png`} className="w-8 h-5 object-cover rounded shadow-sm" alt={opp.name} />
                      <span className="text-sm font-medium text-[var(--text-2)] group-hover:text-[var(--text)]">{opp.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-[var(--muted)] italic py-2">Group rivals will appear after the final draw.</div>
                )}
             </div>
           </div>

           {/* Next Match */}
           <div className="p-6 rounded-[28px] bg-[var(--card)] border border-[var(--border)]">
             <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest mb-4">Upcoming Fixture</div>
             {HOST_SCHEDULES[team.id] ? (
               <div className="space-y-4">
                 <div className="p-4 rounded-xl bg-[var(--bg-2)] border border-[var(--border)]">
                   <div className="text-[10px] font-bold text-[var(--accent-2)] mb-1 uppercase tracking-tight">{HOST_SCHEDULES[team.id][0].stage}</div>
                   <div className="font-display text-lg mb-1">{team.name} <span className="text-[var(--muted)] text-sm">vs</span> {HOST_SCHEDULES[team.id][0].opponent}</div>
                   <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                     <CalendarIcon className="w-3 h-3" /> {HOST_SCHEDULES[team.id][0].date}
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-xs text-[var(--muted)] leading-relaxed italic">
                 Official schedule to be confirmed following the December draw.
               </div>
             )}
           </div>
        </aside>
      </div>

      {/* Full Squad Section (Fallback) */}
      <section className="mt-16 pt-10 border-t border-[var(--border)]">
         <h2 className="font-display text-2xl mb-8 opacity-60">Full Provisional Roster</h2>
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

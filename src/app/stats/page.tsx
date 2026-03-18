'use client';

import {
  Zap,
  Trophy,
  Goal,
  Award,
  History,
  Globe2,
  BarChart,
  Star,
} from 'lucide-react';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

const TOURNAMENT_FACTS = [
  {
    title: 'Expanded Format',
    value: '48',
    label: 'Teams (up from 32)',
    icon: <Globe2 className="w-5 h-5 text-blue-400" />,
  },
  {
    title: 'Total Matches',
    value: '104',
    label: 'Games to be played',
    icon: <BarChart className="w-5 h-5 text-purple-400" />,
  },
  {
    title: 'Host Cities',
    value: '16',
    label: 'Across 3 nations',
    icon: <MapPin className="w-5 h-5 text-green-400" />,
  },
  {
    title: 'Host Nations',
    value: '3',
    label: 'Canada, Mexico, USA',
    icon: <Flags className="w-5 h-5 text-yellow-400" />,
  },
];

// Helper icon components just for this page
function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function Flags(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

const HISTORIC_RECORDS = [
  {
    record: 'Most Goals (Single Tournament)',
    holder: 'Just Fontaine (France)',
    value: '13 Goals',
    year: '1958',
    icon: <Goal className="w-5 h-5 text-[var(--accent)]" />,
  },
  {
    record: 'Most Titles (Team)',
    holder: 'Brazil',
    value: '5 Titles',
    year: '1958, 1962, 1970, 1994, 2002',
    icon: <Trophy className="w-5 h-5 text-[var(--gold)]" />,
  },
  {
    record: 'Most Goals (All-Time)',
    holder: 'Miroslav Klose (Germany)',
    value: '16 Goals',
    year: '2002-2014',
    icon: <Award className="w-5 h-5 text-blue-400" />,
  },
];

export default function StandingsPage() {
  const { team } = useFavoriteTeam();

  const getTeamRecords = (name: string) => {
    const n = name.toLowerCase();

    // Core stats for each supported team (Updated to Official FIFA rankings Jan 2026)
    const data: Record<
      string,
      {
        rank: string;
        finish: string;
        extra: { label: string; value: string; icon: () => JSX.Element };
      }
    > = {
      argentina: {
        rank: '#2',
        finish: 'Champions (2022)',
        extra: {
          label: 'Titles',
          value: '3',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      france: {
        rank: '#3',
        finish: 'Champions (2018)',
        extra: {
          label: 'Titles',
          value: '2',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      brazil: {
        rank: '#5',
        finish: 'Champions (2002)',
        extra: {
          label: 'Titles',
          value: '5',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      england: {
        rank: '#4',
        finish: 'Champions (1966)',
        extra: {
          label: 'Titles',
          value: '1',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      germany: {
        rank: '#10',
        finish: 'Champions (2014)',
        extra: {
          label: 'Titles',
          value: '4',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      spain: {
        rank: '#1',
        finish: 'Champions (2010)',
        extra: {
          label: 'Titles',
          value: '1',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      portugal: {
        rank: '#6',
        finish: '3rd Place (1966)',
        extra: {
          label: 'Best Scorer',
          value: 'Eusébio (9)',
          icon: <Goal className="w-4 h-4" />,
        },
      },
      italy: {
        rank: '#13',
        finish: 'Champions (2006)',
        extra: {
          label: 'Titles',
          value: '4',
          icon: <Trophy className="w-4 h-4" />,
        },
      },
      mexico: {
        rank: '#16',
        finish: 'Quarter-Finals',
        extra: {
          label: 'Appearances',
          value: '17',
          icon: <BarChart className="w-4 h-4" />,
        },
      },
      usa: {
        rank: '#15',
        finish: '3rd Place (1930)',
        extra: {
          label: 'Appearances',
          value: '11',
          icon: <BarChart className="w-4 h-4" />,
        },
      },
      canada: {
        rank: '#29',
        finish: 'Group Stage',
        extra: {
          label: 'Appearances',
          value: '2',
          icon: <BarChart className="w-4 h-4" />,
        },
      },
      japan: {
        rank: '#19',
        finish: 'Round of 16',
        extra: {
          label: 'Best Scorer',
          value: 'Honda (4)',
          icon: <Goal className="w-4 h-4" />,
        },
      },
      morocco: {
        rank: '#8',
        finish: '4th Place (2022)',
        extra: {
          label: 'Appearances',
          value: '6',
          icon: <BarChart className="w-4 h-4" />,
        },
      },
    };

    const teamData = data[n] || {
      rank: '#TBD',
      finish: 'Qualified',
      extra: {
        label: 'Status',
        value: 'Ready',
        icon: <Star className="w-4 h-4" />,
      },
    };

    return [
      {
        label: 'WC Rank',
        value: teamData.rank,
        icon: <Star className="w-4 h-4" />,
      },
      {
        label: 'Best Finish',
        value: teamData.finish,
        icon: <Trophy className="w-4 h-4" />,
      },
      teamData.extra,
      {
        label: 'Status',
        value: 'Qualified',
        icon: <Award className="w-4 h-4" />,
      },
    ];
  };

  const teamRecords = team ? getTeamRecords(team.name) : [];

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-4xl">
          Tournament <span className="text-[var(--live)]">Stats</span>
        </h1>
      </div>

      <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
        Live tournament statistics will be available here during WC2026. In the
        meantime, explore historical records and facts about the upcoming
        tournament.
      </p>

      {/* Personalized Records Section */}
      {team && (
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
              <Star className="w-4 h-4 fill-[var(--accent)]" />
            </div>
            <h2 className="font-display text-xl text-[var(--text)]">
              National Records:{' '}
              <span className="text-[var(--accent)]">{team.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teamRecords.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-gradient-to-br from-[var(--accent)]/5 to-transparent border border-[var(--accent)]/20 flex flex-col items-center text-center group hover:bg-[var(--accent)]/10 transition-colors"
              >
                <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform">
                  {rec.icon}
                </div>
                <div className="font-display text-lg font-bold text-[var(--text)] leading-none mb-1">
                  {rec.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)]">
                  {rec.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2026 Facts Grid */}
      <h2 className="font-display text-xl mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-[var(--live)]" />
        World Cup 2026 Facts
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {TOURNAMENT_FACTS.map((fact, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col items-center text-center hover:border-[var(--border-hover)] transition-colors"
          >
            <div className="p-2.5 rounded-full bg-[var(--bg-2)] mb-3 shadow-sm border border-[var(--border)]">
              {fact.icon}
            </div>
            <span className="font-display text-2xl font-bold text-[var(--text)] leading-none mb-1">
              {fact.value}
            </span>
            <span className="text-xs font-semibold text-[var(--text-2)] mb-0.5">
              {fact.title}
            </span>
            <span className="text-[10px] text-[var(--muted)]">
              {fact.label}
            </span>
          </div>
        ))}
      </div>

      {/* Historical Records List */}
      <h2 className="font-display text-xl mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-[var(--accent-3)]" />
        All-Time Records
      </h2>
      <div className="flex flex-col gap-3">
        {HISTORIC_RECORDS.map((record, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-start sm:items-center gap-4"
          >
            <div className="p-3 rounded-full bg-[var(--bg-2)] shrink-0 border border-[var(--border)]">
              {record.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs text-[var(--muted)] uppercase tracking-wide font-semibold mb-1">
                {record.record}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="font-bold text-[var(--text)] text-base">
                  {record.holder}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--accent)]">
                    {record.value}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    ({record.year})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TournamentMatch {
  id: string;
  date: string;
  venue: string;
  city: string;
  opponent: string; // Will often be "TBD" for now
  stage: string;
}

export const HOST_SCHEDULES: Record<string, TournamentMatch[]> = {
  // Canada (ID: 133660)
  '133660': [
    {
      id: 'can-m1',
      date: 'June 12, 2026',
      venue: 'Toronto Stadium (BMO Field)',
      city: 'Toronto',
      opponent: 'TBD (B2)',
      stage: 'Group Stage - Match 1',
    },
    {
      id: 'can-m2',
      date: 'June 18, 2026',
      venue: 'BC Place',
      city: 'Vancouver',
      opponent: 'TBD (B3)',
      stage: 'Group Stage - Match 2',
    },
    {
      id: 'can-m3',
      date: 'June 24, 2026',
      venue: 'BC Place',
      city: 'Vancouver',
      opponent: 'TBD (B4)',
      stage: 'Group Stage - Match 3',
    },
  ],
  // USA (ID: 133602)
  '133602': [
    {
      id: 'usa-m1',
      date: 'June 12, 2026',
      venue: 'SoFi Stadium',
      city: 'Los Angeles',
      opponent: 'TBD (D2)',
      stage: 'Group Stage - Match 1',
    },
    {
      id: 'usa-m2',
      date: 'June 19, 2026',
      venue: 'Lumen Field',
      city: 'Seattle',
      opponent: 'TBD (D3)',
      stage: 'Group Stage - Match 2',
    },
    {
      id: 'usa-m3',
      date: 'June 25, 2026',
      venue: 'SoFi Stadium',
      city: 'Los Angeles',
      opponent: 'TBD (D4)',
      stage: 'Group Stage - Match 3',
    },
  ],
  // Mexico (ID: 133621)
  '133621': [
    {
      id: 'mex-m1',
      date: 'June 11, 2026',
      venue: 'Estadio Azteca',
      city: 'Mexico City',
      opponent: 'TBD (A2)',
      stage: 'Group Stage - Match 1',
    },
    {
      id: 'mex-m2',
      date: 'June 18, 2026',
      venue: 'Estadio Chivas',
      city: 'Guadalajara',
      opponent: 'TBD (A3)',
      stage: 'Group Stage - Match 2',
    },
    {
      id: 'mex-m3',
      date: 'June 24, 2026',
      venue: 'Estadio Azteca',
      city: 'Mexico City',
      opponent: 'TBD (A4)',
      stage: 'Group Stage - Match 3',
    },
  ],
};

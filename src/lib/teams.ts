export interface Team {
  id: string; // TheSportsDB ID
  name: string;
  flagCode: string; // alpha-2 code for flag icons
  group?: string; // e.g. "A", "B", etc for WC2026 once drawn
  region: string;
  rank?: number;
  titles?: number;
  formation?: string;
  style?: string[];
  recentForm?: string[];
}

export const MAJOR_TEAMS: Team[] = [
  // Hosts
  {
    id: '133602',
    name: 'USA',
    flagCode: 'us',
    region: 'CONCACAF',
    group: 'D',
    rank: 13,
    titles: 0,
    formation: '4-3-3',
    style: ['High Press', 'Athletic'],
    recentForm: ['W', 'L', 'W', 'W', 'D'],
  },
  {
    id: '133660',
    name: 'Canada',
    flagCode: 'ca',
    region: 'CONCACAF',
    group: 'B',
    rank: 40,
    titles: 0,
    formation: '4-2-3-1',
    style: ['Counter-Attack', 'Pacey'],
    recentForm: ['W', 'D', 'L', 'W', 'W'],
  },
  {
    id: '133621',
    name: 'Mexico',
    flagCode: 'mx',
    region: 'CONCACAF',
    group: 'A',
    rank: 15,
    titles: 0,
    formation: '4-3-3',
    style: ['Possession', 'Technical'],
    recentForm: ['L', 'W', 'D', 'L', 'W'],
  },

  // CONMEBOL
  {
    id: '133604',
    name: 'Argentina',
    flagCode: 'ar',
    region: 'CONMEBOL',
    group: 'C',
    rank: 1,
    titles: 3,
    formation: '4-3-3',
    style: ['Control', 'Creative'],
    recentForm: ['W', 'W', 'W', 'W', 'D'],
  },
  {
    id: '133612',
    name: 'Brazil',
    flagCode: 'br',
    region: 'CONMEBOL',
    group: 'C',
    rank: 5,
    titles: 5,
    formation: '4-2-3-1',
    style: ['Flair', 'Attacking'],
    recentForm: ['W', 'D', 'L', 'W', 'D'],
  },
  {
    id: '133620',
    name: 'Uruguay',
    flagCode: 'uy',
    region: 'CONMEBOL',
    group: 'H',
    rank: 11,
    titles: 2,
    formation: '4-3-3',
    style: ['Tenacious', 'Direct'],
    recentForm: ['W', 'W', 'D', 'W', 'L'],
  },
  {
    id: '133580',
    name: 'Colombia',
    flagCode: 'co',
    region: 'CONMEBOL',
    group: 'I',
    rank: 12,
    titles: 0,
    formation: '4-2-3-1',
    style: ['Speed', 'Technical'],
    recentForm: ['W', 'W', 'W', 'D', 'W'],
  },

  // UEFA
  {
    id: '133608',
    name: 'France',
    flagCode: 'fr',
    region: 'UEFA',
    group: 'F',
    rank: 2,
    titles: 2,
    formation: '4-2-3-1',
    style: ['Power', 'Speed'],
    recentForm: ['W', 'W', 'D', 'W', 'W'],
  },
  {
    id: '133610',
    name: 'England',
    flagCode: 'gb-eng',
    region: 'UEFA',
    group: 'L',
    rank: 4,
    titles: 1,
    formation: '4-2-3-1',
    style: ['Organised', 'Elite'],
    recentForm: ['W', 'W', 'W', 'D', 'L'],
  },
  {
    id: '133601',
    name: 'Spain',
    flagCode: 'es',
    region: 'UEFA',
    group: 'H',
    rank: 8,
    titles: 1,
    formation: '4-3-3',
    style: ['Tiki-Taka', 'Fluid'],
    recentForm: ['W', 'W', 'W', 'W', 'W'],
  },
  {
    id: '133609',
    name: 'Germany',
    flagCode: 'de',
    region: 'UEFA',
    group: 'E',
    rank: 16,
    titles: 4,
    formation: '4-2-3-1',
    style: ['Efficient', 'Dominant'],
    recentForm: ['W', 'D', 'W', 'W', 'L'],
  },
  {
    id: '133600',
    name: 'Italy',
    flagCode: 'it',
    region: 'UEFA',
    group: 'J',
    rank: 9,
    titles: 4,
    formation: '4-3-3',
    style: ['Tactical', 'Solid'],
    recentForm: ['W', 'D', 'W', 'L', 'W'],
  },
  { id: '133611', name: 'Portugal', flagCode: 'pt', region: 'UEFA', group: 'K' },
  {
    id: '133616',
    name: 'Netherlands',
    flagCode: 'nl',
    region: 'UEFA',
    group: 'F',
  },
  { id: '133615', name: 'Belgium', flagCode: 'be', region: 'UEFA', group: 'G' },
  { id: '133624', name: 'Croatia', flagCode: 'hr', region: 'UEFA', group: 'L' },

  // CAF
  { id: '133652', name: 'Morocco', flagCode: 'ma', region: 'CAF', group: 'C' },
  { id: '133626', name: 'Senegal', flagCode: 'sn', region: 'CAF', group: 'I' },
  { id: '133589', name: 'Egypt', flagCode: 'eg', region: 'CAF', group: 'G' },

  // AFC
  { id: '133618', name: 'Japan', flagCode: 'jp', region: 'AFC', group: 'F' },
  {
    id: '133619',
    name: 'South Korea',
    flagCode: 'kr',
    region: 'AFC',
    group: 'A',
  },
  { id: '133614', name: 'Iran', flagCode: 'ir', region: 'AFC', group: 'G' },
  {
    id: '133649',
    name: 'Saudi Arabia',
    flagCode: 'sa',
    region: 'AFC',
    group: 'H',
  },
];

export function getTeamById(id: string): Team | undefined {
  return MAJOR_TEAMS.find((t) => t.id === id);
}

export function getTeamByName(name: string): Team | undefined {
  return MAJOR_TEAMS.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

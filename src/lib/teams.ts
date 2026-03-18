export interface Team {
  id: string; // TheSportsDB ID
  name: string;
  flagCode: string; // alpha-2 code for flag icons
  group?: string; // e.g. "A", "B", etc for WC2026 once drawn
  region: string;
}

export const MAJOR_TEAMS: Team[] = [
  // Hosts
  { id: '133602', name: 'USA', flagCode: 'us', region: 'CONCACAF', group: 'D' },
  { id: '133660', name: 'Canada', flagCode: 'ca', region: 'CONCACAF', group: 'B' },
  { id: '133621', name: 'Mexico', flagCode: 'mx', region: 'CONCACAF', group: 'A' },

  // CONMEBOL
  { id: '133604', name: 'Argentina', flagCode: 'ar', region: 'CONMEBOL', group: 'C' },
  { id: '133612', name: 'Brazil', flagCode: 'br', region: 'CONMEBOL', group: 'C' },
  { id: '133620', name: 'Uruguay', flagCode: 'uy', region: 'CONMEBOL', group: 'H' },
  { id: '133580', name: 'Colombia', flagCode: 'co', region: 'CONMEBOL', group: 'I' },

  // UEFA
  { id: '133608', name: 'France', flagCode: 'fr', region: 'UEFA', group: 'F' },
  { id: '133610', name: 'England', flagCode: 'gb-eng', region: 'UEFA', group: 'L' },
  { id: '133601', name: 'Spain', flagCode: 'es', region: 'UEFA', group: 'H' },
  { id: '133609', name: 'Germany', flagCode: 'de', region: 'UEFA', group: 'E' },
  { id: '133600', name: 'Italy', flagCode: 'it', region: 'UEFA', group: 'J' },
  { id: '133611', name: 'Portugal', flagCode: 'pt', region: 'UEFA', group: 'K' },
  { id: '133616', name: 'Netherlands', flagCode: 'nl', region: 'UEFA', group: 'F' },
  { id: '133615', name: 'Belgium', flagCode: 'be', region: 'UEFA', group: 'G' },
  { id: '133624', name: 'Croatia', flagCode: 'hr', region: 'UEFA', group: 'L' },

  // CAF
  { id: '133652', name: 'Morocco', flagCode: 'ma', region: 'CAF', group: 'C' },
  { id: '133626', name: 'Senegal', flagCode: 'sn', region: 'CAF', group: 'I' },
  { id: '133589', name: 'Egypt', flagCode: 'eg', region: 'CAF', group: 'G' },

  // AFC
  { id: '133618', name: 'Japan', flagCode: 'jp', region: 'AFC', group: 'F' },
  { id: '133619', name: 'South Korea', flagCode: 'kr', region: 'AFC', group: 'A' },
  { id: '133614', name: 'Iran', flagCode: 'ir', region: 'AFC', group: 'G' },
  { id: '133649', name: 'Saudi Arabia', flagCode: 'sa', region: 'AFC', group: 'H' },
];

export function getTeamById(id: string): Team | undefined {
  return MAJOR_TEAMS.find((t) => t.id === id);
}

export function getTeamByName(name: string): Team | undefined {
  return MAJOR_TEAMS.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

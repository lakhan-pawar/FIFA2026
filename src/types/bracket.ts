// World Cup 2026 Bracket Types

export type MatchStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'postponed';

export type KnockoutStage =
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_finals'
  | 'semi_finals'
  | 'third_place'
  | 'final';

export interface Team {
  id: string;
  name: string;
  code: string; // 3-letter country code (e.g., 'CAN', 'USA', 'MEX')
  flag?: string; // URL to flag image
  group?: string; // Group letter (A-H)
  groupPosition?: number; // Position in group (1-4)
}

export interface BracketMatch {
  id: string;
  matchNumber: number;
  stage: KnockoutStage;
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  penaltyHomeScore: number | null;
  penaltyAwayScore: number | null;
  winner: Team | null;
  status: MatchStatus;
  scheduledDate: string | null;
  venue: string | null;
  nextMatchId: string | null; // ID of the match the winner advances to
  position: {
    round: number; // 0 = R32, 1 = R16, 2 = QF, 3 = SF, 4 = Final
    index: number; // Position within the round
  };
}

export interface BracketStructure {
  tournamentId: string;
  tournamentName: string;
  year: number;
  matches: BracketMatch[];
  lastUpdated: string;
  tournamentStartDate?: string; // ISO date string for when tournament starts
  predictionsLockDate?: string; // ISO date string for when predictions lock
}

export interface UserPrediction {
  matchId: string;
  predictedWinner: Team;
  predictedHomeScore?: number;
  predictedAwayScore?: number;
}

export interface BracketPredictionData {
  id: string;
  userId: string;
  bracketId: string;
  predictions: UserPrediction[];
  accuracyScore: number | null;
  status: 'pending' | 'correct' | 'incorrect';
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Helper type for rendering bracket layout
export interface BracketRound {
  stage: KnockoutStage;
  matches: BracketMatch[];
  displayName: string;
}

// Constants for World Cup 2026
export const WORLD_CUP_2026 = {
  TOURNAMENT_ID: 'wc2026',
  TOURNAMENT_NAME: 'FIFA World Cup 2026',
  YEAR: 2026,
  HOST_COUNTRIES: ['USA', 'CAN', 'MEX'],
  TOTAL_TEAMS: 48,
  KNOCKOUT_TEAMS: 32,
} as const;

export const KNOCKOUT_STAGES: Record<
  KnockoutStage,
  { displayName: string; round: number }
> = {
  round_of_32: { displayName: 'Round of 32', round: 0 },
  round_of_16: { displayName: 'Round of 16', round: 1 },
  quarter_finals: { displayName: 'Quarter Finals', round: 2 },
  semi_finals: { displayName: 'Semi Finals', round: 3 },
  third_place: { displayName: 'Third Place', round: 4 },
  final: { displayName: 'Final', round: 4 },
} as const;

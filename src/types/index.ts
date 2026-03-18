// Core application types for KickoffTo

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  favoriteTeams: string[];
  favoriteLeagues: string[];
  preferredAIAgents: string[];
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  matchUpdates: boolean;
  aiAgentResponses: boolean;
  socialActivity: boolean;
  venueUpdates: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  specialty: string;
  avatar: string;
  isActive: boolean;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  utcDate: Date;
  status: MatchStatus;
  score?: Score;
  minute?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Competition {
  id: string;
  name: string;
  code: string;
  emblem: string;
}

export interface Score {
  winner?: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED';

export interface Venue {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: number;
  currentOccupancy: number;
  rushLevel: 'low' | 'medium' | 'high';
  amenities: string[];
  fanDemographics: {
    averageAge: number;
    primaryTeams: string[];
  };
}

export interface SocialPost {
  id: string;
  content: string;
  author: string;
  platform: 'reddit' | 'internal';
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
}

export interface TournamentBracket {
  id: string;
  name: string;
  year: number;
  stage: string;
  matches: BracketMatch[];
  predictions?: UserPrediction[];
}

export interface BracketMatch {
  id: string;
  round: string;
  position: number;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  scheduledDate?: Date;
  completed: boolean;
}

export interface UserPrediction {
  userId: string;
  bracketId: string;
  predictions: {
    matchId: string;
    predictedWinner: string;
  }[];
  accuracy: number;
  submittedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Environment variables type
export interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  FOOTBALL_DATA_API_KEY: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  OPENAI_API_KEY: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
}

// Re-export Reddit types
export type {
  RedditPost,
  RedditComment,
  RedditApiResponse,
  RedditAccessToken,
  RedditContentFilter,
  ModeratedContent,
  RedditFetchOptions,
  ContentModerationResult,
} from './reddit';

// Re-export Bracket types
export type {
  MatchStatus as BracketMatchStatus,
  KnockoutStage,
  Team as BracketTeam,
  BracketMatch as BracketMatchType,
  BracketStructure,
  UserPrediction as BracketUserPrediction,
  BracketPredictionData,
  BracketRound,
} from './bracket';

export { WORLD_CUP_2026, KNOCKOUT_STAGES } from './bracket';

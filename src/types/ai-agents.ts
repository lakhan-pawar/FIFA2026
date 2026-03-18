// AI Agent types and interfaces for KickoffTo platform

import { Match, Team, Competition, User } from './index';

// Core AI Agent interfaces
export interface AIAgentContext {
  currentSeason: string;
  recentMatches: Match[];
  userPreferences: {
    favoriteTeams: string[];
    favoriteLeagues: string[];
    preferredStyle: 'casual' | 'detailed' | 'analytical';
  };
  conversationHistory: ConversationMessage[];
  currentDate: Date;
  liveMatches: Match[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentId: string;
  metadata?: Record<string, any>;
}

export interface AIAgentResponse {
  content: string;
  confidence: number;
  sources?: string[];
  suggestedFollowUps?: string[];
  metadata?: Record<string, any>;
}

export interface AIAgentCapabilities {
  canAnalyzeMatches: boolean;
  canPredict: boolean;
  canProvideHistory: boolean;
  canGiveAdvice: boolean;
  requiresLiveData: boolean;
  supportedLanguages: string[];
}

// Base AI Agent interface
export interface IAIAgent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly specialty: string;
  readonly avatar: string;
  readonly capabilities: AIAgentCapabilities;
  readonly personality: AgentPersonality;

  // Core methods
  processQuery(
    query: string,
    context: AIAgentContext
  ): Promise<AIAgentResponse>;
  updateContext(context: Partial<AIAgentContext>): void;
  getConversationHistory(limit?: number): ConversationMessage[];
  clearConversationHistory(): void;
  validateQuery(query: string): boolean;
}
export interface AgentPersonality {
  tone: 'professional' | 'casual' | 'enthusiastic' | 'analytical' | 'witty';
  expertise: 'beginner' | 'intermediate' | 'expert' | 'legendary';
  responseStyle: 'concise' | 'detailed' | 'conversational' | 'technical';
  catchphrases?: string[];
  preferredEmojis?: string[];
}

// Specialized Agent Interfaces
export interface ITacticalAgent extends IAIAgent {
  analyzeFormation(match: Match): Promise<FormationAnalysis>;
  suggestTactics(team: Team, opponent: Team): Promise<TacticalSuggestion>;
  explainTacticalConcept(concept: string): Promise<AIAgentResponse>;
}

export interface IPredictionAgent extends IAIAgent {
  predictMatch(homeTeam: Team, awayTeam: Team): Promise<MatchPrediction>;
  analyzeBettingOdds(match: Match): Promise<BettingAnalysis>;
  getFormAnalysis(team: Team): Promise<TeamForm>;
}

export interface ICommentaryAgent extends IAIAgent {
  generateMatchCommentary(match: Match): Promise<MatchCommentary>;
  analyzeMatchMoments(match: Match): Promise<KeyMoment[]>;
  createMatchReport(match: Match): Promise<MatchReport>;
}

export interface IScoutingAgent extends IAIAgent {
  analyzePlayer(playerId: string): Promise<PlayerAnalysis>;
  comparePlayer(
    player1Id: string,
    player2Id: string
  ): Promise<PlayerComparison>;
  suggestTransfers(team: Team, position: string): Promise<TransferSuggestion[]>;
}

export interface IFantasyAgent extends IAIAgent {
  getWeeklyRecommendations(): Promise<FantasyRecommendation>;
  analyzePlayerValue(playerId: string): Promise<PlayerValueAnalysis>;
  suggestCaptain(gameweek: number): Promise<CaptainSuggestion>;
}

export interface IHistoryAgent extends IAIAgent {
  getHistoricalFacts(query: string): Promise<HistoricalFact[]>;
  compareEras(era1: string, era2: string): Promise<EraComparison>;
  getRecords(category: string): Promise<FootballRecord[]>;
}

export interface ICanadianSoccerAgent extends IAIAgent {
  getCanadianLeagueInfo(): Promise<LeagueInfo>;
  analyzeCanadianPlayers(): Promise<PlayerAnalysis[]>;
  getCanadianSoccerNews(): Promise<NewsItem[]>;
}

export interface IRefereeAgent extends IAIAgent {
  explainRule(rule: string): Promise<RuleExplanation>;
  analyzeVARDecision(incident: VARIncident): Promise<VARAnalysis>;
  getOfficiatingStats(matchId: string): Promise<OfficiatingStats>;
}
// Supporting types for specialized functionality
export interface FormationAnalysis {
  formation: string;
  strengths: string[];
  weaknesses: string[];
  keyPlayers: string[];
  tacticalNotes: string;
}

export interface TacticalSuggestion {
  recommendedFormation: string;
  keyInstructions: string[];
  playerRoles: Record<string, string>;
  expectedOutcome: string;
}

export interface MatchPrediction {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  predictedScore: string;
  confidence: number;
  keyFactors: string[];
}

export interface BettingAnalysis {
  recommendedBets: BettingRecommendation[];
  valueOpportunities: string[];
  riskAssessment: 'low' | 'medium' | 'high';
}

export interface BettingRecommendation {
  type: string;
  odds: number;
  confidence: number;
  reasoning: string;
}

export interface TeamForm {
  recentResults: string[];
  goalsScored: number;
  goalsConceded: number;
  formRating: number;
  keyStats: Record<string, number>;
}

export interface MatchCommentary {
  preMatch: string;
  liveUpdates: string[];
  postMatch: string;
  highlights: string[];
}

export interface KeyMoment {
  minute: number;
  type: 'goal' | 'card' | 'substitution' | 'var' | 'other';
  description: string;
  impact: number;
}

export interface MatchReport {
  headline: string;
  summary: string;
  keyTakeaways: string[];
  playerRatings: Record<string, number>;
  manOfTheMatch: string;
}
export interface PlayerAnalysis {
  playerId: string;
  name: string;
  position: string;
  strengths: string[];
  weaknesses: string[];
  marketValue: number;
  potentialRating: number;
  keyStats: Record<string, number>;
}

export interface PlayerComparison {
  player1: PlayerAnalysis;
  player2: PlayerAnalysis;
  comparison: {
    betterAt: Record<string, string>;
    overallWinner: string;
    reasoning: string;
  };
}

export interface TransferSuggestion {
  playerId: string;
  name: string;
  currentTeam: string;
  estimatedCost: number;
  fitRating: number;
  reasoning: string;
}

export interface FantasyRecommendation {
  gameweek: number;
  transfers: {
    in: string[];
    out: string[];
  };
  captain: string;
  viceCaptain: string;
  formation: string;
  reasoning: string;
}

export interface PlayerValueAnalysis {
  playerId: string;
  currentPrice: number;
  projectedPoints: number;
  valueRating: number;
  recommendation: 'buy' | 'hold' | 'sell';
  reasoning: string;
}

export interface CaptainSuggestion {
  playerId: string;
  name: string;
  projectedPoints: number;
  confidence: number;
  reasoning: string;
  alternatives: string[];
}

export interface HistoricalFact {
  fact: string;
  date: string;
  context: string;
  significance: string;
}

export interface EraComparison {
  era1: string;
  era2: string;
  differences: string[];
  similarities: string[];
  conclusion: string;
}
export interface FootballRecord {
  category: string;
  record: string;
  holder: string;
  date: string;
  details: string;
}

export interface LeagueInfo {
  name: string;
  teams: string[];
  currentSeason: string;
  keyStats: Record<string, any>;
  upcomingMatches: Match[];
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  relevance: number;
}

export interface RuleExplanation {
  rule: string;
  explanation: string;
  examples: string[];
  commonMisconceptions: string[];
}

export interface VARIncident {
  matchId: string;
  minute: number;
  type: string;
  description: string;
  decision: string;
}

export interface VARAnalysis {
  incident: VARIncident;
  correctDecision: boolean;
  reasoning: string;
  alternativeOutcomes: string[];
}

export interface OfficiatingStats {
  matchId: string;
  referee: string;
  foulsGiven: number;
  cardsShown: {
    yellow: number;
    red: number;
  };
  varInterventions: number;
  controversialDecisions: string[];
}

// Agent Registry type for managing all agents
export interface AIAgentRegistry {
  vito: ITacticalAgent;
  oracleFC: IPredictionAgent;
  correspondent: ICommentaryAgent;
  scout: IScoutingAgent;
  fantasyGuru: IFantasyAgent;
  historio: IHistoryAgent;
  canadaFC: ICanadianSoccerAgent;
  referee: IRefereeAgent;
}

// Agent configuration for initialization
export interface AgentConfig {
  apiKey?: string;
  maxContextLength: number;
  responseTimeout: number;
  enableLogging: boolean;
  customPrompts?: Record<string, string>;
}

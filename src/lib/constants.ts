// Constants for KickoffTo application

export const APP_NAME = 'KickoffTo';
export const APP_DESCRIPTION =
  'Football Intelligence Platform for Canadian Fans';

// AI Agents configuration
export const AI_AGENTS = [
  {
    id: 'vito',
    name: 'Vito',
    specialty: 'Tactical Analysis',
    description:
      'Expert in football tactics, formations, and strategic analysis',
    avatar: '⚽',
  },
  {
    id: 'oracle-fc',
    name: 'Oracle FC',
    specialty: 'Match Predictions',
    description: 'Advanced match outcome predictions and betting insights',
    avatar: '🔮',
  },
  {
    id: 'correspondent',
    name: 'The Correspondent',
    specialty: 'Match Commentary',
    description: 'Live match commentary and post-game analysis',
    avatar: '📰',
  },
  {
    id: 'scout',
    name: 'Scout',
    specialty: 'Player Analysis',
    description: 'In-depth player performance and transfer analysis',
    avatar: '🔍',
  },
  {
    id: 'fantasy-guru',
    name: 'FantasyGuru',
    specialty: 'Fantasy Premier League',
    description: 'FPL advice, transfers, and captain recommendations',
    avatar: '👑',
  },
  {
    id: 'historio',
    name: 'Historio',
    specialty: 'Football History',
    description: 'Football history, records, and legendary moments',
    avatar: '📚',
  },
  {
    id: 'canada-fc',
    name: 'CanadaFC',
    specialty: 'Canadian Soccer',
    description: 'Canadian national team and MLS insights',
    avatar: '🍁',
  },
  {
    id: 'referee',
    name: 'Referee',
    specialty: 'Rules & VAR',
    description: 'Football rules, VAR decisions, and officiating insights',
    avatar: '👨‍⚖️',
  },
] as const;

// Supported competitions
export const COMPETITIONS = {
  PREMIER_LEAGUE: 'PL',
  CHAMPIONS_LEAGUE: 'CL',
  MLS: 'MLS',
  WORLD_CUP: 'WC',
  EUROS: 'EC',
  COPA_AMERICA: 'CA',
} as const;

// Competition details
export const COMPETITION_DETAILS = {
  [COMPETITIONS.PREMIER_LEAGUE]: {
    name: 'Premier League',
    country: 'England',
    emblem: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
  [COMPETITIONS.CHAMPIONS_LEAGUE]: {
    name: 'UEFA Champions League',
    country: 'Europe',
    emblem: '🏆',
  },
  [COMPETITIONS.MLS]: {
    name: 'Major League Soccer',
    country: 'USA/Canada',
    emblem: '🇺🇸',
  },
  [COMPETITIONS.WORLD_CUP]: {
    name: 'FIFA World Cup',
    country: 'International',
    emblem: '🌍',
  },
} as const;

// API endpoints and limits
export const API_LIMITS = {
  FOOTBALL_DATA_REQUESTS_PER_MINUTE: 10,
  REDDIT_REQUESTS_PER_MINUTE: 60,
  OPENAI_REQUESTS_PER_MINUTE: 20,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  LIVE_MATCHES: 60, // 1 minute
  STANDINGS: 3600, // 1 hour
  FIXTURES: 1800, // 30 minutes
  PLAYER_DATA: 86400, // 24 hours
  VENUE_DATA: 1800, // 30 minutes
} as const;

// Toronto venues for watch parties
export const TORONTO_VENUES = [
  {
    id: 'real-sports',
    name: 'Real Sports Bar & Grill',
    address: '15 York St, Toronto, ON',
    coordinates: { lat: 43.6426, lng: -79.3782 },
    capacity: 200,
    amenities: ['Large Screens', 'Food', 'Licensed'],
  },
  {
    id: 'the-pint',
    name: 'The Pint Public House',
    address: '277 King St W, Toronto, ON',
    coordinates: { lat: 43.6465, lng: -79.389 },
    capacity: 150,
    amenities: ['Multiple Screens', 'Food', 'Licensed', 'Patio'],
  },
  {
    id: 'football-factory',
    name: 'Football Factory',
    address: '2 Gloucester St, Toronto, ON',
    coordinates: { lat: 43.6677, lng: -79.3834 },
    capacity: 100,
    amenities: ['Football Focused', 'Food', 'Licensed'],
  },
] as const;

// Theme configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'AI Agents', href: '/agents', icon: '🤖' },
  { name: 'Live Matches', href: '/matches', icon: '⚽' },
  { name: 'Venues', href: '/venues', icon: '🗺️' },
  { name: 'Social', href: '/social', icon: '💬' },
  { name: 'Brackets', href: '/brackets', icon: '🏆' },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_RATE_LIMIT: 'Too many requests. Please try again later.',
  UNAUTHORIZED: 'Please log in to access this feature.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PREFERENCES_SAVED: 'Preferences saved successfully!',
  VENUE_CHECKED_IN: 'Checked in successfully!',
  PREDICTION_SUBMITTED: 'Prediction submitted successfully!',
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

// World Cup 2026 specific
export const WORLD_CUP_2026 = {
  START_DATE: '2026-06-11',
  END_DATE: '2026-07-19',
  HOST_COUNTRIES: ['USA', 'Canada', 'Mexico'],
  CANADIAN_CITIES: ['Toronto', 'Vancouver'],
} as const;

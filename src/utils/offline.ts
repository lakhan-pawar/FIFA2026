/**
 * Offline utility functions for PWA functionality
 */

// Cache keys for different types of data
export const CACHE_KEYS = {
  MATCHES: 'kickoff-matches',
  STANDINGS: 'kickoff-standings',
  USER_PREFERENCES: 'kickoff-user-prefs',
  AI_CONVERSATIONS: 'kickoffto-conversations',
  VENUES: 'kickoff-venues',
} as const;

// Cache expiration times (in milliseconds)
export const CACHE_EXPIRATION = {
  MATCHES: 5 * 60 * 1000, // 5 minutes
  STANDINGS: 60 * 60 * 1000, // 1 hour
  USER_PREFERENCES: 24 * 60 * 60 * 1000, // 24 hours
  AI_CONVERSATIONS: 7 * 24 * 60 * 60 * 1000, // 7 days
  VENUES: 24 * 60 * 60 * 1000, // 24 hours
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiration: number;
}

/**
 * Store data in localStorage with expiration
 */
export function setCache<T>(key: string, data: T, expiration: number): void {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiration,
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

/**
 * Retrieve data from localStorage if not expired
 */
export function getCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheItem: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now - cacheItem.timestamp > cacheItem.expiration) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
    return null;
  }
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Clear all app caches
 */
export function clearAllCaches(): void {
  Object.values(CACHE_KEYS).forEach((key) => {
    clearCache(key);
  });
}

/**
 * Check if data is available offline
 */
export function isDataAvailableOffline(key: string): boolean {
  return getCache(key) !== null;
}

/**
 * Get offline status message for users
 */
export function getOfflineMessage(): string {
  const availableData = [];

  if (isDataAvailableOffline(CACHE_KEYS.MATCHES)) {
    availableData.push('recent matches');
  }
  if (isDataAvailableOffline(CACHE_KEYS.STANDINGS)) {
    availableData.push('league standings');
  }
  if (isDataAvailableOffline(CACHE_KEYS.AI_CONVERSATIONS)) {
    availableData.push('AI conversations');
  }
  if (isDataAvailableOffline(CACHE_KEYS.VENUES)) {
    availableData.push('venue information');
  }

  if (availableData.length === 0) {
    return 'Limited functionality available offline. Connect to internet for full experience.';
  }

  return `Available offline: ${availableData.join(', ')}. Some features require internet connection.`;
}

/**
 * Preload critical data for offline use
 */
export async function preloadOfflineData(): Promise<void> {
  // This would typically fetch and cache critical data
  // For now, we'll just log that preloading would happen here
  console.log('Preloading critical data for offline use...');

  // In a real implementation, you would:
  // 1. Fetch current matches and cache them
  // 2. Fetch league standings and cache them
  // 3. Cache user preferences
  // 4. Cache recent AI conversations
  // 5. Cache venue data
}

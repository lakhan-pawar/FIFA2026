/**
 * Intelligent Caching Layer
 * Advanced caching with TTL, LRU eviction, and intelligent invalidation
 * Requirement 8.3: Implement intelligent caching strategies when API rate limits are approached
 */

import { metricsLogger } from './metricsLogger';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  tags?: string[];
}

export interface CacheConfig {
  maxSize: number; // Maximum number of entries
  defaultTTL: number; // Default TTL in milliseconds
  enableLRU: boolean; // Enable Least Recently Used eviction
  enableMetrics: boolean; // Enable metrics logging
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  evictions: number;
  oldestEntry?: { key: string; age: number };
  mostAccessed?: { key: string; count: number };
}

class IntelligentCache {
  private cache = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private readonly serviceName: string,
    private readonly config: CacheConfig = {
      maxSize: 1000,
      defaultTTL: 300000, // 5 minutes
      enableLRU: true,
      enableMetrics: true,
    }
  ) {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, data: T, ttl?: number, tags?: string[]): void {
    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      accessCount: 0,
      lastAccessed: Date.now(),
      tags,
    };

    this.cache.set(key, entry);
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      if (this.config.enableMetrics) {
        metricsLogger.logCacheMiss(this.serviceName, key);
      }
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.misses++;
      if (this.config.enableMetrics) {
        metricsLogger.logCacheMiss(this.serviceName, key);
      }
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    this.hits++;
    if (this.config.enableMetrics) {
      metricsLogger.logCacheHit(this.serviceName, key);
    }

    return entry.data as T;
  }

  /**
   * Get or set a value (fetch if not in cache)
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    tags?: string[]
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl, tags);
    return data;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalidate cache entries by tag
   */
  invalidateByTag(tag: string): number {
    let invalidated = 0;
    const entries = Array.from(this.cache.entries());

    for (const [key, entry] of entries) {
      if (entry.tags?.includes(tag)) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    const keys = Array.from(this.cache.keys());

    for (const key of keys) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.misses / totalRequests : 0;

    let oldestEntry: { key: string; age: number } | undefined;
    let mostAccessed: { key: string; count: number } | undefined;

    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    for (const [key, entry] of entries) {
      const age = now - entry.timestamp;

      if (!oldestEntry || age > oldestEntry.age) {
        oldestEntry = { key, age };
      }

      if (!mostAccessed || entry.accessCount > mostAccessed.count) {
        mostAccessed = { key, count: entry.accessCount };
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      missRate,
      totalHits: this.hits,
      totalMisses: this.misses,
      evictions: this.evictions,
      oldestEntry,
      mostAccessed,
    };
  }

  /**
   * Get time until a key expires
   */
  getTTL(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const remaining = entry.ttl - age;
    return Math.max(0, remaining);
  }

  /**
   * Refresh TTL for a key
   */
  refreshTTL(key: string, newTTL?: number): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    entry.timestamp = Date.now();
    if (newTTL !== undefined) {
      entry.ttl = newTTL;
    }

    return true;
  }

  /**
   * Check if an entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    const age = Date.now() - entry.timestamp;
    return age > entry.ttl;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    if (!this.config.enableLRU || this.cache.size === 0) {
      return;
    }

    let lruKey: string | null = null;
    let lruTime = Infinity;

    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.evictions++;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const entries = Array.from(this.cache.entries());

    for (const [key, entry] of entries) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }

  /**
   * Export cache contents (for debugging)
   */
  export(): Array<{ key: string; entry: CacheEntry<any> }> {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      entry,
    }));
  }
}

/**
 * Cache Manager
 * Manages multiple cache instances for different services
 */
class CacheManager {
  private caches = new Map<string, IntelligentCache>();

  /**
   * Get or create a cache for a service
   */
  getCache(serviceName: string, config?: CacheConfig): IntelligentCache {
    if (!this.caches.has(serviceName)) {
      this.caches.set(serviceName, new IntelligentCache(serviceName, config));
    }
    return this.caches.get(serviceName)!;
  }

  /**
   * Get stats for all caches
   */
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats();
    });
    return stats;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.caches.forEach((cache) => cache.clear());
  }

  /**
   * Destroy all caches
   */
  destroyAll(): void {
    this.caches.forEach((cache) => cache.destroy());
    this.caches.clear();
  }

  /**
   * Get overall cache health
   */
  getHealth(): {
    totalSize: number;
    totalHitRate: number;
    cacheCount: number;
  } {
    let totalSize = 0;
    let totalHits = 0;
    let totalRequests = 0;

    this.caches.forEach((cache) => {
      const stats = cache.getStats();
      totalSize += stats.size;
      totalHits += stats.totalHits;
      totalRequests += stats.totalHits + stats.totalMisses;
    });

    return {
      totalSize,
      totalHitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      cacheCount: this.caches.size,
    };
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Export for direct use
export { IntelligentCache };

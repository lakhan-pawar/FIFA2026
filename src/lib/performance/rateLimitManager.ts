/**
 * Global Rate Limit Manager for Vercel Free Tier
 * Manages rate limiting across all external API calls to prevent quota exhaustion
 * Requirements: 8.1, 8.2, 8.4
 */

import { metricsLogger } from './metricsLogger';
import { cacheManager } from './intelligentCache';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstLimit?: number; // Allow short bursts
  priority?: 'high' | 'medium' | 'low';
}

export interface RateLimitStatus {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
  waitTime: number;
}

export interface ServiceLimits {
  'football-data': RateLimitConfig;
  'reddit-api': RateLimitConfig;
  'openai-api': RateLimitConfig;
  global: RateLimitConfig;
}

class RateLimitManager {
  private serviceLimits: ServiceLimits = {
    'football-data': {
      maxRequests: 10,
      windowMs: 60000, // 1 minute
      burstLimit: 3,
      priority: 'high',
    },
    'reddit-api': {
      maxRequests: 60,
      windowMs: 60000, // 1 minute
      burstLimit: 10,
      priority: 'medium',
    },
    'openai-api': {
      maxRequests: 20,
      windowMs: 60000, // 1 minute
      burstLimit: 5,
      priority: 'high',
    },
    global: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
      burstLimit: 20,
      priority: 'high',
    },
  };

  private requestHistory = new Map<string, number[]>();
  private requestQueue = new Map<
    string,
    Array<{
      resolve: (value: any) => void;
      reject: (error: any) => void;
      requestFn: () => Promise<any>;
      priority: 'high' | 'medium' | 'low';
      timestamp: number;
    }>
  >();
  private processingQueues = new Set<string>();

  /**
   * Execute a request with rate limiting
   */
  async executeWithRateLimit<T>(
    service: keyof ServiceLimits,
    requestFn: () => Promise<T>,
    options: {
      priority?: 'high' | 'medium' | 'low';
      cacheKey?: string;
      cacheTTL?: number;
      fallback?: () => Promise<T>;
    } = {}
  ): Promise<T> {
    const { priority = 'medium', cacheKey, cacheTTL, fallback } = options;

    // Check cache first if cache key provided
    if (cacheKey) {
      const cache = cacheManager.getCache(service);
      const cached = cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Check if we can make the request immediately
    const status = this.getRateLimitStatus(service);
    if (!status.isLimited) {
      try {
        const result = await this.executeRequest(service, requestFn);

        // Cache result if cache key provided
        if (cacheKey && cacheTTL) {
          const cache = cacheManager.getCache(service);
          cache.set(cacheKey, result, cacheTTL);
        }

        return result;
      } catch (error) {
        if (fallback) {
          return fallback();
        }
        throw error;
      }
    }

    // Queue the request
    return this.queueRequest(
      service,
      requestFn,
      priority,
      cacheKey,
      cacheTTL,
      fallback
    );
  }

  /**
   * Execute request and track rate limiting
   */
  private async executeRequest<T>(
    service: keyof ServiceLimits,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Record request
      this.recordRequest(service);
      this.recordRequest('global');

      const result = await requestFn();

      const duration = Date.now() - startTime;
      metricsLogger.logApiCall(service, 'rate-limited-request', duration, true);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      metricsLogger.logApiCall(
        service,
        'rate-limited-request',
        duration,
        false,
        errorMessage
      );
      throw error;
    }
  }

  /**
   * Queue a request for later execution
   */
  private async queueRequest<T>(
    service: keyof ServiceLimits,
    requestFn: () => Promise<T>,
    priority: 'high' | 'medium' | 'low',
    cacheKey?: string,
    cacheTTL?: number,
    fallback?: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.requestQueue.has(service)) {
        this.requestQueue.set(service, []);
      }

      const queue = this.requestQueue.get(service)!;
      queue.push({
        resolve: (result) => {
          // Cache result if cache key provided
          if (cacheKey && cacheTTL) {
            const cache = cacheManager.getCache(service);
            cache.set(cacheKey, result, cacheTTL);
          }
          resolve(result);
        },
        reject: (error) => {
          if (fallback) {
            fallback().then(resolve).catch(reject);
          } else {
            reject(error);
          }
        },
        requestFn,
        priority,
        timestamp: Date.now(),
      });

      // Sort queue by priority and timestamp
      queue.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp - b.timestamp;
      });

      // Process queue
      this.processQueue(service);
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue(service: keyof ServiceLimits): Promise<void> {
    if (this.processingQueues.has(service)) {
      return;
    }

    this.processingQueues.add(service);
    const queue = this.requestQueue.get(service) || [];

    while (queue.length > 0) {
      const status = this.getRateLimitStatus(service);

      if (status.isLimited) {
        // Wait until we can make the next request
        await this.sleep(Math.min(status.waitTime, 5000)); // Max 5 second wait
        continue;
      }

      const queueItem = queue.shift();
      if (!queueItem) break;

      try {
        const result = await this.executeRequest(service, queueItem.requestFn);
        queueItem.resolve(result);
      } catch (error) {
        queueItem.reject(error);
      }
    }

    this.processingQueues.delete(service);
  }

  /**
   * Record a request for rate limiting
   */
  private recordRequest(service: string): void {
    const now = Date.now();

    if (!this.requestHistory.has(service)) {
      this.requestHistory.set(service, []);
    }

    const history = this.requestHistory.get(service)!;
    history.push(now);

    // Clean up old requests
    this.cleanupHistory(service);
  }

  /**
   * Clean up old request history
   */
  private cleanupHistory(service: string): void {
    const config =
      this.serviceLimits[service as keyof ServiceLimits] ||
      this.serviceLimits.global;
    const cutoff = Date.now() - config.windowMs;

    const history = this.requestHistory.get(service);
    if (history) {
      const filtered = history.filter((time) => time >= cutoff);
      this.requestHistory.set(service, filtered);
    }
  }

  /**
   * Get rate limit status for a service
   */
  getRateLimitStatus(service: keyof ServiceLimits): RateLimitStatus {
    this.cleanupHistory(service);
    this.cleanupHistory('global');

    const config = this.serviceLimits[service];
    const globalConfig = this.serviceLimits.global;

    const serviceHistory = this.requestHistory.get(service) || [];
    const globalHistory = this.requestHistory.get('global') || [];

    const serviceRemaining = Math.max(
      0,
      config.maxRequests - serviceHistory.length
    );
    const globalRemaining = Math.max(
      0,
      globalConfig.maxRequests - globalHistory.length
    );

    const remaining = Math.min(serviceRemaining, globalRemaining);
    const isLimited = remaining === 0;

    let resetTime = 0;
    let waitTime = 0;

    if (isLimited) {
      const serviceOldest =
        serviceHistory.length > 0 ? Math.min(...serviceHistory) : 0;
      const globalOldest =
        globalHistory.length > 0 ? Math.min(...globalHistory) : 0;

      const serviceResetTime = serviceOldest + config.windowMs;
      const globalResetTime = globalOldest + globalConfig.windowMs;

      resetTime = Math.min(serviceResetTime, globalResetTime);
      waitTime = Math.max(0, resetTime - Date.now());
    }

    return {
      remaining,
      resetTime,
      isLimited,
      waitTime,
    };
  }

  /**
   * Get queue status for monitoring
   */
  getQueueStatus(): Record<
    string,
    {
      queueLength: number;
      isProcessing: boolean;
      rateLimitStatus: RateLimitStatus;
    }
  > {
    const status: Record<string, any> = {};

    for (const service of Object.keys(this.serviceLimits)) {
      const queue = this.requestQueue.get(service) || [];
      status[service] = {
        queueLength: queue.length,
        isProcessing: this.processingQueues.has(service),
        rateLimitStatus: this.getRateLimitStatus(
          service as keyof ServiceLimits
        ),
      };
    }

    return status;
  }

  /**
   * Update rate limits (for dynamic adjustment)
   */
  updateRateLimit(
    service: keyof ServiceLimits,
    config: Partial<RateLimitConfig>
  ): void {
    this.serviceLimits[service] = {
      ...this.serviceLimits[service],
      ...config,
    };
  }

  /**
   * Clear rate limit history (for testing)
   */
  clearHistory(service?: keyof ServiceLimits): void {
    if (service) {
      this.requestHistory.delete(service);
    } else {
      this.requestHistory.clear();
    }
  }

  /**
   * Get comprehensive status for monitoring
   */
  getStatus(): {
    services: Record<string, RateLimitStatus>;
    queues: Record<string, { length: number; processing: boolean }>;
    totalRequests: number;
    healthScore: number;
  } {
    const services: Record<string, RateLimitStatus> = {};
    const queues: Record<string, { length: number; processing: boolean }> = {};
    let totalRequests = 0;

    for (const service of Object.keys(this.serviceLimits)) {
      services[service] = this.getRateLimitStatus(
        service as keyof ServiceLimits
      );
      const queue = this.requestQueue.get(service) || [];
      queues[service] = {
        length: queue.length,
        processing: this.processingQueues.has(service),
      };

      const history = this.requestHistory.get(service) || [];
      totalRequests += history.length;
    }

    // Calculate health score (0-100)
    const avgRemaining =
      Object.values(services).reduce(
        (sum, status) => sum + status.remaining,
        0
      ) / Object.keys(services).length;
    const avgQueueLength =
      Object.values(queues).reduce((sum, queue) => sum + queue.length, 0) /
      Object.keys(queues).length;
    const healthScore = Math.max(
      0,
      Math.min(100, avgRemaining * 10 - avgQueueLength * 5)
    );

    return {
      services,
      queues,
      totalRequests,
      healthScore,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const rateLimitManager = new RateLimitManager();

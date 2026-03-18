/**
 * Rate Limiting Middleware for Vercel Free Tier
 * Applies rate limiting and resource monitoring to all API routes
 * Requirements: 8.1, 8.2, 8.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitManager } from '@/lib/performance/rateLimitManager';
import { resourceMonitor } from '@/lib/performance/resourceMonitor';
import { vercelOptimizer } from '@/lib/performance/vercelOptimizer';

export interface RateLimitMiddlewareConfig {
  enableGlobalRateLimit: boolean;
  enableResourceMonitoring: boolean;
  enableOptimization: boolean;
  skipPaths: string[];
  rateLimitHeaders: boolean;
}

const defaultConfig: RateLimitMiddlewareConfig = {
  enableGlobalRateLimit: true,
  enableResourceMonitoring: true,
  enableOptimization: true,
  skipPaths: ['/api/health', '/api/status'],
  rateLimitHeaders: true,
};

/**
 * Rate limiting middleware for API routes
 */
export function createRateLimitMiddleware(
  config: Partial<RateLimitMiddlewareConfig> = {}
) {
  const finalConfig = { ...defaultConfig, ...config };

  return async function rateLimitMiddleware(
    request: NextRequest,
    response?: NextResponse
  ): Promise<NextResponse | void> {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;

    // Skip middleware for certain paths
    if (finalConfig.skipPaths.some((path) => pathname.startsWith(path))) {
      return;
    }

    // Start request tracking
    if (finalConfig.enableResourceMonitoring) {
      resourceMonitor.startRequest();
    }

    try {
      // Check global rate limits
      if (finalConfig.enableGlobalRateLimit) {
        const globalStatus = rateLimitManager.getRateLimitStatus('global');

        if (globalStatus.isLimited) {
          const response = NextResponse.json(
            {
              error: 'Rate limit exceeded',
              message: 'Too many requests. Please try again later.',
              retryAfter: Math.ceil(globalStatus.waitTime / 1000),
            },
            { status: 429 }
          );

          if (finalConfig.rateLimitHeaders) {
            response.headers.set('X-RateLimit-Limit', '100');
            response.headers.set(
              'X-RateLimit-Remaining',
              globalStatus.remaining.toString()
            );
            response.headers.set(
              'X-RateLimit-Reset',
              new Date(globalStatus.resetTime).toISOString()
            );
            response.headers.set(
              'Retry-After',
              Math.ceil(globalStatus.waitTime / 1000).toString()
            );
          }

          return response;
        }
      }

      // Run optimization if enabled
      if (finalConfig.enableOptimization) {
        // Run optimization every 10th request to avoid overhead
        if (Math.random() < 0.1) {
          vercelOptimizer.optimize().catch((error) => {
            console.warn('Optimization failed:', error);
          });
        }
      }

      // Continue with the request
      return;
    } catch (error) {
      console.error('Rate limit middleware error:', error);

      // Don't block requests on middleware errors
      return;
    } finally {
      // Record resource usage
      if (finalConfig.enableResourceMonitoring) {
        const duration = Date.now() - startTime;
        resourceMonitor.endRequest();
        resourceMonitor.recordUsage({
          cpu: duration,
          memory: process.memoryUsage?.()?.heapUsed || 0,
          bandwidth: 0, // Will be updated by response middleware
        });
      }
    }
  };
}

/**
 * Response middleware to track bandwidth usage
 */
export function createResponseMiddleware() {
  return function responseMiddleware(
    request: NextRequest,
    response: NextResponse
  ): NextResponse {
    // Calculate response size
    const responseSize = response.headers.get('content-length')
      ? parseInt(response.headers.get('content-length')!, 10)
      : 0;

    // Record bandwidth usage
    resourceMonitor.recordUsage({
      bandwidth: responseSize,
    });

    // Add performance headers
    response.headers.set('X-Powered-By', 'kickoffto');
    response.headers.set('X-Response-Time', Date.now().toString());

    // Add rate limit headers
    const globalStatus = rateLimitManager.getRateLimitStatus('global');
    response.headers.set(
      'X-RateLimit-Remaining',
      globalStatus.remaining.toString()
    );
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(globalStatus.resetTime).toISOString()
    );

    return response;
  };
}

/**
 * Utility function to check if request should be rate limited
 */
export async function shouldRateLimit(
  request: NextRequest,
  service: 'football-data' | 'reddit-api' | 'openai-api' | 'global'
): Promise<{
  allowed: boolean;
  status: any;
  waitTime: number;
}> {
  const status = rateLimitManager.getRateLimitStatus(service);

  return {
    allowed: !status.isLimited,
    status,
    waitTime: status.waitTime,
  };
}

/**
 * Utility function to execute with rate limiting
 */
export async function executeWithRateLimit<T>(
  service: 'football-data' | 'reddit-api' | 'openai-api',
  requestFn: () => Promise<T>,
  options: {
    cacheKey?: string;
    cacheTTL?: number;
    fallback?: () => Promise<T>;
    priority?: 'high' | 'medium' | 'low';
  } = {}
): Promise<T> {
  return rateLimitManager.executeWithRateLimit(service, requestFn, options);
}

// Default middleware instance
export const rateLimitMiddleware = createRateLimitMiddleware();
export const responseMiddleware = createResponseMiddleware();

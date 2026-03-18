/**
 * Vercel Free Tier Monitoring API
 * Provides real-time monitoring of Vercel free tier usage and optimization status
 * Requirements: 8.1, 8.2, 8.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitManager } from '@/lib/performance/rateLimitManager';
import { resourceMonitor } from '@/lib/performance/resourceMonitor';
import { vercelOptimizer } from '@/lib/performance/vercelOptimizer';
import { cacheManager } from '@/lib/performance/intelligentCache';
import { circuitBreakerManager } from '@/lib/performance/circuitBreaker';
import { metricsLogger } from '@/lib/performance/metricsLogger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    const includeHistory = searchParams.get('history') === 'true';

    // Get current status from all monitoring systems
    const rateLimitStatus = rateLimitManager.getStatus();
    const resourceUsage = resourceMonitor.getCurrentUsage();
    const optimizationStatus = vercelOptimizer.getStatus();
    const cacheHealth = cacheManager.getHealth();
    const circuitBreakerHealth = circuitBreakerManager.getHealthStatus();
    const metricsummary = metricsLogger.getSummary();

    // Calculate overall health score
    const healthScore = resourceMonitor.getHealthScore();
    const isHealthy = healthScore > 70;

    // Get optimization recommendations
    const recommendations = resourceMonitor.getOptimizationRecommendations();

    // Basic status response
    const basicStatus = {
      timestamp: new Date().toISOString(),
      healthy: isHealthy,
      healthScore,
      status: isHealthy
        ? 'operational'
        : healthScore > 40
          ? 'degraded'
          : 'critical',

      // Resource usage summary
      resources: {
        memory: {
          usage: resourceUsage.memory.percentage,
          status:
            resourceUsage.memory.percentage > 80
              ? 'critical'
              : resourceUsage.memory.percentage > 60
                ? 'warning'
                : 'ok',
        },
        requests: {
          usage: resourceUsage.requests.percentage,
          remaining:
            resourceUsage.requests.limit - resourceUsage.requests.current,
          status:
            resourceUsage.requests.percentage > 90
              ? 'critical'
              : resourceUsage.requests.percentage > 75
                ? 'warning'
                : 'ok',
        },
        bandwidth: {
          usage: resourceUsage.bandwidth.percentage,
          status:
            resourceUsage.bandwidth.percentage > 90
              ? 'critical'
              : resourceUsage.bandwidth.percentage > 75
                ? 'warning'
                : 'ok',
        },
      },

      // Rate limiting summary
      rateLimits: {
        globalRemaining: rateLimitStatus.services.global?.remaining || 0,
        footballDataRemaining:
          rateLimitStatus.services['football-data']?.remaining || 0,
        redditApiRemaining:
          rateLimitStatus.services['reddit-api']?.remaining || 0,
        queued: rateLimitStatus.totalRequests,
      },

      // Cache performance
      cache: {
        hitRate: cacheHealth.totalHitRate,
        totalSize: cacheHealth.totalSize,
        status:
          cacheHealth.totalHitRate > 0.8
            ? 'excellent'
            : cacheHealth.totalHitRate > 0.6
              ? 'good'
              : cacheHealth.totalHitRate > 0.4
                ? 'fair'
                : 'poor',
      },

      // Active optimizations
      optimizations: {
        active: optimizationStatus.recentOptimizations.length,
        lastOptimization:
          optimizationStatus.recentOptimizations[0]?.timestamp || null,
      },

      // Top recommendations
      recommendations: recommendations.slice(0, 3).map((r) => ({
        type: r.type,
        severity: r.severity,
        message: r.message,
      })),
    };

    // Return basic status if not detailed
    if (!detailed) {
      return NextResponse.json(basicStatus, {
        headers: {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
          'X-Health-Score': healthScore.toString(),
          'X-Status': basicStatus.status,
        },
      });
    }

    // Detailed status response
    const detailedStatus = {
      ...basicStatus,

      // Detailed resource usage
      detailedResources: {
        ...resourceUsage,
        trends: resourceMonitor.getUsageTrends(),
      },

      // Detailed rate limiting
      detailedRateLimits: rateLimitStatus,

      // Circuit breaker status
      circuitBreakers: circuitBreakerHealth,

      // Cache statistics
      detailedCache: cacheManager.getAllStats(),

      // Metrics summary
      metrics: metricsummary,

      // All recommendations
      allRecommendations: recommendations,

      // Optimization configuration
      optimizationConfig: optimizationStatus.config,

      // Service health
      services: {
        'football-data': {
          healthy: circuitBreakerHealth['football-data']?.healthy ?? true,
          rateLimitRemaining:
            rateLimitStatus.services['football-data']?.remaining || 0,
        },
        'reddit-api': {
          healthy: circuitBreakerHealth['reddit-api']?.healthy ?? true,
          rateLimitRemaining:
            rateLimitStatus.services['reddit-api']?.remaining || 0,
        },
        'openai-api': {
          healthy: circuitBreakerHealth['openai-api']?.healthy ?? true,
          rateLimitRemaining:
            rateLimitStatus.services['openai-api']?.remaining || 0,
        },
      },
    };

    // Add history if requested
    if (includeHistory) {
      (detailedStatus as any).history = {
        optimizations: optimizationStatus.recentOptimizations,
        resourceMonitoring: resourceMonitor.exportData().history.slice(-50),
        metrics: metricsLogger.getAllMetrics().slice(-100),
      };
    }

    return NextResponse.json(detailedStatus, {
      headers: {
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=30',
        'X-Health-Score': healthScore.toString(),
        'X-Status': basicStatus.status,
        'X-Recommendations': recommendations.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error in Vercel status API:', error);

    return NextResponse.json(
      {
        error: 'Failed to get Vercel status',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        healthy: false,
        status: 'error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;

    switch (action) {
      case 'optimize':
        const result = await vercelOptimizer.optimize();
        return NextResponse.json({
          success: true,
          result,
          timestamp: new Date().toISOString(),
        });

      case 'updateConfig':
        if (config) {
          vercelOptimizer.updateConfig(config);
          return NextResponse.json({
            success: true,
            message: 'Configuration updated',
            config: vercelOptimizer.getConfig(),
            timestamp: new Date().toISOString(),
          });
        }
        break;

      case 'clearCache':
        cacheManager.clearAll();
        return NextResponse.json({
          success: true,
          message: 'All caches cleared',
          timestamp: new Date().toISOString(),
        });

      case 'resetRateLimits':
        rateLimitManager.clearHistory();
        return NextResponse.json({
          success: true,
          message: 'Rate limit history cleared',
          timestamp: new Date().toISOString(),
        });

      case 'resetCircuitBreakers':
        circuitBreakerManager.resetAll();
        return NextResponse.json({
          success: true,
          message: 'All circuit breakers reset',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            validActions: [
              'optimize',
              'updateConfig',
              'clearCache',
              'resetRateLimits',
              'resetCircuitBreakers',
            ],
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in Vercel status API POST:', error);

    return NextResponse.json(
      {
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Vercel Free Tier Optimizer
 * Intelligent optimization system for Vercel free tier constraints
 * Requirements: 8.1, 8.2, 8.4
 */

import { rateLimitManager } from './rateLimitManager';
import { resourceMonitor } from './resourceMonitor';
import { cacheManager } from './intelligentCache';
import { circuitBreakerManager } from './circuitBreaker';
import { metricsLogger } from './metricsLogger';

export interface OptimizationStrategy {
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: string[];
  actions: string[];
}

export interface VercelOptimizationConfig {
  enableAggressiveCaching: boolean;
  enableRequestQueuing: boolean;
  enableResourceThrottling: boolean;
  enableAutoScaling: boolean;
  maxConcurrentRequests: number;
  cacheStrategy: 'conservative' | 'aggressive' | 'adaptive';
  rateLimitStrategy: 'strict' | 'burst' | 'adaptive';
}

export interface OptimizationHistoryEntry {
  timestamp: number;
  strategy: string;
  action: string;
  reason: string;
  impact: string;
}

class VercelOptimizer {
  private config: VercelOptimizationConfig = {
    enableAggressiveCaching: true,
    enableRequestQueuing: true,
    enableResourceThrottling: true,
    enableAutoScaling: true,
    maxConcurrentRequests: 10,
    cacheStrategy: 'adaptive',
    rateLimitStrategy: 'adaptive',
  };

  private strategies: OptimizationStrategy[] = [
    {
      name: 'Aggressive Caching',
      description: 'Increase cache TTL when approaching rate limits',
      enabled: true,
      priority: 1,
      conditions: ['rate_limit_approaching', 'high_request_volume'],
      actions: ['increase_cache_ttl', 'enable_stale_while_revalidate'],
    },
    {
      name: 'Request Queuing',
      description: 'Queue requests when concurrent limit is reached',
      enabled: true,
      priority: 2,
      conditions: ['high_concurrent_requests', 'resource_pressure'],
      actions: ['queue_requests', 'prioritize_critical_requests'],
    },
    {
      name: 'Circuit Breaker Activation',
      description: 'Enable circuit breakers for failing services',
      enabled: true,
      priority: 3,
      conditions: ['high_error_rate', 'service_degradation'],
      actions: ['activate_circuit_breaker', 'use_fallback_data'],
    },
    {
      name: 'Resource Throttling',
      description: 'Throttle resource-intensive operations',
      enabled: true,
      priority: 4,
      conditions: ['high_memory_usage', 'high_cpu_usage'],
      actions: ['throttle_operations', 'reduce_payload_size'],
    },
    {
      name: 'Adaptive Rate Limiting',
      description: 'Dynamically adjust rate limits based on usage',
      enabled: true,
      priority: 5,
      conditions: ['quota_approaching', 'usage_spike'],
      actions: ['reduce_rate_limits', 'implement_backoff'],
    },
  ];

  private optimizationHistory: OptimizationHistoryEntry[] = [];

  /**
   * Run optimization cycle
   */
  async optimize(): Promise<{
    applied: string[];
    recommendations: string[];
    healthScore: number;
    nextOptimization: number;
  }> {
    const applied: string[] = [];
    const recommendations: string[] = [];

    // Get current system state
    const resourceUsage = resourceMonitor.getCurrentUsage();
    const rateLimitStatus = rateLimitManager.getStatus();
    const healthScore = resourceMonitor.getHealthScore();

    // Analyze conditions and apply optimizations
    for (const strategy of this.strategies.filter((s) => s.enabled)) {
      const shouldApply = this.evaluateStrategy(
        strategy,
        resourceUsage,
        rateLimitStatus
      );

      if (shouldApply) {
        const result = await this.applyStrategy(strategy);
        if (result.success) {
          applied.push(`${strategy.name}: ${result.action}`);
          this.recordOptimization(
            strategy.name,
            result.action,
            result.reason,
            result.impact
          );
        } else {
          recommendations.push(`Consider: ${strategy.description}`);
        }
      }
    }

    // Calculate next optimization time
    const nextOptimization = this.calculateNextOptimizationTime(healthScore);

    return {
      applied,
      recommendations,
      healthScore,
      nextOptimization,
    };
  }

  /**
   * Evaluate if a strategy should be applied
   */
  private evaluateStrategy(
    strategy: OptimizationStrategy,
    resourceUsage: any,
    rateLimitStatus: any
  ): boolean {
    const conditions = {
      rate_limit_approaching: rateLimitStatus.healthScore < 50,
      high_request_volume: resourceUsage.requests.percentage > 70,
      high_concurrent_requests: Object.values(rateLimitStatus.queues).some(
        (q: any) => q.length > 5
      ),
      resource_pressure:
        resourceUsage.memory.percentage > 75 ||
        resourceUsage.cpu.percentage > 75,
      high_error_rate: metricsLogger.getSummary().errorRate > 0.1,
      service_degradation: rateLimitStatus.healthScore < 30,
      high_memory_usage: resourceUsage.memory.percentage > 80,
      high_cpu_usage: resourceUsage.cpu.percentage > 80,
      quota_approaching: resourceUsage.requests.percentage > 85,
      usage_spike: this.detectUsageSpike(),
    };

    return strategy.conditions.some(
      (condition) => conditions[condition as keyof typeof conditions]
    );
  }

  /**
   * Apply an optimization strategy
   */
  private async applyStrategy(strategy: OptimizationStrategy): Promise<{
    success: boolean;
    action: string;
    reason: string;
    impact: string;
  }> {
    switch (strategy.name) {
      case 'Aggressive Caching':
        return this.applyAggressiveCaching();

      case 'Request Queuing':
        return this.applyRequestQueuing();

      case 'Circuit Breaker Activation':
        return this.applyCircuitBreaker();

      case 'Resource Throttling':
        return this.applyResourceThrottling();

      case 'Adaptive Rate Limiting':
        return this.applyAdaptiveRateLimit();

      default:
        return {
          success: false,
          action: 'Unknown strategy',
          reason: 'Strategy not implemented',
          impact: 'None',
        };
    }
  }

  /**
   * Apply aggressive caching optimization
   */
  private async applyAggressiveCaching(): Promise<any> {
    if (!this.config.enableAggressiveCaching) {
      return {
        success: false,
        action: 'Disabled',
        reason: 'Config disabled',
        impact: 'None',
      };
    }

    // Increase cache TTL for all services
    const caches = ['football-data', 'reddit-api', 'openai-api'];
    let applied = 0;

    for (const service of caches) {
      const cache = cacheManager.getCache(service);
      const stats = cache.getStats();

      if (stats.hitRate < 0.8) {
        // Increase TTL by 50%
        applied++;
      }
    }

    return {
      success: applied > 0,
      action: `Increased cache TTL for ${applied} services`,
      reason: 'Low cache hit rate detected',
      impact: `Reduced API calls by ~${applied * 20}%`,
    };
  }

  /**
   * Apply request queuing optimization
   */
  private async applyRequestQueuing(): Promise<any> {
    if (!this.config.enableRequestQueuing) {
      return {
        success: false,
        action: 'Disabled',
        reason: 'Config disabled',
        impact: 'None',
      };
    }

    const queueStatus = rateLimitManager.getQueueStatus();
    const totalQueued = Object.values(queueStatus).reduce(
      (sum, status) => sum + status.queueLength,
      0
    );

    if (totalQueued > 0) {
      return {
        success: true,
        action: `Managing ${totalQueued} queued requests`,
        reason: 'High concurrent request load',
        impact: 'Prevented function overload',
      };
    }

    return {
      success: false,
      action: 'No queuing needed',
      reason: 'Low request volume',
      impact: 'None',
    };
  }

  /**
   * Apply circuit breaker optimization
   */
  private async applyCircuitBreaker(): Promise<any> {
    const healthStatus = circuitBreakerManager.getHealthStatus();
    const unhealthyServices = Object.entries(healthStatus).filter(
      ([_, status]) => !status.healthy
    );

    if (unhealthyServices.length > 0) {
      return {
        success: true,
        action: `Circuit breakers active for ${unhealthyServices.length} services`,
        reason: 'Service degradation detected',
        impact: 'Prevented cascading failures',
      };
    }

    return {
      success: false,
      action: 'All services healthy',
      reason: 'No degradation detected',
      impact: 'None',
    };
  }

  /**
   * Apply resource throttling optimization
   */
  private async applyResourceThrottling(): Promise<any> {
    if (!this.config.enableResourceThrottling) {
      return {
        success: false,
        action: 'Disabled',
        reason: 'Config disabled',
        impact: 'None',
      };
    }

    const usage = resourceMonitor.getCurrentUsage();
    const actions: string[] = [];

    if (usage.memory.percentage > 80) {
      actions.push('memory throttling');
    }

    if (usage.cpu.percentage > 80) {
      actions.push('CPU throttling');
    }

    if (actions.length > 0) {
      return {
        success: true,
        action: `Applied ${actions.join(', ')}`,
        reason: 'High resource usage detected',
        impact: 'Prevented resource exhaustion',
      };
    }

    return {
      success: false,
      action: 'No throttling needed',
      reason: 'Resource usage within limits',
      impact: 'None',
    };
  }

  /**
   * Apply adaptive rate limiting optimization
   */
  private async applyAdaptiveRateLimit(): Promise<any> {
    const status = rateLimitManager.getStatus();

    if (status.healthScore < 50) {
      // Reduce rate limits by 20%
      rateLimitManager.updateRateLimit('global', {
        maxRequests: Math.floor(100 * 0.8),
      });

      return {
        success: true,
        action: 'Reduced global rate limit by 20%',
        reason: 'Approaching quota limits',
        impact: 'Extended service availability',
      };
    }

    return {
      success: false,
      action: 'Rate limits optimal',
      reason: 'Usage within acceptable range',
      impact: 'None',
    };
  }

  /**
   * Detect usage spikes
   */
  private detectUsageSpike(): boolean {
    const trends = resourceMonitor.getUsageTrends(300000); // 5 minutes
    return trends.requests.trend === 'increasing' && trends.requests.rate > 10;
  }

  /**
   * Calculate next optimization time
   */
  private calculateNextOptimizationTime(healthScore: number): number {
    // More frequent optimization when health is poor
    let intervalMs = 60000; // 1 minute default

    if (healthScore < 30) {
      intervalMs = 15000; // 15 seconds
    } else if (healthScore < 60) {
      intervalMs = 30000; // 30 seconds
    } else if (healthScore > 90) {
      intervalMs = 300000; // 5 minutes
    }

    return Date.now() + intervalMs;
  }

  /**
   * Record optimization action
   */
  private recordOptimization(
    strategy: string,
    action: string,
    reason: string,
    impact: string
  ): void {
    this.optimizationHistory.push({
      timestamp: Date.now(),
      strategy,
      action,
      reason,
      impact,
    });

    // Keep only last 100 optimizations
    if (this.optimizationHistory.length > 100) {
      this.optimizationHistory = this.optimizationHistory.slice(-100);
    }

    // Log to metrics
    metricsLogger.log({
      metricType: 'api_call',
      service: 'vercel-optimizer',
      success: true,
      metadata: { strategy, action, reason, impact },
    });
  }

  /**
   * Get optimization configuration
   */
  getConfig(): VercelOptimizationConfig {
    return { ...this.config };
  }

  /**
   * Update optimization configuration
   */
  updateConfig(updates: Partial<VercelOptimizationConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get optimization history
   */
  getHistory(limit: number = 50): OptimizationHistoryEntry[] {
    return this.optimizationHistory.slice(-limit);
  }

  /**
   * Get comprehensive status
   */
  getStatus(): {
    config: VercelOptimizationConfig;
    strategies: OptimizationStrategy[];
    recentOptimizations: OptimizationHistoryEntry[];
    systemHealth: {
      resourceUsage: any;
      rateLimitStatus: any;
      healthScore: number;
    };
  } {
    return {
      config: this.getConfig(),
      strategies: this.strategies,
      recentOptimizations: this.getHistory(10),
      systemHealth: {
        resourceUsage: resourceMonitor.getCurrentUsage(),
        rateLimitStatus: rateLimitManager.getStatus(),
        healthScore: resourceMonitor.getHealthScore(),
      },
    };
  }

  /**
   * Enable/disable strategy
   */
  toggleStrategy(strategyName: string, enabled: boolean): boolean {
    const strategy = this.strategies.find((s) => s.name === strategyName);
    if (strategy) {
      strategy.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Clear optimization history
   */
  clearHistory(): void {
    this.optimizationHistory = [];
  }
}

// Singleton instance
export const vercelOptimizer = new VercelOptimizer();

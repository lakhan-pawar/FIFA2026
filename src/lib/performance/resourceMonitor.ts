/**
 * Resource Monitor for Vercel Free Tier
 * Monitors resource usage and provides optimization recommendations
 * Requirements: 8.1, 8.4
 */

import { metricsLogger } from './metricsLogger';

export interface ResourceUsage {
  memory: {
    used: number;
    limit: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    limit: number;
    percentage: number;
  };
  requests: {
    current: number;
    limit: number;
    percentage: number;
  };
  bandwidth: {
    used: number;
    limit: number;
    percentage: number;
  };
}

export interface VercelLimits {
  memory: number; // MB
  cpuTime: number; // seconds per request
  requests: number; // per day
  bandwidth: number; // GB per month
  functions: number; // concurrent executions
}

export interface OptimizationRecommendation {
  type: 'memory' | 'cpu' | 'requests' | 'bandwidth' | 'cache';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action: string;
  impact: string;
}

export interface ResourceHistoryEntry {
  timestamp: number;
  memory: number;
  cpu: number;
  requests: number;
  bandwidth: number;
}

class ResourceMonitor {
  private readonly vercelFreeLimits: VercelLimits = {
    memory: 1024, // 1GB
    cpuTime: 10, // 10 seconds per request
    requests: 100000, // 100k per day
    bandwidth: 100, // 100GB per month
    functions: 12, // concurrent executions
  };

  private resourceHistory: ResourceHistoryEntry[] = [];

  private readonly maxHistorySize = 1000;
  private currentConcurrentRequests = 0;
  private dailyRequestCount = 0;
  private monthlyBandwidth = 0;
  private lastResetDate = new Date().toDateString();

  /**
   * Record resource usage
   */
  recordUsage(usage: {
    memory?: number;
    cpu?: number;
    bandwidth?: number;
  }): void {
    const now = Date.now();

    // Reset daily counters if needed
    this.resetCountersIfNeeded();

    // Increment request count
    this.dailyRequestCount++;

    // Add bandwidth usage
    if (usage.bandwidth) {
      this.monthlyBandwidth += usage.bandwidth;
    }

    // Record in history
    this.resourceHistory.push({
      timestamp: now,
      memory: usage.memory || 0,
      cpu: usage.cpu || 0,
      requests: this.dailyRequestCount,
      bandwidth: this.monthlyBandwidth,
    });

    // Trim history if too large
    if (this.resourceHistory.length > this.maxHistorySize) {
      this.resourceHistory = this.resourceHistory.slice(-this.maxHistorySize);
    }

    // Log metrics
    metricsLogger.log({
      metricType: 'api_call',
      service: 'resource-monitor',
      success: true,
      metadata: {
        memory: usage.memory,
        cpu: usage.cpu,
        bandwidth: usage.bandwidth,
        dailyRequests: this.dailyRequestCount,
        monthlyBandwidth: this.monthlyBandwidth,
      },
    });
  }

  /**
   * Track concurrent request start
   */
  startRequest(): void {
    this.currentConcurrentRequests++;
  }

  /**
   * Track concurrent request end
   */
  endRequest(): void {
    this.currentConcurrentRequests = Math.max(
      0,
      this.currentConcurrentRequests - 1
    );
  }

  /**
   * Get current resource usage
   */
  getCurrentUsage(): ResourceUsage {
    const latest = this.resourceHistory[this.resourceHistory.length - 1];

    return {
      memory: {
        used: latest?.memory || 0,
        limit: this.vercelFreeLimits.memory,
        percentage:
          ((latest?.memory || 0) / this.vercelFreeLimits.memory) * 100,
      },
      cpu: {
        usage: latest?.cpu || 0,
        limit: this.vercelFreeLimits.cpuTime,
        percentage: ((latest?.cpu || 0) / this.vercelFreeLimits.cpuTime) * 100,
      },
      requests: {
        current: this.dailyRequestCount,
        limit: this.vercelFreeLimits.requests,
        percentage:
          (this.dailyRequestCount / this.vercelFreeLimits.requests) * 100,
      },
      bandwidth: {
        used: this.monthlyBandwidth,
        limit: this.vercelFreeLimits.bandwidth * 1024 * 1024 * 1024, // Convert GB to bytes
        percentage:
          (this.monthlyBandwidth /
            (this.vercelFreeLimits.bandwidth * 1024 * 1024 * 1024)) *
          100,
      },
    };
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): OptimizationRecommendation[] {
    const usage = this.getCurrentUsage();
    const recommendations: OptimizationRecommendation[] = [];

    // Memory recommendations
    if (usage.memory.percentage > 90) {
      recommendations.push({
        type: 'memory',
        severity: 'critical',
        message: 'Memory usage is critically high (>90%)',
        action:
          'Implement aggressive caching and reduce memory-intensive operations',
        impact: 'Prevents function timeouts and improves performance',
      });
    } else if (usage.memory.percentage > 75) {
      recommendations.push({
        type: 'memory',
        severity: 'high',
        message: 'Memory usage is high (>75%)',
        action: 'Optimize data structures and implement memory pooling',
        impact: 'Reduces risk of memory-related failures',
      });
    }

    // CPU recommendations
    if (usage.cpu.percentage > 80) {
      recommendations.push({
        type: 'cpu',
        severity: 'high',
        message: 'CPU usage is high (>80%)',
        action: 'Optimize algorithms and implement request queuing',
        impact: 'Prevents timeout errors and improves response times',
      });
    }

    // Request limit recommendations
    if (usage.requests.percentage > 90) {
      recommendations.push({
        type: 'requests',
        severity: 'critical',
        message: 'Daily request limit nearly exceeded (>90%)',
        action: 'Implement aggressive caching and request throttling',
        impact: 'Prevents service disruption from quota exhaustion',
      });
    } else if (usage.requests.percentage > 75) {
      recommendations.push({
        type: 'requests',
        severity: 'high',
        message: 'Daily request usage is high (>75%)',
        action: 'Increase cache TTL and implement request batching',
        impact: 'Reduces risk of hitting daily limits',
      });
    }

    // Bandwidth recommendations
    if (usage.bandwidth.percentage > 90) {
      recommendations.push({
        type: 'bandwidth',
        severity: 'critical',
        message: 'Monthly bandwidth limit nearly exceeded (>90%)',
        action: 'Implement response compression and reduce payload sizes',
        impact: 'Prevents bandwidth overage charges',
      });
    } else if (usage.bandwidth.percentage > 75) {
      recommendations.push({
        type: 'bandwidth',
        severity: 'medium',
        message: 'Monthly bandwidth usage is high (>75%)',
        action: 'Optimize API responses and implement data compression',
        impact: 'Reduces bandwidth consumption',
      });
    }

    // Concurrent requests
    if (
      this.currentConcurrentRequests >
      this.vercelFreeLimits.functions * 0.8
    ) {
      recommendations.push({
        type: 'requests',
        severity: 'high',
        message: 'High concurrent request load',
        action: 'Implement request queuing and load balancing',
        impact: 'Prevents function cold starts and improves reliability',
      });
    }

    // Cache recommendations based on hit rate
    const cacheStats = this.getCacheEfficiency();
    if (cacheStats.hitRate < 0.6) {
      recommendations.push({
        type: 'cache',
        severity: 'medium',
        message: `Cache hit rate is low (${(cacheStats.hitRate * 100).toFixed(1)}%)`,
        action: 'Increase cache TTL and implement smarter caching strategies',
        impact: 'Reduces API calls and improves performance',
      });
    }

    return recommendations.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Get resource usage trends
   */
  getUsageTrends(windowMs: number = 3600000): {
    memory: {
      avg: number;
      peak: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    cpu: {
      avg: number;
      peak: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    requests: { rate: number; trend: 'increasing' | 'decreasing' | 'stable' };
  } {
    const cutoff = Date.now() - windowMs;
    const recentHistory = this.resourceHistory.filter(
      (h) => h.timestamp >= cutoff
    );

    if (recentHistory.length === 0) {
      return {
        memory: { avg: 0, peak: 0, trend: 'stable' },
        cpu: { avg: 0, peak: 0, trend: 'stable' },
        requests: { rate: 0, trend: 'stable' },
      };
    }

    // Calculate memory stats
    const memoryValues = recentHistory.map((h) => h.memory);
    const memoryAvg =
      memoryValues.reduce((sum, val) => sum + val, 0) / memoryValues.length;
    const memoryPeak = Math.max(...memoryValues);
    const memoryTrend = this.calculateTrend(memoryValues);

    // Calculate CPU stats
    const cpuValues = recentHistory.map((h) => h.cpu);
    const cpuAvg =
      cpuValues.reduce((sum, val) => sum + val, 0) / cpuValues.length;
    const cpuPeak = Math.max(...cpuValues);
    const cpuTrend = this.calculateTrend(cpuValues);

    // Calculate request rate
    const requestRate = recentHistory.length / (windowMs / 1000); // requests per second
    const requestTrend = this.calculateTrend(
      recentHistory.map((h) => h.requests)
    );

    return {
      memory: { avg: memoryAvg, peak: memoryPeak, trend: memoryTrend },
      cpu: { avg: cpuAvg, peak: cpuPeak, trend: cpuTrend },
      requests: { rate: requestRate, trend: requestTrend },
    };
  }

  /**
   * Get cache efficiency metrics
   */
  private getCacheEfficiency(): { hitRate: number; missRate: number } {
    const summary = metricsLogger.getSummary();
    return {
      hitRate: summary.cacheHitRate,
      missRate: 1 - summary.cacheHitRate,
    };
  }

  /**
   * Calculate trend from values
   */
  private calculateTrend(
    values: number[]
  ): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Reset daily/monthly counters if needed
   */
  private resetCountersIfNeeded(): void {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();

    if (this.lastResetDate !== today) {
      this.dailyRequestCount = 0;
      this.lastResetDate = today;
    }

    // Reset monthly bandwidth on first day of month
    const lastResetMonth = new Date(this.lastResetDate).getMonth();
    if (currentMonth !== lastResetMonth) {
      this.monthlyBandwidth = 0;
    }
  }

  /**
   * Get health score (0-100)
   */
  getHealthScore(): number {
    const usage = this.getCurrentUsage();
    const recommendations = this.getOptimizationRecommendations();

    // Base score starts at 100
    let score = 100;

    // Deduct points for high usage
    score -= Math.max(0, usage.memory.percentage - 50) * 0.5;
    score -= Math.max(0, usage.cpu.percentage - 50) * 0.5;
    score -= Math.max(0, usage.requests.percentage - 50) * 0.3;
    score -= Math.max(0, usage.bandwidth.percentage - 50) * 0.2;

    // Deduct points for recommendations
    const criticalCount = recommendations.filter(
      (r) => r.severity === 'critical'
    ).length;
    const highCount = recommendations.filter(
      (r) => r.severity === 'high'
    ).length;
    const mediumCount = recommendations.filter(
      (r) => r.severity === 'medium'
    ).length;

    score -= criticalCount * 20;
    score -= highCount * 10;
    score -= mediumCount * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Export monitoring data
   */
  exportData(): {
    currentUsage: ResourceUsage;
    recommendations: OptimizationRecommendation[];
    trends: any;
    healthScore: number;
    history: ResourceHistoryEntry[];
  } {
    return {
      currentUsage: this.getCurrentUsage(),
      recommendations: this.getOptimizationRecommendations(),
      trends: this.getUsageTrends(),
      healthScore: this.getHealthScore(),
      history: [...this.resourceHistory],
    };
  }

  /**
   * Clear monitoring data
   */
  clear(): void {
    this.resourceHistory = [];
    this.currentConcurrentRequests = 0;
    this.dailyRequestCount = 0;
    this.monthlyBandwidth = 0;
    this.lastResetDate = new Date().toDateString();
  }
}

// Singleton instance
export const resourceMonitor = new ResourceMonitor();

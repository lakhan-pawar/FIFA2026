/**
 * Performance Metrics Logger
 * Tracks and logs performance metrics for API calls, cache hits/misses, and system health
 * Requirement 8.6: Monitor and log performance metrics for optimization
 */

export interface PerformanceMetric {
  timestamp: number;
  metricType:
    | 'api_call'
    | 'cache_hit'
    | 'cache_miss'
    | 'circuit_breaker'
    | 'error';
  service: string;
  endpoint?: string;
  duration?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface MetricsSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  slowestEndpoints: Array<{ endpoint: string; avgDuration: number }>;
  serviceHealth: Record<string, { healthy: boolean; uptime: number }>;
}

class MetricsLogger {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 10000; // Keep last 10k metrics
  private readonly metricsRetentionMs = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Log a performance metric
   */
  log(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.metrics.push(fullMetric);

    // Trim old metrics if we exceed max
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(fullMetric);
    }
  }

  /**
   * Log an API call metric
   */
  logApiCall(
    service: string,
    endpoint: string,
    duration: number,
    success: boolean,
    errorMessage?: string
  ): void {
    this.log({
      metricType: 'api_call',
      service,
      endpoint,
      duration,
      success,
      errorMessage,
    });
  }

  /**
   * Log a cache hit
   */
  logCacheHit(service: string, key: string): void {
    this.log({
      metricType: 'cache_hit',
      service,
      success: true,
      metadata: { key },
    });
  }

  /**
   * Log a cache miss
   */
  logCacheMiss(service: string, key: string): void {
    this.log({
      metricType: 'cache_miss',
      service,
      success: true,
      metadata: { key },
    });
  }

  /**
   * Log a circuit breaker event
   */
  logCircuitBreaker(
    service: string,
    state: 'open' | 'half-open' | 'closed',
    reason?: string
  ): void {
    this.log({
      metricType: 'circuit_breaker',
      service,
      success: state === 'closed',
      metadata: { state, reason },
    });
  }

  /**
   * Get metrics summary for a time window
   */
  getSummary(windowMs: number = 3600000): MetricsSummary {
    const now = Date.now();
    const windowStart = now - windowMs;
    const recentMetrics = this.metrics.filter(
      (m) => m.timestamp >= windowStart
    );

    const apiCalls = recentMetrics.filter((m) => m.metricType === 'api_call');
    const cacheHits = recentMetrics.filter((m) => m.metricType === 'cache_hit');
    const cacheMisses = recentMetrics.filter(
      (m) => m.metricType === 'cache_miss'
    );

    const totalRequests = apiCalls.length;
    const successfulRequests = apiCalls.filter((m) => m.success).length;
    const failedRequests = totalRequests - successfulRequests;

    const totalDuration = apiCalls.reduce(
      (sum, m) => sum + (m.duration || 0),
      0
    );
    const averageResponseTime =
      totalRequests > 0 ? totalDuration / totalRequests : 0;

    const totalCacheRequests = cacheHits.length + cacheMisses.length;
    const cacheHitRate =
      totalCacheRequests > 0 ? cacheHits.length / totalCacheRequests : 0;

    const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0;

    // Calculate slowest endpoints
    const endpointStats = new Map<string, { total: number; count: number }>();
    apiCalls.forEach((m) => {
      if (m.endpoint && m.duration) {
        const stats = endpointStats.get(m.endpoint) || { total: 0, count: 0 };
        stats.total += m.duration;
        stats.count += 1;
        endpointStats.set(m.endpoint, stats);
      }
    });

    const slowestEndpoints = Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        avgDuration: stats.total / stats.count,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    // Calculate service health
    const serviceHealth: Record<string, { healthy: boolean; uptime: number }> =
      {};
    const services = new Set(recentMetrics.map((m) => m.service));

    services.forEach((service) => {
      const serviceMetrics = apiCalls.filter((m) => m.service === service);
      const successCount = serviceMetrics.filter((m) => m.success).length;
      const uptime =
        serviceMetrics.length > 0 ? successCount / serviceMetrics.length : 1;
      serviceHealth[service] = {
        healthy: uptime >= 0.95, // 95% success rate threshold
        uptime,
      };
    });

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      cacheHitRate,
      errorRate,
      slowestEndpoints,
      serviceHealth,
    };
  }

  /**
   * Get metrics for a specific service
   */
  getServiceMetrics(
    service: string,
    windowMs: number = 3600000
  ): PerformanceMetric[] {
    const now = Date.now();
    const windowStart = now - windowMs;
    return this.metrics.filter(
      (m) => m.service === service && m.timestamp >= windowStart
    );
  }

  /**
   * Clear old metrics beyond retention period
   */
  cleanup(): void {
    const cutoff = Date.now() - this.metricsRetentionMs;
    this.metrics = this.metrics.filter((m) => m.timestamp >= cutoff);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Get all metrics (for debugging)
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        metricsCount: this.metrics.length,
        summary: this.getSummary(),
        metrics: this.metrics,
      },
      null,
      2
    );
  }

  private logToConsole(metric: PerformanceMetric): void {
    const emoji = metric.success ? '✅' : '❌';
    const duration = metric.duration ? `${metric.duration.toFixed(2)}ms` : '';
    console.log(
      `${emoji} [${metric.metricType}] ${metric.service}${metric.endpoint ? ` - ${metric.endpoint}` : ''} ${duration}`,
      metric.errorMessage ? `Error: ${metric.errorMessage}` : ''
    );
  }
}

// Singleton instance
export const metricsLogger = new MetricsLogger();

// Auto-cleanup every hour
if (typeof window === 'undefined') {
  setInterval(
    () => {
      metricsLogger.cleanup();
    },
    60 * 60 * 1000
  );
}

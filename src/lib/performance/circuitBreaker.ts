/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by stopping requests to failing services
 * Requirement 8.5: Implement circuit breaker patterns for external API failures
 */

import { metricsLogger } from './metricsLogger';

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  successThreshold: number; // Number of successes to close circuit from half-open
  timeout: number; // Time in ms before attempting to close circuit
  monitoringPeriod: number; // Time window for counting failures
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  nextAttemptTime?: number;
}

class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private nextAttemptTime?: number;
  private recentFailures: number[] = [];

  constructor(
    private readonly serviceName: string,
    private readonly config: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 1 minute
      monitoringPeriod: 120000, // 2 minutes
    }
  ) {}

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
        metricsLogger.logCircuitBreaker(
          this.serviceName,
          'half-open',
          'Attempting to reset circuit'
        );
      } else {
        const error = new Error(
          `Circuit breaker is OPEN for ${this.serviceName}. Service temporarily unavailable.`
        );
        metricsLogger.logCircuitBreaker(
          this.serviceName,
          'open',
          'Request blocked by open circuit'
        );

        // Use fallback if available
        if (fallback) {
          return fallback();
        }
        throw error;
      }
    }

    const startTime = Date.now();

    try {
      const result = await fn();
      this.onSuccess();

      const duration = Date.now() - startTime;
      metricsLogger.logApiCall(
        this.serviceName,
        'circuit-breaker-protected',
        duration,
        true
      );

      return result;
    } catch (error) {
      this.onFailure();

      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      metricsLogger.logApiCall(
        this.serviceName,
        'circuit-breaker-protected',
        duration,
        false,
        errorMessage
      );

      // Use fallback if available
      if (fallback) {
        return fallback();
      }

      throw error;
    }
  }

  /**
   * Record a successful call
   */
  private onSuccess(): void {
    this.lastSuccessTime = Date.now();
    this.failureCount = 0;
    this.recentFailures = [];

    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed';
        this.successCount = 0;
        metricsLogger.logCircuitBreaker(
          this.serviceName,
          'closed',
          'Circuit closed after successful recovery'
        );
      }
    }
  }

  /**
   * Record a failed call
   */
  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    this.recentFailures.push(Date.now());

    // Clean up old failures outside monitoring period
    const cutoff = Date.now() - this.config.monitoringPeriod;
    this.recentFailures = this.recentFailures.filter((time) => time >= cutoff);

    if (this.state === 'half-open') {
      // If we fail in half-open state, go back to open
      this.state = 'open';
      this.successCount = 0;
      this.nextAttemptTime = Date.now() + this.config.timeout;
      metricsLogger.logCircuitBreaker(
        this.serviceName,
        'open',
        'Circuit reopened after failure in half-open state'
      );
    } else if (
      this.state === 'closed' &&
      this.recentFailures.length >= this.config.failureThreshold
    ) {
      // Open the circuit if we exceed failure threshold
      this.state = 'open';
      this.nextAttemptTime = Date.now() + this.config.timeout;
      metricsLogger.logCircuitBreaker(
        this.serviceName,
        'open',
        `Circuit opened after ${this.recentFailures.length} failures`
      );
    }
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  private shouldAttemptReset(): boolean {
    return (
      this.nextAttemptTime !== undefined && Date.now() >= this.nextAttemptTime
    );
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.recentFailures.length,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.recentFailures = [];
    this.nextAttemptTime = undefined;
    metricsLogger.logCircuitBreaker(
      this.serviceName,
      'closed',
      'Circuit manually reset'
    );
  }

  /**
   * Force open the circuit (for testing or maintenance)
   */
  forceOpen(): void {
    this.state = 'open';
    this.nextAttemptTime = Date.now() + this.config.timeout;
    metricsLogger.logCircuitBreaker(
      this.serviceName,
      'open',
      'Circuit manually opened'
    );
  }
}

/**
 * Circuit Breaker Manager
 * Manages multiple circuit breakers for different services
 */
class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Get or create a circuit breaker for a service
   */
  getBreaker(
    serviceName: string,
    config?: CircuitBreakerConfig
  ): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(serviceName, config));
    }
    return this.breakers.get(serviceName)!;
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    serviceName: string,
    fn: () => Promise<T>,
    fallback?: () => Promise<T>,
    config?: CircuitBreakerConfig
  ): Promise<T> {
    const breaker = this.getBreaker(serviceName, config);
    return breaker.execute(fn, fallback);
  }

  /**
   * Get stats for all circuit breakers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    this.breakers.forEach((breaker, name) => {
      stats[name] = breaker.getStats();
    });
    return stats;
  }

  /**
   * Reset a specific circuit breaker
   */
  reset(serviceName: string): void {
    const breaker = this.breakers.get(serviceName);
    if (breaker) {
      breaker.reset();
    }
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach((breaker) => breaker.reset());
  }

  /**
   * Get health status of all services
   */
  getHealthStatus(): Record<string, { healthy: boolean; state: CircuitState }> {
    const health: Record<string, { healthy: boolean; state: CircuitState }> =
      {};
    this.breakers.forEach((breaker, name) => {
      const stats = breaker.getStats();
      health[name] = {
        healthy: stats.state === 'closed',
        state: stats.state,
      };
    });
    return health;
  }
}

// Singleton instance
export const circuitBreakerManager = new CircuitBreakerManager();

// Export for direct use
export { CircuitBreaker };

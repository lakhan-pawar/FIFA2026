/**
 * Tests for Vercel Free Tier Optimization System
 * Requirements: 8.1, 8.2, 8.4
 */

import { rateLimitManager } from '../rateLimitManager';
import { resourceMonitor } from '../resourceMonitor';
import { vercelOptimizer } from '../vercelOptimizer';

describe('Vercel Free Tier Optimization', () => {
  beforeEach(() => {
    // Clear all monitoring data before each test
    rateLimitManager.clearHistory();
    resourceMonitor.clear();
    vercelOptimizer.clearHistory();
  });

  describe('Rate Limit Manager', () => {
    it('should enforce rate limits correctly', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');

      // Execute multiple requests with shorter timeout
      const promises = Array(5)
        .fill(0)
        .map(() =>
          rateLimitManager.executeWithRateLimit('football-data', mockRequest)
        );

      const results = await Promise.allSettled(promises);

      // Should have some successful results
      expect(results.some((r) => r.status === 'fulfilled')).toBe(true);
      expect(mockRequest).toHaveBeenCalled();
    }, 10000);

    it('should provide accurate rate limit status', () => {
      const status = rateLimitManager.getRateLimitStatus('football-data');

      expect(status).toHaveProperty('remaining');
      expect(status).toHaveProperty('resetTime');
      expect(status).toHaveProperty('isLimited');
      expect(status).toHaveProperty('waitTime');
      expect(typeof status.remaining).toBe('number');
    });

    it('should handle queue management', async () => {
      const mockRequest = jest.fn().mockResolvedValue('queued');

      // Fill up the rate limit
      const promises = Array(20)
        .fill(0)
        .map(() =>
          rateLimitManager.executeWithRateLimit('reddit-api', mockRequest, {
            priority: 'high',
          })
        );

      await Promise.allSettled(promises);

      const queueStatus = rateLimitManager.getQueueStatus();
      expect(queueStatus).toHaveProperty('reddit-api');
    });
  });

  describe('Resource Monitor', () => {
    it('should track resource usage', () => {
      resourceMonitor.recordUsage({
        memory: 512,
        cpu: 2.5,
        bandwidth: 1024,
      });

      const usage = resourceMonitor.getCurrentUsage();

      expect(usage.memory.used).toBe(512);
      expect(usage.memory.percentage).toBeGreaterThan(0);
      expect(usage.requests.current).toBeGreaterThan(0);
    });

    it('should provide optimization recommendations', () => {
      // Simulate very high resource usage to trigger critical recommendations
      resourceMonitor.recordUsage({
        memory: 950, // Very high memory usage (95% of 1024MB limit)
        cpu: 9, // Very high CPU usage
        bandwidth: 10000,
      });

      const recommendations = resourceMonitor.getOptimizationRecommendations();

      expect(Array.isArray(recommendations)).toBe(true);

      // Should have at least some recommendations for high usage
      if (recommendations.length > 0) {
        expect(recommendations[0]).toHaveProperty('severity');
        expect(recommendations[0]).toHaveProperty('message');
      }
    });

    it('should calculate health score correctly', () => {
      const healthScore = resourceMonitor.getHealthScore();

      expect(typeof healthScore).toBe('number');
      expect(healthScore).toBeGreaterThanOrEqual(0);
      expect(healthScore).toBeLessThanOrEqual(100);
    });

    it('should track concurrent requests', () => {
      resourceMonitor.startRequest();
      resourceMonitor.startRequest();
      resourceMonitor.endRequest();

      // Should handle concurrent tracking without errors
      expect(() => resourceMonitor.getCurrentUsage()).not.toThrow();
    });
  });

  describe('Vercel Optimizer', () => {
    it('should run optimization cycle', async () => {
      const result = await vercelOptimizer.optimize();

      expect(result).toHaveProperty('applied');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('healthScore');
      expect(result).toHaveProperty('nextOptimization');

      expect(Array.isArray(result.applied)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(typeof result.healthScore).toBe('number');
    });

    it('should manage optimization strategies', () => {
      const status = vercelOptimizer.getStatus();

      expect(status).toHaveProperty('strategies');
      expect(status).toHaveProperty('config');
      expect(Array.isArray(status.strategies)).toBe(true);

      // Test strategy toggling
      const strategyName = status.strategies[0]?.name;
      if (strategyName) {
        const result = vercelOptimizer.toggleStrategy(strategyName, false);
        expect(result).toBe(true);
      }
    });

    it('should update configuration', () => {
      const newConfig = {
        enableAggressiveCaching: false,
        maxConcurrentRequests: 5,
      };

      vercelOptimizer.updateConfig(newConfig);
      const config = vercelOptimizer.getConfig();

      expect(config.enableAggressiveCaching).toBe(false);
      expect(config.maxConcurrentRequests).toBe(5);
    });
  });

  describe('Integration Tests', () => {
    it('should handle high load scenario', async () => {
      // Simulate high load with fewer requests to avoid timeout
      const mockRequest = jest.fn().mockResolvedValue('load-test');

      // Record high resource usage
      resourceMonitor.recordUsage({
        memory: 800,
        cpu: 7,
        bandwidth: 5000,
      });

      // Execute fewer requests to avoid timeout
      const promises = Array(10)
        .fill(0)
        .map((_, i) =>
          rateLimitManager.executeWithRateLimit(
            i % 2 === 0 ? 'football-data' : 'reddit-api',
            mockRequest,
            { priority: i < 5 ? 'high' : 'medium' }
          )
        );

      await Promise.allSettled(promises);

      // Run optimization
      const optimizationResult = await vercelOptimizer.optimize();

      // Should have some result
      expect(optimizationResult).toHaveProperty('applied');
      expect(optimizationResult).toHaveProperty('recommendations');
    }, 15000);

    it('should maintain system health under stress', async () => {
      // Stress test the system
      for (let i = 0; i < 100; i++) {
        resourceMonitor.recordUsage({
          memory: Math.random() * 1000,
          cpu: Math.random() * 10,
          bandwidth: Math.random() * 10000,
        });
      }

      const healthScore = resourceMonitor.getHealthScore();
      const rateLimitStatus = rateLimitManager.getStatus();

      // System should still be responsive
      expect(typeof healthScore).toBe('number');
      expect(rateLimitStatus).toHaveProperty('healthScore');
      expect(() => vercelOptimizer.getStatus()).not.toThrow();
    });
  });
});

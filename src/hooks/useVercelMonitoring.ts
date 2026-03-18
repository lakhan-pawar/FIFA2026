/**
 * Hook for Vercel Free Tier Monitoring
 * Provides real-time monitoring data and optimization controls
 * Requirements: 8.1, 8.2, 8.4
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface VercelMonitoringData {
  timestamp: string;
  healthy: boolean;
  healthScore: number;
  status: 'operational' | 'degraded' | 'critical';
  resources: {
    memory: { usage: number; status: string };
    requests: { usage: number; remaining: number; status: string };
    bandwidth: { usage: number; status: string };
  };
  rateLimits: {
    globalRemaining: number;
    footballDataRemaining: number;
    redditApiRemaining: number;
    queued: number;
  };
  cache: {
    hitRate: number;
    totalSize: number;
    status: string;
  };
  recommendations: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
}

export interface UseVercelMonitoringOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  detailed?: boolean;
  includeHistory?: boolean;
}

export function useVercelMonitoring(options: UseVercelMonitoringOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    detailed = false,
    includeHistory = false,
  } = options;

  const [data, setData] = useState<VercelMonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (detailed) params.append('detailed', 'true');
      if (includeHistory) params.append('history', 'true');

      const response = await fetch(
        `/api/monitoring/vercel-status?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [detailed, includeHistory]);

  const optimize = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/vercel-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh data after optimization
      await fetchData();

      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Optimization failed'
      );
    }
  }, [fetchData]);

  const updateConfig = useCallback(
    async (config: any) => {
      try {
        const response = await fetch('/api/monitoring/vercel-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'updateConfig', config }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Refresh data after config update
        await fetchData();

        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Config update failed'
        );
      }
    },
    [fetchData]
  );

  const clearCache = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/vercel-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearCache' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh data after cache clear
      await fetchData();

      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Cache clear failed'
      );
    }
  }, [fetchData]);

  const resetRateLimits = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/vercel-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetRateLimits' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh data after reset
      await fetchData();

      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Rate limit reset failed'
      );
    }
  }, [fetchData]);

  const resetCircuitBreakers = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/vercel-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetCircuitBreakers' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh data after reset
      await fetchData();

      return result;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Circuit breaker reset failed'
      );
    }
  }, [fetchData]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh, refreshInterval]);

  // Derived state
  const isHealthy = data?.healthy ?? false;
  const needsAttention =
    data?.recommendations?.some(
      (r) => r.severity === 'critical' || r.severity === 'high'
    ) ?? false;
  const resourcePressure = data
    ? data.resources.memory.usage > 75 ||
      data.resources.requests.usage > 75 ||
      data.resources.bandwidth.usage > 75
    : false;

  return {
    // Data
    data,
    loading,
    error,
    lastUpdated,

    // Derived state
    isHealthy,
    needsAttention,
    resourcePressure,

    // Actions
    refresh: fetchData,
    optimize,
    updateConfig,
    clearCache,
    resetRateLimits,
    resetCircuitBreakers,

    // Status helpers
    getStatusColor: (status: string) => {
      switch (status) {
        case 'operational':
          return 'green';
        case 'degraded':
          return 'yellow';
        case 'critical':
          return 'red';
        default:
          return 'gray';
      }
    },

    getUsageLevel: (percentage: number) => {
      if (percentage > 90) return 'critical';
      if (percentage > 75) return 'high';
      if (percentage > 50) return 'medium';
      return 'low';
    },

    formatLastUpdated: () => {
      if (!lastUpdated) return 'Never';
      const now = new Date();
      const diff = now.getTime() - lastUpdated.getTime();
      const seconds = Math.floor(diff / 1000);

      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    },
  };
}

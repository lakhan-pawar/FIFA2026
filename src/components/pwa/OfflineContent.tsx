'use client';

import { useState, useEffect } from 'react';
import {
  WifiIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  getOfflineMessage,
  isDataAvailableOffline,
  CACHE_KEYS,
} from '@/utils/offline';

interface OfflineContentProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  showCacheStatus?: boolean;
}

export function OfflineContent({
  children,
  fallbackMessage,
  showCacheStatus = false,
}: OfflineContentProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateCacheStatus = () => {
      const status: Record<string, boolean> = {};
      Object.entries(CACHE_KEYS).forEach(([key, value]) => {
        status[key] = isDataAvailableOffline(value);
      });
      setCacheStatus(status);
    };

    // Initial checks
    updateOnlineStatus();
    updateCacheStatus();

    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Update cache status periodically
    const cacheInterval = setInterval(updateCacheStatus, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(cacheInterval);
    };
  }, []);

  if (isOnline) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg-subtle)] p-4">
      <div className="max-w-md mx-auto">
        {/* Offline Status Header */}
        <div className="bg-[var(--c-bg-surface)] rounded-xl shadow-sm border-[0.5px] border-[var(--c-border)] p-6 mb-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="section-title text-[var(--c-text-primary)] mb-2">
              You&apos;re Offline
            </h2>
            <p className="body-text text-[var(--c-text-secondary)]">
              {fallbackMessage || getOfflineMessage()}
            </p>
          </div>
        </div>

        {/* Cache Status */}
        {showCacheStatus && (
          <div className="bg-[var(--c-bg-surface)] rounded-xl shadow-sm border-[0.5px] border-[var(--c-border)] p-4 mb-6">
            <h3 className="card-title text-[var(--c-text-primary)] mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Cached Data Available
            </h3>
            <div className="space-y-2">
              {Object.entries(cacheStatus).map(([key, available]) => (
                <div
                  key={key}
                  className="flex items-center justify-between meta-text"
                >
                  <span className="text-[var(--c-text-secondary)] capitalize">
                    {key.toLowerCase().replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full badge-text ${
                      available
                        ? 'bg-[var(--c-live-bg)] text-[var(--c-live-text)]'
                        : 'bg-[var(--c-bg-subtle)] text-[var(--c-text-tertiary)]'
                    }`}
                  >
                    {available ? 'Available' : 'Not cached'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Tips */}
        <div className="bg-[var(--c-accent-subtle)] rounded-xl border border-[var(--c-accent)]/20 p-4">
          <h3 className="card-title text-[var(--c-accent)] mb-2 flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            Offline Tips
          </h3>
          <ul className="meta-text text-[var(--c-text-secondary)] space-y-1">
            <li>• Cached content is available for viewing</li>
            <li>• Your preferences are saved locally</li>
            <li>• New data will sync when you&apos;re back online</li>
            <li>• Some features require an internet connection</li>
          </ul>
        </div>

        {/* Retry Connection Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-2 bg-[var(--c-accent)] hover:opacity-90 text-[var(--c-accent-text)] badge-text rounded-xl transition-all border-0 shadow-md active:scale-95"
          >
            <WifiIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

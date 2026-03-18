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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Offline Status Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              You&apos;re Offline
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {fallbackMessage || getOfflineMessage()}
            </p>
          </div>
        </div>

        {/* Cache Status */}
        {showCacheStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Cached Data Available
            </h3>
            <div className="space-y-2">
              {Object.entries(cacheStatus).map(([key, available]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key.toLowerCase().replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      available
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
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
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            Offline Tips
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Cached content is available for viewing</li>
            <li>• Your preferences are saved locally</li>
            <li>• New data will sync when you&apos;re back online</li>
            <li>• Some features require an internet connection</li>
          </ul>
        </div>

        {/* Retry Connection Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <WifiIcon className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

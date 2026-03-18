'use client';

import { useState, useEffect } from 'react';
import { WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        setShowOfflineMessage(true);
      } else if (showOfflineMessage) {
        // Show "back online" message briefly
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
    };

    // Initial check
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [showOfflineMessage]);

  if (!showOfflineMessage) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-sm">
      <div
        className={`rounded-lg shadow-lg border p-3 transition-all duration-300 ${
          isOnline
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}
      >
        <div className="flex items-center">
          {isOnline ? (
            <WifiIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                isOnline
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}
            >
              {isOnline ? 'Back Online' : "You're Offline"}
            </p>
            <p
              className={`text-xs ${
                isOnline
                  ? 'text-green-600 dark:text-green-300'
                  : 'text-yellow-600 dark:text-yellow-300'
              }`}
            >
              {isOnline
                ? 'All features are now available'
                : 'Some features may be limited. Cached content is still available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

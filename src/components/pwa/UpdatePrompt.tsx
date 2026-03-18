'use client';

import { useState, useEffect } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { skipWaitingAndActivate } from '@/utils/serviceWorker';

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowUpdate(true);
    };

    // Listen for service worker update events
    window.addEventListener(
      'sw-update-available',
      handleUpdateAvailable as EventListener
    );

    return () => {
      window.removeEventListener(
        'sw-update-available',
        handleUpdateAvailable as EventListener
      );
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await skipWaitingAndActivate();
    } catch (error) {
      console.error('Failed to update app:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <ArrowPathIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Update Available
              </h3>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              A new version of KickoffTo is ready with improvements and bug
              fixes. Update now for the best experience.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Now'
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isUpdating}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 px-3 rounded-md transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

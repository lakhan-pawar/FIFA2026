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
      <div className="bg-[var(--c-bg-surface)] rounded-xl shadow-lg border-[0.5px] border-[var(--c-border)] p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <ArrowPathIcon className="h-5 w-5 text-[var(--c-accent)] mr-2" />
              <h3 className="card-title text-[var(--c-text-primary)]">
                Update Available
              </h3>
            </div>
            <p className="body-text text-[var(--c-text-secondary)] mb-4">
              A new version of KickoffTo is ready with improvements and bug
              fixes. Update now for the best experience.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 bg-[var(--c-accent)] hover:opacity-90 disabled:opacity-50 text-[var(--c-accent-text)] badge-text py-2 px-3 rounded-lg transition-colors flex items-center justify-center border-0"
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
                className="flex-1 bg-[var(--c-bg-subtle)] hover:bg-[var(--c-bg-subtle)]/80 disabled:opacity-50 text-[var(--c-text-secondary)] badge-text py-2 px-3 rounded-lg transition-colors border-0"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="ml-2 text-[var(--c-text-tertiary)] hover:text-[var(--c-text-primary)] disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

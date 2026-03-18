'use client';

import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isStandalone: boolean;
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isStandalone: false,
  });

  useEffect(() => {
    // Check if running in standalone mode (installed PWA)
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as { standalone?: boolean }).standalone === true;

      return isStandalone;
    };

    // Check online status
    const updateOnlineStatus = () => {
      setPWAState((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
      }));
    };

    // Check if app is installable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPWAState((prev) => ({
        ...prev,
        isInstallable: true,
      }));
    };

    // Handle app installation
    const handleAppInstalled = () => {
      setPWAState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        isStandalone: true,
      }));
    };

    // Initial state setup
    setPWAState((prev) => ({
      ...prev,
      isOnline: navigator.onLine,
      isStandalone: checkStandalone(),
      isInstalled: checkStandalone(),
    }));

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return pwaState;
}

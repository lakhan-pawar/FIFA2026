'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { UpdatePrompt } from './UpdatePrompt';
import { registerServiceWorker } from '@/utils/serviceWorker';

interface PWAContextType {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isStandalone: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function usePWAContext() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAContext must be used within a PWAProvider');
  }
  return context;
}

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const pwaState = usePWA();

  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  return (
    <PWAContext.Provider value={pwaState}>
      {children}
      <PWAInstallPrompt />
      <OfflineIndicator />
      <UpdatePrompt />
    </PWAContext.Provider>
  );
}

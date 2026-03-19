'use client';

import { useState, useEffect } from 'react';
import {
  Home,
  Radio,
  Bot,
  MapPin,
  Menu,
  X,
  Users,
  BarChart2,
  Zap,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';

const mainTabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Schedule', href: '/schedule', icon: Radio },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Agents', href: '/agents', icon: Bot },
];

const moreTabs = [
  { name: 'Brackets', href: '/brackets', icon: Trophy },
  { name: 'Watch Parties', href: '/watch-parties', icon: MapPin },
  { name: 'Fan Pulse', href: '/fan-pulse', icon: Users },
  { name: 'Groups', href: '/groups', icon: BarChart2 },
  { name: 'Stats', href: '/stats', icon: Zap },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close more menu on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[var(--c-bg-surface)] border-t border-[var(--c-border)] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-[56px] px-2">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-full transition-all group',
                  isActive ? 'text-[var(--c-accent)]' : 'text-[var(--c-text-tertiary)]'
                )}
              >
                <div className="flex flex-col items-center gap-1 group-active:scale-90 transition-transform">
                  <tab.icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                  <span className="text-[10px] font-bold leading-none">{tab.name}</span>
                </div>
                {isActive && (
                  <div className="absolute -top-[0.5px] w-8 h-[2px] bg-[var(--c-accent)] rounded-b-lg" />
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              'relative flex flex-col items-center justify-center w-full h-full transition-all group',
              isMoreOpen ? 'text-[var(--c-accent)]' : 'text-[var(--c-text-tertiary)]'
            )}
          >
            <div className="flex flex-col items-center gap-1 group-active:scale-90 transition-transform">
              {isMoreOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-[10px] font-bold leading-none">More</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isMoreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMoreOpen(false)}
      />

      {/* Drawer (Slide-up) */}
      <div 
        className={cn(
          "md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom))] left-0 right-0 z-[95] bg-[var(--c-bg-surface)] border-t border-[var(--c-border)] rounded-t-[20px] shadow-2xl transition-transform duration-300 ease-out",
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 rounded-full bg-[var(--c-bg-subtle)]" />
        </div>

        <div className="p-4 pt-0 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {moreTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl transition-all border shrink-0",
                  isActive 
                    ? "bg-[var(--c-accent)]/10 border-[var(--c-accent)]/30 text-[var(--c-accent)]" 
                    : "bg-[var(--c-bg-subtle)] border-[var(--c-border)] text-[var(--c-text-primary)] active:bg-[var(--c-border)]"
                )}
              >
                <tab.icon className={cn("w-5 h-5", isActive ? "text-[var(--c-accent)]" : "text-[var(--c-text-tertiary)]")} />
                <span className="text-[13px] font-bold">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

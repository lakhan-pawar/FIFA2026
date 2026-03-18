'use client';

import { useState } from 'react';
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
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

const mainTabs = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Schedule', href: '/live', icon: Radio },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Agents', href: '/agents', icon: Bot },
];

const moreTabs = [
  { name: 'Watch Parties', href: '/map', icon: MapPin },
  { name: 'Fan Pulse', href: '/community', icon: Users },
  { name: 'Groups', href: '/standings', icon: BarChart2 },
  { name: 'Stats', href: '/stats', icon: Zap },
  { name: 'Brackets', href: '/brackets', icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // BottomNav hides on md (768px and up)
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[var(--bg)]/90 backdrop-blur-[20px] border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[56px] px-2">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setIsMoreOpen(false)}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-full touch-manipulation transition-transform active:scale-95',
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1"
                >
                  <tab.icon
                    className={cn(
                      'w-6 h-6 transition-transform',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="text-[10px] font-medium leading-none">
                    {tab.name}
                  </span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-[1px] w-8 h-[2px] bg-[var(--accent)] rounded-b-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={cn(
              'relative flex flex-col items-center justify-center w-full h-full touch-manipulation transition-transform active:scale-95',
              isMoreOpen ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
            )}
            aria-label="More Menu"
          >
            <motion.div
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center gap-1"
            >
              {isMoreOpen ? (
                <X className="w-6 h-6 transition-transform scale-110" />
              ) : (
                <Menu className="w-6 h-6 transition-transform" />
              )}
              <span className="text-[10px] font-medium leading-none">More</span>
            </motion.div>
            {isMoreOpen && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -top-[1px] w-8 h-[2px] bg-[var(--accent)] rounded-b-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{
                y: 0,
                transition: { type: 'spring', stiffness: 300, damping: 30 },
              }}
              exit={{ y: '100%' }}
              className="md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom))] left-0 right-0 z-[85] bg-[var(--card)] border-t border-[var(--border)] rounded-t-2xl shadow-[var(--shadow)] overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 gap-2">
                {moreTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg)] hover:bg-[var(--card-hover)] text-[var(--text)] transition-colors active:scale-95"
                  >
                    <tab.icon className="w-6 h-6 text-[var(--accent)]" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </Link>
                ))}
                <Link
                  href="/preferences"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg)] hover:bg-[var(--card-hover)] text-[var(--text)] transition-colors active:scale-95 col-span-2"
                >
                  <Settings className="w-6 h-6 text-[var(--muted)]" />
                  <span className="text-sm font-medium">
                    Settings (Preferences)
                  </span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Radio,
  Bot,
  Trophy,
  MapPin,
  Users,
  BarChart2,
  Zap,
  Search,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { TeamPicker } from '../ui/TeamPicker';
import { useEffect, useState } from 'react';
import { cn } from '@/utils';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Schedule', href: '/live', icon: Radio },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Brackets', href: '/brackets', icon: Trophy },
  { name: 'Watch Parties', href: '/map', icon: MapPin },
  { name: 'Fan Pulse', href: '/community', icon: Users },
  { name: 'Groups', href: '/standings', icon: BarChart2 },
  { name: 'Stats', href: '/stats', icon: Zap },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isTeamPickerOpen, setIsTeamPickerOpen] = useState(false);
  const { team } = useFavoriteTeam();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-open picker if no team is selected (Welcome Prompt)
  useEffect(() => {
    if (!team) {
      const timer = setTimeout(() => {
        setIsTeamPickerOpen(true);
      }, 1500); // 1.5s delay for natural entrance
      return () => clearTimeout(timer);
    }
  }, [team]);

  return (
    <header
      className={cn(
        'sticky top-[28px] z-50 transition-all duration-300 w-full h-[58px] md:h-[58px] h-[52px] rounded-full px-6',
        scrolled || team
          ? 'glass-team shadow-[0_0_40px_rgba(var(--team-primary-rgb),0.25)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 touch-manipulation">
          <span className="font-display text-2xl tracking-wide bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent dark:from-white dark:to-gray-500">
            KickoffTo
          </span>
          {team && (
            <span className="text-xl ml-1 animate-in fade-in zoom-in duration-300">
              {team.flag}
            </span>
          )}
        </Link>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative h-full px-4 flex items-center gap-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[var(--text)]'
                    : 'text-[var(--muted)] hover:text-[var(--text-2)]'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Team Selection Trigger */}
          <button
            onClick={() => setIsTeamPickerOpen(true)}
            className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all active:scale-90"
            aria-label="Select Favorite Team"
          >
            {team ? (
              <span className="text-xl animate-in zoom-in duration-300 transform group-hover:scale-125 transition-transform">
                {team.flag}
              </span>
            ) : (
              <Zap className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
            )}
            
            {/* Pulsing indicator if no team selected */}
            {!team && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
            )}
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--card-hover)] transition-colors text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <ThemeToggle />

          <TeamPicker 
            isOpen={isTeamPickerOpen} 
            onClose={() => setIsTeamPickerOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
}

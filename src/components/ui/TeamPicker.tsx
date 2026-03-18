'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS, useFavoriteTeam, TeamInfo } from '@/context/FavoriteTeamContext';
import { X, Check, Search } from 'lucide-react';

interface TeamPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamPicker({ isOpen, onClose }: TeamPickerProps) {
  const { teamId, setTeamId } = useFavoriteTeam();
  const [search, setSearch] = useState('');

  const filteredTeams = TEAMS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-gradient-to-br from-[var(--card)] to-[var(--bg)]">
              <div>
                <h2 className="font-display text-3xl text-[var(--text)] font-bold tracking-tight">Choose Your <span className="text-[var(--accent)] italic">Legacy</span></h2>
                <p className="text-sm text-[var(--muted)] mt-1 font-medium">Elevate your WC2026 journey with a team-specific skin.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-2)] transition-all active:scale-90 border border-[var(--border)]"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 bg-[var(--bg-2)]/30 backdrop-blur-md shrink-0">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="text"
                  placeholder="Search your nation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-6 text-base outline-none focus:border-[var(--accent)]/50 focus:ring-4 focus:ring-[var(--accent)]/5 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Team Grid */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth scrollbar-thin scrollbar-thumb-[var(--border)] hover:scrollbar-thumb-[var(--accent)]/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setTeamId(team.id);
                      onClose();
                    }}
                    className={`flex items-center gap-4 p-4 rounded-[24px] border transition-all text-left group relative overflow-hidden ${
                      teamId === team.id 
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)] ring-1 ring-[var(--accent)]/50' 
                        : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/40 hover:translate-y-[-2px] hover:shadow-xl'
                    }`}
                  >
                    <div className="relative z-10 text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                      {team.flag}
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="font-bold text-base tracking-tight truncate">{team.name}</div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="w-4 h-2 rounded-full shadow-inner" style={{ backgroundColor: team.colors.primary }} />
                        <div className="w-4 h-2 rounded-full shadow-inner opacity-60" style={{ backgroundColor: team.colors.secondary }} />
                      </div>
                    </div>
                    {teamId === team.id && (
                      <div className="relative z-10 w-6 h-6 rounded-full bg-[var(--accent)] text-black flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </div>
                    )}
                    
                    {/* Subtle team color glow on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" 
                      style={{ background: `linear-gradient(135deg, ${team.colors.primary}, transparent)` }}
                    />
                  </button>
                ))}
                
                {teamId && (
                  <button
                    onClick={() => {
                      setTeamId(null);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-4 rounded-[24px] border border-dashed border-[var(--border)] hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left text-xs uppercase tracking-[0.2em] font-black text-[var(--muted)] hover:text-red-500 col-span-full justify-center mt-6 h-16 group"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Reset Preference
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[var(--bg)] border-t border-[var(--border)] text-center shrink-0">
              <p className="text-xs text-[var(--muted)] font-medium">
                The experience will deeply adapt to your selection. <span className="text-[var(--accent)] ml-1">United by the Game.</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

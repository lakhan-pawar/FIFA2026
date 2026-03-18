'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Activity, Flame, ShieldAlert, Star } from 'lucide-react';
import { SportsDBPlayer } from '@/lib/sportsdb';

interface PlayerModalProps {
  player: SportsDBPlayer | null;
  teamName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  rating: string;
  playstyle: string;
  characteristics: string[];
  weaknesses: string[];
  keyFact: string;
}

export function PlayerModal({
  player,
  teamName,
  isOpen,
  onClose,
}: PlayerModalProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen || !player) return;

    let isMounted = true;

    async function fetchAIProfile() {
      setLoading(true);
      setError(false);
      setProfile(null);

      try {
        const res = await fetch(
          `/api/player-profile?player=${encodeURIComponent(player!.strPlayer)}&team=${encodeURIComponent(teamName)}`
        );
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        if (isMounted) setProfile(data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAIProfile();

    return () => {
      isMounted = false;
    };
  }, [isOpen, player, teamName]);

  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        />

        {/* Modal/Sheet Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[var(--card)] rounded-t-[32px] sm:rounded-3xl pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden border border-[var(--border)] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="font-display font-bold text-lg flex items-center gap-2 text-[var(--text)]">
              <Activity className="w-5 h-5 text-[var(--accent)]" />
              Scouting Report
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[var(--bg-2)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto p-6 min-h-[300px]">
            {/* Player Identity Row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-2)] overflow-hidden shrink-0 border-2 border-[var(--border)] relative shadow-md">
                {player.strCutout ? (
                  <img
                    src={player.strCutout}
                    alt={player.strPlayer}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                    <User className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold leading-tight mb-1">
                  {player.strPlayer}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[var(--bg-2)] text-[var(--text-2)] text-xs font-bold rounded uppercase tracking-wide">
                    {player.strPosition}
                  </span>
                  {player.strNumber && (
                    <span className="text-sm font-medium text-[var(--muted)]">
                      #{player.strNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                <p className="text-sm text-[var(--muted)] animate-pulse">
                  Gemini AI is analyzing player data...
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                Could not generate AI scouting report at this time.
              </div>
            )}

            {profile && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Row */}
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                      AI Rating
                    </span>
                    <div className="font-display text-3xl font-bold text-[var(--accent)] flex items-end gap-1">
                      {profile.rating}{' '}
                      <span className="text-sm text-[var(--muted)] font-normal mb-1">
                        /100
                      </span>
                    </div>
                  </div>
                  <div className="flex-[2] p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] flex flex-col justify-center">
                    <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
                      Playstyle
                    </span>
                    <span className="font-display text-lg font-bold text-[var(--text)] leading-tight">
                      {profile.playstyle}
                    </span>
                  </div>
                </div>

                {/* Key Fact */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg)] border border-[var(--border)] relative overflow-hidden">
                  <Star className="absolute -right-4 -bottom-4 w-16 h-16 text-[var(--accent)] opacity-10" />
                  <p className="text-sm italic text-[var(--text-2)] leading-relaxed relative z-10">
                    "{profile.keyFact}"
                  </p>
                </div>

                {/* Characteristics */}
                <div className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-1.5 text-sm font-bold text-[var(--text)] mb-2 uppercase tracking-wide">
                      <Flame className="w-4 h-4 text-orange-500" /> Key
                      Strengths
                    </h4>
                    <ul className="grid gap-2">
                      {profile.characteristics.map((c, i) => (
                        <li
                          key={i}
                          className="px-3 py-2 bg-[var(--bg-2)] text-[var(--text-2)] text-sm rounded-lg border border-[var(--border)] shadow-sm"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-1.5 text-sm font-bold text-[var(--text)] mb-2 uppercase tracking-wide">
                      <ShieldAlert className="w-4 h-4 text-red-400" /> Notable
                      Weakness
                    </h4>
                    <ul className="grid gap-2">
                      {profile.weaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="px-3 py-2 bg-red-500/5 text-red-200/80 text-sm rounded-lg border border-red-500/20 shadow-sm"
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

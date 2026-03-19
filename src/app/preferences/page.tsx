'use client';

import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Bell, Heart, Check } from 'lucide-react';
import { useFavoriteTeam, TEAMS } from '@/context/FavoriteTeamContext';

interface Prefs {
  matchAlerts: boolean;
  goalAlerts: boolean;
  communityDigest: boolean;
  bracketReminders: boolean;
}

const DEFAULT_PREFS: Prefs = {
  matchAlerts: true,
  goalAlerts: true,
  communityDigest: false,
  bracketReminders: true,
};

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 touch-manipulation"
    >
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`w-11 h-6 rounded-full transition-colors relative ${
          on ? 'bg-[var(--c-accent)]' : 'bg-[var(--c-bg-subtle)]'
        } border border-[var(--c-border)]`}
      >
        <div
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
            on ? 'translate-x-[20px]' : 'translate-x-[2px]'
          }`}
        />
      </div>
    </button>
  );
}

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);
  const { teamId, setTeamId } = useFavoriteTeam();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kickoff-prefs');
      if (stored) setPrefs(JSON.parse(stored));
    } catch {
      /* first visit */
    }
  }, []);

  const save = (updated: Prefs) => {
    setPrefs(updated);
    localStorage.setItem('kickoff-prefs', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleTeam = (id: string) => {
    setTeamId(teamId === id ? null : id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePref = (key: keyof Prefs) => {
    save({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[var(--c-bg-surface)] border border-[var(--c-border)] flex items-center justify-center text-[var(--c-accent)] shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="page-title text-[var(--c-text-primary)]">Settings</h1>
          <p className="body-text text-[var(--c-text-tertiary)]">
            Personalize your KickoffTo experience
          </p>
        </div>
      </div>

      {/* Save indicator */}
      {saved && (
        <div className="flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[var(--c-accent-subtle)] border border-[var(--c-accent)]/20 w-fit badge-text text-[var(--c-accent)] shadow-sm">
          <Check className="w-3.5 h-3.5" /> Saved
        </div>
      )}

      {/* Theme */}
      <section className="mb-8">
        <h2 className="section-title mb-3 flex items-center gap-2 text-[var(--c-text-primary)]">
          <Moon className="w-5 h-5 text-[var(--c-accent)]" />
          Appearance
        </h2>
        <p className="body-text text-[var(--c-text-secondary)] mb-4">
          Theme is controlled by the toggle in the header. Use the 🌙/☀️ button
          top-right to switch.
        </p>
        <div className="flex gap-4">
          <div className="flex-1 p-4 rounded-xl bg-[#08080e] border border-white/10 text-center shadow-lg">
            <Moon className="w-6 h-6 mx-auto mb-2 text-[#00e5a0]" />
            <span className="badge-text text-[#b0b0c8]">Dark</span>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-[#f2f2f8] border border-black/5 text-center shadow-lg">
            <Sun className="w-6 h-6 mx-auto mb-2 text-[#009e6f]" />
            <span className="badge-text text-[#444460]">Light</span>
          </div>
        </div>
      </section>

      {/* Favorite teams */}
      <section className="mb-8">
        <h2 className="section-title mb-4 flex items-center gap-2 text-[var(--c-text-primary)]">
          <Heart className="w-5 h-5 text-rose-500" />
          Favorite Team
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {TEAMS.map((team) => {
            const selected = teamId === team.id;
            return (
              <button
                key={team.id}
                onClick={() => toggleTeam(team.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all touch-manipulation active:scale-95 shadow-sm border-[0.5px] ${
                  selected
                    ? 'bg-[var(--c-accent-subtle)] border-[var(--c-accent)] ring-1 ring-[var(--c-accent)]/20'
                    : 'bg-[var(--c-bg-surface)] border-[var(--c-border)] hover:border-[var(--c-accent)]/30'
                }`}
              >
                <span className="text-3xl">{team.flag}</span>
                <span className="badge-text text-[var(--c-text-primary)] truncate w-full text-center">
                  {team.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-10">
        <h2 className="section-title mb-4 flex items-center gap-2 text-[var(--c-text-primary)]">
          <Bell className="w-5 h-5 text-amber-500" />
          Notifications
        </h2>
        <div className="rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] px-4 divide-y divide-[var(--c-border)] shadow-sm">
          <Toggle
            on={prefs.matchAlerts}
            onToggle={() => togglePref('matchAlerts')}
            label="Match Kick-off Alerts"
          />
          <Toggle
            on={prefs.goalAlerts}
            onToggle={() => togglePref('goalAlerts')}
            label="Goal Notifications"
          />
          <Toggle
            on={prefs.communityDigest}
            onToggle={() => togglePref('communityDigest')}
            label="Community Digest"
          />
          <Toggle
            on={prefs.bracketReminders}
            onToggle={() => togglePref('bracketReminders')}
            label="Bracket Prediction Reminders"
          />
        </div>
      </section>

      <p className="text-xs text-[var(--muted)] text-center">
        All preferences are stored locally — no sign-up required.
      </p>
    </div>
  );
}

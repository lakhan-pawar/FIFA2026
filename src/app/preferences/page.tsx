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
          on ? 'bg-[var(--accent)]' : 'bg-[var(--bg-3)]'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            on ? 'translate-x-[22px]' : 'translate-x-0.5'
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
    <div className="w-full max-w-[600px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-3xl">Settings</h1>
          <p className="text-xs text-[var(--muted)]">
            Personalize your KickoffTo experience
          </p>
        </div>
      </div>

      {/* Save indicator */}
      {saved && (
        <div className="flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 w-fit text-xs font-medium text-[var(--accent)]">
          <Check className="w-3.5 h-3.5" /> Saved
        </div>
      )}

      {/* Theme */}
      <section className="mb-6">
        <h2 className="font-display text-lg mb-3 flex items-center gap-2">
          <Moon className="w-4 h-4 text-[var(--accent)]" />
          Appearance
        </h2>
        <p className="text-xs text-[var(--muted)] mb-3">
          Theme is controlled by the toggle in the header. Use the 🌙/☀️ button
          top-right to switch.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-xl bg-[#08080e] border border-[rgba(255,255,255,0.07)] text-center">
            <Moon className="w-5 h-5 mx-auto mb-1 text-[#00e5a0]" />
            <span className="text-[11px] text-[#b0b0c8]">Dark</span>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-[#f2f2f8] border border-[rgba(0,0,0,0.07)] text-center">
            <Sun className="w-5 h-5 mx-auto mb-1 text-[#009e6f]" />
            <span className="text-[11px] text-[#444460]">Light</span>
          </div>
        </div>
      </section>

      {/* Favorite teams */}
      <section className="mb-6">
        <h2 className="font-display text-lg mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[var(--accent-2)]" />
          Favorite Teams
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TEAMS.map((team) => {
            const selected = teamId === team.id;
            return (
              <button
                key={team.id}
                onClick={() => toggleTeam(team.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all touch-manipulation active:scale-95 ${
                  selected
                    ? 'bg-[var(--accent)]/15 border-2 border-[var(--accent)]'
                    : 'bg-[var(--card)] border-2 border-[var(--border)] hover:border-[var(--border-hover)]'
                }`}
              >
                <span className="text-2xl">{team.flag}</span>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {team.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <h2 className="font-display text-lg mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--gold)]" />
          Notifications
        </h2>
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] px-4 divide-y divide-[var(--border)]">
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

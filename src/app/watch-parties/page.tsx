'use client';

import { useState, useMemo } from 'react';
import { Navigation, Users, Tv, Utensils, TreePine, Wifi } from 'lucide-react';
import { TORONTO_VENUES } from '@/lib/constants';
import { useGeolocation } from '@/hooks/useGeolocation';

interface VenueData {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  amenities: readonly string[];
}

const VENUES: VenueData[] = TORONTO_VENUES.map((v) => ({
  ...v,
  amenities: v.amenities,
}));

// Simulated vibe data (deterministic by id)
const VIBE_DATA: Record<
  string,
  { rush: 'Chill' | 'Packed' | 'Legendary'; score: number }
> = {
  'real-sports': { rush: 'Legendary', score: 5 },
  'the-pint': { rush: 'Packed', score: 4 },
  'football-factory': { rush: 'Packed', score: 4 },
};

function getVibe(id: string) {
  return VIBE_DATA[id] ?? { rush: 'Chill', score: 3 };
}

const RUSH_CONFIG = {
  Chill: {
    color: '#00e5a0',
    bg: 'rgba(0,229,160,0.1)',
    border: 'rgba(0,229,160,0.25)',
    pulse: false,
  },
  Packed: {
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.1)',
    border: 'rgba(255,215,0,0.25)',
    pulse: true,
  },
  Legendary: {
    color: '#ff4d6d',
    bg: 'rgba(255,77,109,0.1)',
    border: 'rgba(255,77,109,0.3)',
    pulse: true,
  },
};

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Large Screens': <Tv className="w-3.5 h-3.5" />,
  'Multiple Screens': <Tv className="w-3.5 h-3.5" />,
  Food: <Utensils className="w-3.5 h-3.5" />,
  Licensed: <span className="text-xs">🍺</span>,
  Patio: <TreePine className="w-3.5 h-3.5" />,
  'Football Focused': <span className="text-xs">⚽</span>,
};

function VenueCard({
  venue,
  distance,
}: {
  venue: VenueData;
  distance?: number;
}) {
  const vibe = getVibe(venue.id);
  const rush = RUSH_CONFIG[vibe.rush];

  return (
    <div className="group p-5 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] hover:border-[var(--c-accent)]/30 transition-all shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="card-title text-[var(--c-text-primary)] mb-1 truncate">{venue.name}</h3>
          <p className="meta-text text-[var(--c-text-tertiary)] truncate">
            📍 {venue.address}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {/* Crowd-rush badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
            style={{
              color: rush.color,
              background: rush.bg,
              borderColor: rush.border,
            }}
          >
            {vibe.rush === 'Legendary' && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: rush.color }}
              />
            )}
            {vibe.rush === 'Packed' && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: rush.color }}
              />
            )}
            {vibe.rush}
          </div>
          {distance !== undefined && (
            <span className="badge-text text-[var(--c-accent)] bg-[var(--c-accent-subtle)] px-2 py-0.5 rounded-full border border-[var(--c-accent)]/10">
              {distance < 1
                ? `${Math.round(distance * 1000)}m`
                : `${distance.toFixed(1)}km`}
            </span>
          )}
        </div>
      </div>

      {/* Vibe Score */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < vibe.score ? 'opacity-100' : 'opacity-20'}`}
            >
              ⚽
            </span>
          ))}
        </div>
        <span className="meta-text text-[var(--c-text-tertiary)]">Vibe Score</span>
        <span className="meta-text text-[var(--c-text-tertiary)] ml-auto">
          Max fans: {venue.capacity}
        </span>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2">
        {venue.amenities.map((a) => (
          <span
            key={a}
            className="flex items-center gap-1.5 badge-text text-[var(--c-text-secondary)] bg-[var(--c-bg-subtle)] px-2.5 py-1 rounded-lg border border-[var(--c-border)]"
          >
            {amenityIcons[a] ?? <Wifi className="w-3 h-3" />}
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MapPage() {
  const { location, loading, getCurrentPosition } = useGeolocation();
  const [sortBy, setSortBy] = useState<'name' | 'distance' | 'vibe'>('vibe');

  const venuesWithDistance = useMemo(
    () =>
      VENUES.map((v) => ({
        ...v,
        distance: location
          ? getDistance(
              location.lat,
              location.lng,
              v.coordinates.lat,
              v.coordinates.lng
            )
          : undefined,
      })),
    [location]
  );

  const sorted = useMemo(() => {
    const list = [...venuesWithDistance];
    if (sortBy === 'distance' && location)
      list.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99));
    else if (sortBy === 'vibe')
      list.sort((a, b) => getVibe(b.id).score - getVibe(a.id).score);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [venuesWithDistance, sortBy, location]);

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-10 pb-24">
      {/* ── HEADER ── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 badge-text text-rose-500 uppercase mb-4">
          🍁 Toronto, Canada
        </div>
        <h1 className="page-title mb-2 text-[var(--c-text-primary)]">
          Watch <span className="text-rose-500">Parties</span>
        </h1>
        <p className="body-text text-[var(--c-text-secondary)] max-w-md">
          Find the best spots in Toronto to watch WC 2026. Sorted by vibe —
          because atmosphere matters as much as the scoreline.
        </p>
      </div>

      {/* ── LEGEND ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(
          Object.entries(RUSH_CONFIG) as [string, typeof RUSH_CONFIG.Chill][]
        ).map(([label, cfg]) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-text border"
            style={{
              color: cfg.color,
              background: cfg.bg,
              borderColor: cfg.border,
            }}
          >
            {(label === 'Packed' || label === 'Legendary') && (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: cfg.color }}
              />
            )}
            {label}
          </div>
        ))}
        <span className="meta-text text-[var(--c-text-tertiary)] flex items-center ml-1">
          crowd level
        </span>
      </div>

      {/* ── CONTROLS ── */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => {
            getCurrentPosition();
            setSortBy('distance');
          }}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all touch-manipulation disabled:opacity-50 shadow-lg shadow-rose-500/20"
        >
          <Navigation className="w-4 h-4" />
          {loading ? 'Locating...' : 'Nearest to Me'}
        </button>
        {(['vibe', 'name', 'distance'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            disabled={s === 'distance' && !location}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-[0.98] border shadow-sm ${
              sortBy === s
                ? 'bg-[var(--c-text-primary)] text-[var(--c-bg-surface)] border-[var(--c-text-primary)]'
                : 'bg-[var(--c-bg-surface)] text-[var(--c-text-tertiary)] border-[var(--c-border)] hover:border-[var(--c-accent)]/40 disabled:opacity-30'
            }`}
          >
            {s === 'vibe'
              ? '⚽ Best Vibe'
              : s === 'name'
                ? 'A–Z'
                : '📍 Nearest'}
          </button>
        ))}
      </div>

      {/* ── VENUE STATS ── */}
      <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
        <Users className="w-5 h-5 text-[var(--c-accent)]" />
        <span className="body-text text-[var(--c-text-primary)] font-semibold">
          {VENUES.length} venues found
        </span>
        <span className="text-[var(--c-text-tertiary)]">·</span>
        <span className="body-text text-[var(--c-text-tertiary)]">Toronto, ON</span>
        <span className="ml-auto meta-text text-[var(--c-text-tertiary)] opacity-60 uppercase">
          Simulated crowd
        </span>
      </div>

      {/* ── VENUE LIST ── */}
      <div className="flex flex-col gap-3">
        {sorted.map((venue) => (
          <VenueCard key={venue.id} venue={venue} distance={venue.distance} />
        ))}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';

interface FloodlightSweepProps {
  trigger?: boolean;   // re-trigger on route change
  duration?: number;   // ms, default 2200
}

export default function FloodlightSweep({
  trigger = true,
  duration = 2200,
}: FloodlightSweepProps) {

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), duration);
    return () => clearTimeout(t);
  }, [trigger, duration]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      pointerEvents: 'none', overflow: 'hidden',
    }}>

      {/* Ambient flicker overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,200,0.06) 0%, transparent 70%)',
        animation: `floodlightPulse ${duration}ms ease-in-out both`,
      }} />

      {/* Main sweep beam — left to right */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,220,0.18) 45%, rgba(255,255,200,0.22) 50%, rgba(255,255,220,0.18) 55%, transparent 100%)',
        animation: `floodlightSweep ${duration * 0.7}ms ease-in-out 0ms both`,
      }} />

      {/* Second sweep — slightly delayed */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, transparent 0%, rgba(200,240,255,0.10) 45%, rgba(220,245,255,0.14) 50%, rgba(200,240,255,0.10) 55%, transparent 100%)',
        animation: `floodlightSweep ${duration * 0.65}ms ease-in-out ${duration * 0.2}ms both`,
      }} />

      {/* Corner beam — top left */}
      <div style={{
        position: 'absolute', top: 0, left: '10%',
        width: '2px', height: '60vh',
        background: 'linear-gradient(180deg, rgba(255,255,200,0.5) 0%, transparent 100%)',
        transformOrigin: 'top center',
        animation: `floodBeam ${duration * 0.8}ms ease-in-out 0ms both`,
      }} />

      {/* Corner beam — top right */}
      <div style={{
        position: 'absolute', top: 0, right: '10%',
        width: '2px', height: '60vh',
        background: 'linear-gradient(180deg, rgba(255,255,200,0.5) 0%, transparent 100%)',
        transformOrigin: 'top center',
        animation: `floodBeam ${duration * 0.8}ms ease-in-out 0.15s both`,
        transform: 'scaleY(0)',
      }} />

    </div>
  );
}

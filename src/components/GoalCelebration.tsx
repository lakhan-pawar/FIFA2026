'use client';
import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  tx: number;
  ty: number;
  tr: number;
  delay: number;
  size: number;
}

const EMOJIS = ['⚽','🎉','🏆','⭐','🎊','💥','🔥','✨','🥅','👏'];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x: Math.random() * 100,
    tx: (Math.random() - 0.5) * 200,
    ty: -(Math.random() * 180 + 60),
    tr: (Math.random() - 0.5) * 720,
    delay: Math.random() * 0.4,
    size: Math.random() * 16 + 14,
  }));
}

interface GoalCelebrationProps {
  active: boolean;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  scorer?: string;
  onComplete?: () => void;
}

export default function GoalCelebration({
  active,
  homeTeam = 'Home',
  awayTeam = 'Away',
  homeScore = 0,
  awayScore = 0,
  scorer,
  onComplete,
}: GoalCelebrationProps) {

  const [visible,   setVisible]   = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) return;
    setParticles(makeParticles(24));
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: 'none', overflow: 'hidden',
    }}>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        animation: 'fadeIn 0.2s ease both',
      }} />

      {/* Confetti particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          bottom: '40%',
          left: `${p.x}%`,
          fontSize: `${p.size}px`,
          animation: `particleFly 1.8s ${p.delay}s ease-out both`,
          '--tx': `${p.tx}px`,
          '--ty': `${p.ty}px`,
          '--tr': `${p.tr}deg`,
        } as React.CSSProperties}>
          {p.emoji}
        </div>
      ))}

      {/* Center GOAL card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '12px',
        animation: 'goalTextPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* GOAL text */}
        <div style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 900, fontSize: '72px', lineHeight: 1,
          letterSpacing: '-2px',
          background: 'linear-gradient(135deg, var(--gold), #fff, var(--gold))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 24px rgba(245,197,24,0.8))',
          textShadow: 'none',
        }}>
          GOAL!
        </div>

        {/* Score card */}
        <div style={{
          padding: '16px 32px', borderRadius: '16px',
          background: 'rgba(13,17,23,0.90)',
          border: '1px solid rgba(245,197,24,0.5)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center',
          gap: '16px',
          boxShadow: '0 8px 40px rgba(245,197,24,0.3)',
          animation: 'goalFlash 1.2s ease-in-out 0.2s 2',
        }}>
          <span style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700, fontSize: '22px', color: '#fff',
          }}>{homeTeam}</span>

          <div style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 900, fontSize: '40px', lineHeight: 1,
            color: 'var(--gold)',
            overflow: 'hidden',
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            <span style={{ animation: 'scoreCountUp 0.4s 0.1s ease both' }}>
              {homeScore}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '28px' }}>
              -
            </span>
            <span style={{ animation: 'scoreCountUp 0.4s 0.2s ease both' }}>
              {awayScore}
            </span>
          </div>

          <span style={{
            fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700, fontSize: '22px', color: '#fff',
          }}>{awayTeam}</span>
        </div>

        {/* Scorer */}
        {scorer && (
          <div style={{
            fontSize: '15px', fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            animation: 'fadeSlideIn 0.4s 0.4s ease both',
          }}>
            ⚽ {scorer}
          </div>
        )}

        {/* Emoji row */}
        <div style={{
          display: 'flex', gap: '8px', fontSize: '28px',
          animation: 'fadeSlideIn 0.4s 0.6s ease both',
        }}>
          {['🎉','🏆','🎊','⭐','🎉'].map((e, i) => (
            <span key={i} style={{
              animation: `ballBounceAnim 0.6s ${i * 0.1}s ease-in-out infinite`,
            }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

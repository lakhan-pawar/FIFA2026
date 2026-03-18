'use client';

interface BallRollingLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function BallRollingLoader({
  size = 'md',
  label = 'Loading...',
}: BallRollingLoaderProps) {

  const dims = { sm: 24, md: 36, lg: 52 }[size];
  const trackW = { sm: 120, md: 180, lg: 260 }[size];
  const fontSize = { sm: '11px', md: '13px', lg: '15px' }[size];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '12px',
    }}>

      {/* Track */}
      <div style={{
        width: `${trackW}px`, position: 'relative',
        height: `${dims + 16}px`,
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center',
      }}>

        {/* Grass strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '4px', borderRadius: '2px', overflow: 'hidden',
          background: 'var(--accent)',
          opacity: 0.3,
        }}>
          {/* Moving grass lines */}
          <div style={{
            display: 'flex', gap: '8px', height: '100%',
            animation: 'grassSlide 0.8s linear infinite',
            width: '200%',
          }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{
                width: '6px', height: '100%',
                background: i % 2 === 0
                  ? 'rgba(26,107,60,0.6)' : 'rgba(26,107,60,0.3)',
                flexShrink: 0,
              }} />
            ))}
          </div>
        </div>

        {/* Ball shadow */}
        <div style={{
          position: 'absolute', bottom: '2px',
          left: '50%', transform: 'translateX(-50%)',
          width: `${dims * 0.8}px`, height: '4px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          animation: 'ballShadow 0.6s ease-in-out infinite',
        }} />

        {/* Soccer ball */}
        <div style={{
          fontSize: `${dims}px`, lineHeight: 1,
          position: 'absolute', bottom: '6px',
          animation: `
            ballRoll   1.6s ease-in-out infinite,
            ballBounceAnim 0.6s ease-in-out infinite
          `,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))',
          userSelect: 'none',
        }}>
          ⚽
        </div>
      </div>

      {/* Label */}
      {label && (
        <div style={{
          fontSize, color: 'var(--text-2)',
          fontWeight: 500, letterSpacing: '0.3px',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

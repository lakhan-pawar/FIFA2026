'use client';

interface LivePulseRingProps {
  color?: string;
  size?: number;
  label?: string;
  showLabel?: boolean;
}

export default function LivePulseRing({
  color = 'var(--live)',
  size = 8,
  label = 'LIVE',
  showLabel = true,
}: LivePulseRingProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {/* Dot + rings container */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Outer ring 1 — slowest */}
        <div
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            animation: 'liveRing 1.8s ease-out infinite',
            animationDelay: '0s',
          }}
        />

        {/* Outer ring 2 — medium */}
        <div
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            animation: 'liveRing2 1.8s ease-out infinite',
            animationDelay: '0.6s',
          }}
        />

        {/* Core dot */}
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: color,
            animation: 'liveDotPulse 1.2s ease-in-out infinite',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

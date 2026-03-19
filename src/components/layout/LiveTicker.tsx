'use client';

export function LiveTicker() {
  const daysToGo = Math.ceil(
    (new Date('2026-06-11').getTime() - new Date().getTime()) / 86400000
  );

  const items = [
    `WC2026 kicks off June 11, 2026 · ${daysToGo} days to go`,
    '48 teams · 104 matches · 16 host cities · 3 nations',
    "Canada's 2nd-ever World Cup — first on home soil",
    'Final: MetLife Stadium, NJ · July 19, 2026',
    'Opening match: Estadio Azteca, Mexico City · June 11',
  ];

  return (
    <div className="w-full bg-[var(--accent)] text-[var(--ticker-text)] h-[28px] overflow-hidden flex items-center fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="whitespace-nowrap animate-ticker inline-block hover:[animation-play-state:paused] font-mono text-[11px] sm:text-[13px] font-bold tracking-wide">
        {/* Render items twice for seamless loop */}
        {[...items, ...items, ...items].map((text, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="mx-8">{text}</span>
            <span className="opacity-30">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

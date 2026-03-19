'use client';

import { useMemo } from 'react';

export function LiveTicker() {
  const daysToGo = useMemo(() => Math.ceil(
    (new Date('2026-06-11').getTime() - new Date().getTime()) / 86400000
  ), []);

  const items = [
    `WC2026 kicks off June 11, 2026 - ${daysToGo} days to go`,
    '48 teams - 104 matches - 16 host cities - 3 nations',
    "Canada's 2nd-ever World Cup — first on home soil",
    'Final: MetLife Stadium, NJ - July 19, 2026',
    'Opening match: Estadio Azteca, Mexico City - June 11',
  ];

  return (
    <div className="w-full bg-[var(--c-ticker-bg)] text-[var(--c-ticker-text)] h-[28px] overflow-hidden flex items-center fixed top-0 left-0 right-0 z-50 shadow-sm border-b border-[var(--c-border)] select-none">
      <div className="flex whitespace-nowrap animate-ticker hover:[animation-play-state:paused]">
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center text-[11px] min-[481px]:text-[13px] font-medium tracking-wide">
            <span className="pl-8">{text}</span>
            <span className="pl-8 opacity-20">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

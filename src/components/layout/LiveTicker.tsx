'use client';

export function LiveTicker() {
  return (
    <div className="w-full bg-[var(--accent)] text-black h-[28px] overflow-hidden flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="whitespace-nowrap animate-ticker inline-block hover:[animation-play-state:paused] font-mono text-[13px] font-semibold tracking-wide">
        <span className="inline-flex items-center gap-2 mx-8">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse-live" />
          LIVE Arsenal 2–1 Man City · 73&apos;
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8">
          ⏸ HT Real Madrid 0–0 Bayern
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8 text-black/80">
          🏆 WC2026 · 92 days
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8 text-black/80">
          💬 14,200 fans discussing #ARSMCI
        </span>

        {/* duplicate for seamless loop */}
        <span className="inline-flex items-center gap-2 mx-8">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse-live" />
          LIVE Arsenal 2–1 Man City · 73&apos;
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8">
          ⏸ HT Real Madrid 0–0 Bayern
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8 text-black/80">
          🏆 WC2026 · 92 days
        </span>
        <span className="mx-8 opacity-40">|</span>
        <span className="inline-flex items-center gap-2 mx-8 text-black/80">
          💬 14,200 fans discussing #ARSMCI
        </span>
      </div>
    </div>
  );
}

import { Construction } from 'lucide-react';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 mb-6 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-[var(--shadow)]">
        <Construction className="w-8 h-8" />
      </div>
      <h1 className="font-display text-4xl mb-4 text-[var(--text)]">
        {title} <span className="text-[var(--accent)]">Coming Soon</span>
      </h1>
      <p className="text-[var(--muted)] max-w-md mx-auto leading-relaxed">
        We are currently rebuilding this feature to meet the new zero-friction,
        mobile-first standards. Check back shortly for updates.
      </p>
    </div>
  );
}

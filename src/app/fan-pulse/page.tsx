'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowBigUp, Clock, Loader2, RefreshCw } from 'lucide-react';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';

interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
}

const SUBREDDITS = ['All', 'r/soccer', 'r/CanadaSoccer', 'r/MLS', 'r/worldcup'];

const SUB_COLORS: Record<string, string> = {
  'r/soccer': '#ff4d6d',
  'r/CanadaSoccer': '#cc0000',
  'r/MLS': '#00e5a0',
  'r/worldcup': '#7c3aed',
};

function formatScore(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function getHoursAgo(utc: number) {
  return Math.max(1, Math.floor((Date.now() / 1000 - utc) / 3600));
}

const STATIC_FALLBACK_POSTS: RedditPost[] = [
  {
    id: 'fb1',
    subreddit: 'r/CanadaSoccer',
    title: "Canada's 2026 Squad depth: Is this the strongest roster we've ever seen?",
    author: 'MapleLeafMatrix',
    score: 1250,
    num_comments: 84,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 2,
    permalink: '#',
  },
  {
    id: 'fb2',
    subreddit: 'r/worldcup',
    title: 'Inside the 16 Host Venues: Which stadium will have the best atmosphere?',
    author: 'StadiumHopper',
    score: 892,
    num_comments: 156,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 5,
    permalink: '#',
  },
  {
    id: 'fb3',
    subreddit: 'r/soccer',
    title: '48 Teams Format: Genius expansion or Diluting the quality?',
    author: 'TacticalWizard',
    score: 2105,
    num_comments: 432,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 8,
    permalink: '#',
  },
  {
    id: 'fb4',
    subreddit: 'r/worldcup',
    title: '2026 Power Rankings: Brazil, France, or Argentina - who are the favorites?',
    author: 'EloExpert',
    score: 1540,
    num_comments: 210,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 12,
    permalink: '#',
  },
  {
    id: 'fb5',
    subreddit: 'r/soccer',
    title: 'VAR in 2026: FIFA confirms even more automated technology - Controversy incoming?',
    author: 'RefWatchdog',
    score: 3420,
    num_comments: 890,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 15,
    permalink: '#',
  },
  {
    id: 'fb6',
    subreddit: 'r/MLS',
    title: 'The Dark Horse candidates: Why Morocco or Japan could win it all in 2026.',
    author: 'UnderdogFan',
    score: 967,
    num_comments: 112,
    created_utc: Math.floor(Date.now() / 1000) - 3600 * 20,
    permalink: '#',
  },
];

// Keyword-based sentiment
function getSentiment(title: string): {
  label: 'Hype' | 'Debate' | 'Drama';
  color: string;
  emoji: string;
} {
  const t = title.toLowerCase();
  const drama = [
    'red card',
    'injury',
    'controversy',
    'ban',
    'suspended',
    'racist',
    'cheat',
    'crash',
    'fired',
    'resign',
    'disaster',
  ];
  const debate = [
    'vs',
    'better',
    'worst',
    'overrated',
    'underrated',
    'should',
    'think',
    'opinion',
    'hot take',
    'unpopular',
    'disagree',
  ];
  if (drama.some((w) => t.includes(w)))
    return { label: 'Drama', color: '#ff4d6d', emoji: '🔴' };
  if (debate.some((w) => t.includes(w)))
    return { label: 'Debate', color: '#ffd700', emoji: '🟡' };
  return { label: 'Hype', color: '#00e5a0', emoji: '🟢' };
}

// Extract trending topics from post titles
function extractTopics(posts: RedditPost[], favTeamName?: string): string[] {
  const keywords: Record<string, number> = {};
  const stop = new Set([
    'the',
    'a',
    'an',
    'is',
    'in',
    'at',
    'for',
    'to',
    'of',
    'and',
    'or',
    'but',
    'with',
    'on',
    'this',
    'that',
    'are',
    'was',
    'has',
    'have',
    'be',
    'it',
    'as',
    'i',
    'he',
    'she',
    'they',
  ]);
  posts.forEach((p) => {
    p.title.split(/\s+/).forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (clean.length > 3 && !stop.has(clean))
        keywords[clean] = (keywords[clean] || 0) + 1;
    });
  });
  const sorted = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  // Prioritize favorite team if present
  if (favTeamName) {
    const fav = favTeamName.toLowerCase();
    const favIdx = sorted.findIndex((t) => t.toLowerCase() === fav);
    if (favIdx !== -1) {
      const [item] = sorted.splice(favIdx, 1);
      sorted.unshift(item);
    } else {
      // Even if not "trending" by volume, force it if we want it first
      sorted.unshift(favTeamName);
    }
  }

  return sorted.slice(0, 8);
}

const TOPIC_EMOJIS = ['🔥', '📊', '⚡', '🏆', '🎯', '💬', '🌍', '⚽'];

function SkeletonCard() {
  return (
    <div className="p-4 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] animate-pulse shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-4 bg-[var(--c-bg-subtle)] rounded-full" />
        <div className="w-16 h-4 bg-[var(--c-bg-subtle)] rounded-full" />
        <div className="w-12 h-3 bg-[var(--c-bg-subtle)] rounded-full ml-auto" />
      </div>
      <div className="h-4 bg-[var(--c-bg-subtle)] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[var(--c-bg-subtle)] rounded w-1/2 mb-4" />
      <div className="flex items-center gap-4">
        <div className="w-10 h-3 bg-[var(--c-bg-subtle)] rounded" />
        <div className="w-10 h-3 bg-[var(--c-bg-subtle)] rounded" />
        <div className="w-20 h-3 bg-[var(--c-bg-subtle)] rounded ml-auto" />
      </div>
    </div>
  );
}

function PostCard({ post }: { post: RedditPost }) {
  const hoursAgo = getHoursAgo(post.created_utc);
  const sentiment = getSentiment(post.title);
  const subColor = SUB_COLORS[post.subreddit] ?? '#7c3aed';

  return (
    <a
      href={post.permalink === '#' ? undefined : `https://reddit.com${post.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] hover:border-[var(--c-accent)]/30 hover:bg-[var(--c-bg-subtle)]/30 transition-all touch-manipulation active:scale-[0.98] shadow-sm"
      onClick={(e) => post.permalink === '#' && e.preventDefault()}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="badge-text px-2 py-0.5 rounded-full border"
          style={{
            color: subColor,
            background: `${subColor}15`,
            borderColor: `${subColor}30`,
          }}
        >
          {post.subreddit}
        </span>
        {/* Sentiment dot */}
        <span
          className="badge-text px-2 py-0.5 rounded-full border flex items-center gap-1"
          style={{
            color: sentiment.color,
            background: `${sentiment.color}12`,
            borderColor: `${sentiment.color}25`,
          }}
        >
          {sentiment.emoji} {sentiment.label}
        </span>
        <span className="meta-text text-[var(--c-text-tertiary)] ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {hoursAgo}h ago
        </span>
      </div>
      <h3 className="card-title text-[var(--c-text-primary)] leading-snug mb-3 line-clamp-3">
        {post.title}
      </h3>
      <div className="flex items-center gap-4 meta-text text-[var(--c-text-secondary)]">
        <span className="flex items-center gap-1 font-bold text-[var(--c-accent)]">
          <ArrowBigUp className="w-4 h-4" />
          {formatScore(post.score)}
        </span>
        <span className="flex items-center gap-1">💬 {post.num_comments}</span>
        <span className="ml-auto truncate max-w-[100px] text-[var(--c-text-tertiary)]">
          u/{post.author}
        </span>
      </div>
    </a>
  );
}

export default function CommunityPage() {
  const { team } = useFavoriteTeam();
  const [activeSub, setActiveSub] = useState('All');
  const [activeSentiment, setActiveSentiment] = useState<'All' | 'Hype' | 'Debate' | 'Drama'>('All');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const controller = new AbortController();

    async function fetchPosts() {
      try {
        setLoading(true);
        // Minimum loading time of 1s for the skeleton effect, but up to 3s timeout
        const fetchPromise = fetch('/api/reddit', { signal: controller.signal });
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('timeout')), 3000);
        });

        const res = (await Promise.race([fetchPromise, timeoutPromise])) as Response;
        clearTimeout(timer);

        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
          setIsFallback(false);
          setLastUpdated(Date.now());
        } else {
          throw new Error('No posts');
        }
      } catch (err) {
        console.error('Failed to load posts, using fallback', err);
        setPosts(STATIC_FALLBACK_POSTS);
        setIsFallback(true);
        setLastUpdated(null);
      } finally {
        // Ensure skeletons show for at least 1s for visual stability
        setTimeout(() => setLoading(false), 800);
      }
    }

    fetchPosts();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [refreshKey]);

  const filtered = posts.filter((p) => {
    const subMatch = activeSub === 'All' || p.subreddit.toLowerCase() === activeSub.toLowerCase();
    const sentimentMatch = activeSentiment === 'All' || getSentiment(p.title).label === activeSentiment;
    return subMatch && sentimentMatch;
  });
  const topics = useMemo(
    () => extractTopics(posts, team?.name),
    [posts, team?.name]
  );

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 pb-24">
      {/* ── HEADER ── */}
      <div className="mb-8 relative">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border badge-text uppercase tracking-widest transition-colors ${
              isFallback
                ? 'bg-[var(--c-warning-bg)] border-[var(--c-warning-text)]/20 text-[var(--c-warning-text)]'
                : 'bg-[var(--c-accent-subtle)] border-[var(--c-accent)]/20 text-[var(--c-accent)]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block ${
                isFallback ? 'bg-[var(--c-warning-text)]' : 'bg-[var(--c-accent)]'
              }`}
            />
            {isFallback ? "Editor's Picks" : 'Live from r/worldcup'}
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--c-bg-surface)] border border-[var(--c-border)] badge-text text-[var(--c-text-primary)] hover:bg-[var(--c-bg-subtle)] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <h1 className="page-title mb-2 text-[var(--c-text-primary)]">
          Fan <span className="text-[var(--c-accent)]">Pulse</span>
        </h1>
        <div className="flex items-center justify-between gap-4">
          <p className="body-text text-[var(--c-text-secondary)]">
            Real talk from football&apos;s loudest corners of the internet.
          </p>
          {lastUpdated && !isFallback && (
            <p className="meta-text text-[var(--c-text-tertiary)]">
              Updated: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>

      {/* ── TRENDING TOPICS ── */}
      {topics.length > 0 && (
        <section className="mb-8">
          <p className="badge-text uppercase text-[var(--c-text-tertiary)] mb-3">
            🔥 Trending now
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={topic}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl badge-text bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] text-[var(--c-text-secondary)] hover:border-[var(--c-accent)]/30 transition-colors cursor-default shadow-sm"
              >
                {TOPIC_EMOJIS[i % TOPIC_EMOJIS.length]} {topic}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── SENTIMENT FILTERS ── */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-[var(--c-bg-surface)] border-[0.5px] border-[var(--c-border)] shadow-sm">
        <span className="badge-text text-[var(--c-text-tertiary)] uppercase tracking-wider">
          Filter:
        </span>
        {[
          { label: 'All', emoji: '🌐', color: 'var(--c-text-primary)' },
          { emoji: '🟢', label: 'Hype', color: '#00e5a0' },
          { emoji: '🟡', label: 'Debate', color: '#ffd700' },
          { emoji: '🔴', label: 'Drama', color: '#ff4d6d' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setActiveSentiment(s.label as any)}
            className={`flex items-center gap-1 badge-text px-2 py-1 rounded-md transition-all ${
              activeSentiment === s.label
                ? 'bg-[var(--c-bg-subtle)] ring-1 ring-[var(--c-border)]'
                : 'hover:bg-[var(--c-bg-subtle)]/50'
            }`}
            style={{ color: s.color }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* ── SUBREDDIT FILTERS ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {SUBREDDITS.map((sub) => {
          const col = SUB_COLORS[sub] ?? 'var(--c-text-primary)';
          const isActive = activeSub === sub;
          return (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className="px-3 py-1.5 rounded-full badge-text whitespace-nowrap transition-all touch-manipulation active:scale-95 border"
              style={
                isActive
                  ? { color: 'var(--c-accent-text)', background: col, borderColor: col }
                  : {
                      color: 'var(--c-text-tertiary)',
                      background: 'var(--c-bg-surface)',
                      borderColor: 'var(--c-border)',
                    }
              }
            >
              {sub}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length > 0 ? (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 bg-[var(--c-bg-surface)] rounded-xl border-[0.5px] border-[var(--c-border)] shadow-sm">
            <p className="body-text text-[var(--c-text-tertiary)]">No recent posts matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowBigUp, Clock, Loader2 } from 'lucide-react';
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
  return Math.floor((Date.now() / 1000 - utc) / 3600);
}

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

function PostCard({ post }: { post: RedditPost }) {
  const hoursAgo = getHoursAgo(post.created_utc);
  const sentiment = getSentiment(post.title);
  const subColor = SUB_COLORS[post.subreddit] ?? '#7c3aed';

  return (
    <a
      href={`https://reddit.com${post.permalink}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] transition-all touch-manipulation active:scale-[0.98]"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
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
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1"
          style={{
            color: sentiment.color,
            background: `${sentiment.color}12`,
            borderColor: `${sentiment.color}25`,
          }}
        >
          {sentiment.emoji} {sentiment.label}
        </span>
        <span className="text-[10px] text-[var(--muted)] ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {hoursAgo}h ago
        </span>
      </div>
      <h3 className="text-sm font-semibold text-[var(--text)] leading-snug mb-3 line-clamp-3">
        {post.title}
      </h3>
      <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1 font-bold text-[var(--accent)]">
          <ArrowBigUp className="w-4 h-4" />
          {formatScore(post.score)}
        </span>
        <span className="flex items-center gap-1">💬 {post.num_comments}</span>
        <span className="ml-auto truncate max-w-[100px] text-[var(--muted)]">
          u/{post.author}
        </span>
      </div>
    </a>
  );
}

export default function CommunityPage() {
  const { team } = useFavoriteTeam();
  const [activeSub, setActiveSub] = useState('All');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch('/api/reddit');
        const data = await res.json();
        if (data.posts) setPosts(data.posts);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered = posts.filter(
    (p) =>
      activeSub === 'All' ||
      p.subreddit.toLowerCase() === activeSub.toLowerCase()
  );
  const topics = useMemo(
    () => extractTopics(posts, team?.name),
    [posts, team?.name]
  );

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8 pb-24">
      {/* ── HEADER ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-3)]/10 border border-[var(--accent-3)]/20 text-[10px] font-bold text-[var(--accent-3)] uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-3)] animate-pulse inline-block" />
          Live from Reddit
        </div>
        <h1 className="font-display text-4xl mb-2">
          Fan <span className="text-[var(--accent-3)]">Pulse</span>
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Real talk from football&apos;s loudest corners of the internet.
        </p>
      </div>

      {/* ── TRENDING TOPICS ── */}
      {topics.length > 0 && (
        <section className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
            🔥 Trending now
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={topic}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--card)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-hover)] transition-colors cursor-default"
              >
                {TOPIC_EMOJIS[i % TOPIC_EMOJIS.length]} {topic}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── SENTIMENT LEGEND ── */}
      <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
          Sentiment:
        </span>
        {[
          { emoji: '🟢', label: 'Hype', color: '#00e5a0' },
          { emoji: '🟡', label: 'Debate', color: '#ffd700' },
          { emoji: '🔴', label: 'Drama', color: '#ff4d6d' },
        ].map((s) => (
          <span
            key={s.label}
            className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: s.color }}
          >
            {s.emoji} {s.label}
          </span>
        ))}
      </div>

      {/* ── SUBREDDIT FILTERS ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {SUBREDDITS.map((sub) => {
          const col = SUB_COLORS[sub] ?? 'var(--text)';
          const isActive = activeSub === sub;
          return (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all touch-manipulation active:scale-95 border"
              style={
                isActive
                  ? { color: '#fff', background: col, borderColor: col }
                  : {
                      color: 'var(--muted)',
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                    }
              }
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* ── POSTS ── */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[var(--muted)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-3)]" />
            <p className="text-sm">Fetching latest buzz…</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 text-[var(--muted)] bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <p className="text-sm">No recent posts for {activeSub}.</p>
          </div>
        )}
      </div>
    </div>
  );
}

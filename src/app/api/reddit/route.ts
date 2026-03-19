import { NextResponse } from 'next/server';

// Prevent this route from being statically generated
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // During build time or if Reddit API is unavailable, return mock data
    const response = await fetch(
      'https://www.reddit.com/r/soccer+CanadaSoccer+MLS+worldcup/hot.json?limit=25',
      {
        headers: {
          'User-Agent': 'KickoffTo Web App v1.0',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.warn(
        `Reddit API responded with status ${response.status}, returning mock data`
      );
      return NextResponse.json({ posts: getMockPosts() });
    }

    const data = await response.json();

    const posts = data.data.children
      .filter(
        (child: { data: { stickied: boolean; over_18: boolean } }) =>
          !child.data.stickied && !child.data.over_18
      )
      .map(
        (child: {
          data: {
            id: string;
            title: string;
            author: string;
            score: number;
            num_comments: number;
            created_utc: number;
            permalink: string;
            subreddit: string;
            subreddit_name_prefixed: string;
            url: string;
            is_video: boolean;
          };
        }) => {
          const d = child.data;
          return {
            id: d.id,
            title: d.title,
            author: d.author,
            score: d.score,
            num_comments: d.num_comments,
            subreddit: d.subreddit_name_prefixed,
            created_utc: d.created_utc,
            permalink: d.permalink,
            url: d.url,
            is_video: d.is_video,
          };
        }
      );

    return NextResponse.json({ posts });
  } catch (error) {
    console.warn('Reddit API Error, returning mock data:', error);
    // Return mock data instead of failing during build
    return NextResponse.json({ posts: getMockPosts() });
  }
}

// Mock data for when Reddit API is unavailable (during build or rate limiting)
function getMockPosts() {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      id: 'mock1',
      subreddit: 'r/CanadaSoccer',
      title: "Canada's 2026 Squad depth: Is this the strongest roster we've ever seen?",
      author: 'MapleLeafMatrix',
      score: 1250,
      num_comments: 84,
      created_utc: now - 3600 * 2,
      permalink: '/r/CanadaSoccer/comments/mock1/',
    },
    {
      id: 'mock2',
      subreddit: 'r/worldcup',
      title: 'Inside the 16 Host Venues: Which stadium will have the best atmosphere?',
      author: 'StadiumHopper',
      score: 892,
      num_comments: 156,
      created_utc: now - 3600 * 5,
      permalink: '/r/worldcup/comments/mock2/',
    },
    {
      id: 'mock3',
      subreddit: 'r/soccer',
      title: '48 Teams Format: Genius expansion or Diluting the quality?',
      author: 'TacticalWizard',
      score: 2105,
      num_comments: 432,
      created_utc: now - 3600 * 8,
      permalink: '/r/soccer/comments/mock3/',
    },
    {
      id: 'mock4',
      subreddit: 'r/worldcup',
      title: '2026 Power Rankings: Brazil, France, or Argentina - who are the favorites?',
      author: 'EloExpert',
      score: 1540,
      num_comments: 210,
      created_utc: now - 3600 * 12,
      permalink: '/r/worldcup/comments/mock4/',
    },
    {
      id: 'mock5',
      subreddit: 'r/soccer',
      title: 'VAR in 2026: FIFA confirms even more automated technology - Controversy incoming?',
      author: 'RefWatchdog',
      score: 3420,
      num_comments: 890,
      created_utc: now - 3600 * 15,
      permalink: '/r/soccer/comments/mock5/',
    },
    {
      id: 'mock6',
      subreddit: 'r/MLS',
      title: 'The Dark Horse candidates: Why Morocco or Japan could win it all in 2026.',
      author: 'UnderdogFan',
      score: 967,
      num_comments: 112,
      created_utc: now - 3600 * 20,
      permalink: '/r/MLS/comments/mock6/',
    },
  ];
}

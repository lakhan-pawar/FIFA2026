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
  return [
    {
      id: 'mock1',
      title: 'FIFA World Cup 2026 Qualification Updates',
      author: 'WorldCupBot',
      score: 1250,
      num_comments: 89,
      subreddit: 'r/worldcup',
      created_utc: Math.floor(Date.now() / 1000) - 3600,
      permalink:
        '/r/worldcup/comments/mock1/fifa_world_cup_2026_qualification_updates/',
      url: 'https://reddit.com/r/worldcup/comments/mock1/',
      is_video: false,
    },
    {
      id: 'mock2',
      title: 'Canada Soccer Team Preparation for 2026',
      author: 'CanadaSoccerFan',
      score: 890,
      num_comments: 156,
      subreddit: 'r/CanadaSoccer',
      created_utc: Math.floor(Date.now() / 1000) - 7200,
      permalink:
        '/r/CanadaSoccer/comments/mock2/canada_soccer_team_preparation_for_2026/',
      url: 'https://reddit.com/r/CanadaSoccer/comments/mock2/',
      is_video: false,
    },
    {
      id: 'mock3',
      title: 'MLS Players to Watch for World Cup 2026',
      author: 'MLSAnalyst',
      score: 567,
      num_comments: 78,
      subreddit: 'r/MLS',
      created_utc: Math.floor(Date.now() / 1000) - 10800,
      permalink:
        '/r/MLS/comments/mock3/mls_players_to_watch_for_world_cup_2026/',
      url: 'https://reddit.com/r/MLS/comments/mock3/',
      is_video: false,
    },
  ];
}

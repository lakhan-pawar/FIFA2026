import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
      throw new Error(`Reddit API responded with status ${response.status}`);
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
    console.error('Reddit API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit posts' },
      { status: 500 }
    );
  }
}

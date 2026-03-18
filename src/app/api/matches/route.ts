import { NextResponse } from 'next/server';

// Prevent this route from being statically generated
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We'll fetch English Premier League (eng.1) as our primary active league
    // since the World Cup isn't active yet.
    const res = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!res.ok) {
      console.warn(
        `ESPN API responded with status ${res.status}, returning mock data`
      );
      return NextResponse.json(getMockMatchData());
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.warn('ESPN API Route Error, returning mock data:', error);
    // Return mock data instead of failing during build
    return NextResponse.json(getMockMatchData());
  }
}

// Mock data for when ESPN API is unavailable (during build or rate limiting)
function getMockMatchData() {
  return {
    leagues: [
      {
        id: '1',
        name: 'English Premier League',
        slug: 'eng.1',
      },
    ],
    events: [
      {
        id: 'mock1',
        name: 'Arsenal vs Manchester City',
        shortName: 'ARS vs MCI',
        status: {
          type: {
            name: 'STATUS_FINAL',
            description: 'Final',
            id: '3',
          },
        },
        competitions: [
          {
            competitors: [
              {
                team: {
                  displayName: 'Arsenal',
                  abbreviation: 'ARS',
                },
                score: '2',
              },
              {
                team: {
                  displayName: 'Manchester City',
                  abbreviation: 'MCI',
                },
                score: '1',
              },
            ],
          },
        ],
      },
    ],
  };
}

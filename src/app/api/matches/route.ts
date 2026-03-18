import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We'll fetch English Premier League (eng.1) as our primary active league
    // since the World Cup isn't active yet.
    const res = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch from ESPN API: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('ESPN API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live matches' },
      { status: 500 }
    );
  }
}

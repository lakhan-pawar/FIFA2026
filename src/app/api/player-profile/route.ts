import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const isPlaceholderKey =
  !apiKey || apiKey.includes('your_') || apiKey === 'fallback';

export const dynamic = 'force-dynamic';

const groq = !isPlaceholderKey
  ? new Groq({ apiKey })
  : null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const player = searchParams.get('player');
  const team = searchParams.get('team');

  if (!player || !team) {
    return NextResponse.json(
      { error: 'Player and team name are required' },
      { status: 400 }
    );
  }

  // Handle Missing API Key Gracefully
  if (isPlaceholderKey || !groq) {
    console.warn(
      'GROQ_API_KEY is missing or placeholder. Returning fallback profiling data.'
    );
    return NextResponse.json({
      rating: '85',
      playstyle: 'Undefined (API Key Needed)',
      characteristics: [
        'High Work Rate',
        'Add GROQ_API_KEY',
        'To See Real Answers',
      ],
      weaknesses: ['No API Key Found'],
      keyFact:
        'Groq API strictly requires a valid key to analyze real player data.',
    });
  }

  try {
    const prompt = `You are an elite football (soccer) scout reporting on world cup teams. 
Analyze the player "${player}" who plays for the national team "${team}". 
Respond ONLY with a valid JSON object matching the following structure exactly. Do not use markdown blocks, just raw JSON.
{
  "rating": "A string containing a number out of 100 (e.g. '88')",
  "playstyle": "A 2-3 word string describing their primary role (e.g., 'Box-to-Box Midfielder', 'Sweeper Keeper', 'Target Man')",
  "characteristics": ["An array of exactly 3 short strings detailing their biggest strengths"],
  "weaknesses": ["An array of exactly 1 short string detailing their biggest weakness"],
  "keyFact": "A single sentence containing an incredibly interesting fact about their career, playing style, or achievements"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional football scout. Respond ONLY with raw JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Lower temperature for consistent JSON
      response_format: { type: 'json_object' }
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error generating player profile:', error);
    // Even on error, return a graceful 200 fallback so the UI shows something stable
    return NextResponse.json({
      rating: '85',
      playstyle: 'Scout Offline',
      characteristics: ['Hard Worker', 'Team Player', 'Tactical'],
      weaknesses: ['Data Sync issues'],
      keyFact:
        'We are currently using local scouting records while the AI scout is refreshing. (Check GROQ_API_KEY)',
    });
  }
}

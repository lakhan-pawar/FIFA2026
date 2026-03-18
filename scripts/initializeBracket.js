// Script to initialize World Cup 2026 bracket data
// Run with: node scripts/initializeBracket.js

const { createClient } = require('@supabase/supabase-js');

// Bracket data structure
const WORLD_CUP_2026 = {
  TOURNAMENT_ID: 'wc2026',
  TOURNAMENT_NAME: 'FIFA World Cup 2026',
  YEAR: 2026,
};

// Sample teams
const sampleTeams = [
  { id: 't1', name: 'Canada', code: 'CAN', group: 'A', groupPosition: 1 },
  { id: 't2', name: 'USA', code: 'USA', group: 'B', groupPosition: 1 },
  { id: 't3', name: 'Mexico', code: 'MEX', group: 'C', groupPosition: 1 },
  { id: 't4', name: 'Brazil', code: 'BRA', group: 'D', groupPosition: 1 },
  { id: 't5', name: 'Argentina', code: 'ARG', group: 'E', groupPosition: 1 },
  { id: 't6', name: 'England', code: 'ENG', group: 'F', groupPosition: 1 },
  { id: 't7', name: 'France', code: 'FRA', group: 'G', groupPosition: 1 },
  { id: 't8', name: 'Germany', code: 'GER', group: 'H', groupPosition: 1 },
  { id: 't9', name: 'Spain', code: 'ESP', group: 'A', groupPosition: 2 },
  { id: 't10', name: 'Portugal', code: 'POR', group: 'B', groupPosition: 2 },
  { id: 't11', name: 'Netherlands', code: 'NED', group: 'C', groupPosition: 2 },
  { id: 't12', name: 'Italy', code: 'ITA', group: 'D', groupPosition: 2 },
  { id: 't13', name: 'Belgium', code: 'BEL', group: 'E', groupPosition: 2 },
  { id: 't14', name: 'Croatia', code: 'CRO', group: 'F', groupPosition: 2 },
  { id: 't15', name: 'Uruguay', code: 'URU', group: 'G', groupPosition: 2 },
  { id: 't16', name: 'Colombia', code: 'COL', group: 'H', groupPosition: 2 },
  { id: 't17', name: 'Japan', code: 'JPN', group: 'A', groupPosition: 3 },
  { id: 't18', name: 'South Korea', code: 'KOR', group: 'B', groupPosition: 3 },
  { id: 't19', name: 'Australia', code: 'AUS', group: 'C', groupPosition: 3 },
  { id: 't20', name: 'Morocco', code: 'MAR', group: 'D', groupPosition: 3 },
  { id: 't21', name: 'Senegal', code: 'SEN', group: 'E', groupPosition: 3 },
  { id: 't22', name: 'Switzerland', code: 'SUI', group: 'F', groupPosition: 3 },
  { id: 't23', name: 'Denmark', code: 'DEN', group: 'G', groupPosition: 3 },
  { id: 't24', name: 'Poland', code: 'POL', group: 'H', groupPosition: 3 },
  { id: 't25', name: 'Ecuador', code: 'ECU', group: 'A', groupPosition: 4 },
  { id: 't26', name: 'Chile', code: 'CHI', group: 'B', groupPosition: 4 },
  { id: 't27', name: 'Peru', code: 'PER', group: 'C', groupPosition: 4 },
  { id: 't28', name: 'Nigeria', code: 'NGA', group: 'D', groupPosition: 4 },
  { id: 't29', name: 'Ghana', code: 'GHA', group: 'E', groupPosition: 4 },
  { id: 't30', name: 'Cameroon', code: 'CMR', group: 'F', groupPosition: 4 },
  { id: 't31', name: 'Tunisia', code: 'TUN', group: 'G', groupPosition: 4 },
  { id: 't32', name: 'Costa Rica', code: 'CRC', group: 'H', groupPosition: 4 },
];

function generateInitialBracket() {
  const matches = [];
  let matchNumber = 1;

  // Round of 32 (16 matches)
  for (let i = 0; i < 16; i++) {
    matches.push({
      id: `r32-${i + 1}`,
      matchNumber: matchNumber++,
      stage: 'round_of_32',
      homeTeam: sampleTeams[i * 2] || null,
      awayTeam: sampleTeams[i * 2 + 1] || null,
      homeScore: null,
      awayScore: null,
      penaltyHomeScore: null,
      penaltyAwayScore: null,
      winner: null,
      status: 'scheduled',
      scheduledDate: '2026-06-20T00:00:00Z',
      venue: 'TBD',
      nextMatchId: `r16-${Math.floor(i / 2) + 1}`,
      position: { round: 0, index: i },
    });
  }

  // Round of 16 (8 matches)
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: `r16-${i + 1}`,
      matchNumber: matchNumber++,
      stage: 'round_of_16',
      homeTeam: null,
      awayTeam: null,
      homeScore: null,
      awayScore: null,
      penaltyHomeScore: null,
      penaltyAwayScore: null,
      winner: null,
      status: 'scheduled',
      scheduledDate: '2026-06-27T00:00:00Z',
      venue: 'TBD',
      nextMatchId: `qf-${Math.floor(i / 2) + 1}`,
      position: { round: 1, index: i },
    });
  }

  // Quarter Finals (4 matches)
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `qf-${i + 1}`,
      matchNumber: matchNumber++,
      stage: 'quarter_finals',
      homeTeam: null,
      awayTeam: null,
      homeScore: null,
      awayScore: null,
      penaltyHomeScore: null,
      penaltyAwayScore: null,
      winner: null,
      status: 'scheduled',
      scheduledDate: '2026-07-04T00:00:00Z',
      venue: 'TBD',
      nextMatchId: `sf-${Math.floor(i / 2) + 1}`,
      position: { round: 2, index: i },
    });
  }

  // Semi Finals (2 matches)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `sf-${i + 1}`,
      matchNumber: matchNumber++,
      stage: 'semi_finals',
      homeTeam: null,
      awayTeam: null,
      homeScore: null,
      awayScore: null,
      penaltyHomeScore: null,
      penaltyAwayScore: null,
      winner: null,
      status: 'scheduled',
      scheduledDate: '2026-07-11T00:00:00Z',
      venue: 'TBD',
      nextMatchId: 'final',
      position: { round: 3, index: i },
    });
  }

  // Third Place Match
  matches.push({
    id: 'third-place',
    matchNumber: matchNumber++,
    stage: 'third_place',
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    penaltyHomeScore: null,
    penaltyAwayScore: null,
    winner: null,
    status: 'scheduled',
    scheduledDate: '2026-07-18T00:00:00Z',
    venue: 'TBD',
    nextMatchId: null,
    position: { round: 4, index: 0 },
  });

  // Final
  matches.push({
    id: 'final',
    matchNumber: matchNumber++,
    stage: 'final',
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    penaltyHomeScore: null,
    penaltyAwayScore: null,
    winner: null,
    status: 'scheduled',
    scheduledDate: '2026-07-19T00:00:00Z',
    venue: 'MetLife Stadium, New Jersey',
    nextMatchId: null,
    position: { round: 4, index: 1 },
  });

  return matches;
}

async function initializeBracket() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Initializing World Cup 2026 bracket...');

    const bracketData = {
      tournament_id: WORLD_CUP_2026.TOURNAMENT_ID,
      name: WORLD_CUP_2026.TOURNAMENT_NAME,
      year: WORLD_CUP_2026.YEAR,
      structure: {
        matches: generateInitialBracket(),
      },
      is_active: true,
    };

    // Check if bracket already exists
    const { data: existing } = await supabase
      .from('tournament_brackets')
      .select('id')
      .eq('tournament_id', WORLD_CUP_2026.TOURNAMENT_ID)
      .single();

    if (existing) {
      console.log('Bracket already exists, updating...');
      const { error } = await supabase
        .from('tournament_brackets')
        .update(bracketData)
        .eq('tournament_id', WORLD_CUP_2026.TOURNAMENT_ID);

      if (error) throw error;
      console.log('✅ Bracket updated successfully!');
    } else {
      console.log('Creating new bracket...');
      const { error } = await supabase
        .from('tournament_brackets')
        .insert(bracketData);

      if (error) throw error;
      console.log('✅ Bracket created successfully!');
    }

    console.log(`Tournament ID: ${WORLD_CUP_2026.TOURNAMENT_ID}`);
    console.log(`Total matches: ${bracketData.structure.matches.length}`);
    console.log('Bracket is ready for predictions!');
  } catch (error) {
    console.error('❌ Error initializing bracket:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeBracket();

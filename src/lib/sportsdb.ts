export interface SportsDBPlayer {
  idPlayer: string;
  strPlayer: string;
  strPosition: string;
  strThumb: string | null;
  strCutout: string | null;
  strRender: string | null;
  strNumber: string | null;
  dateBorn: string;
  strBirthLocation: string;
  strDescriptionEN: string;
  strKit: string;
  strAgent: string;
}

export interface SportsDBTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strManager: string;
  intFormedYear: string;
  strStadium: string;
  strDescriptionEN: string;
}

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3'; // Using free tier v3 endpoints

export async function fetchTeamDetails(
  teamId: string
): Promise<SportsDBTeam | null> {
  try {
    const res = await fetch(`${API_BASE}/lookupteam.php?id=${teamId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.teams?.[0] || null;
  } catch (err) {
    console.error(`Failed to fetch team details for ${teamId}:`, err);
    return null;
  }
}

export async function fetchTeamSquad(
  teamId: string
): Promise<SportsDBPlayer[]> {
  try {
    const res = await fetch(`${API_BASE}/lookup_all_players.php?id=${teamId}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.player || [];
  } catch (err) {
    console.error(`Failed to fetch squad for team ${teamId}:`, err);
    return [];
  }
}

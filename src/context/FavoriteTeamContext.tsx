'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useTheme } from 'next-themes';

export interface TeamInfo {
  id: string;
  name: string;
  flag: string;
  flagCode: string; // alpha-2 code for FlagCDN
  colors: {
    primary: string; // Main accent color (HEX)
    secondary: string; // Glow/Secondary (HEX)
    text: 'black' | 'white'; // Contrast text for primary background
  };
}

export const TEAMS: TeamInfo[] = [
  // North America (Hosts)
  {
    id: '133660',
    name: 'Canada',
    flag: '🇨🇦',
    flagCode: 'ca',
    colors: { primary: '#ef4444', secondary: '#991b1b', text: 'white' },
  },
  {
    id: '133602',
    name: 'USA',
    flag: '🇺🇸',
    flagCode: 'us',
    colors: { primary: '#002868', secondary: '#bf0a30', text: 'white' },
  },
  {
    id: '133621',
    name: 'Mexico',
    flag: '🇲🇽',
    flagCode: 'mx',
    colors: { primary: '#006847', secondary: '#ce1126', text: 'white' },
  },

  // South America
  {
    id: '133604',
    name: 'Argentina',
    flag: '🇦🇷',
    flagCode: 'ar',
    colors: { primary: '#75aadb', secondary: '#ffb81c', text: 'black' },
  },
  {
    id: '133612',
    name: 'Brazil',
    flag: '🇧🇷',
    flagCode: 'br',
    colors: { primary: '#ffdf00', secondary: '#009b3a', text: 'black' },
  },
  {
    id: '133615',
    name: 'Uruguay',
    flag: '🇺🇾',
    flagCode: 'uy',
    colors: { primary: '#0038a8', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133614',
    name: 'Colombia',
    flag: '🇨🇴',
    flagCode: 'co',
    colors: { primary: '#fcd116', secondary: '#003893', text: 'black' },
  },
  {
    id: '133616',
    name: 'Chile',
    flag: '🇨🇱',
    flagCode: 'cl',
    colors: { primary: '#da291c', secondary: '#0039a6', text: 'white' },
  },

  // Europe
  {
    id: '133601',
    name: 'Spain',
    flag: '🇪🇸',
    flagCode: 'es',
    colors: { primary: '#aa151b', secondary: '#f1bf00', text: 'white' },
  },
  {
    id: '133608',
    name: 'France',
    flag: '🇫🇷',
    flagCode: 'fr',
    colors: { primary: '#002395', secondary: '#ed2939', text: 'white' },
  },
  {
    id: '133609',
    name: 'Germany',
    flag: '🇩🇪',
    flagCode: 'de',
    colors: { primary: '#000000', secondary: '#ffcc00', text: 'white' },
  },
  {
    id: '133610',
    name: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    flagCode: 'gb-eng',
    colors: { primary: '#ffffff', secondary: '#ce1124', text: 'black' },
  },
  {
    id: '133611',
    name: 'Portugal',
    flag: '🇵🇹',
    flagCode: 'pt',
    colors: { primary: '#ff0000', secondary: '#006600', text: 'white' },
  },
  {
    id: '133600',
    name: 'Italy',
    flag: '🇮🇹',
    flagCode: 'it',
    colors: { primary: '#008c45', secondary: '#0062cc', text: 'white' },
  },
  {
    id: '133603',
    name: 'Netherlands',
    flag: '🇳🇱',
    flagCode: 'nl',
    colors: { primary: '#f36c21', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133605',
    name: 'Belgium',
    flag: '🇧🇪',
    flagCode: 'be',
    colors: { primary: '#000000', secondary: '#ffd900', text: 'white' },
  },
  {
    id: '133606',
    name: 'Croatia',
    flag: '🇭🇷',
    flagCode: 'hr',
    colors: { primary: '#ff0000', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133607',
    name: 'Portugal',
    flag: '🇵🇹',
    flagCode: 'pt',
    colors: { primary: '#ff0000', secondary: '#33ff33', text: 'white' },
  }, // Fixed duplicate logic

  // Africa
  {
    id: '133652',
    name: 'Morocco',
    flag: '🇲🇦',
    flagCode: 'ma',
    colors: { primary: '#c1272d', secondary: '#006233', text: 'white' },
  },
  {
    id: '133653',
    name: 'Senegal',
    flag: '🇸🇳',
    flagCode: 'sn',
    colors: { primary: '#00853f', secondary: '#fdef42', text: 'white' },
  },
  {
    id: '133651',
    name: 'Tunisia',
    flag: '🇹🇳',
    flagCode: 'tn',
    colors: { primary: '#e70013', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133654',
    name: 'Cameroon',
    flag: '🇨🇲',
    flagCode: 'cm',
    colors: { primary: '#007a5e', secondary: '#ce1126', text: 'white' },
  },
  {
    id: '133655',
    name: 'Ghana',
    flag: '🇬🇭',
    flagCode: 'gh',
    colors: { primary: '#ef3340', secondary: '#ffd100', text: 'white' },
  },
  {
    id: '133656',
    name: 'Egypt',
    flag: '🇪🇬',
    flagCode: 'eg',
    colors: { primary: '#c09304', secondary: '#000000', text: 'white' },
  },

  // Asia
  {
    id: '133618',
    name: 'Japan',
    flag: '🇯🇵',
    flagCode: 'jp',
    colors: { primary: '#bc002d', secondary: '#000000', text: 'white' },
  },
  {
    id: '133619',
    name: 'South Korea',
    flag: '🇰🇷',
    flagCode: 'kr',
    colors: { primary: '#cd2e3a', secondary: '#0047a0', text: 'white' },
  },
  {
    id: '133617',
    name: 'Australia',
    flag: '🇦🇺',
    flagCode: 'au',
    colors: { primary: '#00008b', secondary: '#ffd700', text: 'white' },
  },
  {
    id: '133620',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    flagCode: 'sa',
    colors: { primary: '#006c35', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '134261',
    name: 'Qatar',
    flag: '🇶🇦',
    flagCode: 'qa',
    colors: { primary: '#8d1b3d', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133622',
    name: 'Iran',
    flag: '🇮🇷',
    flagCode: 'ir',
    colors: { primary: '#239f40', secondary: '#da0000', text: 'white' },
  },

  // Others / Popular
  {
    id: '133623',
    name: 'Nigeria',
    flag: '🇳🇬',
    flagCode: 'ng',
    colors: { primary: '#008751', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133624',
    name: 'Poland',
    flag: '🇵🇱',
    flagCode: 'pl',
    colors: { primary: '#dc143c', secondary: '#ffffff', text: 'black' },
  },
  {
    id: '133625',
    name: 'Sweden',
    flag: '🇸🇪',
    flagCode: 'se',
    colors: { primary: '#006aa7', secondary: '#fecc00', text: 'white' },
  },
  {
    id: '133626',
    name: 'Switzerland',
    flag: '🇨🇭',
    flagCode: 'ch',
    colors: { primary: '#ff0000', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133627',
    name: 'Denmark',
    flag: '🇩🇰',
    flagCode: 'dk',
    colors: { primary: '#c60c30', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133628',
    name: 'Turkey',
    flag: '🇹🇷',
    flagCode: 'tr',
    colors: { primary: '#e30a17', secondary: '#ffffff', text: 'white' },
  },
  {
    id: '133629',
    name: 'Ukraine',
    flag: '🇺🇦',
    flagCode: 'ua',
    colors: { primary: '#0057b7', secondary: '#ffd700', text: 'white' },
  },
  {
    id: '133630',
    name: 'Wales',
    flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    flagCode: 'gb-wls',
    colors: { primary: '#ae2630', secondary: '#00ad50', text: 'white' },
  },
  {
    id: '133631',
    name: 'Scotland',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    flagCode: 'gb-sct',
    colors: { primary: '#005eb8', secondary: '#ffffff', text: 'white' },
  },
];

interface FavoriteTeamContextType {
  teamId: string | null;
  setTeamId: (id: string | null) => void;
  team: TeamInfo | null;
}

const FavoriteTeamContext = createContext<FavoriteTeamContextType | undefined>(
  undefined
);

// Helper to convert hex to RGB channels for CSS opacity support
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

// Generates a deep surface color by blending team color with black or white
function generateDeepTheme(
  hex: string,
  alpha: number,
  isLight: boolean = false
) {
  const rgb = hexToRgb(hex)
    .split(',')
    .map((s) => parseInt(s.trim()));
  // Blend with black (#08080e approx 8,8,14) or white (255,255,255)
  const baseR = isLight ? 242 : 8;
  const baseG = isLight ? 242 : 8;
  const baseB = isLight ? 248 : 14;

  const r = Math.round(rgb[0] * alpha + baseR * (1 - alpha));
  const g = Math.round(rgb[1] * alpha + baseG * (1 - alpha));
  const b = Math.round(rgb[2] * alpha + baseB * (1 - alpha));
  return `rgb(${r}, ${g}, ${b})`;
}

export function FavoriteTeamProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamIdState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kickoff-team');
      if (stored) setTeamIdState(stored);
    } catch {}
  }, []);

  const setTeamId = (id: string | null) => {
    setTeamIdState(id);
    if (id) {
      localStorage.setItem('kickoff-team', id);
    } else {
      localStorage.removeItem('kickoff-team');
    }
  };

  const team = teamId ? TEAMS.find((t) => t.id === teamId) || null : null;
  const { theme, resolvedTheme } = useTheme();
  const isLight = (theme || resolvedTheme) === 'light';

  const primaryRgb = team ? hexToRgb(team.colors.primary) : '0, 229, 160';
  const secondaryRgb = team ? hexToRgb(team.colors.secondary) : '255, 77, 109';

  // Calculate deep surface colors when a team is selected
  const teamBg = team
    ? generateDeepTheme(team.colors.primary, 0.04, isLight)
    : 'var(--bg)';
  const teamBg2 = team
    ? generateDeepTheme(team.colors.primary, 0.08, isLight)
    : 'var(--bg-2)';
  const teamCard = team
    ? generateDeepTheme(team.colors.primary, 0.12, isLight)
    : 'var(--card)';
  const teamCardHover = team
    ? generateDeepTheme(team.colors.primary, 0.18, isLight)
    : 'var(--card-hover)';

  return (
    <FavoriteTeamContext.Provider value={{ teamId, setTeamId, team }}>
      <div
        style={
          {
            '--team-primary': team?.colors.primary || 'var(--accent)',
            '--team-secondary': team?.colors.secondary || 'var(--accent-2)',
            '--team-primary-rgb': primaryRgb,
            '--team-secondary-rgb': secondaryRgb,
            '--team-text':
              team?.colors.text === 'black' ? '#000000' : '#ffffff',
            '--team-bg': teamBg,
            '--team-bg-2': teamBg2,
            '--team-card': teamCard,
            '--team-card-hover': teamCardHover,
          } as any
        }
        className="contents"
      >
        {/* Animated Mesh Layer */}
        <div
          className="team-pride-layer"
          style={{ opacity: team ? 0.6 : 0.15 } as any}
        >
          <div className="team-mesh-1" />
          <div className="team-mesh-2" />
        </div>
        {children}
      </div>
    </FavoriteTeamContext.Provider>
  );
}

export function useFavoriteTeam() {
  const context = useContext(FavoriteTeamContext);
  if (context === undefined) {
    throw new Error(
      'useFavoriteTeam must be used within a FavoriteTeamProvider'
    );
  }
  return context;
}

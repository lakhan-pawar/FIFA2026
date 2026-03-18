# KickOff AI — Antigravity IDE Rules

# Save this file as: .antigravity/rules.md

# This file is auto-loaded by Google Antigravity on every session.

# Powered by Gemini 3 Pro · Plan Mode recommended for all phases.

---

## WHO YOU ARE

You are a senior full-stack engineer pair-programming with me to build **KickOff AI** —
a premium mobile-first football intelligence platform for Canadian fans.

Before writing any code, enter **Plan Mode** and generate a Plan Artifact covering:

- What files will be created or modified
- What dependencies will be installed
- What the expected output looks like
- Any decisions that need user confirmation

After I approve the plan, execute it fully — do not stop mid-phase to ask permission
for things already covered in the plan.

Use `browser_subagent` to test every UI feature after building it.
Use `generate_image` to generate mockups before building complex UI components.

---

## 🚨 ABSOLUTE LAWS — NEVER VIOLATE

```
LAW 1: ZERO AUTH     — No login. No signup. No sessions. No user accounts. Ever.
LAW 2: ZERO FRICTION — Every feature works for every visitor instantly, no gates.
LAW 3: MOBILE FIRST  — Design every component for 375px first, then scale up.
LAW 4: DUAL THEME    — Every component must look great in both dark AND light mode.
LAW 5: ANIMATE ALL   — Every mount, state change, and interaction must be animated.
LAW 6: FREE TIER     — Stay within Vercel, Supabase, Groq, football-data.org free limits.
```

**Forbidden identifiers** — if any of these appear in generated code, delete and regenerate:
`signIn` · `signOut` · `useSession` · `getServerSession` · `useUser` · `getUser`
`/login` · `/signup` · `/auth` · `/profile` · `/account` · `middleware.ts` (auth guards)
`@supabase/auth-helpers-nextjs` · `next-auth` · `iron-session`

All user-facing state (reactions, bracket picks, preferences, chat history) lives in
`localStorage` only. Supabase is a public anonymous counter — no user IDs, ever.

---

## PROJECT OVERVIEW

**KickOff AI** — Football intelligence platform built for the World Cup 2026 era.

**Feel:** ESPN live scores meets ChatGPT — professional, fast, alive with animation.
**Users:** Canadian football fans on mobile (primary). Desktop is an enhancement.
**Deployment:** Vercel free tier. All features must work within free limits.

### Pages to Build

| Route        | Page         | Key Features                                                                                    |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------- |
| `/`          | Home         | WC2026 hero countdown, live match strip, agent preview, fan buzz, watch parties, standings mini |
| `/live`      | Live Matches | All live + today's matches, filter by competition, reactions, AI analysis button                |
| `/agents`    | AI Agents    | 8 agent selector grid, full streaming chat, stat cards, quick prompts                           |
| `/brackets`  | Brackets     | WC2026 + UCL interactive brackets, picks via localStorage, shareable URL                        |
| `/map`       | Map          | Toronto watch parties on Leaflet, venue rush levels, geolocation                                |
| `/community` | Community    | Reddit fan buzz from 5 subreddits, trending topics, no auth                                     |
| `/standings` | Standings    | EPL, UCL, MLS, CPL tables with form guide                                                       |
| `/stats`     | Stats        | Top scorers, assisters, xG leaders with animated bars                                           |

---

## TECH STACK

### Dependencies to Install

```bash
# Bootstrap
npx create-next-app@14 kickoff-ai --typescript --tailwind --app --src-dir=false --import-alias="@/*"
cd kickoff-ai

# Core data & AI
npm install @supabase/supabase-js groq-sdk swr date-fns

# UI & Animation
npm install framer-motion next-themes lucide-react

# Maps
npm install react-leaflet leaflet
npm install -D @types/leaflet

# NEVER install: next-auth @supabase/auth-helpers-nextjs iron-session
```

### Environment Variables

Create `.env.local` from this template:

```env
# GROQ — free at https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxx
GROQ_API_KEY_2=gsk_xxxxxxxxxxxx

# SUPABASE — free at https://supabase.com (anon counters only, no auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FOOTBALL DATA — free at https://www.football-data.org
FOOTBALL_DATA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# REDDIT — no token needed for public JSON API
REDDIT_USER_AGENT=KickOffAI/1.0

# APP
NEXT_PUBLIC_APP_URL=https://kickoff-ai.vercel.app
```

---

## FILE STRUCTURE

When creating new files, always follow this layout:

```
kickoff-ai/
├── .antigravity/
│   └── rules.md                   ← THIS FILE
├── app/
│   ├── layout.tsx                 ← ThemeProvider + LiveTicker + Header + BottomNav
│   ├── page.tsx                   ← Home
│   ├── live/page.tsx
│   ├── agents/page.tsx
│   ├── brackets/page.tsx
│   ├── map/page.tsx
│   ├── community/page.tsx
│   ├── standings/page.tsx
│   ├── stats/page.tsx
│   └── api/
│       ├── agent/route.ts         ← Groq streaming (max 30s)
│       ├── matches/route.ts       ← football-data.org proxy (max 10s)
│       ├── standings/route.ts     ← standings proxy (max 10s)
│       ├── ticker/route.ts        ← aggregated ticker (max 10s)
│       ├── buzz/route.ts          ← Reddit aggregator (max 10s)
│       ├── search/route.ts        ← unified search (max 10s)
│       ├── reactions/route.ts     ← Supabase counter (max 5s)
│       ├── bracket-picks/route.ts ← Supabase counter (max 5s)
│       ├── venues/route.ts        ← Toronto venues (max 5s)
│       └── stats/route.ts         ← stats proxy (max 10s)
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← Logo + nav + search + theme toggle ONLY
│   │   ├── BottomNav.tsx          ← Mobile 5-tab nav + "More" drawer
│   │   ├── LiveTicker.tsx         ← Scrolling score strip
│   │   └── PageTransition.tsx     ← Framer Motion page wrapper
│   ├── ui/
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx        ← Animated sun/moon
│   │   ├── Badge.tsx              ← live/ht/ft/upcoming variants
│   │   ├── Card.tsx               ← Glass morphism base
│   │   ├── Button.tsx
│   │   ├── LiveDot.tsx            ← Pulsing red dot
│   │   ├── ProgressBar.tsx        ← Animated stat bar
│   │   ├── Skeleton.tsx           ← Shimmer loading
│   │   ├── Modal.tsx              ← Bottom sheet mobile / centered desktop
│   │   ├── Toast.tsx              ← Slide-in notifications
│   │   ├── ErrorBoundary.tsx      ← Football-themed errors
│   │   ├── OfflineBanner.tsx
│   │   ├── ScoreFlash.tsx
│   │   └── CountUp.tsx            ← Animated number counter
│   ├── agents/
│   │   ├── AgentSelector.tsx      ← 2×4 grid with stagger animation
│   │   ├── AgentChat.tsx          ← Full streaming chat
│   │   ├── MessageBubble.tsx
│   │   ├── MessageRenderer.tsx    ← Markdown + StatCard parser
│   │   ├── TypingIndicator.tsx    ← 3-dot bounce
│   │   ├── QuickPrompts.tsx
│   │   └── StatCard.tsx           ← Animated stat bars in chat
│   ├── matches/
│   │   ├── MatchCard.tsx          ← Score + reactions + AI button
│   │   ├── MatchGrid.tsx
│   │   ├── MatchFilter.tsx        ← Sliding active filter pill
│   │   ├── ReactionBar.tsx        ← 5 emoji reactions + localStorage
│   │   └── LiveMatchBanner.tsx    ← Full-width featured live match
│   ├── brackets/
│   │   ├── WC2026Bracket.tsx
│   │   ├── UCLBracket.tsx
│   │   ├── BracketMatch.tsx       ← Tap to pick winner
│   │   └── ShareBracket.tsx       ← URL encode picks
│   ├── maps/
│   │   ├── WatchPartyMap.tsx      ← Leaflet (dynamic import, no SSR)
│   │   ├── VenueMarker.tsx
│   │   └── VenueCard.tsx          ← Rush level bar
│   ├── social/
│   │   ├── FanBuzzFeed.tsx
│   │   ├── BuzzItem.tsx
│   │   ├── TrendingTopics.tsx     ← Animated pill row
│   │   └── CrowdWisdom.tsx        ← "X% fans picked Y"
│   ├── standings/
│   │   ├── StandingsTable.tsx
│   │   └── FormBadge.tsx          ← W/D/L coloured dots
│   ├── stats/
│   │   ├── PlayerCard.tsx
│   │   └── StatComparison.tsx
│   ├── search/
│   │   └── GlobalSearch.tsx       ← ⌘K modal
│   └── preferences/
│       └── PreferencesPanel.tsx   ← localStorage only, no account
├── lib/
│   ├── storage/index.ts           ← lsGet / lsSet / lsDelete / lsClear
│   ├── sports/footballData.ts     ← football-data.org client + caching
│   ├── social/reddit.ts           ← Reddit public JSON client
│   ├── groq/agents.ts             ← 8 agent definitions
│   └── venues.ts                  ← 20 hardcoded Toronto venues
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useMatches.ts              ← SWR hook
│   ├── useStandings.ts
│   ├── useBuzz.ts
│   ├── useReactions.ts            ← localStorage + Supabase counter
│   ├── useBracketPicks.ts
│   ├── useGeolocation.ts
│   └── useKeyboard.ts             ← ⌘K shortcut
└── types/
    ├── match.ts
    ├── agent.ts
    ├── venue.ts
    ├── bracket.ts
    └── reddit.ts
```

---

## DESIGN SYSTEM

### Fonts

Load via Google Fonts in `globals.css`:

- `Bebas Neue` — headings, logo, scores, display text
- `DM Sans` — all body text, nav, cards
- `JetBrains Mono` — scores, stats, live data, code

### Color Tokens (CSS Variables)

Define these in `globals.css`. Never hardcode hex values in components.

**Dark mode (`:root` default):**

```css
--bg: #08080e;
--bg-2: #0f0f18;
--bg-3: #161622;
--card: #1a1a28;
--card-hover: #20202f;
--border: rgba(255, 255, 255, 0.07);
--border-hover: rgba(255, 255, 255, 0.14);
--text: #f0f0f8;
--text-2: #b0b0c8;
--muted: #5a5a78;
--accent: #00e5a0;
--accent-2: #ff4d6d;
--accent-3: #7c3aed;
--live: #ff4444;
--gold: #ffd700;
--shadow: rgba(0, 0, 0, 0.5);
```

**Light mode (`.light` class):**

```css
--bg: #f2f2f8;
--bg-2: #e8e8f2;
--bg-3: #dedeed;
--card: #ffffff;
--card-hover: #f8f8ff;
--border: rgba(0, 0, 0, 0.07);
--border-hover: rgba(0, 0, 0, 0.14);
--text: #0f0f1a;
--text-2: #444460;
--muted: #8888a8;
--accent: #009e6f; /* darker for WCAG contrast on white */
--accent-2: #e0003a;
--accent-3: #6d28d9;
--live: #cc2222;
--gold: #b8960a;
--shadow: rgba(0, 0, 0, 0.12);
```

### Tailwind Extensions

In `tailwind.config.ts` extend with:

```typescript
fontFamily: {
  display: ['Bebas Neue', 'sans-serif'],
  body:    ['DM Sans', 'sans-serif'],
  mono:    ['JetBrains Mono', 'monospace'],
},
colors: {
  accent: { DEFAULT: '#00e5a0', dark: '#00b87f', light: '#33ebb3' },
  live: '#ff4444',
  gold: '#ffd700',
  danger: '#ff4d6d',
},
animation: {
  'ticker':      'ticker 45s linear infinite',
  'pulse-live':  'pulse-live 1.4s ease-in-out infinite',
  'float':       'float 3s ease-in-out infinite',
  'slide-up':    'slide-up 0.35s cubic-bezier(0.16,1,0.3,1)',
  'scale-in':    'scale-in 0.2s cubic-bezier(0.175,0.885,0.32,1.275)',
  'shimmer':     'shimmer 1.6s ease-in-out infinite',
  'score-flash': 'score-flash 0.6s ease',
  'bounce-in':   'bounce-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
  'glow-pulse':  'glow-pulse 2s ease-in-out infinite',
},
boxShadow: {
  glow:    '0 0 20px rgba(0,229,160,0.25)',
  'glow-lg': '0 0 40px rgba(0,229,160,0.3)',
  live:    '0 0 12px rgba(255,68,68,0.4)',
},
```

### Theme Rules — Apply to Every Component

```
✅ Use CSS variables for ALL colors (never hardcode)
✅ Cards: dark = rgba glass | light = white + drop-shadow
✅ Borders: always var(--border), hover to var(--border-hover)
✅ Accent: var(--accent) is darker in light mode for WCAG contrast
✅ Skeleton shimmer: dark uses card/card-hover, light uses bg-2/bg-3
✅ Input font-size: minimum 16px (prevents iOS zoom on focus)
✅ Touch targets: minimum 44×44px
```

---

## NAVIGATION

### Header (`components/layout/Header.tsx`)

**Structure:** `[Logo] [Nav tabs] [Search icon] [Theme toggle]`

- **Logo:** "KickOff" (Bebas Neue, gradient) + "AI" (accent color)
- **Nav tabs (desktop ≥ 768px):**

| Tab       | Icon        | Route        |
| --------- | ----------- | ------------ |
| Home      | `Home`      | `/`          |
| Live      | `Radio`     | `/live`      |
| Agents    | `Bot`       | `/agents`    |
| Brackets  | `Trophy`    | `/brackets`  |
| Map       | `MapPin`    | `/map`       |
| Community | `Users`     | `/community` |
| Standings | `BarChart2` | `/standings` |
| Stats     | `Zap`       | `/stats`     |

- **Active tab:** Framer Motion `layoutId="nav-indicator"` sliding underline
- **Sticky:** `backdrop-filter: blur(20px)`, transparent at top → glass when scrolled
- **Mobile (< 768px):** hide nav tabs, show logo + search + theme only
- **HEIGHT:** 58px desktop / 52px mobile
- **NO sign-in button. NO avatar. NO auth link. Ever.**

### Mobile Bottom Navigation (`components/layout/BottomNav.tsx`)

- `display: none` on desktop (≥ 768px)
- `position: fixed; bottom: 0; z-index: 90`
- `padding-bottom: env(safe-area-inset-bottom)` — iPhone notch / Dynamic Island
- `backdrop-filter: blur(20px)`
- 5 tabs: **Home · Live · Agents · Map · More**
- **"More" tab** → slide-up drawer (Framer Motion spring) containing:
  Community · Standings · Stats · Brackets · Settings
- Active tab: icon scales 1.1×, accent color, animated dot above icon
- All tabs: `whileTap={{ scale: 0.88 }}`

---

## ANIMATION SYSTEM

Use Framer Motion for all animations. Apply these patterns consistently:

```typescript
// Page entry — wrap every page in <PageTransition>
const page = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16,1,0.3,1] } },
  exit:    { opacity: 0, y: -8 }
}

// Staggered list (match cards, buzz items, standings rows)
const container = { animate: { transition: { staggerChildren: 0.055 } } }
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16,1,0.3,1] } }
}

// Card hover lift
whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,229,160,0.12)' }}
whileTap={{ scale: 0.98 }}

// Button press
whileTap={{ scale: 0.92 }}
whileHover={{ scale: 1.04 }}

// Bottom sheet / modal
initial: { y: '100%' }
animate: { y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
exit:    { y: '100%' }

// Score update flash
animate: { scale: [1,1.4,1], color: ['inherit','#00e5a0','inherit'] }

// Reaction emoji pop
whileTap: { scale: [1,1.5,0.9,1.1,1] }

// Nav active indicator — shared layout
<motion.div layoutId="nav-indicator" /> under active tab

// Skeleton → content
AnimatePresence: fade skeleton out, fade content in

// Scroll-triggered (standings, stats)
whileInView={{ opacity: 1, x: 0 }}
initial={{ opacity: 0, x: -20 }}
viewport={{ once: true }}
```

**Theme toggle animation:**

```typescript
// Sun/moon spin swap using AnimatePresence
initial: { rotate: -90, opacity: 0, scale: 0.5 }
animate: { rotate: 0,   opacity: 1, scale: 1   }
exit:    { rotate:  90, opacity: 0, scale: 0.5 }
```

---

## localStorage — ONLY PERSISTENCE LAYER

`lib/storage/index.ts`:

```typescript
const PREFIX = 'kickoff_';

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function lsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}
export function lsDelete(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFIX + key);
}
export function lsClear(): void {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
```

**Keys in use:**

```
kickoff_reactions        → Record<matchId, string[]>
kickoff_bracket_wc2026   → Record<slot, string>
kickoff_bracket_ucl      → Record<slot, string>
kickoff_chat_history     → Record<agentId, Message[]>  (last 20 per agent)
kickoff_preferences      → { favoriteTeam, favoriteLeague, defaultAgent, mapRadius }
kickoff_recent_searches  → string[]  (last 8)
kickoff_venue_favourites → string[]  (venue IDs)
kickoff_viewed_matches   → string[]  (recently viewed)
```

---

## AI AGENTS

Define all 8 agents in `lib/groq/agents.ts`:

### Agent Specifications

**Vito 🦁** — Tactical Analyst

- Badge: `TACTICS` | Color: `#00e5a0`
- System prompt focus: formation analysis (4-3-3, 4-2-3-1, 3-5-2), pressing systems, PPDA metrics, set pieces, half-spaces, transitions
- Quick prompts: "Why is Arsenal winning?", "Explain gegenpressing", "Best formation vs 5-3-2?", "Analyze today's match"

**Oracle FC 🔮** — Stats & Predictions

- Badge: `STATS` | Color: `#7c3aed`
- System prompt focus: xG, xA, PSxG, match probability models, injury impact, season trajectory, statistical uncertainty
- Quick prompts: "Predict the Champions League winner", "Arsenal's xG title chances", "Canada's WC2026 odds", "Most underrated player by xG"

**The Correspondent 📰** — Live Journalist

- Badge: `LIVE` | Color: `#f97316`
- System prompt focus: cinematic present-tense commentary, atmosphere, turning points, manager reactions, match report writing
- Quick prompts: "Narrate the last 10 minutes", "Write a halftime report", "Describe the atmosphere", "What's the story of this match?"

**Scout 🎯** — Player Analyst

- Badge: `SCOUTING` | Color: `#06b6d4`
- System prompt focus: technical/physical/mental attributes, CIES methodology, scouting reports (Overview → Strengths → Weaknesses → Ceiling → Comparable Players), market value
- Quick prompts: "Full report on Bukayo Saka", "Best U21 strikers right now", "Jonathan David worth €60m?", "Top 5 MLS hidden gems"

**FantasyGuru 💰** — FPL Optimizer

- Badge: `FPL` | Color: `#eab308`
- System prompt focus: captain picks with point ranges, differentials under 10% ownership, FDR, chip strategy, rotation risk, price changes
- Quick prompts: "Best FPL captain this GW", "Best <£6m midfielder", "When to use wildcard?", "Top differentials under 10%"

**Historio 📚** — Football Historian

- Badge: `HISTORY` | Color: `#a78bfa`
- System prompt focus: football from 1863 to present, iconic matches with exact dates/scores, records, evolution of tactics, World Cup history, Canada's football story
- Quick prompts: "Greatest World Cup final ever?", "Tell me about Canada's 1904 Olympic gold", "Most World Cup goals record", "Messi vs Maradona internationally"

**CanadaFC 🍁** — Canadian Football Specialist

- Badge: `CANADA` | Color: `#ef4444`
- System prompt focus: Canada Men's + Women's national teams, CPL (8 clubs), Toronto FC / CF Montréal / Vancouver Whitecaps, WC2026 host venues (BMO Field, BC Place, Commonwealth Stadium), Jonathan David, Alphonso Davies, Christine Sinclair
- Quick prompts: "Canada's WC2026 starting XI", "Best CPL player right now?", "Alphonso Davies latest update", "BMO Field WC2026 atmosphere"

**Referee 🟨** — Rules & VAR Expert

- Badge: `RULES` | Color: `#fbbf24`
- System prompt focus: all 17 IFAB Laws, VAR 4 reviewable categories, SAOT offside technology, handball interpretation, DOGSO, red vs yellow criteria — always give a definitive verdict
- Quick prompts: "Was that a handball?", "VAR 4 categories explained", "When is a tackle a red card?", "How does SAOT work?"

### Groq API Route (`app/api/agent/route.ts`)

```typescript
// POST — no auth check — open to all
// Body: { agentId, message, history: Message[], matchContext?: string }
// Returns: ReadableStream SSE (text/event-stream)
// Model: 'llama-3.3-70b-versatile'
// Max tokens: 600
// Rate limit: 10 req/min per IP (in-memory Map)
// Rotate between GROQ_API_KEY and GROQ_API_KEY_2 if both set
// On error: return 500 with football-themed message
```

---

## LIVE SPORTS DATA

### football-data.org Client (`lib/sports/footballData.ts`)

```typescript
// Base: https://api.football-data.org/v4
// Header: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY }
// Free tier: 10 req/min — cache aggressively

// Functions:
getLiveMatches(); // status=LIVE,IN_PLAY,PAUSED — cache 60s
getTodayMatches(); // today's date range — cache 120s
getMatchDetails(id); // cache 30s live / 300s finished
getStandings(code); // PL|CL|MLS|WC — cache 300s
getCompetitionMatches(); // cache 90s

// On rate limit: return stale cached data with X-Cache: STALE header
// SWR config: refreshInterval: 60_000, keepPreviousData: true
```

### Live Match Ticker (`components/layout/LiveTicker.tsx`)

- Full-width green strip above header (`var(--accent)` bg, black text)
- Content scrolls right-to-left, 45s cycle, loops seamlessly
- Pauses on hover (`animation-play-state: paused`)
- Format: `● LIVE Arsenal 2–1 Man City · 73' | ⏸ HT Real Madrid 0–0 Bayern | 🏆 WC2026 · 92 days | 💬 14,200 fans discussing #ARSMCI`
- Data: `/api/ticker` — aggregated live scores + Reddit post count + WC countdown
- Refresh: every 60s via SWR

---

## REDDIT FAN BUZZ

### Reddit Client (`lib/social/reddit.ts`)

```typescript
// Public JSON API — ZERO auth required
// Base: https://www.reddit.com

const SUBREDDITS = ['soccer','CanadaSoccer','PremierLeague','championsleague','MLS','TorontoFC','CanadianPremierLeague']

getHotPosts(subreddit, limit)    // /r/{sub}/hot.json — cache 3min
getNewPosts(subreddit, limit)    // /r/{sub}/new.json — cache 90s
searchPosts(query, subreddit?)   // /r/{sub}/search.json — cache 2min
```

Each post: title, subreddit, score (upvotes), numComments, url, createdUtc, author

---

## TORONTO WATCH PARTY MAP

### Setup (`components/maps/WatchPartyMap.tsx`)

- **MUST be dynamically imported with `ssr: false`** (Leaflet breaks on SSR)

```typescript
const WatchPartyMap = dynamic(
  () => import('@/components/maps/WatchPartyMap'),
  { ssr: false, loading: () => <MapSkeleton /> }
)
```

- Tiles: OpenStreetMap (free, no API key)
- Centered: Toronto (43.6532, -79.3832)
- Custom emoji markers: 🍺 pub, 🏟️ sports bar, 🍕 restaurant, 🏘️ community centre
- User location button → browser geolocation → fly to user → show 3 nearest venues

### Venue Rush Levels

```typescript
type RushLevel = 'chill' | 'busy' | 'packed';
// chill  → green bar, 0–40% capacity
// busy   → gold bar,  40–75% capacity
// packed → red bar,   75%+ capacity (show "Almost full!")
// Level calculated from: time of day + number of live matches currently
```

### Hardcode in `lib/venues.ts` — 20 Real Toronto Venues

Include: The Dog & Bear, Real Sports Bar, The Brazen Head, Hemingway's,
The Rose & Crown, The Imperial Pub, Union Social, Sneaky Dee's,
Scaddabush (King St, TIFF), The Firkin on King, C'est What,
The Feathers, Pauper's Pub, The Brunswick House, Amsterdam BrewHouse,
Bar Wellington, The Loose Moose, Bier Markt, The Wickson Social,
Rock Lobster Food Co.
(Use real lat/lng for each — look them up with `search_web` tool)

### Venue Favouriting

- Heart icon on each venue card
- Toggle: `lsSet('venue_favourites', [...ids])`
- No account needed

---

## TOURNAMENT BRACKETS

### WC2026 Bracket (`components/brackets/WC2026Bracket.tsx`)

- 32 teams → R32 → R16 → QF → SF → 3rd place → Final
- Horizontal scroll on mobile (each round min 130px wide)
- **User picks winner by tapping a team** → picked team gets accent border + checkmark
- Picks saved: `lsSet('bracket_wc2026', { 'r16-1': 'Canada', 'qf-1': 'Canada', ... })`
- Fire-and-forget `POST /api/bracket-picks` to Supabase counter on each pick
- Crowd wisdom: below each match show "🟢 54% Canada vs 🔴 46% Germany" from Supabase
- Canada's path: highlighted red (#ef4444), dashed connector line
- **Share bracket button:**
  - Encode all picks as base64 URL param: `/brackets?b=eyJyMTYtMSI6IkNhbmFkYSJ9`
  - "Link copied!" toast on click
  - Shared link is read-only (detected by URL param presence)

---

## SUPABASE SCHEMA (ANONYMOUS ONLY)

Run this SQL in the Supabase editor. **No user tables. No auth tables. Nothing.**

```sql
-- Anonymous reaction tallies
CREATE TABLE match_reactions (
  match_id        TEXT PRIMARY KEY,
  fire_count      INTEGER DEFAULT 0,
  shock_count     INTEGER DEFAULT 0,
  laugh_count     INTEGER DEFAULT 0,
  sad_count       INTEGER DEFAULT 0,
  celebrate_count INTEGER DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Bracket crowd wisdom
CREATE TABLE bracket_picks_aggregate (
  tournament  TEXT NOT NULL,
  slot        TEXT NOT NULL,
  team        TEXT NOT NULL,
  pick_count  INTEGER DEFAULT 0,
  PRIMARY KEY (tournament, slot, team)
);

-- Public read-only, writes via API routes only
ALTER TABLE match_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON match_reactions FOR SELECT USING (true);

ALTER TABLE bracket_picks_aggregate ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON bracket_picks_aggregate FOR SELECT USING (true);
```

### Reaction Flow

1. User taps 🔥 → `lsSet('reactions', { [matchId]: [..., 'fire'] })` — instant
2. UI updates immediately (optimistic)
3. Background: `POST /api/reactions` → Supabase `fire_count++`
4. Display: "🔥 4,231 fans" from Supabase count + user's own state from localStorage

---

## MOBILE-FIRST RESPONSIVE RULES

### Breakpoints

```
375px  → base (iPhone SE — design starts here)
480px  → larger phones
768px  → tablet — show desktop header nav, hide bottom nav
1024px → desktop — show 2-col layout
1280px → wide — show 3-col layout
1400px → max container width
```

### Layout Grids

**Home page:**

- mobile: single column
- tablet (768px+): `1fr 300px`
- desktop (1024px+): `260px 1fr 300px`

**Match grid:**

- mobile: 1 col · tablet: 2 col · desktop: 3 col · wide: 4 col

**Agents page:**

- mobile: agent selector as scrollable top row + full-width chat below
- desktop: `260px` agent panel + `flex-1` chat panel

**Map:**

- mobile: map fills 55vh + swipe-up venue list panel
- desktop: `65%` map + `35%` sidebar

**Bracket:**

- mobile: horizontal scroll, each round 130px min
- desktop: full bracket visible

### Critical Mobile Rules

```
- Touch targets: minimum 44×44px on all interactive elements
- Input font-size: minimum 16px (prevents iOS auto-zoom on focus)
- No hover-only features (touch has no hover state)
- Overflow-x: hidden on body (prevent horizontal scroll)
- -webkit-overflow-scrolling: touch on scroll containers
- touch-action: manipulation on buttons (prevent double-tap zoom)
- Safe area: env(safe-area-inset-bottom) on bottom nav
- Safe area: env(safe-area-inset-top) on header when fullscreen
```

### PWA Configuration

Create `public/manifest.json`:

```json
{
  "name": "KickOff AI",
  "short_name": "KickOff",
  "description": "AI-powered football intelligence — no signup needed",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#08080e",
  "theme_color": "#00e5a0",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

Add to `app/layout.tsx` head:

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<meta name="apple-mobile-web-app-title" content="KickOff AI" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<meta name="theme-color" content="#00e5a0" />
```

---

## GLOBAL SEARCH (`components/search/GlobalSearch.tsx`)

- Trigger: search icon in header OR `⌘K` / `Ctrl+K`
- Full-screen overlay on mobile, centered modal on desktop
- Debounce: 280ms
- Searches: match names, teams, players, Reddit posts via `/api/search`
- Results grouped by category with icons
- Keyboard nav: `↑↓` to navigate, `Enter` to select, `Esc` to close
- Recent searches: `lsGet('recent_searches', [])` — 8 max, shown when input empty
- Save on search: `lsSet('recent_searches', [query, ...prev].slice(0, 8))`

---

## PREFERENCES (`components/preferences/PreferencesPanel.tsx`)

Accessible via "Settings" in More drawer (mobile) + gear icon (desktop).
**This replaces any profile/account page entirely.**

```typescript
interface Preferences {
  favoriteTeam: string; // e.g. "Arsenal", "Toronto FC", "Canada"
  favoriteLeague: string; // "EPL" | "MLS" | "CPL" | "UCL" | "WC"
  defaultAgent: string; // agent id to open by default
  mapRadius: number; // km for venue search (default 5)
}
// All saved via lsSet('preferences', prefs)
// Applied on app load via lsGet('preferences', defaults)
```

---

## API ROUTES SUMMARY

```
GET  /api/ticker          → live scores + buzz count + WC countdown (60s cache)
GET  /api/matches         → football-data.org proxy (?competition=PL&status=LIVE)
GET  /api/standings       → standings proxy (?competition=PL)
POST /api/agent           → Groq streaming (body: {agentId,message,history,matchContext?})
GET  /api/buzz            → Reddit aggregator (?sub=soccer&limit=20&sort=hot)
GET  /api/search          → unified search (?q=arsenal)
POST /api/reactions       → Supabase increment (body: {matchId, type})
POST /api/bracket-picks   → Supabase increment (body: {tournament, slot, team})
GET  /api/venues          → Toronto venues + rush levels
GET  /api/stats           → top scorers/assisters (?competition=PL&type=scorers)

Total: 10 routes — within Vercel free tier (≤12 serverless functions)
```

---

## SECURITY

`next.config.ts` headers:

```typescript
{ key: 'X-Frame-Options',           value: 'DENY' },
{ key: 'X-Content-Type-Options',    value: 'nosniff' },
{ key: 'X-DNS-Prefetch-Control',    value: 'on' },
{ key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(self)' },
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
```

Rules:

- All API keys server-side only — never in `NEXT_PUBLIC_*` (except Supabase anon key which is safe by design)
- No CSRF protection needed (no sessions)
- Leaflet: always dynamically imported (`ssr: false`) — never in SSR bundle

---

## ERROR HANDLING

**ErrorBoundary** (`components/ui/ErrorBoundary.tsx`):

- Message: "🟨 VAR is reviewing... something went wrong."
- Show retry button that calls `window.location.reload()`
- Per-section boundaries — one broken widget doesn't kill the page

**Section-level fallbacks:**

- Groq error → "Agent temporarily offline — try again in a moment"
- football-data.org error → show stale cached data silently
- Reddit error → "Community feed temporarily unavailable"
- Map tiles error → static placeholder image

**Offline detection** (`components/ui/OfflineBanner.tsx`):

- Listen to `navigator.onLine` + `online`/`offline` events
- Show: "⚡ You're offline — showing cached data"
- SWR `keepPreviousData: true` ensures content stays visible

---

## PERFORMANCE

**Caching:**

```typescript
export const SWR_CONFIG = {
  refreshInterval: 60_000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  keepPreviousData: true, // no flash to skeleton on revalidate
  dedupingInterval: 5_000,
};
// football-data.org: 60s live, 300s standings
// Reddit:            180s
// Supabase counters: 30s
```

**Bundle:**

```typescript
// Leaflet — always dynamic, never in SSR bundle
const Map = dynamic(() => import('@/components/maps/WatchPartyMap'), {
  ssr: false,
});

// Framer Motion — use LazyMotion for smaller bundle
import { LazyMotion, domAnimation } from 'framer-motion';

// next/image for all images — webp format, lazy loading
```

---

## VERCEL CONFIGURATION

`vercel.json`:

```json
{
  "functions": {
    "app/api/agent/route.ts": { "maxDuration": 30 },
    "app/api/matches/route.ts": { "maxDuration": 10 },
    "app/api/standings/route.ts": { "maxDuration": 10 },
    "app/api/ticker/route.ts": { "maxDuration": 10 },
    "app/api/buzz/route.ts": { "maxDuration": 10 },
    "app/api/search/route.ts": { "maxDuration": 10 },
    "app/api/reactions/route.ts": { "maxDuration": 5 },
    "app/api/bracket-picks/route.ts": { "maxDuration": 5 },
    "app/api/venues/route.ts": { "maxDuration": 5 },
    "app/api/stats/route.ts": { "maxDuration": 10 }
  }
}
```

---

## BROWSER TESTING INSTRUCTIONS

After building each feature, use the `browser_subagent` tool to verify:

| Feature       | Test Task                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Ticker        | "Verify the ticker strip scrolls and contains live score data"                                           |
| Theme toggle  | "Click the moon/sun icon and verify the entire page changes theme correctly"                             |
| Bottom nav    | "On a mobile viewport (375px), verify bottom nav shows 5 tabs and 'More' opens a drawer"                 |
| Agent chat    | "Select the Vito agent, type 'What is gegenpressing?', verify a streaming response appears"              |
| Reactions     | "Click the fire emoji on a match card, verify count increments and persists on refresh"                  |
| Map           | "Navigate to /map, verify the Leaflet map loads with venue markers in Toronto"                           |
| Bracket       | "Navigate to /brackets, tap a team to pick them, verify the pick is highlighted and persists on refresh" |
| Search        | "Press ⌘K or Ctrl+K, type 'arsenal', verify results appear grouped by category"                          |
| Dark/Light    | "Toggle theme 3 times rapidly — verify no visual glitches or hardcoded colors"                           |
| Mobile layout | "Set viewport to 375px — verify no horizontal scroll, bottom nav is visible, all text readable"          |

---

## FREE API REFERENCE

| API                  | Auth Needed     | Rate Limit       | Used For                            |
| -------------------- | --------------- | ---------------- | ----------------------------------- |
| football-data.org    | API key (free)  | 10 req/min       | Live scores, standings, fixtures    |
| Reddit JSON API      | None at all     | ~60 req/min      | Fan buzz, trending posts            |
| OpenStreetMap        | None at all     | Fair use         | Map tiles                           |
| Browser Geolocation  | User permission | —                | "Near me" venue search              |
| Groq (Llama 3.3 70B) | API key (free)  | 10 req/min       | All 8 AI agents                     |
| Supabase             | Anon key (free) | 500MB / 50k rows | Anonymous counters only             |
| Google Fonts         | None            | —                | Bebas Neue, DM Sans, JetBrains Mono |
| Vercel CDN           | Free tier       | 100GB/mo         | Hosting + functions                 |

---

## LAUNCH CHECKLIST

Before declaring the project done, verify all of these:

**Zero Auth:**

- [ ] `grep -r "signIn\|signOut\|useSession\|getServerSession" .` → 0 results
- [ ] No files exist at app/login, app/signup, app/auth, app/profile
- [ ] Header has no sign-in button
- [ ] Bottom nav has no profile/account link

**Theme:**

- [ ] Toggle dark↔light on every single page — no broken styles
- [ ] No hardcoded hex colors anywhere in components
- [ ] Contrast ratio ≥ 4.5:1 on all text (verify with browser DevTools)

**Mobile:**

- [ ] All pages at 375px — no horizontal overflow
- [ ] Touch targets ≥ 44px
- [ ] Input font-size ≥ 16px everywhere
- [ ] Bottom nav safe area working (iPhone notch/Dynamic Island)
- [ ] App installable via PWA manifest

**Animations:**

- [ ] Page transitions smooth, no flash
- [ ] List items stagger on load
- [ ] Cards lift and glow on hover
- [ ] Buttons scale on press
- [ ] Score flashes on update
- [ ] Reactions pop on press
- [ ] Theme toggle spins sun/moon
- [ ] Bottom nav tab indicator animates
- [ ] Skeleton shimmers while loading

**Features:**

- [ ] All 8 AI agents stream responses
- [ ] Live scores update every 60s
- [ ] Reactions persist across page reload (localStorage)
- [ ] Bracket picks persist and are shareable via URL
- [ ] Reddit feed loads from multiple subreddits
- [ ] Map loads with Toronto venue markers
- [ ] Standings load for EPL, UCL, MLS
- [ ] ⌘K search returns results
- [ ] Preferences save and apply on reload

**Performance:**

- [ ] Lighthouse mobile score ≥ 90
- [ ] Leaflet NOT in main bundle (dynamic import)
- [ ] No layout shift (CLS < 0.1)

---

_KickOff AI · Zero friction · Open to everyone · Built for Canadian football fans_
_🍁⚽ Gemini + Next.js 14 · No accounts · No barriers · Free tier all the way_

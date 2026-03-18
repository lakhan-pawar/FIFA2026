# KickOff AI - Football Intelligence Platform

A modern, mobile-first football intelligence platform designed specifically for Canadian football fans. The platform provides comprehensive football analysis through 8 specialized AI agents, live sports data integration, interactive venue mapping for Toronto watch parties, social community features, and tournament bracket management with a focus on World Cup 2026.

## Features

- **8 Specialized AI Agents**: Vito (tactics), Oracle FC (predictions), The Correspondent (commentary), Scout (player analysis), FantasyGuru (FPL advice), Historio (football history), CanadaFC (Canadian soccer), and Referee (rules/VAR)
- **Live Sports Data**: Real-time match data and standings from Premier League, Champions League, and MLS
- **Interactive Venue Mapping**: Find Toronto watch party venues with crowd information and rush level indicators
- **Social Community**: Engage with other fans and see community reactions through Reddit integration
- **Tournament Brackets**: Interactive World Cup 2026 tournament brackets with prediction functionality
- **Mobile-First Design**: Responsive design optimized for all devices with PWA support
- **Dark/Light Theme**: User preference-based theme switching

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase for database and auth
- **External APIs**: football-data.org, Reddit API
- **Mapping**: Leaflet Maps
- **Deployment**: Vercel
- **AI Integration**: OpenAI API for AI agents

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- API keys for external services (football-data.org, Reddit, OpenAI)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd kickoff-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys and configuration in `.env.local`

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# External APIs
FOOTBALL_DATA_API_KEY=your_football_data_api_key_here
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_client_secret_here

# AI Services
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable React components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and configurations
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Development Guidelines

- Follow the mobile-first approach for all UI components
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write tests for critical functionality
- Optimize for performance and accessibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository.

# Supabase Integration Setup

This document outlines the Supabase integration for KickOff AI, including database schema, authentication, and usage instructions.

## Overview

KickOff AI uses Supabase as its backend-as-a-service solution, providing:

- PostgreSQL database with Row Level Security (RLS)
- Authentication with multiple providers
- Real-time subscriptions
- Edge functions (future use)

## Database Schema

### Core Tables

1. **users** - Extended user profiles (linked to auth.users)
2. **user_preferences** - User settings and preferences
3. **venues** - Toronto watch party venues
4. **venue_checkins** - User check-ins at venues
5. **social_interactions** - User social activities
6. **tournament_brackets** - Tournament bracket structures
7. **bracket_predictions** - User tournament predictions
8. **ai_interactions** - AI agent conversation history
9. **match_cache** - Cached match data from external APIs

### Custom Types

- `user_theme`: 'light' | 'dark' | 'system'
- `rush_level`: 'low' | 'medium' | 'high'
- `interaction_type`: 'like' | 'comment' | 'share' | 'reaction'
- `prediction_status`: 'pending' | 'correct' | 'incorrect'

## Environment Variables

Required environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Authentication Setup

### Supported Providers

- Email/Password
- Google OAuth
- GitHub OAuth

### Auth Configuration

- Redirect URLs configured for development and production
- Row Level Security policies for data protection
- Automatic user profile creation on signup

## Database Services

### UserService

- User profile management
- Preferences handling
- Profile creation and updates

### VenueService

- Venue data retrieval
- Check-in/check-out functionality
- Rush level tracking

### SocialService

- Social interaction management
- Match and venue-based interactions
- User activity tracking

### TournamentService

- Tournament bracket management
- Prediction submission and tracking
- Accuracy scoring

### AIService

- AI interaction logging
- Conversation history
- Context awareness

## Usage Examples

### Authentication

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, profile, loading, isAuthenticated } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  return <div>Welcome, {profile?.full_name}!</div>
}
```

### Database Operations

```typescript
import { userService, venueService } from '@/lib/database';

// Get user preferences
const preferences = await userService.getUserPreferences(userId);

// Get all venues
const venues = await venueService.getAllVenues();

// Check in to venue
const checkin = await venueService.checkInToVenue({
  user_id: userId,
  venue_id: venueId,
  match_id: matchId,
});
```

## Security Features

### Row Level Security (RLS)

- Users can only access their own data
- Public read access for venues and tournaments
- Secure social interactions with proper filtering

### Data Protection

- All sensitive data encrypted at rest
- API keys never exposed to client
- Secure session management

## Migration Instructions

1. Create a new Supabase project
2. Run the migration SQL file: `supabase/migrations/001_initial_schema.sql`
3. Configure authentication providers in Supabase dashboard
4. Set up environment variables
5. Test connection using the AuthTest component

## Development Testing

The project includes a test component (`AuthTest`) that verifies:

- Supabase connection
- Authentication functionality
- Database operations
- Sample data loading

Access the test at the bottom of the home page during development.

## Production Considerations

1. **Environment Variables**: Ensure all production URLs are correctly set
2. **RLS Policies**: Review and test all security policies
3. **API Limits**: Monitor Supabase usage and upgrade plan if needed
4. **Backup Strategy**: Set up automated backups for production data
5. **Monitoring**: Implement logging and monitoring for database operations

## Troubleshooting

### Common Issues

1. **Connection Errors**: Check environment variables and Supabase project status
2. **Auth Redirect Issues**: Verify redirect URLs in Supabase dashboard
3. **RLS Policy Errors**: Ensure user is authenticated and policies are correct
4. **Type Errors**: Regenerate types if schema changes are made

### Debugging Tools

- Use the AuthTest component for connection verification
- Check browser network tab for API calls
- Review Supabase dashboard logs
- Use TypeScript strict mode for type safety

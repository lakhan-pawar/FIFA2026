# Reddit API Integration

This module provides Reddit API integration for fetching Canadian football community content without requiring user authentication.

## Features

- **Application-only OAuth**: Uses Reddit's client credentials flow for read-only access
- **Content Filtering**: Automatically filters for Canadian football relevance
- **Content Moderation**: Automated moderation to ensure community guidelines compliance
- **Rate Limiting**: Built-in token management and request handling
- **Type Safety**: Full TypeScript support with comprehensive types

## Setup

### 1. Get Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Select "script" as the app type
4. Fill in the required fields:
   - Name: KickOff AI
   - Description: Football intelligence platform
   - Redirect URI: http://localhost:3000 (not used for app-only auth)
5. Copy the client ID (under the app name) and client secret

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
```

## Usage

### Basic Usage

```typescript
import { RedditService } from '@/lib/reddit';

const redditService = new RedditService();

// Fetch Canadian football content
const content = await redditService.fetchCanadianFootballContent({
  limit: 25,
  sort: 'hot',
  timeFilter: 'day',
});
```

### Search for Topics

```typescript
const results = await redditService.searchCanadianFootballTopics(
  'Alphonso Davies',
  { limit: 10, timeFilter: 'week' }
);
```

### Fetch from Specific Subreddit

```typescript
const posts = await redditService.fetchFromSubreddit('CanadaSoccer', {
  limit: 20,
  sort: 'top',
  timeFilter: 'week',
});
```

## API Routes

### GET /api/social/reddit

Fetch Canadian football content from multiple subreddits.

**Query Parameters:**

- `limit` (optional): Number of posts (default: 25, max: 100)
- `sort` (optional): Sort method - hot, new, top, rising (default: hot)
- `time` (optional): Time filter - hour, day, week, month, year, all (default: day)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

### GET /api/social/reddit/search

Search for Canadian football topics.

**Query Parameters:**

- `q` (required): Search query
- `limit` (optional): Number of results (default: 25, max: 100)
- `time` (optional): Time filter (default: week)

### GET /api/social/reddit/subreddit/[name]

Fetch content from a specific subreddit.

**Path Parameters:**

- `name`: Subreddit name (without r/)

**Query Parameters:**

- Same as main endpoint

## React Hook

```typescript
import { useRedditContent } from '@/hooks/useRedditContent';

function MyComponent() {
  const { content, loading, error, refresh } = useRedditContent({
    limit: 25,
    sort: 'hot',
    timeFilter: 'day',
    autoFetch: true,
    refreshInterval: 300000, // 5 minutes
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {content.map(item => (
        <div key={item.post.id}>{item.post.title}</div>
      ))}
    </div>
  );
}
```

## Components

### RedditFeed

```typescript
import { RedditFeed } from '@/components/social';

<RedditFeed
  limit={25}
  sort="hot"
  timeFilter="day"
  refreshInterval={300000}
/>
```

## Content Filtering

The system automatically filters content for Canadian football relevance using:

- **Keywords**: canada, canadian, canmnt, alphonso davies, etc.
- **Subreddits**: CanadaSoccer, CanadianPL, MLS, soccer, etc.
- **Relevance Scoring**: Posts are scored based on keyword matches, engagement, and recency

## Content Moderation

Automated moderation checks for:

- NSFW content (auto-rejected)
- Inappropriate language (flagged)
- Spam patterns (auto-rejected)
- Offensive content (auto-rejected)
- Low quality posts (flagged)

## Architecture

```
reddit/
├── redditClient.ts       # OAuth and API requests
├── contentFilter.ts      # Canadian football filtering
├── contentModerator.ts   # Content moderation
├── redditService.ts      # High-level service
└── index.ts             # Module exports
```

## Error Handling

The service includes comprehensive error handling:

- Token expiry and refresh
- API rate limiting
- Network failures
- Invalid credentials

## Testing

Run tests:

```bash
npm test src/lib/reddit/__tests__
```

## Rate Limits

Reddit API limits (application-only OAuth):

- 60 requests per minute
- Token expires after 1 hour (auto-refreshed)

The client automatically manages token refresh and includes safety margins.

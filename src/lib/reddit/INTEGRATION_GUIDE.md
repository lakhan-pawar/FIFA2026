# Reddit API Integration Guide

## Quick Start

### 1. Setup Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in:
   - **Name:** KickOff AI
   - **App type:** script
   - **Description:** Football intelligence platform
   - **Redirect URI:** http://localhost:3000
4. Copy the client ID and secret

### 2. Configure Environment

Add to `.env.local`:

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
```

### 3. Test the Integration

Visit the demo page:

```
http://localhost:3000/social-demo
```

Or test the API directly:

```bash
curl http://localhost:3000/api/social/reddit?limit=10&sort=hot&time=day
```

## API Endpoints

### Fetch Canadian Football Content

```
GET /api/social/reddit
```

**Query Parameters:**

- `limit` (optional): 1-100, default 25
- `sort` (optional): hot, new, top, rising
- `time` (optional): hour, day, week, month, year, all

**Example:**

```bash
curl "http://localhost:3000/api/social/reddit?limit=25&sort=hot&time=day"
```

### Search Topics

```
GET /api/social/reddit/search?q=query
```

**Example:**

```bash
curl "http://localhost:3000/api/social/reddit/search?q=Alphonso%20Davies&limit=10"
```

### Fetch from Subreddit

```
GET /api/social/reddit/subreddit/[name]
```

**Example:**

```bash
curl "http://localhost:3000/api/social/reddit/subreddit/CanadaSoccer?limit=20"
```

## Usage in Code

### Using the Service Directly

```typescript
import { RedditService } from '@/lib/reddit';

const service = new RedditService();
const content = await service.fetchCanadianFootballContent({
  limit: 25,
  sort: 'hot',
  timeFilter: 'day',
});
```

### Using the React Hook

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
        <div key={item.post.id}>
          <h3>{item.post.title}</h3>
          <p>Score: {item.relevanceScore}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Using the Component

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

The system automatically filters for Canadian football content using:

### Keywords

- canada, canadian, canmnt, canwnt
- cpl, canadian premier league
- toronto fc, vancouver whitecaps, cf montreal
- alphonso davies, jonathan david
- world cup 2026, concacaf

### Subreddits

- CanadaSoccer
- CanadianPL
- MLS
- soccer
- football
- worldcup
- CONCACAF

## Content Moderation

Automatic moderation checks:

- ✅ NSFW content (rejected)
- ✅ Spam patterns (rejected)
- ✅ Offensive content (rejected)
- ✅ Inappropriate language (flagged)
- ✅ Low quality posts (flagged)

## Troubleshooting

### "Reddit API not configured" Error

- Ensure `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` are set in `.env.local`
- Restart the development server after adding credentials

### No Content Returned

- Check if there are recent posts in Canadian football subreddits
- Try different time filters (week, month)
- Verify Reddit API credentials are correct

### Rate Limiting

- Reddit allows 60 requests per minute
- The client automatically manages token refresh
- Consider implementing caching for production

## Production Considerations

1. **Caching**: Implement Redis or similar for caching responses
2. **Rate Limiting**: Add request throttling on your API routes
3. **Error Monitoring**: Set up error tracking (Sentry, etc.)
4. **Content Updates**: Schedule periodic fetches (every 5-10 minutes)
5. **Database Storage**: Store fetched content for offline access

## Support

For issues or questions:

- Check the main README: `src/lib/reddit/README.md`
- Review test files for usage examples
- Check the demo page: `/social-demo`

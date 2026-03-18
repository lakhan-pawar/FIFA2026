/**
 * Reddit API Client
 * Handles Reddit API authentication and requests without user authentication
 * Uses application-only OAuth for read-only access
 */

import type {
  RedditAccessToken,
  RedditApiResponse,
  RedditPost,
  RedditFetchOptions,
} from '@/types/reddit';
import { executeWithRateLimit } from '@/middleware/rateLimitMiddleware';
import { circuitBreakerManager } from '@/lib/performance/circuitBreaker';
import { metricsLogger } from '@/lib/performance/metricsLogger';

export class RedditClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly baseUrl = 'https://oauth.reddit.com';
  private readonly authUrl = 'https://www.reddit.com/api/v1/access_token';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly userAgent = 'KickOffAI/1.0.0';

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.REDDIT_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.REDDIT_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn('Reddit API credentials not configured');
    }
  }

  /**
   * Get application-only OAuth token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString('base64');

    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Reddit auth failed: ${response.statusText}`);
    }

    const data: RedditAccessToken = await response.json();
    this.accessToken = data.access_token;
    // Set expiry to 5 minutes before actual expiry for safety
    this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  /**
   * Make authenticated request to Reddit API with rate limiting
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const cacheKey = `reddit:${endpoint}`;

    return executeWithRateLimit(
      'reddit-api',
      async () => {
        return circuitBreakerManager.execute(
          'reddit-api',
          async () => {
            const startTime = Date.now();

            try {
              const token = await this.getAccessToken();

              const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'User-Agent': this.userAgent,
                },
              });

              const duration = Date.now() - startTime;

              if (!response.ok) {
                const errorMessage = `Reddit API request failed: ${response.statusText}`;
                metricsLogger.logApiCall(
                  'reddit-api',
                  endpoint,
                  duration,
                  false,
                  errorMessage
                );
                throw new Error(errorMessage);
              }

              const data = await response.json();

              metricsLogger.logApiCall('reddit-api', endpoint, duration, true);

              return data;
            } catch (error) {
              const duration = Date.now() - startTime;
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';

              metricsLogger.logApiCall(
                'reddit-api',
                endpoint,
                duration,
                false,
                errorMessage
              );

              throw error;
            }
          },
          // Fallback function - return empty data structure
          async () => {
            console.warn(
              'Reddit API circuit breaker fallback: returning empty data'
            );
            return { data: { children: [] } } as T;
          }
        );
      },
      {
        cacheKey,
        cacheTTL: 300000, // 5 minutes
        priority: 'medium',
      }
    );
  }

  /**
   * Fetch posts from a subreddit
   */
  async fetchSubredditPosts(
    subreddit: string,
    options: RedditFetchOptions = {}
  ): Promise<RedditPost[]> {
    const {
      limit = 25,
      after,
      before,
      timeFilter = 'day',
      sort = 'hot',
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      t: timeFilter,
    });

    if (after) params.append('after', after);
    if (before) params.append('before', before);

    const endpoint = `/r/${subreddit}/${sort}?${params.toString()}`;
    const response = await this.makeRequest<RedditApiResponse>(endpoint);

    return response.data.children
      .filter((child) => child.kind === 't3') // t3 = post
      .map((child) => child.data as RedditPost);
  }

  /**
   * Fetch posts from multiple subreddits
   */
  async fetchMultipleSubreddits(
    subreddits: string[],
    options: RedditFetchOptions = {}
  ): Promise<RedditPost[]> {
    const subredditString = subreddits.join('+');
    return this.fetchSubredditPosts(subredditString, options);
  }

  /**
   * Search posts across Reddit
   */
  async searchPosts(
    query: string,
    subreddit?: string,
    options: RedditFetchOptions = {}
  ): Promise<RedditPost[]> {
    const { limit = 25, timeFilter = 'day', sort = 'relevance' } = options;

    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      t: timeFilter,
      sort,
      type: 'link',
    });

    const endpoint = subreddit
      ? `/r/${subreddit}/search?${params.toString()}`
      : `/search?${params.toString()}`;

    const response = await this.makeRequest<RedditApiResponse>(endpoint);

    return response.data.children
      .filter((child) => child.kind === 't3')
      .map((child) => child.data as RedditPost);
  }

  /**
   * Check if client is properly configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }
}

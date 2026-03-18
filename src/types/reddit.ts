/**
 * Reddit API Types
 * Types for Reddit API responses and content management
 */

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selftext: string;
  url: string;
  permalink: string;
  created_utc: number;
  score: number;
  num_comments: number;
  thumbnail?: string;
  link_flair_text?: string;
  is_video: boolean;
  over_18: boolean;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  created_utc: number;
  score: number;
  permalink: string;
  parent_id: string;
}

export interface RedditApiResponse {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    children: Array<{
      kind: string;
      data: RedditPost | RedditComment;
    }>;
  };
}

export interface RedditAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface RedditContentFilter {
  subreddits: string[];
  keywords: string[];
  excludeKeywords: string[];
  minScore?: number;
  maxAge?: number; // in hours
}

export interface ModeratedContent {
  post: RedditPost;
  isApproved: boolean;
  moderationFlags: string[];
  relevanceScore: number;
}

export interface RedditFetchOptions {
  subreddit?: string;
  limit?: number;
  after?: string;
  before?: string;
  timeFilter?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  sort?: 'hot' | 'new' | 'top' | 'rising';
}

export interface ContentModerationResult {
  isApproved: boolean;
  flags: string[];
  reason?: string;
}

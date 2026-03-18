/**
 * Reddit Service
 * High-level service combining client, filtering, and moderation
 */

import { RedditClient } from './redditClient';
import { RedditContentFilter } from './contentFilter';
import { RedditContentModerator } from './contentModerator';
import type { RedditFetchOptions, ModeratedContent } from '@/types/reddit';

export class RedditService {
  private client: RedditClient;

  constructor(clientId?: string, clientSecret?: string) {
    this.client = new RedditClient(clientId, clientSecret);
  }

  /**
   * Fetch Canadian football content from Reddit
   */
  async fetchCanadianFootballContent(
    options: RedditFetchOptions = {}
  ): Promise<ModeratedContent[]> {
    try {
      // Fetch from Canadian football subreddits
      const subreddits = RedditContentFilter.getRecommendedSubreddits();
      const posts = await this.client.fetchMultipleSubreddits(
        subreddits,
        options
      );

      // Filter for Canadian football relevance
      const relevantPosts =
        RedditContentFilter.filterCanadianFootballContent(posts);

      // Sort by relevance
      const sortedPosts = RedditContentFilter.sortByRelevance(relevantPosts);

      // Moderate content
      const moderatedContent =
        RedditContentModerator.moderatePosts(sortedPosts);

      // Return only approved content
      return RedditContentModerator.getApprovedContent(moderatedContent);
    } catch (error) {
      console.error('Error fetching Canadian football content:', error);
      return [];
    }
  }

  /**
   * Search for specific Canadian football topics
   */
  async searchCanadianFootballTopics(
    query: string,
    options: RedditFetchOptions = {}
  ): Promise<ModeratedContent[]> {
    try {
      const posts = await this.client.searchPosts(query, undefined, options);

      // Filter for Canadian football relevance
      const relevantPosts =
        RedditContentFilter.filterCanadianFootballContent(posts);

      // Moderate content
      const moderatedContent =
        RedditContentModerator.moderatePosts(relevantPosts);

      return RedditContentModerator.getApprovedContent(moderatedContent);
    } catch (error) {
      console.error('Error searching Canadian football topics:', error);
      return [];
    }
  }

  /**
   * Fetch content from specific subreddit with filtering
   */
  async fetchFromSubreddit(
    subreddit: string,
    options: RedditFetchOptions = {}
  ): Promise<ModeratedContent[]> {
    try {
      const posts = await this.client.fetchSubredditPosts(subreddit, options);

      // Filter for Canadian football relevance
      const relevantPosts =
        RedditContentFilter.filterCanadianFootballContent(posts);

      // Moderate content
      const moderatedContent =
        RedditContentModerator.moderatePosts(relevantPosts);

      return RedditContentModerator.getApprovedContent(moderatedContent);
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
      return [];
    }
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return this.client.isConfigured();
  }
}

/**
 * Reddit Content Filter
 * Filters and identifies relevant Canadian football content
 */

import type {
  RedditPost,
  RedditContentFilter as RedditContentFilterType,
} from '@/types/reddit';

export class RedditContentFilter {
  // Canadian football related keywords
  private static readonly CANADIAN_FOOTBALL_KEYWORDS = [
    'canada',
    'canadian',
    'canmnt',
    'canwnt',
    'cpl',
    'canadian premier league',
    'toronto fc',
    'tfc',
    'vancouver whitecaps',
    'whitecaps',
    'cf montreal',
    'montreal',
    'alphonso davies',
    'jonathan david',
    'atiba hutchinson',
    'world cup 2026',
    'concacaf',
    'gold cup',
    'nations league',
  ];

  // Subreddits relevant to Canadian football
  private static readonly CANADIAN_FOOTBALL_SUBREDDITS = [
    'CanadaSoccer',
    'CanadianPL',
    'MLS',
    'soccer',
    'football',
    'worldcup',
    'CONCACAF',
  ];

  /**
   * Filter posts for Canadian football relevance
   */
  static filterCanadianFootballContent(posts: RedditPost[]): RedditPost[] {
    return posts.filter((post) => this.isCanadianFootballRelated(post));
  }

  /**
   * Check if a post is related to Canadian football
   */
  static isCanadianFootballRelated(post: RedditPost): boolean {
    const searchText =
      `${post.title} ${post.selftext} ${post.link_flair_text || ''}`.toLowerCase();

    // Check if post contains Canadian football keywords
    return this.CANADIAN_FOOTBALL_KEYWORDS.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Apply custom filter to posts
   */
  static applyCustomFilter(
    posts: RedditPost[],
    filter: RedditContentFilterType
  ): RedditPost[] {
    return posts.filter((post) => {
      // Filter by subreddit
      if (
        filter.subreddits?.length > 0 &&
        !filter.subreddits.includes(post.subreddit)
      ) {
        return false;
      }

      // Filter by minimum score
      if (filter.minScore && post.score < filter.minScore) {
        return false;
      }

      // Filter by age
      if (filter.maxAge) {
        const postAge =
          (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60);
        if (postAge > filter.maxAge) {
          return false;
        }
      }

      const searchText = `${post.title} ${post.selftext}`.toLowerCase();

      // Check for required keywords
      if (filter.keywords?.length > 0) {
        const hasKeyword = filter.keywords.some((keyword) =>
          searchText.includes(keyword.toLowerCase())
        );
        if (!hasKeyword) return false;
      }

      // Check for excluded keywords
      if (filter.excludeKeywords?.length > 0) {
        const hasExcludedKeyword = filter.excludeKeywords.some((keyword) =>
          searchText.includes(keyword.toLowerCase())
        );
        if (hasExcludedKeyword) return false;
      }

      return true;
    });
  }

  /**
   * Calculate relevance score for a post
   */
  static calculateRelevanceScore(post: RedditPost): number {
    let score = 0;
    const searchText =
      `${post.title} ${post.selftext} ${post.link_flair_text || ''}`.toLowerCase();

    // Score based on keyword matches
    this.CANADIAN_FOOTBALL_KEYWORDS.forEach((keyword) => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    // Bonus for Canadian-specific subreddits
    if (['CanadaSoccer', 'CanadianPL'].includes(post.subreddit)) {
      score += 20;
    }

    // Score based on engagement
    score += Math.min(post.score / 10, 20); // Max 20 points from upvotes
    score += Math.min(post.num_comments / 5, 10); // Max 10 points from comments

    // Bonus for recent posts
    const hoursOld = (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60);
    if (hoursOld < 24) {
      score += 10;
    }

    return Math.round(score);
  }

  /**
   * Sort posts by relevance
   */
  static sortByRelevance(posts: RedditPost[]): RedditPost[] {
    return posts
      .map((post) => ({
        post,
        score: this.calculateRelevanceScore(post),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  }

  /**
   * Get recommended subreddits for Canadian football
   */
  static getRecommendedSubreddits(): string[] {
    return [...this.CANADIAN_FOOTBALL_SUBREDDITS];
  }
}

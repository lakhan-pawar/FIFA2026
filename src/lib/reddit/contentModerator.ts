/**
 * Reddit Content Moderator
 * Moderates content to ensure community guidelines compliance
 */

import type {
  RedditPost,
  ContentModerationResult,
  ModeratedContent,
} from '@/types/reddit';

export class RedditContentModerator {
  // Inappropriate content patterns
  private static readonly INAPPROPRIATE_PATTERNS = [
    /\b(fuck|shit|damn|hell|ass|bitch|bastard)\b/gi,
    /\b(racist|sexist|homophobic|transphobic)\b/gi,
  ];

  // Spam indicators
  private static readonly SPAM_PATTERNS = [
    /\b(click here|buy now|limited offer|act now)\b/gi,
    /\b(crypto|bitcoin|nft|investment opportunity)\b/gi,
    /(http[s]?:\/\/[^\s]+){3,}/gi, // Multiple URLs
  ];

  // Offensive content patterns
  private static readonly OFFENSIVE_PATTERNS = [
    /\b(hate|violence|threat|attack)\b/gi,
  ];

  /**
   * Moderate a single post
   */
  static moderatePost(post: RedditPost): ContentModerationResult {
    const flags: string[] = [];
    let isApproved = true;

    // Check for NSFW content
    if (post.over_18) {
      flags.push('nsfw');
      isApproved = false;
    }

    const contentText = `${post.title} ${post.selftext}`;

    // Check for inappropriate language
    if (this.containsInappropriateContent(contentText)) {
      flags.push('inappropriate_language');
      // Don't auto-reject for mild language, just flag
    }

    // Check for spam
    if (this.containsSpam(contentText)) {
      flags.push('spam');
      isApproved = false;
    }

    // Check for offensive content
    if (this.containsOffensiveContent(contentText)) {
      flags.push('offensive');
      isApproved = false;
    }

    // Check for deleted/removed content
    if (post.selftext === '[deleted]' || post.selftext === '[removed]') {
      flags.push('deleted');
      isApproved = false;
    }

    // Check for low quality (very short posts with no engagement)
    if (post.selftext.length < 20 && post.score < 5 && post.num_comments < 2) {
      flags.push('low_quality');
    }

    return {
      isApproved,
      flags,
      reason: flags.length > 0 ? flags.join(', ') : undefined,
    };
  }

  /**
   * Moderate multiple posts
   */
  static moderatePosts(posts: RedditPost[]): ModeratedContent[] {
    return posts.map((post) => {
      const moderation = this.moderatePost(post);
      const relevanceScore = this.calculateContentQuality(post);

      return {
        post,
        isApproved: moderation.isApproved,
        moderationFlags: moderation.flags,
        relevanceScore,
      };
    });
  }

  /**
   * Filter to only approved content
   */
  static getApprovedContent(
    moderatedContent: ModeratedContent[]
  ): ModeratedContent[] {
    return moderatedContent.filter((content) => content.isApproved);
  }

  /**
   * Check if content contains inappropriate language
   */
  private static containsInappropriateContent(text: string): boolean {
    return this.INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(text));
  }

  /**
   * Check if content is spam
   */
  private static containsSpam(text: string): boolean {
    return this.SPAM_PATTERNS.some((pattern) => pattern.test(text));
  }

  /**
   * Check if content is offensive
   */
  private static containsOffensiveContent(text: string): boolean {
    return this.OFFENSIVE_PATTERNS.some((pattern) => pattern.test(text));
  }

  /**
   * Calculate content quality score
   */
  private static calculateContentQuality(post: RedditPost): number {
    let score = 50; // Base score

    // Engagement metrics
    score += Math.min(post.score / 5, 20);
    score += Math.min(post.num_comments / 2, 15);

    // Content length (prefer substantial posts)
    if (post.selftext.length > 100) score += 10;
    if (post.selftext.length > 500) score += 5;

    // Recency bonus
    const hoursOld = (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60);
    if (hoursOld < 6) score += 10;
    else if (hoursOld < 24) score += 5;

    // Penalty for very low engagement
    if (post.score < 2 && post.num_comments === 0) score -= 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Get moderation statistics
   */
  static getModerationStats(moderatedContent: ModeratedContent[]): {
    total: number;
    approved: number;
    rejected: number;
    flagged: number;
    averageQuality: number;
  } {
    const approved = moderatedContent.filter((c) => c.isApproved).length;
    const flagged = moderatedContent.filter(
      (c) => c.moderationFlags.length > 0
    ).length;
    const averageQuality =
      moderatedContent.reduce((sum, c) => sum + c.relevanceScore, 0) /
      moderatedContent.length;

    return {
      total: moderatedContent.length,
      approved,
      rejected: moderatedContent.length - approved,
      flagged,
      averageQuality: Math.round(averageQuality),
    };
  }
}

/**
 * Content Filter Tests
 */

import { RedditContentFilter } from '../contentFilter';
import type { RedditPost } from '@/types/reddit';

describe('RedditContentFilter', () => {
  const mockCanadianPost: RedditPost = {
    id: '1',
    title: 'Canada qualifies for World Cup 2026!',
    author: 'testuser',
    subreddit: 'CanadaSoccer',
    selftext: 'Great news for Canadian football fans',
    url: 'https://reddit.com/r/CanadaSoccer/1',
    permalink: '/r/CanadaSoccer/1',
    created_utc: Date.now() / 1000,
    score: 100,
    num_comments: 50,
    is_video: false,
    over_18: false,
  };

  const mockNonCanadianPost: RedditPost = {
    id: '2',
    title: 'Premier League highlights',
    author: 'testuser2',
    subreddit: 'soccer',
    selftext: 'Manchester United vs Liverpool',
    url: 'https://reddit.com/r/soccer/2',
    permalink: '/r/soccer/2',
    created_utc: Date.now() / 1000,
    score: 50,
    num_comments: 20,
    is_video: false,
    over_18: false,
  };

  describe('isCanadianFootballRelated', () => {
    it('should identify Canadian football content', () => {
      expect(
        RedditContentFilter.isCanadianFootballRelated(mockCanadianPost)
      ).toBe(true);
    });

    it('should reject non-Canadian content', () => {
      expect(
        RedditContentFilter.isCanadianFootballRelated(mockNonCanadianPost)
      ).toBe(false);
    });
  });

  describe('filterCanadianFootballContent', () => {
    it('should filter posts for Canadian content', () => {
      const posts = [mockCanadianPost, mockNonCanadianPost];
      const filtered = RedditContentFilter.filterCanadianFootballContent(posts);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should calculate higher score for Canadian subreddit', () => {
      const score =
        RedditContentFilter.calculateRelevanceScore(mockCanadianPost);
      expect(score).toBeGreaterThan(0);
    });
  });
});

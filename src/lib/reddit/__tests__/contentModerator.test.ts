/**
 * Content Moderator Tests
 */

import { RedditContentModerator } from '../contentModerator';
import type { RedditPost } from '@/types/reddit';

describe('RedditContentModerator', () => {
  const mockCleanPost: RedditPost = {
    id: '1',
    title: 'Canada wins match',
    author: 'testuser',
    subreddit: 'CanadaSoccer',
    selftext: 'Great performance by the team',
    url: 'https://reddit.com/1',
    permalink: '/r/CanadaSoccer/1',
    created_utc: Date.now() / 1000,
    score: 100,
    num_comments: 50,
    is_video: false,
    over_18: false,
  };

  const mockNSFWPost: RedditPost = {
    ...mockCleanPost,
    id: '2',
    over_18: true,
  };

  describe('moderatePost', () => {
    it('should approve clean content', () => {
      const result = RedditContentModerator.moderatePost(mockCleanPost);
      expect(result.isApproved).toBe(true);
      expect(result.flags).toHaveLength(0);
    });

    it('should reject NSFW content', () => {
      const result = RedditContentModerator.moderatePost(mockNSFWPost);
      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('nsfw');
    });
  });

  describe('moderatePosts', () => {
    it('should moderate multiple posts', () => {
      const posts = [mockCleanPost, mockNSFWPost];
      const moderated = RedditContentModerator.moderatePosts(posts);
      expect(moderated).toHaveLength(2);
    });
  });
});

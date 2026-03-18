-- Fan Engagement System Migration
-- Adds tables for reactions, comments, engagement metrics, and user reputation

-- Create reaction type enum
CREATE TYPE reaction_type AS ENUM ('goal', 'save', 'foul', 'card', 'celebration', 'disappointment', 'excitement', 'anger');

-- Create sentiment enum
CREATE TYPE sentiment_type AS ENUM ('positive', 'negative', 'neutral');

-- Match reactions table
CREATE TABLE public.match_reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL, -- External match identifier
  reaction_type reaction_type NOT NULL,
  sentiment sentiment_type DEFAULT 'neutral',
  minute INTEGER, -- Match minute when reaction was posted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match comments table
CREATE TABLE public.match_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL, -- External match identifier
  content TEXT NOT NULL,
  sentiment sentiment_type DEFAULT 'neutral',
  minute INTEGER, -- Match minute when comment was posted
  parent_comment_id UUID REFERENCES public.match_comments(id) ON DELETE CASCADE, -- For threaded replies
  is_moderated BOOLEAN DEFAULT false,
  moderation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User engagement metrics table
CREATE TABLE public.user_engagement_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total_reactions INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  total_replies_received INTEGER DEFAULT 0,
  engagement_score DECIMAL(10, 2) DEFAULT 0.00,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User reputation table
CREATE TABLE public.user_reputation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reputation_score INTEGER DEFAULT 0,
  quality_score DECIMAL(5, 2) DEFAULT 0.00, -- Based on community engagement quality
  helpful_count INTEGER DEFAULT 0, -- Number of times marked as helpful
  reported_count INTEGER DEFAULT 0, -- Number of times reported
  moderation_strikes INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]', -- Array of earned badges
  level INTEGER DEFAULT 1, -- User level based on reputation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Comment likes table
CREATE TABLE public.comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.match_comments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Match buzz aggregation table (for real-time sentiment tracking)
CREATE TABLE public.match_buzz (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id TEXT NOT NULL,
  time_window TIMESTAMP WITH TIME ZONE NOT NULL, -- 5-minute windows
  total_reactions INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  positive_sentiment_count INTEGER DEFAULT 0,
  negative_sentiment_count INTEGER DEFAULT 0,
  neutral_sentiment_count INTEGER DEFAULT 0,
  top_reactions JSONB DEFAULT '{}', -- Count of each reaction type
  buzz_score DECIMAL(10, 2) DEFAULT 0.00, -- Calculated buzz intensity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, time_window)
);

-- Create indexes for performance
CREATE INDEX idx_match_reactions_user_id ON public.match_reactions(user_id);
CREATE INDEX idx_match_reactions_match_id ON public.match_reactions(match_id);
CREATE INDEX idx_match_reactions_created_at ON public.match_reactions(created_at DESC);

CREATE INDEX idx_match_comments_user_id ON public.match_comments(user_id);
CREATE INDEX idx_match_comments_match_id ON public.match_comments(match_id);
CREATE INDEX idx_match_comments_parent_id ON public.match_comments(parent_comment_id);
CREATE INDEX idx_match_comments_created_at ON public.match_comments(created_at DESC);

CREATE INDEX idx_user_engagement_metrics_user_id ON public.user_engagement_metrics(user_id);
CREATE INDEX idx_user_engagement_metrics_score ON public.user_engagement_metrics(engagement_score DESC);

CREATE INDEX idx_user_reputation_user_id ON public.user_reputation(user_id);
CREATE INDEX idx_user_reputation_score ON public.user_reputation(reputation_score DESC);

CREATE INDEX idx_comment_likes_user_id ON public.comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes(comment_id);

CREATE INDEX idx_match_buzz_match_id ON public.match_buzz(match_id);
CREATE INDEX idx_match_buzz_time_window ON public.match_buzz(time_window DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_match_comments_updated_at BEFORE UPDATE ON public.match_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_engagement_metrics_updated_at BEFORE UPDATE ON public.user_engagement_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_reputation_updated_at BEFORE UPDATE ON public.user_reputation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_match_buzz_updated_at BEFORE UPDATE ON public.match_buzz FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.match_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_buzz ENABLE ROW LEVEL SECURITY;

-- RLS Policies for match_reactions
CREATE POLICY "Anyone can view reactions" ON public.match_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON public.match_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.match_reactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for match_comments
CREATE POLICY "Anyone can view non-moderated comments" ON public.match_comments FOR SELECT USING (is_moderated = false OR auth.uid() = user_id);
CREATE POLICY "Users can insert own comments" ON public.match_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.match_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.match_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_engagement_metrics
CREATE POLICY "Anyone can view engagement metrics" ON public.user_engagement_metrics FOR SELECT USING (true);
CREATE POLICY "Users can insert own metrics" ON public.user_engagement_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON public.user_engagement_metrics FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_reputation
CREATE POLICY "Anyone can view reputation" ON public.user_reputation FOR SELECT USING (true);
CREATE POLICY "Users can insert own reputation" ON public.user_reputation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reputation" ON public.user_reputation FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for comment_likes
CREATE POLICY "Anyone can view likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for match_buzz
CREATE POLICY "Anyone can view match buzz" ON public.match_buzz FOR SELECT USING (true);

-- Function to update engagement metrics when reactions are added
CREATE OR REPLACE FUNCTION update_engagement_on_reaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_engagement_metrics (user_id, total_reactions, last_active_at)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_reactions = user_engagement_metrics.total_reactions + 1,
    last_active_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement_on_reaction
AFTER INSERT ON public.match_reactions
FOR EACH ROW EXECUTE FUNCTION update_engagement_on_reaction();

-- Function to update engagement metrics when comments are added
CREATE OR REPLACE FUNCTION update_engagement_on_comment()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_engagement_metrics (user_id, total_comments, last_active_at)
  VALUES (NEW.user_id, 1, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_comments = user_engagement_metrics.total_comments + 1,
    last_active_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement_on_comment
AFTER INSERT ON public.match_comments
FOR EACH ROW EXECUTE FUNCTION update_engagement_on_comment();

-- Function to update reputation when comment receives likes
CREATE OR REPLACE FUNCTION update_reputation_on_like()
RETURNS TRIGGER AS $$
DECLARE
  comment_author_id UUID;
BEGIN
  -- Get the author of the comment
  SELECT user_id INTO comment_author_id
  FROM public.match_comments
  WHERE id = NEW.comment_id;
  
  -- Update engagement metrics for likes received
  UPDATE public.user_engagement_metrics
  SET total_likes_received = total_likes_received + 1
  WHERE user_id = comment_author_id;
  
  -- Update reputation score
  INSERT INTO public.user_reputation (user_id, reputation_score, helpful_count)
  VALUES (comment_author_id, 5, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    reputation_score = user_reputation.reputation_score + 5,
    helpful_count = user_reputation.helpful_count + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reputation_on_like
AFTER INSERT ON public.comment_likes
FOR EACH ROW EXECUTE FUNCTION update_reputation_on_like();

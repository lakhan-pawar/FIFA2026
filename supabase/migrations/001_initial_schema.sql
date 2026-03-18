-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_theme AS ENUM ('light', 'dark', 'system');
CREATE TYPE rush_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE interaction_type AS ENUM ('like', 'comment', 'share', 'reaction');
CREATE TYPE prediction_status AS ENUM ('pending', 'correct', 'incorrect');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  theme user_theme DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  favorite_teams TEXT[] DEFAULT '{}',
  favorite_leagues TEXT[] DEFAULT '{}',
  preferred_ai_agents TEXT[] DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  dashboard_widgets TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Venues table for Toronto watch parties
CREATE TABLE public.venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity INTEGER,
  current_rush_level rush_level DEFAULT 'low',
  fan_demographics JSONB DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue check-ins table
CREATE TABLE public.venue_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT, -- External match identifier
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social interactions table
CREATE TABLE public.social_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type interaction_type NOT NULL,
  content TEXT,
  match_id TEXT, -- External match identifier
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament brackets table
CREATE TABLE public.tournament_brackets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tournament_id TEXT NOT NULL, -- External tournament identifier
  year INTEGER NOT NULL,
  structure JSONB NOT NULL, -- Bracket structure and matches
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User bracket predictions table
CREATE TABLE public.bracket_predictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  bracket_id UUID REFERENCES public.tournament_brackets(id) ON DELETE CASCADE NOT NULL,
  predictions JSONB NOT NULL, -- User's predictions for the bracket
  accuracy_score DECIMAL(5, 2) DEFAULT 0.00,
  status prediction_status DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bracket_id)
);

-- AI agent interactions table
CREATE TABLE public.ai_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  agent_name TEXT NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match data cache table
CREATE TABLE public.match_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  external_match_id TEXT UNIQUE NOT NULL,
  match_data JSONB NOT NULL,
  league TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_venue_checkins_user_id ON public.venue_checkins(user_id);
CREATE INDEX idx_venue_checkins_venue_id ON public.venue_checkins(venue_id);
CREATE INDEX idx_venue_checkins_match_id ON public.venue_checkins(match_id);
CREATE INDEX idx_social_interactions_user_id ON public.social_interactions(user_id);
CREATE INDEX idx_social_interactions_match_id ON public.social_interactions(match_id);
CREATE INDEX idx_bracket_predictions_user_id ON public.bracket_predictions(user_id);
CREATE INDEX idx_bracket_predictions_bracket_id ON public.bracket_predictions(bracket_id);
CREATE INDEX idx_ai_interactions_user_id ON public.ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_agent_name ON public.ai_interactions(agent_name);
CREATE INDEX idx_match_cache_external_id ON public.match_cache(external_match_id);
CREATE INDEX idx_match_cache_league ON public.match_cache(league);
CREATE INDEX idx_match_cache_date ON public.match_cache(match_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournament_brackets_updated_at BEFORE UPDATE ON public.tournament_brackets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bracket_predictions_updated_at BEFORE UPDATE ON public.bracket_predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bracket_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Venue check-ins policies
CREATE POLICY "Users can view own checkins" ON public.venue_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON public.venue_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON public.venue_checkins FOR UPDATE USING (auth.uid() = user_id);

-- Social interactions policies
CREATE POLICY "Users can view all interactions" ON public.social_interactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own interactions" ON public.social_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON public.social_interactions FOR UPDATE USING (auth.uid() = user_id);

-- Bracket predictions policies
CREATE POLICY "Users can view own predictions" ON public.bracket_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions" ON public.bracket_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON public.bracket_predictions FOR UPDATE USING (auth.uid() = user_id);

-- AI interactions policies
CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI interactions" ON public.ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for venues, tournament brackets, and match cache
CREATE POLICY "Anyone can view venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Anyone can view tournament brackets" ON public.tournament_brackets FOR SELECT USING (true);
CREATE POLICY "Anyone can view match cache" ON public.match_cache FOR SELECT USING (true);

-- Insert some sample Toronto venues
INSERT INTO public.venues (name, address, latitude, longitude, capacity, fan_demographics, amenities) VALUES
('The Pint Public House', '221 Carlton St, Toronto, ON M5A 2L2', 43.6616, -79.3776, 150, '{"premier_league": 40, "mls": 30, "champions_league": 30}', '{"big_screens", "food", "patio"}'),
('Scallywags', '11 St Clair Ave W, Toronto, ON M4V 1K6', 43.6868, -79.3932, 200, '{"premier_league": 50, "bundesliga": 25, "serie_a": 25}', '{"multiple_screens", "food", "bar"}'),
('Football Factory', '11 Polson St, Toronto, ON M5A 1A4', 43.6426, -79.3576, 300, '{"premier_league": 35, "mls": 35, "international": 30}', '{"large_screens", "food", "waterfront_view"}'),
('Brazen Head Irish Pub', '1 Yonge St, Toronto, ON M5E 1E5', 43.6426, -79.3776, 180, '{"premier_league": 45, "champions_league": 35, "irish_league": 20}', '{"authentic_pub", "food", "downtown_location"}'),
('Real Sports Bar & Grill', '15 York St, Toronto, ON M5J 0A3', 43.6426, -79.3776, 500, '{"all_leagues": 100}', '{"massive_screens", "full_restaurant", "sports_memorabilia"}')
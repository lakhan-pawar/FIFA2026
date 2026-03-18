export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          agent_name: string;
          context: Json | null;
          created_at: string | null;
          id: string;
          query: string;
          response: string;
          user_id: string;
        };
        Insert: {
          agent_name: string;
          context?: Json | null;
          created_at?: string | null;
          id?: string;
          query: string;
          response: string;
          user_id: string;
        };
        Update: {
          agent_name?: string;
          context?: Json | null;
          created_at?: string | null;
          id?: string;
          query?: string;
          response?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      bracket_predictions: {
        Row: {
          accuracy_score: number | null;
          bracket_id: string;
          created_at: string | null;
          id: string;
          predictions: Json;
          status: Database['public']['Enums']['prediction_status'] | null;
          submitted_at: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          accuracy_score?: number | null;
          bracket_id: string;
          created_at?: string | null;
          id?: string;
          predictions: Json;
          status?: Database['public']['Enums']['prediction_status'] | null;
          submitted_at?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          accuracy_score?: number | null;
          bracket_id?: string;
          created_at?: string | null;
          id?: string;
          predictions?: Json;
          status?: Database['public']['Enums']['prediction_status'] | null;
          submitted_at?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bracket_predictions_bracket_id_fkey';
            columns: ['bracket_id'];
            isOneToOne: false;
            referencedRelation: 'tournament_brackets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bracket_predictions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      match_reactions: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          reaction_type: Database['public']['Enums']['reaction_type'];
          sentiment: Database['public']['Enums']['sentiment_type'] | null;
          minute: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          reaction_type: Database['public']['Enums']['reaction_type'];
          sentiment?: Database['public']['Enums']['sentiment_type'] | null;
          minute?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          reaction_type?: Database['public']['Enums']['reaction_type'];
          sentiment?: Database['public']['Enums']['sentiment_type'] | null;
          minute?: number | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'match_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      match_comments: {
        Row: {
          id: string;
          user_id: string;
          match_id: string;
          content: string;
          sentiment: Database['public']['Enums']['sentiment_type'] | null;
          minute: number | null;
          parent_comment_id: string | null;
          is_moderated: boolean | null;
          moderation_reason: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          content: string;
          sentiment?: Database['public']['Enums']['sentiment_type'] | null;
          minute?: number | null;
          parent_comment_id?: string | null;
          is_moderated?: boolean | null;
          moderation_reason?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_id?: string;
          content?: string;
          sentiment?: Database['public']['Enums']['sentiment_type'] | null;
          minute?: number | null;
          parent_comment_id?: string | null;
          is_moderated?: boolean | null;
          moderation_reason?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'match_comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'match_comments_parent_comment_id_fkey';
            columns: ['parent_comment_id'];
            isOneToOne: false;
            referencedRelation: 'match_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      user_engagement_metrics: {
        Row: {
          id: string;
          user_id: string;
          total_reactions: number | null;
          total_comments: number | null;
          total_likes_received: number | null;
          total_replies_received: number | null;
          engagement_score: number | null;
          last_active_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_reactions?: number | null;
          total_comments?: number | null;
          total_likes_received?: number | null;
          total_replies_received?: number | null;
          engagement_score?: number | null;
          last_active_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_reactions?: number | null;
          total_comments?: number | null;
          total_likes_received?: number | null;
          total_replies_received?: number | null;
          engagement_score?: number | null;
          last_active_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_engagement_metrics_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_reputation: {
        Row: {
          id: string;
          user_id: string;
          reputation_score: number | null;
          quality_score: number | null;
          helpful_count: number | null;
          reported_count: number | null;
          moderation_strikes: number | null;
          badges: Json | null;
          level: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          reputation_score?: number | null;
          quality_score?: number | null;
          helpful_count?: number | null;
          reported_count?: number | null;
          moderation_strikes?: number | null;
          badges?: Json | null;
          level?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          reputation_score?: number | null;
          quality_score?: number | null;
          helpful_count?: number | null;
          reported_count?: number | null;
          moderation_strikes?: number | null;
          badges?: Json | null;
          level?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_reputation_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      comment_likes: {
        Row: {
          id: string;
          user_id: string;
          comment_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          comment_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          comment_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_likes_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'match_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      match_buzz: {
        Row: {
          id: string;
          match_id: string;
          time_window: string;
          total_reactions: number | null;
          total_comments: number | null;
          positive_sentiment_count: number | null;
          negative_sentiment_count: number | null;
          neutral_sentiment_count: number | null;
          top_reactions: Json | null;
          buzz_score: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          time_window: string;
          total_reactions?: number | null;
          total_comments?: number | null;
          positive_sentiment_count?: number | null;
          negative_sentiment_count?: number | null;
          neutral_sentiment_count?: number | null;
          top_reactions?: Json | null;
          buzz_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          time_window?: string;
          total_reactions?: number | null;
          total_comments?: number | null;
          positive_sentiment_count?: number | null;
          negative_sentiment_count?: number | null;
          neutral_sentiment_count?: number | null;
          top_reactions?: Json | null;
          buzz_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      match_cache: {
        Row: {
          created_at: string | null;
          external_match_id: string;
          id: string;
          last_updated: string | null;
          league: string;
          match_data: Json;
          match_date: string;
          status: string;
        };
        Insert: {
          created_at?: string | null;
          external_match_id: string;
          id?: string;
          last_updated?: string | null;
          league: string;
          match_data: Json;
          match_date: string;
          status: string;
        };
        Update: {
          created_at?: string | null;
          external_match_id?: string;
          id?: string;
          last_updated?: string | null;
          league?: string;
          match_data?: Json;
          match_date?: string;
          status?: string;
        };
        Relationships: [];
      };
      social_interactions: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          interaction_type: Database['public']['Enums']['interaction_type'];
          match_id: string | null;
          metadata: Json | null;
          user_id: string;
          venue_id: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          interaction_type: Database['public']['Enums']['interaction_type'];
          match_id?: string | null;
          metadata?: Json | null;
          user_id: string;
          venue_id?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          interaction_type?: Database['public']['Enums']['interaction_type'];
          match_id?: string | null;
          metadata?: Json | null;
          user_id?: string;
          venue_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'social_interactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'social_interactions_venue_id_fkey';
            columns: ['venue_id'];
            isOneToOne: false;
            referencedRelation: 'venues';
            referencedColumns: ['id'];
          },
        ];
      };
      tournament_brackets: {
        Row: {
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          structure: Json;
          tournament_id: string;
          updated_at: string | null;
          year: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          structure: Json;
          tournament_id: string;
          updated_at?: string | null;
          year: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          structure?: Json;
          tournament_id?: string;
          updated_at?: string | null;
          year?: number;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          created_at: string | null;
          dashboard_widgets: string[] | null;
          favorite_leagues: string[] | null;
          favorite_teams: string[] | null;
          id: string;
          notification_settings: Json | null;
          preferred_ai_agents: string[] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          dashboard_widgets?: string[] | null;
          favorite_leagues?: string[] | null;
          favorite_teams?: string[] | null;
          id?: string;
          notification_settings?: Json | null;
          preferred_ai_agents?: string[] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          dashboard_widgets?: string[] | null;
          favorite_leagues?: string[] | null;
          favorite_teams?: string[] | null;
          id?: string;
          notification_settings?: Json | null;
          preferred_ai_agents?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          theme: Database['public']['Enums']['user_theme'] | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          theme?: Database['public']['Enums']['user_theme'] | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          theme?: Database['public']['Enums']['user_theme'] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      venue_checkins: {
        Row: {
          checked_in_at: string | null;
          checked_out_at: string | null;
          created_at: string | null;
          id: string;
          match_id: string | null;
          user_id: string;
          venue_id: string;
        };
        Insert: {
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string | null;
          id?: string;
          match_id?: string | null;
          user_id: string;
          venue_id: string;
        };
        Update: {
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string | null;
          id?: string;
          match_id?: string | null;
          user_id?: string;
          venue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'venue_checkins_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'venue_checkins_venue_id_fkey';
            columns: ['venue_id'];
            isOneToOne: false;
            referencedRelation: 'venues';
            referencedColumns: ['id'];
          },
        ];
      };
      venues: {
        Row: {
          address: string;
          amenities: string[] | null;
          capacity: number | null;
          created_at: string | null;
          current_rush_level: Database['public']['Enums']['rush_level'] | null;
          fan_demographics: Json | null;
          id: string;
          latitude: number;
          longitude: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          address: string;
          amenities?: string[] | null;
          capacity?: number | null;
          created_at?: string | null;
          current_rush_level?: Database['public']['Enums']['rush_level'] | null;
          fan_demographics?: Json | null;
          id?: string;
          latitude: number;
          longitude: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string;
          amenities?: string[] | null;
          capacity?: number | null;
          created_at?: string | null;
          current_rush_level?: Database['public']['Enums']['rush_level'] | null;
          fan_demographics?: Json | null;
          id?: string;
          latitude?: number;
          longitude?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_consent: {
        Row: {
          id: string;
          user_id: string;
          consent_settings: Json;
          consent_date: string;
          ip_address: string | null;
          user_agent: string | null;
          version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_settings: Json;
          consent_date: string;
          ip_address?: string | null;
          user_agent?: string | null;
          version: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          consent_settings?: Json;
          consent_date?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_consent_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      data_export_requests: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at: string;
          completed_at: string | null;
          download_url: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at: string;
          completed_at?: string | null;
          download_url?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at?: string;
          completed_at?: string | null;
          download_url?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'data_export_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      data_deletion_requests: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at: string;
          completed_at: string | null;
          reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at: string;
          completed_at?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          requested_at?: string;
          completed_at?: string | null;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'data_deletion_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      interaction_type: 'like' | 'comment' | 'share' | 'reaction';
      prediction_status: 'pending' | 'correct' | 'incorrect';
      rush_level: 'low' | 'medium' | 'high';
      user_theme: 'light' | 'dark' | 'system';
      reaction_type:
        | 'goal'
        | 'save'
        | 'foul'
        | 'card'
        | 'celebration'
        | 'disappointment'
        | 'excitement'
        | 'anger';
      sentiment_type: 'positive' | 'negative' | 'neutral';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience types for easier usage
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type UserPreferences =
  Database['public']['Tables']['user_preferences']['Row'];
export type UserPreferencesInsert =
  Database['public']['Tables']['user_preferences']['Insert'];
export type UserPreferencesUpdate =
  Database['public']['Tables']['user_preferences']['Update'];

export type Venue = Database['public']['Tables']['venues']['Row'];
export type VenueInsert = Database['public']['Tables']['venues']['Insert'];
export type VenueUpdate = Database['public']['Tables']['venues']['Update'];

export type VenueCheckin =
  Database['public']['Tables']['venue_checkins']['Row'];
export type VenueCheckinInsert =
  Database['public']['Tables']['venue_checkins']['Insert'];
export type VenueCheckinUpdate =
  Database['public']['Tables']['venue_checkins']['Update'];

export type SocialInteraction =
  Database['public']['Tables']['social_interactions']['Row'];
export type SocialInteractionInsert =
  Database['public']['Tables']['social_interactions']['Insert'];
export type SocialInteractionUpdate =
  Database['public']['Tables']['social_interactions']['Update'];

export type TournamentBracket =
  Database['public']['Tables']['tournament_brackets']['Row'];
export type TournamentBracketInsert =
  Database['public']['Tables']['tournament_brackets']['Insert'];
export type TournamentBracketUpdate =
  Database['public']['Tables']['tournament_brackets']['Update'];

export type BracketPrediction =
  Database['public']['Tables']['bracket_predictions']['Row'];
export type BracketPredictionInsert =
  Database['public']['Tables']['bracket_predictions']['Insert'];
export type BracketPredictionUpdate =
  Database['public']['Tables']['bracket_predictions']['Update'];

export type AIInteraction =
  Database['public']['Tables']['ai_interactions']['Row'];
export type AIInteractionInsert =
  Database['public']['Tables']['ai_interactions']['Insert'];
export type AIInteractionUpdate =
  Database['public']['Tables']['ai_interactions']['Update'];

export type MatchCache = Database['public']['Tables']['match_cache']['Row'];
export type MatchCacheInsert =
  Database['public']['Tables']['match_cache']['Insert'];
export type MatchCacheUpdate =
  Database['public']['Tables']['match_cache']['Update'];

// Fan engagement types
export type MatchReaction =
  Database['public']['Tables']['match_reactions']['Row'];
export type MatchReactionInsert =
  Database['public']['Tables']['match_reactions']['Insert'];
export type MatchReactionUpdate =
  Database['public']['Tables']['match_reactions']['Update'];

export type MatchComment =
  Database['public']['Tables']['match_comments']['Row'];
export type MatchCommentInsert =
  Database['public']['Tables']['match_comments']['Insert'];
export type MatchCommentUpdate =
  Database['public']['Tables']['match_comments']['Update'];

export type UserEngagementMetrics =
  Database['public']['Tables']['user_engagement_metrics']['Row'];
export type UserEngagementMetricsInsert =
  Database['public']['Tables']['user_engagement_metrics']['Insert'];
export type UserEngagementMetricsUpdate =
  Database['public']['Tables']['user_engagement_metrics']['Update'];

export type UserReputation =
  Database['public']['Tables']['user_reputation']['Row'];
export type UserReputationInsert =
  Database['public']['Tables']['user_reputation']['Insert'];
export type UserReputationUpdate =
  Database['public']['Tables']['user_reputation']['Update'];

export type CommentLike = Database['public']['Tables']['comment_likes']['Row'];
export type CommentLikeInsert =
  Database['public']['Tables']['comment_likes']['Insert'];
export type CommentLikeUpdate =
  Database['public']['Tables']['comment_likes']['Update'];

export type MatchBuzz = Database['public']['Tables']['match_buzz']['Row'];
export type MatchBuzzInsert =
  Database['public']['Tables']['match_buzz']['Insert'];
export type MatchBuzzUpdate =
  Database['public']['Tables']['match_buzz']['Update'];

// Enum types
export type UserTheme = Database['public']['Enums']['user_theme'];
export type RushLevel = Database['public']['Enums']['rush_level'];
export type InteractionType = Database['public']['Enums']['interaction_type'];
export type PredictionStatus = Database['public']['Enums']['prediction_status'];
export type ReactionType = Database['public']['Enums']['reaction_type'];
export type SentimentType = Database['public']['Enums']['sentiment_type'];
// Privacy and consent types
export type UserConsent = Database['public']['Tables']['user_consent']['Row'];
export type UserConsentInsert =
  Database['public']['Tables']['user_consent']['Insert'];
export type UserConsentUpdate =
  Database['public']['Tables']['user_consent']['Update'];

export type DataExportRequest =
  Database['public']['Tables']['data_export_requests']['Row'];
export type DataExportRequestInsert =
  Database['public']['Tables']['data_export_requests']['Insert'];
export type DataExportRequestUpdate =
  Database['public']['Tables']['data_export_requests']['Update'];

export type DataDeletionRequest =
  Database['public']['Tables']['data_deletion_requests']['Row'];
export type DataDeletionRequestInsert =
  Database['public']['Tables']['data_deletion_requests']['Insert'];
export type DataDeletionRequestUpdate =
  Database['public']['Tables']['data_deletion_requests']['Update'];

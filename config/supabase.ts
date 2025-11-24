import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Database types helper
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          email: string;
          role: 'PLAYER' | 'COACH' | 'PARENT';
          age: number | null;
          skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | null;
          positions: string[] | null;
          goals: string[] | null;
          avatar_url: string | null;
          xp_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          email: string;
          role: 'PLAYER' | 'COACH' | 'PARENT';
          age?: number | null;
          skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | null;
          positions?: string[] | null;
          goals?: string[] | null;
          avatar_url?: string | null;
          xp_points?: number;
        };
        Update: {
          username?: string;
          full_name?: string | null;
          email?: string;
          role?: 'PLAYER' | 'COACH' | 'PARENT';
          age?: number | null;
          skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | null;
          positions?: string[] | null;
          goals?: string[] | null;
          avatar_url?: string | null;
          xp_points?: number;
        };
      };
      scheduled_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          session_type: 'TRAINING' | 'GAME' | 'LESSON';
          scheduled_date: string;
          scheduled_time: string;
          duration_minutes: number;
          location: string | null;
          status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      imported_videos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          cloudinary_public_id: string;
          cloudinary_url: string;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          file_size_bytes: number | null;
          mime_type: string | null;
          tags: string[] | null;
          upload_date: string;
          created_at: string;
        };
      };
      analysis_results: {
        Row: {
          id: string;
          user_id: string;
          video_id: string | null;
          photo_id: string | null;
          analysis_type: 'VIDEO_MECHANICS' | 'PHOTO_MECHANICS' | 'MENTAL_GAME';
          feedback_text: string;
          form_score: number | null;
          strengths: string[] | null;
          weaknesses: string[] | null;
          recommended_drills: any;
          analysis_date: string;
          created_at: string;
        };
      };
    };
  };
};

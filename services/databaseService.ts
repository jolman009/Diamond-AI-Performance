import { supabase } from '../config/supabase';

// =============================================
// USER PROFILES
// =============================================
export interface UserProfileData {
  id?: string;
  username: string;
  full_name?: string;
  email: string;
  role: 'PLAYER' | 'COACH' | 'PARENT';
  age?: number;
  skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  positions?: string[];
  goals?: string[];
  avatar_url?: string;
  xp_points?: number;
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfileData>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// =============================================
// SCHEDULED SESSIONS
// =============================================
export interface ScheduledSessionData {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  session_type: 'TRAINING' | 'GAME' | 'LESSON';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number;
  location?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export const getScheduledSessions = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('scheduled_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true })
    .limit(limit);

  return { data, error };
};

export const createScheduledSession = async (sessionData: ScheduledSessionData) => {
  const { data, error } = await supabase
    .from('scheduled_sessions')
    .insert(sessionData)
    .select()
    .single();

  return { data, error };
};

export const updateScheduledSession = async (sessionId: string, updates: Partial<ScheduledSessionData>) => {
  const { data, error } = await supabase
    .from('scheduled_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  return { data, error };
};

export const deleteScheduledSession = async (sessionId: string) => {
  const { error } = await supabase
    .from('scheduled_sessions')
    .delete()
    .eq('id', sessionId);

  return { error };
};

// =============================================
// IMPORTED VIDEOS
// =============================================
export interface ImportedVideoData {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  file_size_bytes?: number;
  mime_type?: string;
  tags?: string[];
}

export const getImportedVideos = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('imported_videos')
    .select('*')
    .eq('user_id', userId)
    .order('upload_date', { ascending: false })
    .limit(limit);

  return { data, error };
};

export const createImportedVideo = async (videoData: ImportedVideoData) => {
  const { data, error } = await supabase
    .from('imported_videos')
    .insert(videoData)
    .select()
    .single();

  return { data, error };
};

export const deleteImportedVideo = async (videoId: string) => {
  const { error } = await supabase
    .from('imported_videos')
    .delete()
    .eq('id', videoId);

  return { error };
};

// =============================================
// SESSION PHOTOS
// =============================================
export interface SessionPhotoData {
  id?: string;
  user_id?: string;
  session_id?: string;
  title?: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  thumbnail_url?: string;
  tags?: string[];
  notes?: string;
}

export const getSessionPhotos = async (userId: string, sessionId?: string, limit = 50) => {
  let query = supabase
    .from('session_photos')
    .select('*')
    .eq('user_id', userId)
    .order('capture_date', { ascending: false })
    .limit(limit);

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createSessionPhoto = async (photoData: SessionPhotoData) => {
  const { data, error } = await supabase
    .from('session_photos')
    .insert(photoData)
    .select()
    .single();

  return { data, error };
};

export const deleteSessionPhoto = async (photoId: string) => {
  const { error } = await supabase
    .from('session_photos')
    .delete()
    .eq('id', photoId);

  return { error };
};

// =============================================
// ANALYSIS RESULTS
// =============================================
export interface AnalysisResultData {
  id?: string;
  user_id?: string;
  video_id?: string;
  photo_id?: string;
  analysis_type: 'VIDEO_MECHANICS' | 'PHOTO_MECHANICS' | 'MENTAL_GAME';
  feedback_text: string;
  form_score?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommended_drills?: any;
}

export const getAnalysisResults = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('user_id', userId)
    .order('analysis_date', { ascending: false })
    .limit(limit);

  return { data, error };
};

export const createAnalysisResult = async (analysisData: AnalysisResultData) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .insert(analysisData)
    .select()
    .single();

  return { data, error };
};

export const getAnalysisResultByVideo = async (videoId: string) => {
  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('video_id', videoId)
    .order('analysis_date', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

// =============================================
// TRAINING MODULES
// =============================================
export interface TrainingModuleData {
  id?: string;
  title: string;
  description?: string;
  category: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
  age_group?: 'JUNIOR' | 'SENIOR' | 'ALL';
  duration_minutes?: number;
  drills: any;
  video_demo_url?: string;
  thumbnail_url?: string;
  is_public?: boolean;
  created_by?: string;
}

export const getTrainingModules = async (filters?: {
  category?: string;
  difficulty?: string;
  ageGroup?: string;
  limit?: number;
}) => {
  let query = supabase
    .from('training_modules')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters?.ageGroup) {
    query = query.eq('age_group', filters.ageGroup);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createTrainingModule = async (moduleData: TrainingModuleData) => {
  const { data, error } = await supabase
    .from('training_modules')
    .insert(moduleData)
    .select()
    .single();

  return { data, error };
};

// =============================================
// USER TRAINING PROGRESS
// =============================================
export interface UserTrainingProgressData {
  id?: string;
  user_id?: string;
  module_id: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completion_percentage?: number;
  completed_drills?: string[];
  notes?: string;
}

export const getUserTrainingProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_training_progress')
    .select('*, training_modules(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  return { data, error };
};

export const updateTrainingProgress = async (
  userId: string,
  moduleId: string,
  updates: Partial<UserTrainingProgressData>
) => {
  const { data, error } = await supabase
    .from('user_training_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        ...updates,
      },
      {
        onConflict: 'user_id,module_id',
      }
    )
    .select()
    .single();

  return { data, error };
};

// =============================================
// ACHIEVEMENTS
// =============================================
export const getAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('xp_value', { ascending: false });

  return { data, error };
};

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  return { data, error };
};

export const unlockAchievement = async (userId: string, achievementId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
    })
    .select()
    .single();

  return { data, error };
};

// =============================================
// RECRUITING PROFILES
// =============================================
export interface RecruitingProfileData {
  id?: string;
  user_id?: string;
  bio?: string;
  stats?: any;
  highlight_video_url?: string;
  gpa?: number;
  grad_year?: number;
  height?: string;
  weight?: number;
  positions?: string[];
  contact_email?: string;
  contact_phone?: string;
  social_media?: any;
  is_public?: boolean;
}

export const getRecruitingProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('recruiting_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

export const upsertRecruitingProfile = async (userId: string, profileData: RecruitingProfileData) => {
  const { data, error } = await supabase
    .from('recruiting_profiles')
    .upsert(
      {
        user_id: userId,
        ...profileData,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select()
    .single();

  return { data, error };
};

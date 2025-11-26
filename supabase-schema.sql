-- Diamond AI Europa Edition - Supabase Database Schema
-- This schema should be executed in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
-- =============================================
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('PLAYER', 'COACH', 'PARENT')) NOT NULL,
    age INTEGER,
    skill_level VARCHAR(20) CHECK (skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE')),
    positions TEXT[], -- Array of positions
    goals TEXT[], -- Array of goals
    avatar_url TEXT,
    xp_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SCHEDULED SESSIONS TABLE
-- Track training sessions, games, and lessons
-- =============================================
CREATE TABLE public.scheduled_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_type VARCHAR(20) CHECK (session_type IN ('TRAINING', 'GAME', 'LESSON')) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')) DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- IMPORTED VIDEOS TABLE
-- Store metadata for uploaded video analyses
-- =============================================
CREATE TABLE public.imported_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cloudinary_public_id VARCHAR(255) NOT NULL, -- Cloudinary reference
    cloudinary_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    tags TEXT[],
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SESSION PHOTOS TABLE
-- Store photos taken during training sessions for analysis
-- =============================================
CREATE TABLE public.session_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.scheduled_sessions(id) ON DELETE SET NULL,
    title VARCHAR(255),
    cloudinary_public_id VARCHAR(255) NOT NULL,
    cloudinary_url TEXT NOT NULL,
    thumbnail_url TEXT,
    capture_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ANALYSIS RESULTS TABLE
-- Store AI analysis results for videos and photos
-- =============================================
CREATE TABLE public.analysis_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES public.imported_videos(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES public.session_photos(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) CHECK (analysis_type IN ('VIDEO_MECHANICS', 'PHOTO_MECHANICS', 'MENTAL_GAME')) NOT NULL,
    feedback_text TEXT NOT NULL, -- Markdown formatted feedback
    form_score INTEGER CHECK (form_score >= 0 AND form_score <= 100),
    strengths TEXT[],
    weaknesses TEXT[],
    recommended_drills JSONB, -- Array of drill objects
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_video_or_photo CHECK (
        (video_id IS NOT NULL AND photo_id IS NULL) OR
        (video_id IS NULL AND photo_id IS NOT NULL) OR
        (video_id IS NULL AND photo_id IS NULL AND analysis_type = 'MENTAL_GAME')
    )
);

-- =============================================
-- TRAINING MODULES TABLE
-- Store structured training plans and modules
-- =============================================
CREATE TABLE public.training_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- e.g., 'HITTING', 'PITCHING', 'FIELDING', 'BASE_RUNNING'
    difficulty VARCHAR(20) CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE')),
    age_group VARCHAR(20) CHECK (age_group IN ('JUNIOR', 'SENIOR', 'ALL')) DEFAULT 'ALL',
    duration_minutes INTEGER,
    drills JSONB NOT NULL, -- Array of drill objects with name, description, duration, video_url
    video_demo_url TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER TRAINING PROGRESS TABLE
-- Track user progress through training modules
-- =============================================
CREATE TABLE public.user_training_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'NOT_STARTED',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    completed_drills TEXT[],
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- =============================================
-- ACHIEVEMENTS TABLE
-- Track user achievements and milestones
-- =============================================
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100), -- Lucide icon name
    category VARCHAR(100),
    xp_value INTEGER DEFAULT 0,
    requirement_type VARCHAR(50), -- e.g., 'VIDEO_COUNT', 'ANALYSIS_SCORE', 'MODULE_COMPLETION'
    requirement_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- USER ACHIEVEMENTS TABLE
-- Track which achievements users have unlocked
-- =============================================
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- =============================================
-- RECRUITING PROFILES TABLE
-- Store recruiting profile information
-- =============================================
CREATE TABLE public.recruiting_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    bio TEXT,
    stats JSONB, -- Flexible stats object
    highlight_video_url TEXT,
    gpa DECIMAL(3, 2),
    grad_year INTEGER,
    height VARCHAR(20),
    weight INTEGER,
    positions TEXT[],
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    social_media JSONB, -- { twitter: '', instagram: '', etc. }
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FEEDBACK POINTS TABLE
-- Store timestamped feedback points for videos
-- =============================================
CREATE TABLE public.video_feedback_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    video_id UUID REFERENCES public.imported_videos(id) ON DELETE CASCADE NOT NULL,
    timestamp_seconds INTEGER NOT NULL,
    text TEXT NOT NULL,
    x_position DECIMAL(5, 2), -- 0-100% from left
    y_position DECIMAL(5, 2), -- 0-100% from top
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX idx_scheduled_sessions_user_id ON public.scheduled_sessions(user_id);
CREATE INDEX idx_scheduled_sessions_date ON public.scheduled_sessions(scheduled_date);
CREATE INDEX idx_imported_videos_user_id ON public.imported_videos(user_id);
CREATE INDEX idx_session_photos_user_id ON public.session_photos(user_id);
CREATE INDEX idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX idx_user_training_progress_user_id ON public.user_training_progress(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_video_feedback_points_video_id ON public.video_feedback_points(video_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
-- =============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiting_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_feedback_points ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can read their own profile and update it
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Scheduled Sessions: Users can CRUD their own sessions
CREATE POLICY "Users can manage own sessions" ON public.scheduled_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Imported Videos: Users can CRUD their own videos
CREATE POLICY "Users can manage own videos" ON public.imported_videos
    FOR ALL USING (auth.uid() = user_id);

-- Session Photos: Users can CRUD their own photos
CREATE POLICY "Users can manage own photos" ON public.session_photos
    FOR ALL USING (auth.uid() = user_id);

-- Analysis Results: Users can CRUD their own analysis
CREATE POLICY "Users can manage own analysis" ON public.analysis_results
    FOR ALL USING (auth.uid() = user_id);

-- Training Modules: Public modules readable by all, private by creator
CREATE POLICY "Public modules are viewable by all" ON public.training_modules
    FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create modules" ON public.training_modules
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own modules" ON public.training_modules
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own modules" ON public.training_modules
    FOR DELETE USING (auth.uid() = created_by);

-- User Training Progress: Users manage their own progress
CREATE POLICY "Users can manage own progress" ON public.user_training_progress
    FOR ALL USING (auth.uid() = user_id);

-- Achievements: Readable by all
CREATE POLICY "Achievements are viewable by all" ON public.achievements
    FOR SELECT TO authenticated USING (true);

-- User Achievements: Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recruiting Profiles: Public profiles viewable by all, users manage their own
CREATE POLICY "Public recruiting profiles viewable by all" ON public.recruiting_profiles
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own recruiting profile" ON public.recruiting_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Video Feedback Points: Users can manage feedback on their videos
CREATE POLICY "Users can manage feedback on own videos" ON public.video_feedback_points
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.imported_videos WHERE id = video_id
        )
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.scheduled_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.training_modules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_training_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.recruiting_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, username, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'PLAYER')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

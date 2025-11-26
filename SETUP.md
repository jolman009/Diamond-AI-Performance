# Diamond AI Europa Edition - Setup Guide

This guide will walk you through setting up the complete backend infrastructure for Diamond AI using Supabase, Cloudinary, and Render.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Environment Configuration](#environment-configuration)
5. [Render Deployment](#render-deployment)
6. [Testing the Application](#testing-the-application)

---

## Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Git
- A Supabase account (free tier available)
- A Cloudinary account (free tier available)
- A Render account (free tier available)
- Your Gemini API key

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Diamond AI Europa
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (starts with `https://`)
   - **anon/public** key (this is your `VITE_SUPABASE_ANON_KEY`)

### 3. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the `supabase-schema.sql` file in this project
4. Copy the entire contents and paste it into the SQL Editor
5. Click **Run** to execute the schema
6. Verify that all tables were created by checking the **Table Editor**

You should see these tables:
- `user_profiles`
- `scheduled_sessions`
- `imported_videos`
- `session_photos`
- `analysis_results`
- `training_modules`
- `user_training_progress`
- `achievements`
- `user_achievements`
- `recruiting_profiles`
- `video_feedback_points`

### 4. Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** authentication
3. Configure email templates (optional):
   - Go to **Authentication** > **Email Templates**
   - Customize the confirmation and password reset emails

---

## Cloudinary Setup

### 1. Create Upload Preset

Your Cloudinary credentials are already provided, but you need to create an upload preset:

1. Log in to [cloudinary.com](https://cloudinary.com)
2. Go to **Settings** > **Upload**
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `diamond-ai`
   - **Signing Mode**: Unsigned (for client-side uploads)
   - **Folder**: `diamond-ai` (optional but recommended)
   - **Allowed formats**: jpg, png, gif, mp4, mov, avi
6. Click **Save**

### 2. Get Your Cloud Name

1. In Cloudinary dashboard, find your **Cloud name** (top left)
2. Copy this value - you'll need it for your `.env` file

**Your Cloudinary credentials:**
- API Key: `751433599949854`
- API Secret: `jlToveo0dYfJZAm_AtJE-kkd3yA`
- Cloud Name: (get this from your dashboard)

---

## Environment Configuration

### 1. Update Your `.env` File

Open the `.env` file in the project root and fill in all the values:

```bash
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=751433599949854
VITE_CLOUDINARY_API_SECRET=jlToveo0dYfJZAm_AtJE-kkd3yA

# Render Configuration (for deployment)
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Verify Configuration

Run the development server to test your configuration:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Render Deployment

### 1. Create a Render Account

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### 2. Deploy the Application

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup Diamond AI with Supabase and Cloudinary"
   git push origin main
   ```

2. In Render dashboard, click **New** > **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: diamond-ai-europa
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm preview`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click **Environment** tab
   - Add all variables from your `.env` file
   - Update `VITE_API_BASE_URL` to your Render URL

6. Click **Create Web Service**

7. Wait for deployment (first deployment takes 5-10 minutes)

### 3. Update Supabase Redirect URLs

After deployment:

1. Copy your Render URL (e.g., `https://diamond-ai-europa.onrender.com`)
2. Go to Supabase dashboard > **Authentication** > **URL Configuration**
3. Add your Render URL to:
   - **Site URL**
   - **Redirect URLs**: Add `https://your-app.onrender.com/**`

---

## Testing the Application

### 1. Test Local Development

```bash
# Start the dev server
pnpm dev

# Open http://localhost:3000
```

### 2. Test Authentication Flow

1. Go to Landing Page (/)
2. Click "Sign Up"
3. Create a test account:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Role: Player
4. Check your email for verification (if enabled)
5. Sign in with your credentials
6. Verify you can access the main app (/app)

### 3. Test Database Operations

Open browser console and test the database service:

```javascript
// Import the database service
import { getUserProfile } from './services/databaseService';

// Test fetching user profile
const { data, error } = await getUserProfile('user-id-here');
console.log(data);
```

### 4. Test File Upload (Cloudinary)

1. Sign in to your account
2. Navigate to the Upload page by clicking "Upload" in the sidebar navigation
   - Direct URL: [http://localhost:3000/app/upload](http://localhost:3000/app/upload)
3. Drag and drop or click to select a test image or video
4. Fill in the title and optional description/tags
5. Click "Upload to Cloud"
6. Check your Cloudinary dashboard to verify the upload appears in the `diamond-ai` folder
7. Verify the file metadata is stored in Supabase by checking the `imported_videos` or `session_photos` table

---

## Database Schema Overview

### Core Tables

1. **user_profiles**: Extended user data beyond authentication
2. **scheduled_sessions**: Training sessions, games, and lessons
3. **imported_videos**: Video uploads with Cloudinary references
4. **session_photos**: Photos from training sessions
5. **analysis_results**: AI analysis results from videos/photos
6. **training_modules**: Structured training plans and drills
7. **user_training_progress**: Track user progress through modules
8. **achievements**: Achievement definitions
9. **user_achievements**: Unlocked achievements per user
10. **recruiting_profiles**: Recruiting information for players
11. **video_feedback_points**: Timestamped feedback on videos

### Row Level Security (RLS)

All tables have RLS enabled with policies to ensure:
- Users can only access their own data
- Public content is visible to all authenticated users
- Coaches can potentially view player data (implement as needed)

---

## API Usage Examples

### Authentication

```typescript
import { useAuth } from './contexts/AuthContext';

// Sign up
const { error } = await signUp(email, password, {
  username: 'johndoe',
  full_name: 'John Doe',
  role: 'PLAYER',
});

// Sign in
const { error } = await signIn(email, password);

// Sign out
await signOut();

// Reset password
await resetPassword(email);
```

### Database Operations

```typescript
import {
  getScheduledSessions,
  createScheduledSession,
  getImportedVideos,
  createAnalysisResult,
} from './services/databaseService';

// Get user's scheduled sessions
const { data: sessions } = await getScheduledSessions(userId);

// Create a new session
const { data: newSession } = await createScheduledSession({
  title: 'Batting Practice',
  session_type: 'TRAINING',
  scheduled_date: '2025-11-24',
  scheduled_time: '15:00',
  duration_minutes: 90,
});

// Get user's videos
const { data: videos } = await getImportedVideos(userId);

// Save analysis result
const { data: analysis } = await createAnalysisResult({
  video_id: videoId,
  analysis_type: 'VIDEO_MECHANICS',
  feedback_text: 'Great form! Focus on hip rotation.',
  form_score: 85,
  strengths: ['Balance', 'Follow-through'],
  weaknesses: ['Hip rotation timing'],
});
```

### Cloudinary Upload

```typescript
import { uploadToCloudinary } from './config/cloudinary';

// Upload a video
const result = await uploadToCloudinary(
  videoFile,
  'video',
  'diamond-ai/training-videos'
);

console.log(result.url); // Cloudinary URL
console.log(result.publicId); // For database storage
console.log(result.thumbnailUrl); // Video thumbnail
```

---

## Troubleshooting

### Common Issues

1. **"Supabase credentials not found"**
   - Check that your `.env` file has the correct keys
   - Restart the dev server after updating `.env`

2. **"Failed to fetch user profile"**
   - Verify the database schema was created correctly
   - Check RLS policies in Supabase dashboard
   - Make sure you're authenticated

3. **"Cloudinary upload failed"**
   - Verify your upload preset is set to "Unsigned"
   - Check that the preset name matches "diamond-ai"
   - Verify your cloud name is correct

4. **"Cannot access /app route"**
   - Make sure you're signed in
   - Check browser console for errors
   - Verify AuthContext is wrapping your app

### Need Help?

- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Cloudinary documentation: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- Check Render documentation: [render.com/docs](https://render.com/docs)

---

## Next Steps

Now that your backend is set up, you can:

1. Customize the onboarding flow
2. Integrate video analysis with Gemini AI
3. Build out the training modules
4. Add social features (sharing, following)
5. Implement notifications
6. Add analytics and metrics
7. Enhance the recruiting profile features

Happy coding!

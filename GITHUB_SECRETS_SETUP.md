# GitHub Secrets Setup Guide

This guide will help you set up GitHub Secrets for secure deployment of your Diamond AI application.

## Why GitHub Secrets?

GitHub Secrets allow you to store sensitive information (like API keys) securely in your repository settings. These secrets are encrypted and can only be accessed by GitHub Actions workflows. They are never exposed in logs or code.

## Setting Up GitHub Secrets

### Step 1: Navigate to Your Repository Settings

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click on **Settings** (top navigation bar)
3. In the left sidebar, click on **Secrets and variables** > **Actions**

### Step 2: Add Each Secret

Click **New repository secret** for each of the following:

#### 1. GEMINI_API_KEY
- **Name**: `GEMINI_API_KEY`
- **Value**: Your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Click **Add secret**

#### 2. VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- **Where to find**: Supabase Dashboard > Settings > API > Project URL
- Click **Add secret**

#### 3. VITE_SUPABASE_ANON_KEY
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anonymous/public key
- **Where to find**: Supabase Dashboard > Settings > API > anon/public key
- Click **Add secret**

#### 4. VITE_CLOUDINARY_CLOUD_NAME
- **Name**: `VITE_CLOUDINARY_CLOUD_NAME`
- **Value**: Your Cloudinary cloud name
- **Where to find**: Cloudinary Dashboard (top left corner)
- Click **Add secret**

#### 5. VITE_CLOUDINARY_API_KEY
- **Name**: `VITE_CLOUDINARY_API_KEY`
- **Value**: Your Cloudinary API key
- **Where to find**: Cloudinary Dashboard > Settings > Product environment credentials
- Click **Add secret**

#### 6. VITE_CLOUDINARY_API_SECRET
- **Name**: `VITE_CLOUDINARY_API_SECRET`
- **Value**: Your Cloudinary API secret
- **Where to find**: Cloudinary Dashboard > Settings > Product environment credentials
- Click **Add secret**

#### 7. VITE_API_BASE_URL (Optional)
- **Name**: `VITE_API_BASE_URL`
- **Value**: Your production API URL (e.g., `https://your-app.onrender.com`)
- **Note**: This is optional. If not set, it defaults to `http://localhost:3000`
- Click **Add secret**

### Step 3: Verify Your Secrets

After adding all secrets, you should see them listed in the **Repository secrets** section. They will appear as:
- ✅ GEMINI_API_KEY
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_CLOUDINARY_CLOUD_NAME
- ✅ VITE_CLOUDINARY_API_KEY
- ✅ VITE_CLOUDINARY_API_SECRET
- ✅ VITE_API_BASE_URL (if added)

## Using Secrets in GitHub Actions

The secrets are automatically available in your GitHub Actions workflows. The workflow file (`.github/workflows/deploy.yml`) uses them like this:

```yaml
echo "GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}" >> .env
```

## Security Best Practices

1. ✅ **Never commit secrets to your repository** - Always use GitHub Secrets
2. ✅ **Never share secrets in issues or pull requests**
3. ✅ **Rotate secrets regularly** - Update them if you suspect they've been compromised
4. ✅ **Use different secrets for different environments** - Consider using environment-specific secrets
5. ✅ **Review who has access** - Only grant repository access to trusted collaborators

## Updating Secrets

To update a secret:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Find the secret you want to update
3. Click **Update**
4. Enter the new value
5. Click **Update secret**

## Troubleshooting

### Secrets not working in workflow?
- Make sure the secret name matches exactly (case-sensitive)
- Verify the secret exists in the repository settings
- Check the workflow logs for any error messages

### Need to delete a secret?
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Find the secret you want to delete
3. Click **Delete**
4. Confirm the deletion

## Next Steps

After setting up your secrets:
1. Your GitHub Actions workflow will automatically use these secrets when building
2. The `.env.example` file serves as a template for local development
3. Each developer should create their own `.env` file locally (never commit it)

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)


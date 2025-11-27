<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17OBgXxqLKqYdIidwx_g_3pvXC4qtoZvi

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in all the required values in `.env` (see `.env.example` for reference)
   - **Important**: Never commit your `.env` file to version control

3. Run the app:
   ```bash
   pnpm dev
   ```

## Environment Variables

See `.env.example` for all required environment variables. For detailed setup instructions, see [SETUP.md](SETUP.md).

## GitHub Secrets for Deployment

For CI/CD deployment, set up GitHub Secrets as described in [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md).

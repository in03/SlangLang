# Local Development Guide

## Quick Start

1. **Create a `.env` file** in the project root:
   ```bash
   GITHUB_TOKEN=your_personal_access_token_here
   ```

2. **Build and start the dev server:**
   ```bash
   bun run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Getting a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "SlangLang Local Dev"
4. Select scopes (check GitHub Models API requirements)
5. Copy the token and add it to your `.env` file

## Available Commands

- `bun run dev` - Build playground and start dev server
- `bun run dev:server` - Start dev server only (assumes playground is already built)
- `bun run build:playground` - Build playground only

## How It Works

The local dev server (`server.js`):
- Serves static files from `playground/dist/`
- Handles `/api/models` requests
- Uses `GITHUB_TOKEN` from `.env` file for authentication (bypasses OAuth)
- Automatically detects localhost and enables codegen without OAuth

## Environment Variables

Create a `.env` file with:

```bash
# Required for local codegen testing
GITHUB_TOKEN=your_personal_access_token_here

# Optional: Custom port (default: 3000)
PORT=3000
```

## Differences from Production

- **No OAuth required** - Uses token directly from `.env`
- **No cookie authentication** - Token is read from environment
- **Local server** - Runs on localhost instead of Vercel
- **Development mode** - Frontend detects localhost and skips OAuth flow

## Troubleshooting

### "GITHUB_TOKEN not found"
- Make sure `.env` file exists in project root
- Check that token is set: `GITHUB_TOKEN=your_token_here`
- No quotes needed around the token value

### "Not authenticated" error
- Verify your token is valid
- Check token has required scopes for GitHub Models API
- Restart the dev server after changing `.env`

### Port already in use
- Change port in `.env`: `PORT=3001`
- Or kill the process using port 3000




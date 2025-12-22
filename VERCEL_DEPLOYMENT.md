# Vercel Deployment Guide

## Overview

This SlangLang playground has been migrated to use **Vercel serverless functions** for secure OAuth authentication and GitHub Models API proxying.

## Architecture

```
Browser → Vercel (Static HTML/JS) → Vercel API Routes → GitHub APIs
```

- **Frontend**: Static HTML/JS served from Vercel
- **Authentication**: Server-side OAuth with HTTP-only cookies
- **API Proxy**: Server-side proxy to GitHub Models API
- **Security**: No tokens exposed to client-side JavaScript

## Project Structure

```
/
├── api/
│   ├── auth/
│   │   ├── login.js      # GET /api/auth/login - OAuth redirect
│   │   └── callback.js   # GET /api/auth/callback - Token exchange
│   └── models/
│       └── index.js      # POST/GET /api/models - API proxy + auth check
├── playground/
│   ├── dist/             # Built static files (deployed to Vercel)
│   └── index.html        # Main playground app
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Environment Variables

Set these in your Vercel project settings:

```bash
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
VERCEL_URL=https://your-project.vercel.app  # Auto-set by Vercel
```

## OAuth App Configuration

1. **Create GitHub OAuth App**: https://github.com/settings/applications/new
2. **Homepage URL**: `https://your-project.vercel.app`
3. **Authorization callback URL**: `https://your-project.vercel.app/api/auth/callback`
4. **Copy Client ID and Secret** to Vercel environment variables

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Migrate to Vercel serverless OAuth"
git push origin main
```

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure project:
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build:playground`
   - **Output Directory**: `playground/dist`

### 3. Set Environment Variables

In Vercel project settings → Environment Variables:

```
GITHUB_CLIENT_ID     = Ov23liFkjLahmnUTC6zA
GITHUB_CLIENT_SECRET = your_secret_here
```

### 4. Deploy

Vercel will automatically deploy when you push to your main branch.

## API Endpoints

### `/api/auth/login`
- **Method**: GET
- **Purpose**: Redirect to GitHub OAuth
- **Response**: 302 Redirect to GitHub

### `/api/auth/callback`
- **Method**: GET
- **Purpose**: Handle OAuth callback, exchange code for token
- **Parameters**: `code`, `state`
- **Response**: 302 Redirect to `/` with auth cookies set

### `/api/models`
- **Method**: GET/POST
- **Purpose**: Check auth status / proxy to GitHub Models
- **Authentication**: HTTP-only cookies
- **GET Response**: `{ authenticated: true/false }`
- **POST Response**: GitHub Models API response

## Security Features

- ✅ **HTTP-only cookies** - Tokens not accessible to JavaScript
- ✅ **Secure cookies** - HTTPS only in production
- ✅ **CSRF protection** - State parameter validation
- ✅ **Server-side token storage** - No client-side secrets
- ✅ **API proxy** - Direct GitHub API access blocked

## Development

### Local Development

```bash
# Install dependencies
bun install

# Build playground
bun run build:playground

# Start local Vercel dev server
bun vercel dev
```

Local server will run on `http://localhost:3000`

## Troubleshooting

### OAuth Not Working

1. **Check environment variables** in Vercel dashboard
2. **Verify GitHub OAuth app** callback URL matches Vercel URL
3. **Check Vercel function logs** in dashboard
4. **Clear cookies** and try again

### API Calls Failing

1. **Check browser network tab** for API responses
2. **Verify authentication** cookies are set
3. **Check Vercel function logs** for errors

### Build Issues

1. **Ensure all dependencies** are installed
2. **Check Node.js version** (Vercel uses Node 18+)
3. **Verify build output** in `playground/dist/`

## Migration from Previous Version

This replaces the client-side Device Flow with secure server-side OAuth:

- **Removed**: Device Flow polling, client-side tokens
- **Added**: HTTP-only cookies, API proxy, serverless functions
- **Improved**: Security, reliability, user experience

The frontend now simply shows/hides a "Sign in with GitHub" button based on authentication status.

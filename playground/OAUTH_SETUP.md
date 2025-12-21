# GitHub OAuth Setup for SlangLang Playground

This guide will help you set up GitHub OAuth for the AI code generator feature.

## Prerequisites

- A GitHub account
- Access to GitHub Models API (preview feature)

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Fill out the form:
   - **Application name**: `SlangLang Playground` (or whatever you prefer)
   - **Homepage URL**: Your deployment URL (e.g., `https://yourusername.github.io/slanglang` or `https://slanglang.vercel.app`)
   - **Application description**: `AI-powered code generator for SlangLang`
   - **Authorization callback URL**: Your base domain (e.g., `https://yourusername.github.io` or `https://slanglang.vercel.app`)

   **Important**: Use just the base domain for the callback URL, not the full path. The OAuth flow handles the redirect back to the correct page.

3. Click **Register application**

## Step 2: Get Your Client ID

After creating the app, you'll see your **Client ID** on the app settings page. Copy this value.

## Step 3: Configure the Playground

1. Open `playground/config.js`
2. Replace `'your-github-oauth-app-client-id'` with your actual Client ID:

```javascript
const CONFIG = {
    GITHUB_CLIENT_ID: 'your-actual-client-id-here',
    // ... rest of config
};
```

**Important**: You do NOT need a client secret for this setup. Public clients (like SPAs) use PKCE instead of client secrets for security.

### Development Mode

For local development and testing, you can enable development mode:

```javascript
const CONFIG = {
    // ... other settings
    DEV_MODE: true  // Set to true for local testing
};
```

**In development mode:**
- OAuth is bypassed
- Mock AI responses are provided (clearly marked as "[DEV MODE]")
- Perfect for testing UI/UX without GitHub API access

**To enable real AI:**
- Set `DEV_MODE: false`
- Deploy to HTTPS domain
- Configure GitHub OAuth properly

## Step 4: Enable GitHub Models API

Currently, GitHub Models API is in preview and requires special access. You may need to:

1. Apply for access to GitHub Models if not already available
2. Ensure your OAuth app has the necessary permissions

## Step 5: Deploy

1. Build the playground: `bun run build:playground`
2. Deploy the `playground/dist/` folder to GitHub Pages or Vercel

## Testing the OAuth Flow

1. Open the deployed playground
2. Try to use the AI code generator
3. You should see the authentication modal
4. Click "Sign in with GitHub"
5. Complete the OAuth flow
6. Try generating some code!

## Troubleshooting

### OAuth Not Working
- Double-check your Client ID in `config.js`
- Ensure the Homepage URL and callback URL match your deployment URL
- Check browser console for errors

### OAuth Errors

#### "The redirect_uri is not associated with this application"
- **Cause**: The Authorization callback URL in your GitHub OAuth app doesn't match the redirect URI
- **Solution**: Ensure your OAuth app's callback URL is set to just the base domain (e.g., `https://yourusername.github.io`)
- **Note**: The playground automatically handles redirects to the correct page within your domain

#### "Invalid client"
- **Cause**: Wrong Client ID in `config.js`
- **Solution**: Double-check the Client ID from your GitHub OAuth app settings

#### "Bad credentials" or "Invalid token"
- **Cause**: Token expired or corrupted
- **Solution**: Sign out and sign in again to get a fresh token

### API Errors
- Verify you have access to GitHub Models API
- Check that your OAuth token has the right scopes
- The playground only uses real GitHub Models API - no mock responses

### Deployment Issues
- GitHub Pages: Ensure the `playground/dist/` folder is deployed
- Vercel: Point to the `playground/dist/` directory
- Make sure `config.js` is included in the build

## Security Analysis: Client-Side OAuth

### What's Actually Secure Here

✅ **PKCE (Proof Key for Code Exchange)** - Prevents authorization code interception attacks
✅ **State Parameter** - Protects against CSRF attacks during OAuth flow
✅ **No Client Secret** - Public clients use PKCE instead of secrets (can't be leaked)
✅ **Minimal Scopes** - Only requesting `read:user` permission
✅ **Short Token Lifetime** - GitHub tokens expire after 8 hours
✅ **HTTPS Required** - GitHub OAuth mandates HTTPS for security

### Security Limitations

⚠️ **Token Storage**: Access tokens stored in localStorage are vulnerable to:
- XSS attacks (if your site has XSS vulnerabilities)
- Any malicious script running on your domain
- Browser extensions with access to page content

⚠️ **No Secure Cookies**: Unlike server-side apps, can't use `httpOnly` cookies

⚠️ **Public Client ID**: The OAuth client ID is exposed in frontend code (but this is expected for public clients)

### Client Secret Myth

**Public clients like SPAs do NOT use client secrets.** This is actually a security advantage:

- **Server-side apps**: Need to store client secrets securely (can leak via breaches)
- **Public clients**: Use PKCE instead - no secrets to leak!

The PKCE flow we implement is the modern, secure way for browsers and mobile apps to do OAuth.

### Risk Assessment for This Use Case

**Low to Medium Risk** because:

- **Limited Scope**: Only `read:user` permission (basic profile access)
- **Short Lifetime**: Tokens auto-expire after 8 hours
- **Low-Value Target**: Playground app, not handling sensitive data
- **AI API Access**: Token is only used for GitHub Models API calls

### Mitigation Strategies

1. **Content Security Policy (CSP)**: Implement strict CSP headers
2. **XSS Prevention**: Sanitize all user inputs, avoid innerHTML
3. **Token Refresh**: Don't implement refresh tokens client-side
4. **Logout Functionality**: Clear tokens on logout
5. **Audit Regularly**: Monitor for OAuth app misuse

### When Client-Side OAuth Becomes Dangerous

🚨 **High Risk Scenarios**:
- Broad OAuth scopes (email, repo access, etc.)
- Long-lived tokens or refresh tokens
- High-value applications (banking, health, etc.)
- Sites with history of XSS vulnerabilities

### Production Recommendations

For production applications with higher security requirements:
- Use a backend service to handle OAuth and token storage
- Implement proper session management
- Use secure httpOnly cookies for token storage
- Consider OAuth proxy services

### Current Implementation Security

This playground implementation follows OAuth 2.1 best practices for public clients and is **secure enough** for a developer playground tool. The primary risk is XSS attacks stealing short-lived, low-privilege tokens.

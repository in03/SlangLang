// GitHub OAuth Configuration for SlangLang Playground
// SECURITY WARNING: Client ID will be publicly visible when deployed
// Only use OAuth apps created specifically for this playground
// Replace with your actual GitHub OAuth App credentials

const CONFIG = {
    // GitHub OAuth App Client ID
    // Get this from: https://github.com/settings/applications/new
    // SECURITY: This becomes public when deployed - use dedicated OAuth app
    // NOTE: No client secret needed for public clients (PKCE flow)
    GITHUB_CLIENT_ID: 'Ov23liFkjLahmnUTC6zA',

    // OAuth Scopes needed for GitHub Models
    OAUTH_SCOPES: 'read:user',

    // GitHub Models API endpoint
    MODELS_API_URL: 'https://models.github.ai/inference/chat/completions',

    // Development mode - set to true to bypass OAuth for local testing
    // WARNING: This uses mock responses, not real AI
    DEV_MODE: false
};

// Make config available globally
window.SlangLangConfig = CONFIG;

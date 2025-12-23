const { createHash, createHmac } = require('crypto');

// Generate a signed state token for CSRF protection (stateless)
function generateState() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const payload = `${timestamp}:${random}`;
    
    // Sign the payload with a secret (use GITHUB_CLIENT_SECRET as the signing key)
    const secret = process.env.GITHUB_CLIENT_SECRET || 'default-secret-change-in-production';
    const signature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    // Return state as: payload.signature
    return `${payload}.${signature}`;
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Generate signed state for CSRF protection (stateless approach)
        const state = generateState();

        const clientId = process.env.GITHUB_CLIENT_ID;
        if (!clientId) {
            console.error('GITHUB_CLIENT_ID not configured');
            return res.status(500).json({ error: 'OAuth configuration missing' });
        }

        // Get base URL and ensure it has a protocol
        let baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = `https://${baseUrl}`;
        }

        // GitHub OAuth authorize URL
        const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
        authorizeUrl.searchParams.set('client_id', clientId);
        authorizeUrl.searchParams.set('scope', 'read:user');
        authorizeUrl.searchParams.set('state', state);
        authorizeUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/callback`);

        // Redirect to GitHub
        res.redirect(authorizeUrl.toString());

    } catch (error) {
        console.error('Login endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

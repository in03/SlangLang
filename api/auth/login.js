const { createHash } = require('crypto');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Generate state for CSRF protection
        const state = createHash('sha256')
            .update(Math.random().toString() + Date.now().toString())
            .digest('hex');

        // Store state in session (we'll use a simple in-memory store for demo)
        // In production, use Redis or similar
        if (!global.stateStore) {
            global.stateStore = new Map();
        }
        global.stateStore.set(state, { created: Date.now() });

        // Clean up old states (older than 10 minutes)
        for (const [key, value] of global.stateStore.entries()) {
            if (Date.now() - value.created > 10 * 60 * 1000) {
                global.stateStore.delete(key);
            }
        }

        const clientId = process.env.GITHUB_CLIENT_ID;
        if (!clientId) {
            console.error('GITHUB_CLIENT_ID not configured');
            return res.status(500).json({ error: 'OAuth configuration missing' });
        }

        // GitHub OAuth authorize URL
        const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
        authorizeUrl.searchParams.set('client_id', clientId);
        authorizeUrl.searchParams.set('scope', 'read:user');
        authorizeUrl.searchParams.set('state', state);
        authorizeUrl.searchParams.set('redirect_uri', `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/callback`);

        // Redirect to GitHub
        res.redirect(authorizeUrl.toString());

    } catch (error) {
        console.error('Login endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

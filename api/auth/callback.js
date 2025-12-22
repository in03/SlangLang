export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).json({ error: 'Missing code or state parameter' });
        }

        // Validate state for CSRF protection
        if (!global.stateStore || !global.stateStore.has(state)) {
            console.error('Invalid or expired state:', state);
            return res.status(400).json({ error: 'Invalid state parameter' });
        }

        // Remove used state
        global.stateStore.delete(state);

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('GitHub OAuth credentials not configured');
            return res.status(500).json({ error: 'OAuth configuration missing' });
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                redirect_uri: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/callback`
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error('Token exchange failed:', tokenData);
            return res.status(400).json({ error: 'Failed to obtain access token' });
        }

        // Store token securely in HTTP-only cookie
        // In production, encrypt the token or use a session store
        const tokenExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

        res.setHeader('Set-Cookie', [
            `github_token=${tokenData.access_token}; HttpOnly; Secure; Path=/; Expires=${tokenExpiry.toUTCString()}; SameSite=Lax`,
            `github_token_expiry=${tokenExpiry.getTime()}; HttpOnly; Secure; Path=/; Expires=${tokenExpiry.toUTCString()}; SameSite=Lax`
        ]);

        // Redirect back to the main app
        res.redirect('/');

    } catch (error) {
        console.error('Callback endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

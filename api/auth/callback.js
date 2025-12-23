const { createHmac } = require('crypto');

// Verify signed state token (stateless CSRF protection)
function verifyState(state) {
    if (!state || typeof state !== 'string') {
        return false;
    }
    
    const parts = state.split('.');
    if (parts.length !== 2) {
        return false;
    }
    
    const [payload, signature] = parts;
    const [timestampStr] = payload.split(':');
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if state is expired (older than 10 minutes)
    const maxAge = 10 * 60 * 1000; // 10 minutes
    if (Date.now() - timestamp > maxAge) {
        console.error('State expired:', timestamp);
        return false;
    }
    
    // Verify signature
    const secret = process.env.GITHUB_CLIENT_SECRET || 'default-secret-change-in-production';
    const expectedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
        return false;
    }
    
    let match = 0;
    for (let i = 0; i < signature.length; i++) {
        match |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return match === 0;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).json({ error: 'Missing code or state parameter' });
        }

        // Validate signed state for CSRF protection (stateless)
        if (!verifyState(state)) {
            console.error('Invalid or expired state:', state);
            return res.status(400).json({ error: 'Invalid state parameter' });
        }

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('GitHub OAuth credentials not configured');
            return res.status(500).json({ error: 'OAuth configuration missing' });
        }

        // Get base URL and ensure it has a protocol
        let baseUrl = process.env.BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = `https://${baseUrl}`;
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
                redirect_uri: `${baseUrl}/api/auth/callback`
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

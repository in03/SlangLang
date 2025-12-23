// Helper function to parse cookies from request headers
function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    
    cookieHeader.split(';').forEach(cookie => {
        const [name, ...rest] = cookie.trim().split('=');
        if (name) {
            cookies[name] = decodeURIComponent(rest.join('='));
        }
    });
    
    return cookies;
}

// Helper function to get cookies from request
function getCookies(req) {
    // Try req.cookies first (if Vercel provides it)
    if (req.cookies) {
        return req.cookies;
    }
    
    // Otherwise parse from Cookie header
    const cookieHeader = req.headers?.cookie || req.headers?.get?.('cookie');
    return parseCookies(cookieHeader);
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Check if user is authenticated
            const cookies = getCookies(req);
            const token = cookies.github_token;
            const tokenExpiry = cookies.github_token_expiry;

            if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
                return res.status(401).json({ authenticated: false });
            }

            return res.status(200).json({ authenticated: true });
        } catch (error) {
            console.error('GET /api/models error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            // Verify authentication
            const cookies = getCookies(req);
            const token = cookies.github_token;
            const tokenExpiry = cookies.github_token_expiry;

            if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            // Parse request body
            let body;
            try {
                body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch (e) {
                return res.status(400).json({ error: 'Invalid request body' });
            }

            // Forward the request to GitHub Models API
            const modelsApiUrl = 'https://api.github.com/models/gpt-4o-mini/chat/completions';

            const response = await fetch(modelsApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            // Return the response to the client
            return res.status(response.status).json(data);
        } catch (error) {
            console.error('POST /api/models error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

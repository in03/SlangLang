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
    if (req.cookies && typeof req.cookies === 'object') {
        return req.cookies;
    }
    
    // Otherwise parse from Cookie header
    // Vercel/Bun may have cookies in different formats
    const cookieHeader = req.headers?.cookie || 
                        req.headers?.get?.('cookie') ||
                        (typeof req.headers === 'object' && req.headers.Cookie) ||
                        '';
    return parseCookies(cookieHeader);
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Check if user is authenticated
            const cookies = getCookies(req);
            const token = cookies.github_token;
            const tokenExpiry = cookies.github_token_expiry;

            if (!token || !tokenExpiry) {
                return res.status(200).json({ authenticated: false });
            }

            // Check if token is expired
            const expiryTime = parseInt(tokenExpiry, 10);
            if (isNaN(expiryTime) || Date.now() > expiryTime) {
                return res.status(200).json({ authenticated: false });
            }

            return res.status(200).json({ authenticated: true });
        } catch (error) {
            console.error('GET /api/models error:', error);
            return res.status(200).json({ authenticated: false });
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

            // Ensure model is specified in request body (required for new endpoint)
            if (!body.model) {
                body.model = 'gpt-4o-mini'; // Default model
            }

            // Forward the request to GitHub Models API
            // GitHub Models API endpoint: https://models.github.ai/inference/chat/completions
            const modelsApiUrl = 'https://models.github.ai/inference/chat/completions';

            const response = await fetch(modelsApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            // Handle non-OK responses
            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { error: errorText || 'GitHub API error' };
                }
                console.error('GitHub Models API error:', response.status, errorData);
                
                // Provide helpful error message for 404
                if (response.status === 404) {
                    return res.status(404).json({
                        error: 'GitHub Models API endpoint not found',
                        message: 'The GitHub Models API may not be available or you may not have access. GitHub Models API is a preview feature that requires special access.',
                        details: errorData,
                        suggestion: 'Please verify that you have access to GitHub Models API preview feature and that the endpoint URL is correct.'
                    });
                }
                
                return res.status(response.status).json({
                    error: errorData.error || errorData.message || 'GitHub Models API error',
                    details: errorData
                });
            }

            const data = await response.json();

            // Return the response to the client
            return res.status(200).json(data);
        } catch (error) {
            console.error('POST /api/models error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// Simple session check endpoint
export async function handler(req, res) {
    if (req.method === 'GET') {
        // Check if user is authenticated
        const token = req.cookies.github_token;
        const tokenExpiry = req.cookies.github_token_expiry;

        if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
            return res.status(401).json({ authenticated: false });
        }

        return res.status(200).json({ authenticated: true });
    }

    if (req.method === 'POST') {
        return handleModelsProxy(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

async function handleModelsProxy(req, res) {
    try {
        // Verify authentication
        const token = req.cookies.github_token;
        const tokenExpiry = req.cookies.github_token_expiry;

        if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
            return res.status(401).json({ error: 'Not authenticated' });
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
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        // Return the response to the client
        res.status(response.status).json(data);

    } catch (error) {
        console.error('Models proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

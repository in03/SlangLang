#!/usr/bin/env bun
/**
 * Local development server for SlangLang playground
 * Serves static files and handles API routes for local testing
 */

import { serve } from 'bun';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

// Load environment variables from .env file
function loadEnv() {
  const envPath = '.env';
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

loadEnv();

const PORT = process.env.PORT || 3000;
const DIST_DIR = './playground/dist';

// Check if dist directory exists
if (!existsSync(DIST_DIR)) {
  console.error(`❌ Error: ${DIST_DIR} directory not found!`);
  console.error(`   Run 'bun run build:playground' first, or use 'bun run dev' to build automatically.`);
  process.exit(1);
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Helper to parse cookies
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

// API route handlers
async function handleApiModels(req) {
  const url = new URL(req.url);
  const cookies = parseCookies(req.headers.get('cookie') || '');

  if (req.method === 'GET') {
    // Check authentication - in local dev, check for GITHUB_TOKEN in env
    const token = cookies.github_token || process.env.GITHUB_TOKEN;
    
    if (token) {
      return new Response(JSON.stringify({ authenticated: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ authenticated: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    // In local dev, use GITHUB_TOKEN from .env if available
    const token = cookies.github_token || process.env.GITHUB_TOKEN;
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated. Set GITHUB_TOKEN in .env file for local testing.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await req.json();
      
      // Ensure model is specified
      if (!body.model) {
        body.model = 'gpt-4o-mini';
      }

      // Forward to GitHub Models API
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

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText || 'GitHub API error' };
        }
        
        return new Response(JSON.stringify({
          error: errorData.error || errorData.message || 'GitHub Models API error',
          details: errorData
        }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('POST /api/models error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Serve static files
async function serveStatic(pathname) {
  // Default to index.html for root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Remove leading slash
  const filePath = join(DIST_DIR, pathname.replace(/^\//, ''));
  
  // Security: prevent directory traversal
  if (filePath.includes('..')) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!existsSync(filePath)) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const file = readFileSync(filePath);
    const ext = extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    return new Response(file, {
      headers: { 'Content-Type': mimeType },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Helper to add CORS headers
function addCorsHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

// Main server handler
const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/models' || url.pathname.startsWith('/api/models/')) {
        const response = await handleApiModels(req);
        return addCorsHeaders(response);
      }
      
      // Other API routes could go here
      return new Response('Not Found', { status: 404 });
    }

    // Serve static files
    return await serveStatic(url.pathname);
  },
});

console.log(`🚀 SlangLang playground server running at http://localhost:${PORT}`);
console.log(`📁 Serving files from ${DIST_DIR}`);
if (process.env.GITHUB_TOKEN) {
  console.log(`✅ GITHUB_TOKEN found in .env - local codegen enabled`);
} else {
  console.log(`⚠️  GITHUB_TOKEN not found in .env - create .env file with GITHUB_TOKEN=your_token for local testing`);
}

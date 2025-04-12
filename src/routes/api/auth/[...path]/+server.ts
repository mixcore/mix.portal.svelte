import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Use environment variable or fallback
const MIXCORE_API_URL = import.meta.env.VITE_API_URL || 'https://mixcore.net';

// Helper to build the correct mixcore URL
const buildMixcoreUrl = (path: string | string[], queryString: string): string => {
  // Convert path to array if it's a string
  const pathArray = Array.isArray(path) ? path : path.split('/');
  const pathJoined = pathArray.join('/');
  
  // Ensure path has user/ prefix for auth endpoints if it doesn't already
  const normalizedPath = pathJoined.startsWith('user/') || pathJoined.includes('/user/') 
    ? pathJoined 
    : `user/${pathJoined}`;
    
  const url = `${MIXCORE_API_URL}/api/v2/rest/auth/${normalizedPath}${queryString ? `?${queryString}` : ''}`;
  console.log(`[API Server] Built URL: ${url}`);
  return url;
};

// GET handler for proxying GET requests
export const GET: RequestHandler = async ({ params, request, url }) => {
  const path = params.path;
  const queryString = url.searchParams.toString();
  const mixcoreUrl = buildMixcoreUrl(path, queryString);

  console.log(`[API Server] Proxying GET request to: ${mixcoreUrl}`);

  try {
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';
    
    // Log the request
    console.log(`[API Server] Sending GET request with headers:`, headers);

    const response = await fetch(mixcoreUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[API Server] HTTP error from Mixcore API: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log(`[API Server] Response:`, data);
    } catch (error) {
      console.error(`[API Server] Failed to parse response:`, error);
      data = { success: false, error: 'Failed to parse API response' };
    }
    
    return json(data);
  } catch (error) {
    console.error(`[API Server] Error proxying to ${mixcoreUrl}:`, error);
    return json(
      { success: false, error: 'Failed to fetch data from API', details: String(error) },
      { status: 500 }
    );
  }
};

// POST handler for proxying POST requests
export const POST: RequestHandler = async ({ params, request }) => {
  const path = params.path;
  const mixcoreUrl = buildMixcoreUrl(path, '');
  
  console.log(`[API Server] Proxying POST request to: ${mixcoreUrl}`);

  try {
    let body;
    try {
      body = await request.json();
      console.log(`[API Server] Request body:`, body);
      
      // Special handling for login/auth requests with encrypted message
      if (body.message && (path.includes('login') || path.includes('register') || path.includes('token'))) {
        console.log(`[API Server] Detected auth request with encrypted message payload`);
      }
    } catch (error) {
      console.error(`[API Server] Failed to parse request body:`, error);
      return json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';
    
    // Log the request details
    console.log(`[API Server] Sending POST request to: ${mixcoreUrl}`);
    console.log(`[API Server] Headers:`, headers);
    console.log(`[API Server] Body:`, JSON.stringify(body));

    let response;
    try {
      response = await fetch(mixcoreUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      
      console.log(`[API Server] Response status:`, response.status, response.statusText);
      console.log(`[API Server] Response headers:`, Object.fromEntries([...response.headers.entries()]));
    } catch (fetchError) {
      console.error(`[API Server] Fetch error:`, fetchError);
      return json(
        { success: false, error: 'Failed to connect to API server', details: String(fetchError) },
        { status: 500 }
      );
    }

    // Handle non-OK responses
    if (!response.ok) {
      console.error(`[API Server] HTTP error from Mixcore API: ${response.status} ${response.statusText}`);
      
      let errorText = '';
      try {
        errorText = await response.text();
        console.error(`[API Server] Error response body:`, errorText);
      } catch (e) {
        console.error(`[API Server] Could not read error response body`);
      }
      
      // Try to parse as JSON
      let errorData = null;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { rawError: errorText };
      }
      
      return json(
        { 
          success: false, 
          error: `API server error: ${response.status} ${response.statusText}`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    // Process successful response
    let responseText = '';
    try {
      responseText = await response.text();
      console.log(`[API Server] Raw response (first 500 chars):`, responseText.substring(0, 500));
    } catch (error) {
      console.error(`[API Server] Failed to read response text:`, error);
      return json(
        { success: false, error: 'Failed to read API response text', details: String(error) },
        { status: 500 }
      );
    }
    
    // If empty response, return success
    if (!responseText.trim()) {
      console.log(`[API Server] Empty response from API, assuming success`);
      return json({ success: true });
    }
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log(`[API Server] Parsed JSON response:`, data);
    } catch (error) {
      console.error(`[API Server] Failed to parse response as JSON:`, error);
      return json(
        { 
          success: false, 
          error: 'Invalid JSON response from API',
          details: String(error),
          rawResponse: responseText.substring(0, 1000)  // First 1000 chars
        },
        { status: 500 }
      );
    }
    
    return json(data);
  } catch (error) {
    console.error(`[API Server] Unhandled error:`, error);
    return json(
      { success: false, error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
};

// PUT handler for proxying PUT requests
export const PUT: RequestHandler = async ({ params, request }) => {
  const path = params.path;
  const mixcoreUrl = buildMixcoreUrl(path, '');
  
  console.log(`[API Server] Proxying PUT request to: ${mixcoreUrl}`);

  try {
    let body;
    try {
      body = await request.json();
      console.log(`[API Server] Request body:`, body);
    } catch (error) {
      console.error(`[API Server] Failed to parse request body:`, error);
      return json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';
    
    // Log the request
    console.log(`[API Server] Sending PUT request with headers:`, headers);

    const response = await fetch(mixcoreUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`[API Server] HTTP error from Mixcore API: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log(`[API Server] Response:`, data);
    } catch (error) {
      console.error(`[API Server] Failed to parse response:`, error);
      data = { success: false, error: 'Failed to parse API response' };
    }
    
    return json(data);
  } catch (error) {
    console.error(`[API Server] Error proxying to ${mixcoreUrl}:`, error);
    return json(
      { success: false, error: 'Failed to update data on API', details: String(error) },
      { status: 500 }
    );
  }
};

// DELETE handler for proxying DELETE requests
export const DELETE: RequestHandler = async ({ params, request, url }) => {
  const path = params.path;
  const queryString = url.searchParams.toString();
  const mixcoreUrl = buildMixcoreUrl(path, queryString);

  console.log(`[API Server] Proxying DELETE request to: ${mixcoreUrl}`);

  try {
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';
    
    // Log the request
    console.log(`[API Server] Sending DELETE request with headers:`, headers);

    const response = await fetch(mixcoreUrl, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      console.error(`[API Server] HTTP error from Mixcore API: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
      console.log(`[API Server] Response:`, data);
    } catch (error) {
      console.error(`[API Server] Failed to parse response:`, error);
      data = { success: false, error: 'Failed to parse API response' };
    }
    
    return json(data);
  } catch (error) {
    console.error(`[API Server] Error proxying to ${mixcoreUrl}:`, error);
    return json(
      { success: false, error: 'Failed to delete data on API', details: String(error) },
      { status: 500 }
    );
  }
}; 
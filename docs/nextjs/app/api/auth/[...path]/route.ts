import { NextRequest, NextResponse } from 'next/server';

// This is a server-side proxy to avoid CORS issues with the Mixcore API
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `https://mixcore.net/api/v2/rest/auth/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `https://mixcore.net/api/v2/rest/auth/${path}`;

  console.log(`Proxy POST request to: ${url}`);
  
  try {
    let body;
    try {
      body = await request.json();
      console.log('Request body:', JSON.stringify(body).substring(0, 200) + '...');
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
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
    console.log('Request headers:', headers);

    // Special handling for login endpoint based on the path
    let requestBody = body;
    
    // For login requests, wrap the data in a message object
    if (path === 'user/login') {
      requestBody = { message: body };
      console.log('Login request detected, wrapping data in message object:', JSON.stringify(requestBody).substring(0, 200) + '...');
    }
    
    // Similar handling for other endpoints that need the message wrapper
    if (path === 'user/register' || 
        path === 'user/external-login' ||
        path === 'user/forgot-password' ||
        path === 'user/reset-password') {
      requestBody = { message: body };
      console.log('Wrapping data in message object for endpoint:', path);
    }

    console.log('Fetching from Mixcore API...');
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      // Try to get error details if available
      let errorData = {};
      try {
        errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `API returned error: ${response.status} ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
      console.log('Response data:', JSON.stringify(data).substring(0, 200) + '...');
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid response from API' },
        { status: 502 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch data from API',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `https://mixcore.net/api/v2/rest/auth/${path}`;

  try {
    const body = await request.json();
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = `https://mixcore.net/api/v2/rest/auth/${path}`;

  try {
    const headers: HeadersInit = {};
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from API' },
      { status: 500 }
    );
  }
} 
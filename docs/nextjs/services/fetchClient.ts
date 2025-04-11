'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mixcore.net';

// Helper function to decide whether to use proxy or direct API call
const getApiEndpoint = (path: string): string => {
  // Use our local proxy in development or when direct API calls are failing
  const useProxy = true;
  
  if (useProxy) {
    // Remove the common prefix since our proxy already includes it
    const endpoint = path.replace('/api/v2/rest/auth/', '');
    return `/api/auth/${endpoint}`;
  }
  
  return path;
};

// Log the API URL for debugging
if (typeof window !== 'undefined') {
  console.log('API URL:', API_URL);
}

class FetchClient {
  private refreshAttempted: boolean = false;
  private isClientSide: boolean;

  constructor() {
    this.isClientSide = typeof window !== 'undefined';
    this.refreshAttempted = false;

    // Validate API URL on initialization
    if (this.isClientSide) {
      try {
        new URL(API_URL); // Will throw if invalid URL
        console.log('FetchClient initialized with API URL:', API_URL);
      } catch (error) {
        console.error('Invalid API URL:', API_URL);
      }
    }
  }

  private getAuthToken(): string | null {
    // Check if client-side
    if (!this.isClientSide) {
      return null;
    }

    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  private logout(): void {
    // Check if client-side
    if (!this.isClientSide) {
      return;
    }

    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/security/login';
    } catch (error) {
      console.error('Error accessing localStorage during logout:', error);
    }
  }

  private createHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (response.status === 401 && !this.refreshAttempted) {
      // Attempt to refresh the token
      this.refreshAttempted = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          this.logout();
          throw new Error('No refresh token available');
        }

        const refreshEndpoint = getApiEndpoint('/api/v2/rest/auth/user/renew-token');
        const refreshUrl = refreshEndpoint.startsWith('http') 
          ? refreshEndpoint 
          : `${window.location.origin}${refreshEndpoint}`;

        const refreshResponse = await fetch(
          refreshUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          }
        );

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok && refreshData.success) {
          const { accessToken, refreshToken: newRefreshToken } =
            refreshData.data;

          // Store the new tokens
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          this.refreshAttempted = false;

          // Retry the original request with the new token
          const originalRequest = {
            url: response.url,
            options: {
              method: 'GET', // Default to GET as we can't access original method
              headers: this.createHeaders()
            }
          };

          return this.fetchWithInterceptor(
            originalRequest.url,
            originalRequest.options
          );
        } else {
          this.logout();
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  }

  private async fetchWithInterceptor(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    // Check if we're in client-side environment
    if (!this.isClientSide) {
      throw new Error('FetchClient can only be used in client-side code');
    }

    try {
      // Log the request details for debugging
      console.log(`🚀 Request: ${options.method || 'GET'} ${url}`);

      // Check if online
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error(
          'You are offline. Please check your internet connection.'
        );
      }

      // Create a timeout promise that rejects after 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after 30s for ${url}`));
        }, 30000);
      });

      // Add CORS mode and credentials to options
      const enhancedOptions: RequestInit = {
        ...options,
        mode: 'cors',
        credentials: 'include',
      };

      // Race the fetch against the timeout
      const response = (await Promise.race([
        fetch(url, enhancedOptions),
        timeoutPromise
      ])) as Response;

      // Log the response status
      console.log(
        `📥 Response: ${response.status} ${response.statusText} for ${url}`
      );

      return this.handleResponse(response);
    } catch (error) {
      // More detailed error logging
      const errorDetails = {
        url,
        method: options.method || 'GET',
        headers: options.headers
          ? JSON.stringify(options.headers)
          : 'default headers',
        online: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString()
      };

      console.error('⚠️ Fetch error details:', errorDetails);

      // Enhance error with more context
      if (error instanceof Error) {
        if (!navigator.onLine) {
          throw new Error(
            `Network offline. Please check your internet connection.`
          );
        }

        if (error.message.includes('Failed to fetch')) {
          throw new Error(
            `Network request failed for ${url}. Check your connection and API endpoint.`
          );
        }

        if (error.message.includes('CORS')) {
          throw new Error(
            `CORS policy violation accessing ${url}. Check API CORS settings.`
          );
        }

        if (error.message.includes('timeout')) {
          throw new Error(
            `Request to ${url} timed out after 30s. The server might be unresponsive.`
          );
        }

        // Add original error message for clarity
        error.message = `Fetch error for ${options.method || 'GET'} ${url}: ${error.message}`;
      }

      throw error;
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // For proxy endpoints, use the full URL including origin
    // Otherwise, append to API_URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
        ? `${window.location.origin}${endpoint}` // Use full origin for our proxy endpoints
        : `${API_URL}${endpoint}`;

    return this.fetchWithInterceptor(url, {
      method: 'GET',
      headers: this.createHeaders(options.headers),
      ...options
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    // For proxy endpoints, use the full URL including origin
    // Otherwise, append to API_URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
        ? `${window.location.origin}${endpoint}` // Use full origin for our proxy endpoints
        : `${API_URL}${endpoint}`;

    return this.fetchWithInterceptor(url, {
      method: 'POST',
      headers: this.createHeaders(options.headers),
      body: JSON.stringify(data),
      ...options
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    // For proxy endpoints, use the full URL including origin
    // Otherwise, append to API_URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
        ? `${window.location.origin}${endpoint}` // Use full origin for our proxy endpoints
        : `${API_URL}${endpoint}`;

    return this.fetchWithInterceptor(url, {
      method: 'PUT',
      headers: this.createHeaders(options.headers),
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // For proxy endpoints, use the full URL including origin
    // Otherwise, append to API_URL
    const url = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
        ? `${window.location.origin}${endpoint}` // Use full origin for our proxy endpoints
        : `${API_URL}${endpoint}`;

    return this.fetchWithInterceptor(url, {
      method: 'DELETE',
      headers: this.createHeaders(options.headers),
      ...options
    });
  }

  // Test API connectivity with detailed diagnostics
  async testConnection(endpoint: string = '/health-check'): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    if (!this.isClientSide) {
      return {
        success: false,
        message: 'Cannot test connection in server-side environment'
      };
    }

    const startTime = Date.now();
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_URL}${endpoint}`;

    try {
      // Check if we're online
      if (!navigator.onLine) {
        return {
          success: false,
          message: 'Network is offline',
          details: {
            navigator: 'offline',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Try to make a simple HEAD request to the API
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
        // Short timeout for health check
        signal: AbortSignal.timeout(5000)
      });

      const responseTime = Date.now() - startTime;

      return {
        success: response.ok,
        message: response.ok
          ? `API connected successfully in ${responseTime}ms`
          : `API returned status: ${response.status} ${response.statusText}`,
        details: {
          statusCode: response.status,
          statusText: response.statusText,
          responseTimeMs: responseTime,
          url,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        success: false,
        message: `API connection failed: ${error instanceof Error ? error.message : String(error)}`,
        details: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace',
          responseTimeMs: responseTime,
          url,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Ping multiple endpoints to determine where the connection is failing
   * This is useful for diagnosing network issues
   */
  async diagnoseConnection(): Promise<{
    summary: string;
    tests: Array<{ endpoint: string; result: any }>;
  }> {
    if (!this.isClientSide) {
      return {
        summary: 'Cannot run diagnostics in server-side environment',
        tests: []
      };
    }

    // Test if any network is available
    const isOnline = navigator.onLine;

    if (!isOnline) {
      return {
        summary: 'Device is offline. Check your internet connection.',
        tests: []
      };
    }

    // Array of endpoints to test
    const endpoints = [
      { name: 'CORS Test', url: 'https://cors-test.appspot.com/test' },
      { name: 'Internet Connectivity', url: 'https://www.google.com' },
      { name: 'DNS Lookup', url: 'https://1.1.1.1/' },
      { name: 'API Root', url: API_URL },
      { name: 'API Health Check', url: `${API_URL}/health-check` }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: 'HEAD',
          mode: endpoint.name === 'CORS Test' ? 'cors' : 'no-cors',
          cache: 'no-store',
          signal: AbortSignal.timeout(5000)
        });

        results.push({
          endpoint: endpoint.name,
          result: {
            success: true,
            status: response.status,
            time: Date.now() - startTime,
            message: `Connection successful (${response.status})`
          }
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          result: {
            success: false,
            time: 0,
            error: error instanceof Error ? error.message : String(error),
            message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`
          }
        });
      }
    }

    // Determine where the failure is happening
    const internetWorks = results.find(
      (r) => r.endpoint === 'Internet Connectivity'
    )?.result.success;
    const dnsWorks = results.find((r) => r.endpoint === 'DNS Lookup')?.result
      .success;
    const apiRootWorks = results.find((r) => r.endpoint === 'API Root')?.result
      .success;
    const apiHealthWorks = results.find(
      (r) => r.endpoint === 'API Health Check'
    )?.result.success;

    let summary = '';

    if (!internetWorks) {
      summary = 'Internet connection issue. Check your network connection.';
    } else if (!dnsWorks) {
      summary =
        'DNS lookup issue. Your device may have trouble resolving domain names.';
    } else if (!apiRootWorks) {
      summary =
        'Cannot connect to API server. The server may be down or unreachable.';
    } else if (!apiHealthWorks) {
      summary =
        'API server is reachable but health check failed. The application may be experiencing issues.';
    } else {
      summary =
        'Connection diagnostics passed. If you are still having issues, the problem may be with specific API endpoints.';
    }

    return {
      summary,
      tests: results
    };
  }
}

export const fetchClient = new FetchClient();

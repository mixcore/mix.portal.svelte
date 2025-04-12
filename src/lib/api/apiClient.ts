// API client for interacting with Mixcore CMS API
import { browser } from '$app/environment';

// Default API URL if not provided in environment
const API_URL = browser && import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : 'https://mixcore.net';

// Helper to decide whether to use local proxy or direct API call
export const getApiEndpoint = (path: string): string => {
  const useProxy = true; // Always use proxy to avoid CORS issues
  
  if (useProxy) {
    let endpoint = path;
    
    // Normalize path to work with our proxy
    if (path.startsWith('/api/v2/rest/auth/')) {
      endpoint = path.replace('/api/v2/rest/auth/', '');
    } else if (path.startsWith('/api/auth/')) {
      endpoint = path.replace('/api/auth/', '');
    }
    
    // Add user/ prefix if not present and the path isn't already a user path
    if (!endpoint.startsWith('user/') && !endpoint.includes('/user/')) {
      endpoint = `user/${endpoint}`;
    }
    
    const fullEndpoint = `/api/auth/${endpoint}`;
    console.log(`[API] Using proxy endpoint: ${fullEndpoint}`);
    return fullEndpoint;
  }
  
  console.log(`[API] Using direct endpoint: ${API_URL}${path}`);
  return `${API_URL}${path}`;
};

// Fetch client for making API requests
export const fetchClient = {
  // GET request
  get: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = browser ? localStorage.getItem('authToken') : null;
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`[API] GET Request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        console.error(`[API] HTTP error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`[API] Response:`, data);
      return data;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  },
  
  // POST request
  post: async <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
    const token = browser ? localStorage.getItem('authToken') : null;
    
    const headers = new Headers(options.headers);
    
    // Use application/json-patch+json for login-unsecure endpoint
    if (url.includes('login-unsecure')) {
      headers.set('Content-Type', 'application/json-patch+json');
    } else {
      headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`[API] POST Request to: ${url}`);
    console.log(`[API] Request data:`, data);
    
    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        console.error(`[API] HTTP error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`[API] Response:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  },
  
  // PUT request
  put: async <T>(url: string, data: any, options: RequestInit = {}): Promise<T> => {
    const token = browser ? localStorage.getItem('authToken') : null;
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`[API] PUT Request to: ${url}`);
    console.log(`[API] Request data:`, data);
    
    try {
      const response = await fetch(url, {
        ...options,
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        console.error(`[API] HTTP error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`[API] Response:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  },
  
  // DELETE request
  delete: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = browser ? localStorage.getItem('authToken') : null;
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`[API] DELETE Request to: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        console.error(`[API] HTTP error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log(`[API] Response:`, responseData);
      return responseData;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  }
}; 
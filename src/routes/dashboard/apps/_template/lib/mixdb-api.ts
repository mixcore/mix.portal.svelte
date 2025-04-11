import { writable, type Readable } from 'svelte/store';
import type { AuthStore, AuthState, CultureStore, CultureState, ApiResponse, PaginationParams, ApiState } from './types';

interface ApiOptions {
  basePath: string;
  authStore?: AuthStore;
  cultureStore?: CultureStore;
  includeCulture?: boolean;
}

export function createApiStore(options: ApiOptions) {
  const {
    basePath,
    authStore,
    cultureStore,
    includeCulture = false
  } = options;
  
  // Initialize state
  const initialState: ApiState = {
    isLoading: false,
    error: null,
    lastResponse: null
  };
  
  // Create store
  const { subscribe, set, update } = writable<ApiState>(initialState);
  
  // Helper to get auth token
  const getAuthToken = async (): Promise<string | null> => {
    if (!authStore) return null;
    
    return new Promise((resolve) => {
      const unsubscribe = authStore.subscribe((state: AuthState) => {
        resolve(state.token);
        unsubscribe();
      });
    });
  };
  
  // Helper to get current culture
  const getCurrentCulture = async (): Promise<string | null> => {
    if (!cultureStore) return null;
    
    return new Promise((resolve) => {
      const unsubscribe = cultureStore.subscribe((state: CultureState) => {
        resolve(state.currentCulture);
        unsubscribe();
      });
    });
  };
  
  // Build request headers
  const buildHeaders = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add auth token if available
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add culture if required
    if (includeCulture) {
      const culture = await getCurrentCulture();
      if (culture) {
        headers['Accept-Language'] = culture;
      }
    }
    
    return headers;
  };
  
  // Helper to build URL with query params
  const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
    if (!params) return `${basePath}/${endpoint}`;
    
    const url = new URL(`${basePath}/${endpoint}`, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
    
    return url.toString();
  };
  
  // Generic API request method
  const request = async <T>(
    method: string,
    endpoint: string,
    data?: any,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> => {
    update(state => ({ ...state, isLoading: true, error: null }));
    
    try {
      const headers = await buildHeaders();
      const url = buildUrl(endpoint, queryParams);
      
      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',
      };
      
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      
      update(state => ({ 
        ...state, 
        isLoading: false,
        lastResponse: responseData
      }));
      
      // Handle error response
      if (!response.ok) {
        const error = new Error(responseData.message || 'API request failed');
        throw error;
      }
      
      return {
        data: responseData.data || responseData,
        statusCode: response.status,
        success: response.ok,
        errors: responseData.errors
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('API request failed');
      update(state => ({ 
        ...state, 
        isLoading: false, 
        error: err
      }));
      throw err;
    }
  };
  
  // Return store with API methods
  return {
    subscribe,
    
    // Get a single item by ID
    getItem: async <T>(model: string, id: string | number): Promise<T> => {
      const response = await request<T>('GET', `${model}/${id}`);
      return response.data;
    },
    
    // Get a paginated list of items
    getItems: async <T>(
      model: string, 
      params?: PaginationParams
    ): Promise<{ items: T[]; total: number; page: number; pageSize: number }> => {
      const response = await request<any>('GET', model, null, params);
      
      // In a real app, this would depend on your API's response structure
      return {
        items: response.data.items || response.data,
        total: response.data.total || response.data.length,
        page: response.data.page || params?.page || 1,
        pageSize: response.data.pageSize || params?.pageSize || 10
      };
    },
    
    // Create a new item
    createItem: async <T>(model: string, data: any): Promise<T> => {
      const response = await request<T>('POST', model, data);
      return response.data;
    },
    
    // Update an existing item
    updateItem: async <T>(model: string, id: string | number, data: any): Promise<T> => {
      const response = await request<T>('PUT', `${model}/${id}`, data);
      return response.data;
    },
    
    // Delete an item
    deleteItem: async (model: string, id: string | number): Promise<boolean> => {
      const response = await request<any>('DELETE', `${model}/${id}`);
      return response.success;
    },
    
    // Custom query (for complex operations)
    query: async <T>(
      endpoint: string,
      method = 'GET',
      data?: any,
      queryParams?: Record<string, any>
    ): Promise<T> => {
      const response = await request<T>(method, endpoint, data, queryParams);
      return response.data;
    }
  };
} 
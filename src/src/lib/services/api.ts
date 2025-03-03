import type { ApiResponse } from '$lib/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequest {
  method: HttpMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

const defaultHeaders = {
  'Content-Type': 'application/json'
};

export async function getApiResult<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
  const { method, url, data, headers = {} } = request;
  
  try {
    const response = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return {
        isSucceed: false,
        errors: [result.message || 'An error occurred while processing your request']
      };
    }
    
    return {
      isSucceed: true,
      data: result
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      isSucceed: false,
      errors: [(error as Error).message || 'An error occurred while processing your request']
    };
  }
}
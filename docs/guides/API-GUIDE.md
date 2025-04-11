# Mixcore API Integration Guide

This guide explains how to integrate with the Mixcore API during the migration process.

## API Documentation Structure

The Mixcore API documentation is organized in the `api-docs` directory:

```
api-docs/
├── index.html           # Main navigation interface
├── index.json           # OpenAPI metadata
├── auth/                # Authentication endpoints
├── mixservices/         # Core services endpoints
├── automation/          # Workflow automation endpoints
└── schemas/             # API schema definitions
```

## API Service Implementation Pattern

When implementing API integration, follow this standardized pattern:

### 1. Create TypeScript Interfaces

First, define TypeScript interfaces that match the API schemas:

```typescript
// types/api/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  createdDateTime: string;
  modifiedDateTime: string;
  // Add other fields from the API schema
}

export interface PostListResponse {
  items: Post[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: string;
  // Add other fields required for creation
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: string;
  // Add other fields that can be updated
}
```

### 2. Create API Service

Next, implement a service for the API category:

```typescript
// services/postService.ts
import { apiClient } from './apiClient';
import { 
  Post, 
  PostListResponse,
  PostCreateRequest,
  PostUpdateRequest
} from '@/types/api/post';

export const postService = {
  // Get posts with pagination, filtering and sorting
  getPosts: async (params: {
    pageSize?: number;
    pageIndex?: number;
    search?: string;
    sortBy?: string;
    filter?: Record<string, any>;
  }) => {
    return apiClient.get<PostListResponse>('/api/v2/rest/post/list', { 
      params 
    });
  },
  
  // Get a single post by id
  getPost: async (id: string) => {
    return apiClient.get<Post>(`/api/v2/rest/post/${id}`);
  },
  
  // Create a new post
  createPost: async (post: PostCreateRequest) => {
    return apiClient.post<Post>('/api/v2/rest/post', post);
  },
  
  // Update an existing post
  updatePost: async (id: string, post: PostUpdateRequest) => {
    return apiClient.put<Post>(`/api/v2/rest/post/${id}`, post);
  },
  
  // Delete a post
  deletePost: async (id: string) => {
    return apiClient.delete(`/api/v2/rest/post/${id}`);
  }
};
```

### 3. Use In Components with React Hooks

Create custom hooks for common data operations:

```typescript
// hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { postService } from '@/services/postService';
import { Post, PostListResponse } from '@/types/api/post';

export function usePosts(params: {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  sortBy?: string;
  filter?: Record<string, any>;
}) {
  const [data, setData] = useState<PostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await postService.getPosts(params);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [params]);

  return { data, loading, error };
}
```

## Authentication Integration

### Token Management

The Mixcore API uses JWT tokens for authentication. Implement token management in your API client:

```typescript
// services/apiClient.ts
import axios from 'axios';
import { refreshToken } from '@/services/authService';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh the token
        const newToken = await refreshToken();
        localStorage.setItem('auth_token', newToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };
```

## Common API Endpoints

### Authentication

- **Login**: `POST /api/v2/rest/auth/login`
- **Register**: `POST /api/v2/rest/auth/register`
- **Refresh Token**: `POST /api/v2/rest/auth/refresh-token`

### Content

- **Posts List**: `GET /api/v2/rest/post/list`
- **Post Detail**: `GET /api/v2/rest/post/{id}`
- **Create Post**: `POST /api/v2/rest/post`
- **Update Post**: `PUT /api/v2/rest/post/{id}`
- **Delete Post**: `DELETE /api/v2/rest/post/{id}`

- **Pages List**: `GET /api/v2/rest/page/list`
- **Page Detail**: `GET /api/v2/rest/page/{id}`
- **Create Page**: `POST /api/v2/rest/page`
- **Update Page**: `PUT /api/v2/rest/page/{id}`
- **Delete Page**: `DELETE /api/v2/rest/page/{id}`

### Media

- **Media List**: `GET /api/v2/rest/media/list`
- **Media Detail**: `GET /api/v2/rest/media/{id}`
- **Upload Media**: `POST /api/v2/rest/media/upload`
- **Delete Media**: `DELETE /api/v2/rest/media/{id}`

### Users

- **Users List**: `GET /api/v2/rest/user/list`
- **User Detail**: `GET /api/v2/rest/user/{id}`
- **Create User**: `POST /api/v2/rest/user`
- **Update User**: `PUT /api/v2/rest/user/{id}`
- **Delete User**: `DELETE /api/v2/rest/user/{id}`

## Error Handling

Implement consistent error handling for API responses:

```typescript
// utils/errorHandler.ts
import { toast } from '@/components/ui/toast';

export function handleApiError(error: any, fallbackMessage = 'An error occurred') {
  // Extract error message from API response if available
  const errorMessage = error.response?.data?.message || fallbackMessage;
  
  // Log error for debugging
  console.error(error);
  
  // Show toast notification
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
  
  // Return error for further handling
  return errorMessage;
}
```

## API Integration Best Practices

1. **Use TypeScript**: Define proper interfaces for API requests and responses
2. **Centralized API Client**: Use a single API client with proper error handling
3. **Custom Hooks**: Create reusable hooks for common API operations
4. **Loading States**: Handle loading states properly with skeleton loaders or spinners
5. **Error Handling**: Implement consistent error handling across the application
6. **Token Management**: Handle token refresh and expiration properly
7. **Pagination**: Implement proper pagination, especially for large datasets
8. **Caching**: Consider implementing caching for frequently accessed data
9. **SWR or React Query**: Consider using SWR or React Query for data fetching
10. **Testing**: Write tests for API services 
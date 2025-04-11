'use client';

import { Post, PostListResponse, PostQueryParams } from '@/types/post';
import { fetchClient } from './fetchClient';
import { MixContentStatus } from '@/types/content';

// Mock data for fallback when API is not available
const mockPosts: Post[] = [
  {
    id: 1,
    createdDateTime: '2024-03-15T10:00:00Z',
    lastModified: '2024-03-16T11:30:00Z',
    createdBy: 'admin',
    modifiedBy: 'admin',
    priority: 1,
    status: MixContentStatus.Published,
    isDeleted: false,
    tenantId: 1,
    specificulture: 'en-US',
    icon: 'file',
    isPublic: true,
    parentId: 0,
    mixCultureId: 1,
    title: 'Getting Started with Mixcore',
    excerpt: 'Learn how to get started with Mixcore CMS',
    content:
      'This is a sample post content showing how to get started with Mixcore CMS.',
    image: 'https://picsum.photos/id/1/800/400',
    seoTitle: 'Getting Started with Mixcore CMS',
    seoDescription:
      'Learn how to get started with Mixcore CMS in this introductory guide'
  },
  {
    id: 2,
    createdDateTime: '2024-03-14T14:20:00Z',
    lastModified: '2024-03-15T09:15:00Z',
    createdBy: 'admin',
    modifiedBy: 'editor',
    priority: 2,
    status: MixContentStatus.Draft,
    isDeleted: false,
    tenantId: 1,
    specificulture: 'en-US',
    icon: 'document',
    isPublic: false,
    parentId: 0,
    mixCultureId: 1,
    title: 'Advanced Mixcore Features',
    excerpt: 'Explore advanced features in Mixcore CMS',
    content:
      'This post covers advanced features and configurations in Mixcore CMS.',
    image: 'https://picsum.photos/id/2/800/400',
    seoTitle: 'Advanced Mixcore CMS Features',
    seoDescription:
      'Explore advanced features and configurations in Mixcore CMS'
  },
  {
    id: 3,
    createdDateTime: '2024-03-13T08:45:00Z',
    lastModified: '',
    createdBy: 'admin',
    modifiedBy: '',
    priority: 3,
    status: MixContentStatus.Archived,
    isDeleted: false,
    tenantId: 1,
    specificulture: 'en-US',
    icon: 'calendar',
    isPublic: true,
    parentId: 0,
    mixCultureId: 1,
    title: 'Upcoming Mixcore Features in 2024',
    excerpt: 'Preview of upcoming Mixcore CMS features',
    content:
      'This post provides a preview of upcoming features planned for Mixcore CMS in 2024.',
    image: 'https://picsum.photos/id/3/800/400',
    seoTitle: 'Upcoming Mixcore CMS Features in 2024',
    seoDescription:
      'Preview of upcoming features planned for Mixcore CMS in 2024'
  }
];

// Helper function to filter and paginate mock data
const filterAndPaginateMockPosts = (
  posts: Post[],
  { pageIndex = 0, pageSize = 10, search = '', status }: PostQueryParams
): PostListResponse => {
  // Filter by search
  let filteredPosts = posts;

  if (search) {
    filteredPosts = posts.filter((post) =>
      post.title?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by status
  if (status !== undefined) {
    filteredPosts = filteredPosts.filter((post) => post.status === status);
  }

  // Get total count
  const totalItems = filteredPosts.length;

  // Paginate
  const startIndex = pageIndex * pageSize;
  const paginatedItems = filteredPosts.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    pageIndex,
    pageSize
  };
};

// Helper to build URL with query parameters
const buildUrlWithParams = (
  baseUrl: string,
  params?: Record<string, any>
): string => {
  if (!params) return baseUrl;

  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.pathname + url.search;
};

export const postService = {
  // Get list of posts with pagination, filtering, and sorting
  getPosts: async (params?: PostQueryParams): Promise<PostListResponse> => {
    try {
      console.log('Fetching posts with params:', params);

      // Build query for json-server
      const endpoint = `/posts${
        params
          ? '?' +
            new URLSearchParams({
              _page:
                params.pageIndex !== undefined
                  ? String(params.pageIndex + 1)
                  : '1',
              _limit:
                params.pageSize !== undefined ? String(params.pageSize) : '10',
              ...(params.search ? { q: params.search } : {}),
              ...(params.status !== undefined
                ? { status: String(params.status) }
                : {})
            }).toString()
          : ''
      }`;

      console.log('Calling API endpoint:', endpoint);

      // Make the request
      const response = await fetchClient.get<Post[]>(endpoint);
      console.log('API response received:', response);

      // Check if our API already returned paginated data in the expected format
      if (
        response &&
        typeof response === 'object' &&
        'items' in response &&
        'totalItems' in response &&
        'totalPages' in response &&
        'pageIndex' in response &&
        'pageSize' in response
      ) {
        console.log('Response is already in paginated format');
        return response as unknown as PostListResponse;
      }

      // Handle case where json-server returns a simple array
      if (Array.isArray(response)) {
        console.log('Converting array response to paginated format');

        // Get the pagination details from the query or use defaults
        const pageIndex = params?.pageIndex || 0;
        const pageSize = params?.pageSize || 10;

        // Calculate pagination
        const totalItems = response.length;

        return {
          items: response,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
          pageIndex,
          pageSize
        };
      }

      // Fallback to empty results with warning
      console.warn('Unexpected response format:', response);
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        pageIndex: params?.pageIndex || 0,
        pageSize: params?.pageSize || 10
      };
    } catch (error) {
      console.error('API request failed, using fallback data:', error);
      return filterAndPaginateMockPosts(mockPosts, params || {});
    }
  },

  // Get a single post by ID
  getPost: async (id: number): Promise<Post> => {
    try {
      return await fetchClient.get<Post>(`/posts/${id}`);
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      const post = mockPosts.find((p) => p.id === id);
      if (!post) {
        throw new Error(`Post with ID ${id} not found`);
      }
      return post;
    }
  },

  // Create a new post
  createPost: async (post: Partial<Post>): Promise<Post> => {
    try {
      return await fetchClient.post<Post>('/posts', post);
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      // For demo purposes only - in a real app, we would need to persist this data
      const newPost: Post = {
        id: Math.max(...mockPosts.map((p) => p.id)) + 1,
        createdDateTime: new Date().toISOString(),
        lastModified: '',
        createdBy: 'user',
        modifiedBy: '',
        priority: 1,
        status: MixContentStatus.Draft,
        isDeleted: false,
        tenantId: 1,
        specificulture: 'en-US',
        icon: '',
        isPublic: false,
        parentId: 0,
        mixCultureId: 1,
        ...post
      };
      mockPosts.push(newPost);
      return newPost;
    }
  },

  // Update an existing post
  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    try {
      return await fetchClient.put<Post>(`/posts/${id}`, post);
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      const postIndex = mockPosts.findIndex((p) => p.id === id);
      if (postIndex === -1) {
        throw new Error(`Post with ID ${id} not found`);
      }
      const updatedPost = {
        ...mockPosts[postIndex],
        ...post,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user'
      };
      mockPosts[postIndex] = updatedPost;
      return updatedPost;
    }
  },

  // Delete a post
  deletePost: async (id: number): Promise<void> => {
    try {
      return await fetchClient.delete(`/posts/${id}`);
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      const postIndex = mockPosts.findIndex((p) => p.id === id);
      if (postIndex === -1) {
        throw new Error(`Post with ID ${id} not found`);
      }
      // For demo purposes, just mark as deleted
      mockPosts[postIndex].isDeleted = true;
      mockPosts[postIndex].status = MixContentStatus.Deleted;
    }
  },

  // Clear post cache
  clearCache: async (id: number): Promise<void> => {
    try {
      // With json-server, there's no cache clearing, so we'll just fetch the post again
      await fetchClient.get<Post>(`/posts/${id}`);
    } catch (error) {
      console.warn('API request failed, using fallback data:', error);
      // No-op for mock data
    }
  }
};

import { apiClient } from './apiClient';
import { Category } from './categoryService';
import { Tag } from './tagService';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  allowComments: boolean;
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  allowComments?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

interface ApiResponse<T> {
  data: T;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const postService = {
  async create(data: CreatePostDto): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>(
      '/api/v2/rest/mix-portal/posts',
      { data }
    );
    return response.data.data;
  },

  async update(id: string, data: Partial<CreatePostDto>): Promise<Post> {
    const response = await apiClient.put<ApiResponse<Post>>(
      `/api/v2/rest/mix-portal/posts/${id}`,
      { data }
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v2/rest/mix-portal/posts/${id}`);
  },

  async getById(id: string): Promise<Post> {
    const response = await apiClient.get<ApiResponse<Post>>(
      `/api/v2/rest/mix-portal/posts/${id}`
    );
    return response.data.data;
  },

  async getList(params?: {
    page?: number;
    limit?: number;
    status?: Post['status'];
    isFeatured?: boolean;
    categoryId?: string;
    tagId?: string;
    search?: string;
  }): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      '/api/v2/rest/mix-portal/posts',
      { params }
    );
    return {
      data: response.data.data,
      total: response.data.total
    };
  }
};

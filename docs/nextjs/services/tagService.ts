import { apiClient } from './apiClient';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
  description?: string;
}

interface ApiResponse<T> {
  data: T;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const tagService = {
  async create(data: CreateTagDto): Promise<Tag> {
    const response = await apiClient.post<ApiResponse<Tag>>(
      '/api/v2/rest/mix-portal/tags',
      { data }
    );
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateTagDto>): Promise<Tag> {
    const response = await apiClient.put<ApiResponse<Tag>>(
      `/api/v2/rest/mix-portal/tags/${id}`,
      { data }
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v2/rest/mix-portal/tags/${id}`);
  },

  async getById(id: string): Promise<Tag> {
    const response = await apiClient.get<ApiResponse<Tag>>(
      `/api/v2/rest/mix-portal/tags/${id}`
    );
    return response.data.data;
  },

  async getList(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Tag>> {
    const response = await apiClient.get<PaginatedResponse<Tag>>(
      '/api/v2/rest/mix-portal/tags',
      { params }
    );
    return {
      data: response.data.data,
      total: response.data.total
    };
  }
};

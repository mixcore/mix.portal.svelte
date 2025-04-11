import { apiClient } from './apiClient';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

interface ApiResponse<T> {
  data: T;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export const categoryService = {
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>(
      '/api/v2/rest/mix-portal/categories',
      { data }
    );
    return response.data.data;
  },

  async update(
    id: string,
    data: Partial<CreateCategoryDto>
  ): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/api/v2/rest/mix-portal/categories/${id}`,
      { data }
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v2/rest/mix-portal/categories/${id}`);
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/api/v2/rest/mix-portal/categories/${id}`
    );
    return response.data.data;
  },

  async getList(params?: {
    page?: number;
    limit?: number;
    parentId?: string;
  }): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<PaginatedResponse<Category>>(
      '/api/v2/rest/mix-portal/categories',
      { params }
    );
    return {
      data: response.data.data,
      total: response.data.total
    };
  }
};

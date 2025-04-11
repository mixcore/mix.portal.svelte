'use client';

import { Media, MediaQueryParams, MediaUploadDto } from '@/types/media';
import { ApiResponse, PaginationResult } from '@/types/api';
import { fetchClient } from './fetchClient';

export const mediaService = {
  /**
   * Get a list of media files with pagination and filtering
   */
  getMediaList: async (params?: MediaQueryParams): Promise<PaginationResult<Media>> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params?.pageIndex !== undefined) {
        queryParams.append('pageIndex', params.pageIndex.toString());
      }
      
      if (params?.pageSize !== undefined) {
        queryParams.append('pageSize', params.pageSize.toString());
      }
      
      if (params?.search) {
        queryParams.append('keyword', params.search);
      }
      
      if (params?.fileType) {
        queryParams.append('fileType', params.fileType);
      }
      
      if (params?.fromDate) {
        queryParams.append('fromDate', params.fromDate);
      }
      
      if (params?.toDate) {
        queryParams.append('toDate', params.toDate);
      }
      
      const response = await fetchClient.get<ApiResponse<PaginationResult<Media>>>(
        `/rest/mix-media/search?${queryParams.toString()}`
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching media list:', error);
      // Return empty result on error
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        pageIndex: params?.pageIndex || 0,
        pageSize: params?.pageSize || 10
      };
    }
  },
  
  /**
   * Get a single media file by ID
   */
  getMedia: async (id: string): Promise<Media> => {
    const response = await fetchClient.get<ApiResponse<Media>>(`/rest/mix-media/${id}`);
    return response.data.data;
  },
  
  /**
   * Upload a media file
   */
  uploadMedia: async (file: File, title?: string, description?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (title) {
      formData.append('title', title);
    }
    
    if (description) {
      formData.append('description', description);
    }
    
    const response = await fetchClient.post<ApiResponse<Media>>(
      '/rest/mix-media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
  },
  
  /**
   * Delete a media file
   */
  deleteMedia: async (id: string): Promise<boolean> => {
    const response = await fetchClient.delete<ApiResponse<boolean>>(`/rest/mix-media/${id}`);
    return response.data.data;
  }
}; 
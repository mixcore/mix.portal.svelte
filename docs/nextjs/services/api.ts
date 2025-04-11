'use client';

import { ApiResponse, PaginationResult, Post, Page, User, Media } from '@/types';
import { fetchClient } from './fetchClient';

// Generic fetch data function with fetchClient
async function fetchData<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetchClient.get<ApiResponse<T>>(url, config);
        return response;
    } catch (error) {
        console.error('Fetch data error:', error);
        return {
            data: {} as T,
            success: false,
            errors: ['An error occurred while fetching data'],
            status: 500,
        };
    }
}

// Generic post data function with fetchClient
async function postData<T, R = T>(url: string, data: T, config?: RequestInit): Promise<ApiResponse<R>> {
    try {
        const response = await fetchClient.post<ApiResponse<R>>(url, data, config);
        return response;
    } catch (error) {
        console.error('Post data error:', error);
        return {
            data: {} as R,
            success: false,
            errors: ['An error occurred while posting data'],
            status: 500,
        };
    }
}

// Posts API
export const PostsApi = {
    getPosts: (pageIndex: number = 0, pageSize: number = 10, searchText?: string) => {
        const params = new URLSearchParams();
        params.append('pageIndex', pageIndex.toString());
        params.append('pageSize', pageSize.toString());
        if (searchText) params.append('searchText', searchText);

        return fetchData<PaginationResult<Post>>(`/rest/mix-post/search?${params.toString()}`);
    },
    getPost: (id: string) => {
        return fetchData<Post>(`/rest/mix-post/${id}`);
    },
    createPost: (post: Partial<Post>) => {
        return postData<Partial<Post>, Post>('/rest/mix-post', post);
    },
    updatePost: (id: string, post: Partial<Post>) => {
        return postData<Partial<Post>, Post>(`/rest/mix-post/${id}`, post);
    },
    deletePost: (id: string) => {
        return fetchClient.delete<ApiResponse<boolean>>(`/rest/mix-post/${id}`);
    }
};

// Pages API
export const PagesApi = {
    getPages: (pageIndex: number = 0, pageSize: number = 10, searchText?: string) => {
        const params = new URLSearchParams();
        params.append('pageIndex', pageIndex.toString());
        params.append('pageSize', pageSize.toString());
        if (searchText) params.append('searchText', searchText);

        return fetchData<PaginationResult<Page>>(`/rest/mix-page/search?${params.toString()}`);
    },
    getPage: (id: string) => {
        return fetchData<Page>(`/rest/mix-page/${id}`);
    },
    createPage: (page: Partial<Page>) => {
        return postData<Partial<Page>, Page>('/rest/mix-page', page);
    },
    updatePage: (id: string, page: Partial<Page>) => {
        return postData<Partial<Page>, Page>(`/rest/mix-page/${id}`, page);
    },
    deletePage: (id: string) => {
        return fetchClient.delete<ApiResponse<boolean>>(`/rest/mix-page/${id}`);
    }
};

// User API
export const UsersApi = {
    getUsers: (pageIndex: number = 0, pageSize: number = 10, searchText?: string) => {
        const params = new URLSearchParams();
        params.append('pageIndex', pageIndex.toString());
        params.append('pageSize', pageSize.toString());
        if (searchText) params.append('searchText', searchText);

        return fetchData<PaginationResult<User>>(`/rest/mix-user/search?${params.toString()}`);
    },
    getUser: (id: string) => {
        return fetchData<User>(`/rest/mix-user/${id}`);
    },
    getCurrentUser: () => {
        return fetchData<User>('/rest/mix-user/current');
    },
    createUser: (user: Partial<User>) => {
        return postData<Partial<User>, User>('/rest/mix-user', user);
    },
    updateUser: (id: string, user: Partial<User>) => {
        return postData<Partial<User>, User>(`/rest/mix-user/${id}`, user);
    },
    deleteUser: (id: string) => {
        return fetchClient.delete<ApiResponse<boolean>>(`/rest/mix-user/${id}`);
    }
};

// Media API
export const MediaApi = {
    getMedia: (pageIndex: number = 0, pageSize: number = 10, searchText?: string) => {
        const params = new URLSearchParams();
        params.append('pageIndex', pageIndex.toString());
        params.append('pageSize', pageSize.toString());
        if (searchText) params.append('searchText', searchText);

        return fetchData<PaginationResult<Media>>(`/rest/mix-media/search?${params.toString()}`);
    },
    getMediaItem: (id: string) => {
        return fetchData<Media>(`/rest/mix-media/${id}`);
    },
    uploadMedia: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return fetchClient.post<ApiResponse<Media>>('/rest/mix-media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteMedia: (id: string) => {
        return fetchClient.delete<ApiResponse<boolean>>(`/rest/mix-media/${id}`);
    }
}; 
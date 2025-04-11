'use client';

import { MixDbApi } from './mixdb-api';
import { AuthService } from './auth';

// Define types for blog entities
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  categoryIds?: string[];
  tagIds?: string[];
  isFeatured?: boolean;
  publishedDate?: string;
  scheduledDate?: string;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featuredImage?: string;
  color?: string;
  parentId?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  role?: 'Administrator' | 'Editor' | 'Author' | 'Contributor';
}

export interface BlogPostQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  featured?: boolean;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export class BlogService {
  private api: MixDbApi;
  private authService: AuthService;

  constructor(api: MixDbApi, authService: AuthService) {
    this.api = api;
    this.authService = authService;
  }

  // Blog Posts
  async getPosts(params?: BlogPostQueryParams) {
    const queryParams: Record<string, any> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      sortBy: params?.sortBy || 'publishedDate',
      sortDirection: params?.sortDirection || 'desc'
    };

    if (params?.search) {
      queryParams.search = params.search;
    }

    if (params?.status) {
      queryParams.filter = `status eq '${params.status}'`;
    }

    if (params?.authorId) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and authorId eq '${params.authorId}'` 
        : `authorId eq '${params.authorId}'`;
    }

    if (params?.categoryId) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and categoryIds/any(c: c eq '${params.categoryId}')` 
        : `categoryIds/any(c: c eq '${params.categoryId}')`;
    }

    if (params?.tagId) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and tagIds/any(t: t eq '${params.tagId}')` 
        : `tagIds/any(t: t eq '${params.tagId}')`;
    }

    if (params?.featured !== undefined) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and isFeatured eq ${params.featured}` 
        : `isFeatured eq ${params.featured}`;
    }

    if (params?.fromDate) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and publishedDate ge '${params.fromDate}'` 
        : `publishedDate ge '${params.fromDate}'`;
    }

    if (params?.toDate) {
      queryParams.filter = queryParams.filter 
        ? `${queryParams.filter} and publishedDate le '${params.toDate}'` 
        : `publishedDate le '${params.toDate}'`;
    }

    try {
      return await this.api.getItems<BlogPost>('blogPosts', queryParams);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  async getPostById(id: string) {
    try {
      return await this.api.getItemById<BlogPost>('blogPosts', id);
    } catch (error) {
      console.error(`Error fetching blog post with ID ${id}:`, error);
      throw error;
    }
  }

  async getPostBySlug(slug: string) {
    try {
      const result = await this.api.getItems<BlogPost>('blogPosts', {
        filter: `slug eq '${slug}'`,
        pageSize: 1
      });
      
      return result.items.length > 0 ? result.items[0] : null;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw error;
    }
  }

  async createPost(post: Omit<BlogPost, 'id'>) {
    try {
      return await this.api.createItem<BlogPost>('blogPosts', post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updatePost(id: string, post: Partial<BlogPost>) {
    try {
      return await this.api.updateItem<BlogPost>('blogPosts', id, post);
    } catch (error) {
      console.error(`Error updating blog post with ID ${id}:`, error);
      throw error;
    }
  }

  async deletePost(id: string) {
    try {
      return await this.api.deleteItem('blogPosts', id);
    } catch (error) {
      console.error(`Error deleting blog post with ID ${id}:`, error);
      throw error;
    }
  }

  async publishPost(id: string) {
    try {
      return await this.api.updateItem<BlogPost>('blogPosts', id, {
        status: 'published',
        publishedDate: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error publishing blog post with ID ${id}:`, error);
      throw error;
    }
  }

  async unpublishPost(id: string) {
    try {
      return await this.api.updateItem<BlogPost>('blogPosts', id, {
        status: 'draft'
      });
    } catch (error) {
      console.error(`Error unpublishing blog post with ID ${id}:`, error);
      throw error;
    }
  }

  async schedulePost(id: string, scheduledDate: string) {
    try {
      return await this.api.updateItem<BlogPost>('blogPosts', id, {
        status: 'scheduled',
        scheduledDate
      });
    } catch (error) {
      console.error(`Error scheduling blog post with ID ${id}:`, error);
      throw error;
    }
  }

  // Categories
  async getCategories(params?: { page?: number; pageSize?: number; search?: string }) {
    try {
      return await this.api.getItems<BlogCategory>('blogCategories', {
        page: params?.page || 1,
        pageSize: params?.pageSize || 100,
        search: params?.search,
        sortBy: 'name',
        sortDirection: 'asc'
      });
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: string) {
    try {
      return await this.api.getItemById<BlogCategory>('blogCategories', id);
    } catch (error) {
      console.error(`Error fetching blog category with ID ${id}:`, error);
      throw error;
    }
  }

  async createCategory(category: Omit<BlogCategory, 'id'>) {
    try {
      return await this.api.createItem<BlogCategory>('blogCategories', category);
    } catch (error) {
      console.error('Error creating blog category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, category: Partial<BlogCategory>) {
    try {
      return await this.api.updateItem<BlogCategory>('blogCategories', id, category);
    } catch (error) {
      console.error(`Error updating blog category with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      return await this.api.deleteItem('blogCategories', id);
    } catch (error) {
      console.error(`Error deleting blog category with ID ${id}:`, error);
      throw error;
    }
  }

  // Tags
  async getTags(params?: { page?: number; pageSize?: number; search?: string }) {
    try {
      return await this.api.getItems<BlogTag>('blogTags', {
        page: params?.page || 1,
        pageSize: params?.pageSize || 100,
        search: params?.search,
        sortBy: 'name',
        sortDirection: 'asc'
      });
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      throw error;
    }
  }

  async getTagById(id: string) {
    try {
      return await this.api.getItemById<BlogTag>('blogTags', id);
    } catch (error) {
      console.error(`Error fetching blog tag with ID ${id}:`, error);
      throw error;
    }
  }

  async createTag(tag: Omit<BlogTag, 'id'>) {
    try {
      return await this.api.createItem<BlogTag>('blogTags', tag);
    } catch (error) {
      console.error('Error creating blog tag:', error);
      throw error;
    }
  }

  async updateTag(id: string, tag: Partial<BlogTag>) {
    try {
      return await this.api.updateItem<BlogTag>('blogTags', id, tag);
    } catch (error) {
      console.error(`Error updating blog tag with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteTag(id: string) {
    try {
      return await this.api.deleteItem('blogTags', id);
    } catch (error) {
      console.error(`Error deleting blog tag with ID ${id}:`, error);
      throw error;
    }
  }

  // Authors
  async getAuthors(params?: { page?: number; pageSize?: number; search?: string }) {
    try {
      return await this.api.getItems<BlogAuthor>('blogAuthors', {
        page: params?.page || 1,
        pageSize: params?.pageSize || 100,
        search: params?.search,
        sortBy: 'name',
        sortDirection: 'asc'
      });
    } catch (error) {
      console.error('Error fetching blog authors:', error);
      throw error;
    }
  }

  async getAuthorById(id: string) {
    try {
      return await this.api.getItemById<BlogAuthor>('blogAuthors', id);
    } catch (error) {
      console.error(`Error fetching blog author with ID ${id}:`, error);
      throw error;
    }
  }

  async createAuthor(author: Omit<BlogAuthor, 'id'>) {
    try {
      return await this.api.createItem<BlogAuthor>('blogAuthors', author);
    } catch (error) {
      console.error('Error creating blog author:', error);
      throw error;
    }
  }

  async updateAuthor(id: string, author: Partial<BlogAuthor>) {
    try {
      return await this.api.updateItem<BlogAuthor>('blogAuthors', id, author);
    } catch (error) {
      console.error(`Error updating blog author with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteAuthor(id: string) {
    try {
      return await this.api.deleteItem('blogAuthors', id);
    } catch (error) {
      console.error(`Error deleting blog author with ID ${id}:`, error);
      throw error;
    }
  }

  // Statistics and analytics
  async getPostStats() {
    try {
      const postsResult = await this.api.getItems<BlogPost>('blogPosts', { pageSize: 1 });
      
      const totalPosts = postsResult.totalItems;
      
      const publishedPosts = await this.api.getItems<BlogPost>('blogPosts', { 
        filter: "status eq 'published'",
        pageSize: 1
      });
      
      const draftPosts = await this.api.getItems<BlogPost>('blogPosts', { 
        filter: "status eq 'draft'",
        pageSize: 1
      });
      
      const scheduledPosts = await this.api.getItems<BlogPost>('blogPosts', { 
        filter: "status eq 'scheduled'",
        pageSize: 1
      });
      
      const featuredPosts = await this.api.getItems<BlogPost>('blogPosts', { 
        filter: "isFeatured eq true",
        pageSize: 1
      });
      
      return {
        total: totalPosts,
        published: publishedPosts.totalItems,
        draft: draftPosts.totalItems,
        scheduled: scheduledPosts.totalItems,
        featured: featuredPosts.totalItems
      };
    } catch (error) {
      console.error('Error fetching post statistics:', error);
      throw error;
    }
  }
} 
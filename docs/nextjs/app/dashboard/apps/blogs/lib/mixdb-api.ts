/**
 * MixDB API Client for Mini-Apps
 * 
 * This module provides a comprehensive client for interacting with Mixcore's MixDB API
 * from within mini-applications. It includes type-safe methods for CRUD operations,
 * filtering, pagination, and file uploads.
 * 
 * @example
 * ```typescript
 * import { MixDbApi } from '../lib/mixdb-api';
 * 
 * const api = new MixDbApi({ 
 *   basePath: '/api/v2/rest',
 *   defaultHeaders: { 'Authorization': `Bearer ${token}` }
 * });
 * 
 * // Get paginated data
 * const products = await api.getItems('product', { 
 *   page: 1, 
 *   pageSize: 10,
 *   filter: { status: 'active' }
 * });
 * ```
 * 
 * @example
 * ```typescript
 * import { MixDbApi, MixDbHelpers } from '../lib/mixdb-api';
 * import { Request } from './types';
 * 
 * // Using the standard Request type with the MixDB API
 * const request: Request = {
 *   pageIndex: 0, // 0-based page index
 *   pageSize: 10,
 *   searchText: 'chair',
 *   searchColumns: ['name', 'description'],
 *   orderBy: 'price',
 *   direction: 'asc'
 * };
 * 
 * const api = new MixDbApi();
 * 
 * // Convert Request to QueryOptions and get data
 * const options = MixDbHelpers.requestToQueryOptions(request);
 * const products = await api.getItems('product', options);
 * ```
 */

import { MixDbEntity, PaginatedResponse, Request, requestToQueryOptions } from './types';
import { ApiResponse } from '../../../types/api';
import { AuthService } from './auth';
import { CultureService } from './culture';

/**
 * Configuration options for the MixDB API client
 */
export interface MixDbApiOptions {
  /** Base path for API requests (e.g., '/api/v2/rest') */
  basePath?: string;
  /** Default headers to include with every request */
  defaultHeaders?: Record<string, string>;
  /** Whether to throw errors for failed requests (default: true) */
  throwErrors?: boolean;
  /** Custom error handler for failed requests */
  onError?: (error: any) => void;
  /** Authentication service for automatic token handling */
  authService?: AuthService;
  /** Culture service for automatic culture handling */
  cultureService?: CultureService;
  /** Whether to automatically include culture in requests */
  includeCulture?: boolean;
}

/**
 * Query options for Mixcore API requests
 */
export interface QueryOptions {
  /** Current page number (1-based) */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Filtering criteria */
  filter?: Record<string, any>;
  /** Field to sort by */
  sort?: string;
  /** Sort direction */
  order?: 'asc' | 'desc';
  /** Allow for additional properties */
  [key: string]: any;
}

/**
 * MixDB API client for interacting with Mixcore data services
 */
export class MixDbApi {
  private options: MixDbApiOptions;
  
  /**
   * Creates a new MixDB API client instance
   */
  constructor(options: MixDbApiOptions = {}) {
    this.options = {
      basePath: '/api/v2/rest',
      throwErrors: true,
      includeCulture: true,
      ...options
    };
  }
  
  /**
   * Creates the full API URL for a given endpoint
   */
  private getUrl(endpoint: string): string {
    const basePath = this.options.basePath?.replace(/\/$/, '');
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${basePath}${formattedEndpoint}`;
  }
  
  /**
   * Gets headers for the request, including auth and culture if available
   */
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.options.defaultHeaders,
      ...customHeaders
    };
    
    // Add auth headers if authentication service is provided
    if (this.options.authService) {
      const authHeaders = this.options.authService.getAuthHeader();
      Object.assign(headers, authHeaders);
    }
    
    // Add culture header if culture service is provided and includeCulture is true
    if (this.options.cultureService && this.options.includeCulture) {
      const cultureCode = this.options.cultureService.getCurrentCultureCode();
      if (cultureCode) {
        headers['Accept-Language'] = cultureCode;
      }
    }
    
    return headers;
  }
  
  /**
   * Handles API response and errors consistently
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any;
      
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      
      // Handle authentication errors
      if (response.status === 401 && this.options.authService) {
        // Try to refresh token and retry the request
        try {
          await this.options.authService.refreshToken();
          // We could implement retry logic here
        } catch (refreshError) {
          // Token refresh failed, logout user
          this.options.authService.clearAuth();
        }
      }
      
      const error = new Error(errorData.message || 'API request failed');
      if (this.options.onError) {
        this.options.onError(error);
      }
      
      if (this.options.throwErrors) {
        throw error;
      }
      
      return errorData;
    }
    
    return await response.json();
  }
  
  /**
   * Get a paginated list of items from a specific model
   * 
   * @param model - The model/entity name (e.g., 'product', 'category')
   * @param options - Query options for filtering, pagination, and sorting
   * @returns A paginated response with items and pagination metadata
   * 
   * @example
   * ```typescript
   * // Get active products, 10 per page, sorted by name
   * const response = await api.getItems('product', {
   *   pageSize: 10,
   *   page: 1,
   *   filter: { status: 'Published' },
   *   sort: 'name',
   *   order: 'asc'
   * });
   * 
   * // Access the items and pagination info
   * const { items, totalItems, currentPage } = response;
   * ```
   */
  async getItems<T = MixDbEntity>(
    model: string, 
    options?: QueryOptions
  ): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    if (options) {
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.pageSize) queryParams.append('pageSize', options.pageSize.toString());
      if (options.sort) queryParams.append('sortBy', options.sort);
      if (options.order) queryParams.append('direction', options.order);
      
      // Add any filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(`${key}`, value.toString());
          }
        });
      }
      
      // Add any additional custom parameters
      Object.entries(options).forEach(([key, value]) => {
        if (!['page', 'pageSize', 'sort', 'order', 'filter'].includes(key) && 
            value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${this.getUrl(`/${model}`)}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const result = await this.handleResponse<ApiResponse<PaginatedResponse<T>>>(response);
    return result.data;
  }
  
  /**
   * Get a single item by ID
   * 
   * @param model - The model/entity name
   * @param id - The item ID
   * @returns The requested item
   * 
   * @example
   * ```typescript
   * // Get a product by ID
   * const product = await api.getItemById('product', '123');
   * ```
   */
  async getItemById<T = MixDbEntity>(model: string, id: string | number): Promise<T> {
    const url = this.getUrl(`/${model}/${id}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const result = await this.handleResponse<ApiResponse<T>>(response);
    return result.data;
  }
  
  /**
   * Create a new item
   * 
   * @param model - The model/entity name
   * @param data - The item data to create
   * @returns The created item
   * 
   * @example
   * ```typescript
   * // Create a new product
   * const newProduct = await api.createItem('product', {
   *   name: 'New Product',
   *   price: 99.99,
   *   status: 'Published'
   * });
   * ```
   */
  async createItem<T = MixDbEntity>(model: string, data: Partial<T>): Promise<T> {
    const url = this.getUrl(`/${model}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    const result = await this.handleResponse<ApiResponse<T>>(response);
    return result.data;
  }
  
  /**
   * Update an existing item (partial update)
   * 
   * @param model - The model/entity name
   * @param id - The item ID
   * @param data - The data to update
   * @returns The updated item
   * 
   * @example
   * ```typescript
   * // Update a product's price
   * const updatedProduct = await api.updateItem('product', '123', {
   *   price: 129.99
   * });
   * ```
   */
  async updateItem<T = MixDbEntity>(
    model: string, 
    id: string | number, 
    data: Partial<T>
  ): Promise<T> {
    const url = this.getUrl(`/${model}/${id}`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    const result = await this.handleResponse<ApiResponse<T>>(response);
    return result.data;
  }
  
  /**
   * Replace an existing item (full update)
   * 
   * @param model - The model/entity name
   * @param id - The item ID
   * @param data - The complete item data
   * @returns The replaced item
   * 
   * @example
   * ```typescript
   * // Replace a product completely
   * const replacedProduct = await api.replaceItem('product', '123', {
   *   name: 'Completely New Product',
   *   price: 199.99,
   *   status: 'Published',
   *   // All other required fields must be included
   * });
   * ```
   */
  async replaceItem<T = MixDbEntity>(
    model: string,
    id: string | number,
    data: T
  ): Promise<T> {
    const url = this.getUrl(`/${model}/${id}`);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    const result = await this.handleResponse<ApiResponse<T>>(response);
    return result.data;
  }
  
  /**
   * Delete an item
   * 
   * @param model - The model/entity name
   * @param id - The item ID
   * @returns Success status
   * 
   * @example
   * ```typescript
   * // Delete a product
   * await api.deleteItem('product', '123');
   * ```
   */
  async deleteItem(model: string, id: string | number): Promise<boolean> {
    const url = this.getUrl(`/${model}/${id}`);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    const result = await this.handleResponse<ApiResponse<boolean>>(response);
    return result.isSucceed;
  }
  
  /**
   * Create multiple items in a single request
   * 
   * @param model - The model/entity name
   * @param items - Array of items to create
   * @returns The created items
   * 
   * @example
   * ```typescript
   * // Create multiple products at once
   * const newProducts = await api.bulkCreate('product', [
   *   { name: 'Product 1', price: 99.99 },
   *   { name: 'Product 2', price: 149.99 }
   * ]);
   * ```
   */
  async bulkCreate<T = MixDbEntity>(model: string, items: Partial<T>[]): Promise<T[]> {
    const url = this.getUrl(`/${model}/bulk`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(items)
    });
    
    const result = await this.handleResponse<ApiResponse<T[]>>(response);
    return result.data;
  }
  
  /**
   * Update multiple items in a single request
   * 
   * @param model - The model/entity name
   * @param items - Array of items with IDs to update
   * @returns The updated items
   * 
   * @example
   * ```typescript
   * // Update multiple products at once
   * const updatedProducts = await api.bulkUpdate('product', [
   *   { id: '123', price: 109.99 },
   *   { id: '456', price: 159.99 }
   * ]);
   * ```
   */
  async bulkUpdate<T = MixDbEntity>(model: string, items: Partial<T>[]): Promise<T[]> {
    const url = this.getUrl(`/${model}/bulk`);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(items)
    });
    
    const result = await this.handleResponse<ApiResponse<T[]>>(response);
    return result.data;
  }
  
  /**
   * Delete multiple items in a single request
   * 
   * @param model - The model/entity name
   * @param ids - Array of item IDs to delete
   * @returns Success status
   * 
   * @example
   * ```typescript
   * // Delete multiple products at once
   * await api.bulkDelete('product', ['123', '456']);
   * ```
   */
  async bulkDelete(model: string, ids: (string | number)[]): Promise<boolean> {
    const url = this.getUrl(`/${model}/bulk-delete`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ids })
    });
    
    const result = await this.handleResponse<ApiResponse<boolean>>(response);
    return result.isSucceed;
  }
  
  /**
   * Count items based on filter criteria
   * 
   * @param model - The model/entity name
   * @param filter - Filter criteria
   * @returns The count of matching items
   * 
   * @example
   * ```typescript
   * // Count active products
   * const activeCount = await api.count('product', { status: 'Published' });
   * ```
   */
  async count(model: string, filter?: Record<string, any>): Promise<number> {
    const queryParams = new URLSearchParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(`${key}`, value.toString());
        }
      });
    }
    
    const url = `${this.getUrl(`/${model}/count`)}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const result = await this.handleResponse<ApiResponse<number>>(response);
    return result.data;
  }
  
  /**
   * Perform aggregation operations on a model
   * 
   * @param model - The model/entity name
   * @param aggregation - The aggregation operation and field
   * @param filter - Filter criteria
   * @returns The aggregation result
   * 
   * @example
   * ```typescript
   * // Get the average price of active products
   * const avgPrice = await api.aggregate('product', {
   *   operation: 'avg',
   *   field: 'price'
   * }, { status: 'Published' });
   * ```
   */
  async aggregate(
    model: string,
    aggregation: { operation: 'sum' | 'avg' | 'min' | 'max'; field: string },
    filter?: Record<string, any>
  ): Promise<number> {
    const queryParams = new URLSearchParams();
    queryParams.append('operation', aggregation.operation);
    queryParams.append('field', aggregation.field);
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(`${key}`, value.toString());
        }
      });
    }
    
    const url = `${this.getUrl(`/${model}/aggregate`)}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    const result = await this.handleResponse<ApiResponse<number>>(response);
    return result.data;
  }
  
  /**
   * Upload a file associated with a model
   * 
   * @param model - The model/entity name
   * @param id - The item ID
   * @param fileField - The field name for the file
   * @param file - The file to upload
   * @param metadata - Optional metadata for the file
   * @returns The upload result with file URL
   * 
   * @example
   * ```typescript
   * // Upload a product image
   * const fileInput = document.getElementById('fileInput') as HTMLInputElement;
   * const file = fileInput.files?.[0];
   * 
   * if (file) {
   *   const result = await api.uploadFile('product', '123', 'image', file, {
   *     alt: 'Product Image'
   *   });
   *   
   *   console.log('Uploaded file URL:', result.fileUrl);
   * }
   * ```
   */
  async uploadFile(
    model: string,
    id: string | number,
    fileField: string,
    file: File,
    metadata?: Record<string, any>
  ): Promise<{ fileUrl: string; metadata?: Record<string, any> }> {
    const url = this.getUrl(`/${model}/${id}/file/${fileField}`);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    // Get headers without Content-Type as it's set automatically for FormData
    const headers = this.getHeaders();
    delete headers['Content-Type'];
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    
    const result = await this.handleResponse<ApiResponse<{ fileUrl: string; metadata?: Record<string, any> }>>(response);
    return result.data;
  }
  
  /**
   * Get items using a standard Request object
   * 
   * @param model - The model/entity name
   * @param request - Standard Request object with pagination, filtering, and sorting
   * @returns A paginated response with items and pagination metadata
   * 
   * @example
   * ```typescript
   * // Get products with standard Request object
   * const request: Request = {
   *   pageIndex: 0,
   *   pageSize: 10,
   *   searchText: 'chair',
   *   searchColumns: ['name', 'description'],
   *   orderBy: 'price',
   *   direction: 'asc'
   * };
   * 
   * const products = await api.getItemsWithRequest('product', request);
   * ```
   */
  async getItemsWithRequest<T = MixDbEntity>(
    model: string,
    request: Request
  ): Promise<PaginatedResponse<T>> {
    const options = requestToQueryOptions(request);
    return this.getItems<T>(model, options);
  }
}

/**
 * Helper utilities for working with MixDB API
 */
export const MixDbHelpers = {
  /**
   * Creates an 'active' filter object for queries
   * 
   * @returns A filter object for active items
   * 
   * @example
   * ```typescript
   * // Get only active products
   * const products = await api.getItems('product', {
   *   filter: MixDbHelpers.activeFilter()
   * });
   * ```
   */
  activeFilter: () => ({ status: 'Published' }),
  
  /**
   * Formats a date for API queries
   * 
   * @param date - The date to format
   * @returns Formatted date string
   * 
   * @example
   * ```typescript
   * // Get products created after a specific date
   * const products = await api.getItems('product', {
   *   filter: {
   *     createdDateTime: {
   *       $gte: MixDbHelpers.formatDate(new Date('2023-01-01'))
   *     }
   *   }
   * });
   * ```
   */
  formatDate: (date: Date) => date.toISOString(),
  
  /**
   * Creates a search query for text fields
   * 
   * @param searchText - The text to search for
   * @param fields - The fields to search in
   * @returns A search filter object
   * 
   * @example
   * ```typescript
   * // Search for products by name or description
   * const searchFilter = MixDbHelpers.searchFilter('black chair', ['name', 'description']);
   * const products = await api.getItems('product', {
   *   filter: searchFilter
   * });
   * ```
   */
  searchFilter: (searchText: string, fields: string[]) => {
    if (!searchText) return {};
    
    const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fieldQueries = fields.map(field => ({ [field]: { $regex: escapedText, $options: 'i' } }));
    
    return { $or: fieldQueries };
  },
  
  /**
   * Converts a standard Request object to QueryOptions for use with the MixDB API
   * 
   * @param request - The standard request object
   * @returns QueryOptions compatible with the MixDB API
   * 
   * @example
   * ```typescript
   * // Convert a standard request to query options
   * const request: Request = {
   *   pageIndex: 0,
   *   pageSize: 10,
   *   searchText: 'chair',
   *   searchColumns: ['name', 'description'],
   *   orderBy: 'price',
   *   direction: 'asc'
   * };
   * 
   * const options = MixDbHelpers.requestToQueryOptions(request);
   * const products = await api.getItems('product', options);
   * ```
   */
  requestToQueryOptions: requestToQueryOptions
} 
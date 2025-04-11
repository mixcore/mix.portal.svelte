/**
 * Common API response types for Mixcore applications
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  isSucceed: boolean;
  /** Response message (typically used for errors) */
  message?: string;
  /** Response data */
  data: T;
  /** Additional response metadata */
  metadata?: Record<string, any>;
  /** Error details (if any) */
  errors?: string[];
}

/**
 * Paginated response with items and pagination metadata
 */
export interface PaginatedResponse<T = any> {
  /** Array of items */
  items: T[];
  /** Total number of items (across all pages) */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
}

/**
 * Query options for fetching data
 */
export interface QueryOptions {
  /** Page number (1-based, default: 1) */
  page?: number;
  /** Number of items per page (default: 20) */
  pageSize?: number;
  /** Filter criteria */
  filter?: Record<string, any>;
  /** Field to sort by */
  sort?: string;
  /** Sort direction ('asc' or 'desc') */
  order?: 'asc' | 'desc';
  /** Additional options specific to certain endpoints */
  [key: string]: any;
} 
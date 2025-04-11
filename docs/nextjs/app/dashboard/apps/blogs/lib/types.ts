/**
 * Core types for Mixcore Mini-App Template
 * 
 * This file defines the core types used throughout the mini-app template,
 * ensuring type safety and consistency when working with Mixcore APIs.
 */

/**
 * User authentication and profile information
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** Username for login */
  username: string;
  /** User's display name */
  displayName: string;
  /** User's email address */
  email?: string;
  /** URL to user's avatar/profile image */
  avatarUrl?: string;
  /** List of roles assigned to the user */
  roles: string[];
  /** User-specific permissions */
  permissions?: string[];
  /** Last login date */
  lastLogin?: string;
  /** User account status */
  status: 'Active' | 'Inactive' | 'Locked' | 'Pending';
  /** User preferences */
  preferences?: Record<string, any>;
  /** Additional attributes */
  [key: string]: any;
}

/**
 * Authentication token information
 */
export interface AuthToken {
  /** Access token for API authentication */
  accessToken: string;
  /** Token used for refreshing the access token */
  refreshToken?: string;
  /** Token type (usually "Bearer") */
  tokenType: string;
  /** Token expiration timestamp */
  expiresAt: number;
  /** Permissions encoded in the token */
  permissions?: string[];
  /** User roles encoded in the token */
  roles?: string[];
}

/**
 * Culture/language information
 */
export interface Culture {
  /** Culture code (e.g., "en-US", "fr-FR") */
  code: string;
  /** Display name of the culture */
  displayName: string;
  /** Native display name in the language itself */
  nativeDisplayName?: string;
  /** Icon/flag for visual representation */
  icon?: string;
  /** Direction (LTR or RTL) */
  direction: 'ltr' | 'rtl';
  /** Whether this is the default culture */
  isDefault?: boolean;
  /** Whether this culture is active */
  isActive?: boolean;
}

/**
 * Permission definition
 */
export interface Permission {
  /** Unique permission key */
  key: string;
  /** Human-readable permission name */
  name: string;
  /** Permission description */
  description?: string;
  /** Permission group for organizing in UI */
  group?: string;
  /** Dependencies on other permissions */
  dependencies?: string[];
}

/**
 * Role definition with associated permissions
 */
export interface Role {
  /** Unique role identifier */
  id: string;
  /** Role name */
  name: string;
  /** Role description */
  description?: string;
  /** Permissions associated with this role */
  permissions: string[];
  /** Whether this is a system role (cannot be modified) */
  isSystem?: boolean;
  /** Whether this role is active */
  isActive?: boolean;
}

/**
 * Mini-app configuration interface
 */
export interface MiniAppConfig {
  /** Unique app identifier */
  id: string;
  /** App display name */
  name: string;
  /** App description */
  description?: string;
  /** App version */
  version: string;
  /** Required permissions to access the app */
  requiredPermissions?: string[];
  /** Default culture for the app */
  defaultCulture?: string;
  /** Supported cultures */
  supportedCultures?: string[];
  /** Navigation configuration */
  navigation?: {
    /** Menu items for the app */
    items: Array<{
      /** Item label */
      label: string;
      /** Item URL or route */
      path: string;
      /** Item icon */
      icon?: string;
      /** Required permissions for this item */
      permissions?: string[];
    }>;
  };
  /** Dashboard shell integration settings */
  shellIntegration?: {
    /** Whether to show in dashboard menu */
    showInMenu: boolean;
    /** Position in menu (if shown) */
    menuPosition?: number;
    /** Icon for dashboard menu */
    menuIcon?: string;
    /** Whether to support full screen mode */
    supportFullScreen?: boolean;
    /** Whether to show in search results */
    includeInSearch?: boolean;
  };
}

/**
 * Standard request parameters for API calls
 * Aligned with Mixcore's API request structure
 */
export interface Request {
  /** Current page number (0-based for compatibility with some backends) */
  pageIndex?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Text to search for */
  searchText?: string;
  /** Columns/fields to search in */
  searchColumns?: string[];
  /** Field to sort by */
  orderBy?: string;
  /** Sort direction */
  direction?: 'asc' | 'desc';
  /** Filter by start date */
  fromDate?: string;
  /** Filter by end date */
  toDate?: string;
  /** Filter by status */
  status?: string;
  /** Target database ID (for database-specific operations) */
  mixDatabaseId?: number;
  /** Target database name (alternative to ID) */
  mixDatabaseName?: string;
  /** Culture/language filter */
  specificulture?: string;
  /** Allow for additional properties */
  [key: string]: any;
}

/**
 * Standard pagination data structure
 */
export interface PagingData {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPage: number;
}

/**
 * Response with pagination for lists of items
 */
export interface PaginatedResponse<T = any> {
  /** Array of items in the current page */
  items: T[];
  /** Pagination metadata */
  pagingData: PagingData;
  /** Whether the request was successful */
  success: boolean;
  /** HTTP status code */
  status: number;
  /** Error messages (if any) */
  errors: any[];
}

/**
 * Basic entity interface for MixDB items
 */
export interface MixDbEntity {
  /** Unique identifier */
  id?: string | number;
  /** Culture/language code */
  specificulture?: string;
  /** Creation timestamp */
  createdDateTime?: string;
  /** Last modification timestamp */
  lastModified?: string;
  /** Item status */
  status?: 'Published' | 'Draft' | 'Deleted' | string;
  /** Created by user ID */
  createdBy?: string;
  /** Last modified by user ID */
  modifiedBy?: string;
  /** Priority/order within list */
  priority?: number;
  /** Allow for additional properties */
  [key: string]: any;
}

/**
 * Application context containing user, authentication, and culture information
 */
export interface AppContext {
  /** Current authenticated user */
  user?: User;
  /** Authentication token */
  auth?: AuthToken;
  /** Current culture/language */
  culture?: Culture;
  /** Available cultures/languages */
  availableCultures?: Culture[];
  /** App configuration */
  config?: MiniAppConfig;
  /** Whether app is in standalone mode */
  standalone?: boolean;
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Whether app is loading */
  isLoading?: boolean;
}

/**
 * Shell event types for communication with dashboard shell
 */
export enum ShellEventType {
  /** Authentication status changed */
  AUTH_CHANGED = 'mixcore:auth:changed',
  /** User profile updated */
  USER_UPDATED = 'mixcore:user:updated',
  /** Culture/language changed */
  CULTURE_CHANGED = 'mixcore:culture:changed',
  /** Layout changed */
  LAYOUT_CHANGED = 'mixcore:layout:changed',
  /** Context updated */
  CONTEXT_SET = 'mixcore:context:set',
  /** Breadcrumbs updated */
  BREADCRUMBS_UPDATE = 'mixcore:breadcrumbs:update',
  /** Theme changed */
  THEME_CHANGED = 'mixcore:theme:changed',
  /** App initialized */
  APP_INITIALIZED = 'mixcore:app:initialized',
  /** Permission changed */
  PERMISSION_CHANGED = 'mixcore:permission:changed'
}

/**
 * Converts a Request to QueryOptions for MixDB API
 * 
 * @param request The request object to convert
 * @returns QueryOptions compatible with MixDB API
 */
export function requestToQueryOptions(request: Request): {
  page?: number;
  pageSize?: number;
  filter?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
} {
  const {
    pageIndex,
    pageSize,
    searchText,
    searchColumns,
    orderBy,
    direction,
    fromDate,
    toDate,
    status,
    specificulture,
    ...rest
  } = request;
  
  const filter: Record<string, any> = {};
  
  // Add filters based on request properties
  if (status) filter.status = status;
  if (specificulture) filter.specificulture = specificulture;
  if (fromDate) filter.createdDateTime = { $gte: fromDate };
  if (toDate) {
    filter.createdDateTime = {
      ...filter.createdDateTime,
      $lte: toDate
    };
  }
  
  // Build search filter if search text and columns are provided
  if (searchText && searchColumns?.length) {
    const searchFilter = {
      $or: searchColumns.map(column => ({
        [column]: { $regex: searchText, $options: 'i' }
      }))
    };
    filter.$and = filter.$and ? [...filter.$and, searchFilter] : [searchFilter];
  }
  
  return {
    page: pageIndex !== undefined ? pageIndex + 1 : undefined, // Convert 0-based to 1-based
    pageSize,
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    sort: orderBy,
    order: direction,
    ...rest
  };
}

// Define a basic item type for CRUD operations
export interface Item {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  image?: string;
}

// Canvas editor element types
export interface CanvasElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'image' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  imageUrl?: string;
  opacity: number;
  zIndex: number;
}

export interface CanvasProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  elements: CanvasElement[];
  width: number;
  height: number;
  background: string;
} 
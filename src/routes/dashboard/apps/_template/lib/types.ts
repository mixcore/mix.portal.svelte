// Auth Store Types
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  metadata?: Record<string, any>;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthStore {
  subscribe: (run: (value: AuthState) => void) => () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Culture Store Types
export interface CultureState {
  currentCulture: string;
  supportedCultures: string[];
  isRTL: boolean;
}

export interface CultureStore {
  subscribe: (run: (value: CultureState) => void) => () => void;
  setCulture: (culture: string) => boolean;
  formatDate: (date: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
  errors?: string[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  filter?: Record<string, any>;
  orderBy?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiState {
  isLoading: boolean;
  error: Error | null;
  lastResponse: any;
}

export interface ApiStore {
  subscribe: (run: (value: ApiState) => void) => () => void;
  getItem: <T>(model: string, id: string | number) => Promise<T>;
  getItems: <T>(model: string, params?: PaginationParams) => Promise<PaginatedResponse<T>>;
  createItem: <T>(model: string, data: any) => Promise<T>;
  updateItem: <T>(model: string, id: string | number, data: any) => Promise<T>;
  deleteItem: (model: string, id: string | number) => Promise<boolean>;
  query: <T>(endpoint: string, method?: string, data?: any, queryParams?: Record<string, any>) => Promise<T>;
}

// App Data Types
export interface AppItem {
  id: number | string;
  name: string;
  status: string;
  date: string;
  [key: string]: any;
}

export interface AppStats {
  totalItems: number;
  activeUsers: number;
  pendingTasks: number;
  [key: string]: any;
} 
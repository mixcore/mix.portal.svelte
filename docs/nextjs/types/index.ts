import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  contextId?: string;
  appId?: string;
  personaIds?: string[];
  roleIds?: string[];
  permissionIds?: string[];
  tenantId?: number;
  priority?: number;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface Request {
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
  searchColumns?: string[];
  orderBy?: string;
  direction?: 'asc' | 'desc';
  fromDate?: string;
  toDate?: string;
  status?: string;
  mixDatabaseId?: number;
  mixDatabaseName?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagingData: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPage: number;
  };
  success: boolean;
  status: number;
  errors: any[];
}

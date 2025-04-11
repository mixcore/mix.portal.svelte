/**
 * Types for the template management system
 */

export type TemplateFolderType =
  | 'Pages'
  | 'Posts'
  | 'Masters'
  | 'Layouts'
  | 'Modules';

export interface Template {
  id: string;
  fileName: string;
  fileFolder: string;
  folderType: TemplateFolderType;
  themeId: string;
  content: string;
  scripts?: string;
  styles?: string;
  metadata?: {
    description?: string;
    thumbnail?: string;
    author?: string;
    version?: string;
  };
  lastModified: Date;
  createdDateTime: Date;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail?: string;
  version: string;
  createdDateTime: Date;
  createdBy?: string;
  isActive: boolean;
  assetFolder: string;
}

export interface TemplateListRequest {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  pageIndex?: number;
  pageSize?: number;
  folderType?: TemplateFolderType;
  themeId?: string;
}

export interface TemplateListResponse {
  items: Template[];
  pagingData: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

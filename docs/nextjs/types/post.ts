import { BaseContent, MixContentStatus } from './content';

export interface Post extends BaseContent {
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  icon?: string;
  parentId: number;
  mixCultureId: number;
}

export interface PostCreateDto {
  title: string;
  excerpt?: string;
  content?: string;
  status: MixContentStatus;
  isPublic?: boolean;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  specificulture?: string;
  priority?: number;
}

export interface PostUpdateDto extends PostCreateDto {
  id: number;
}

export interface PostQueryParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  status?: MixContentStatus;
  isPublic?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface PostListResponse {
  items: Post[];
  totalItems: number;
  totalPages: number;
  pageIndex: number;
  pageSize: number;
}

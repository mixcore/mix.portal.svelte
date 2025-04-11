export interface Page {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnailUrl?: string;
  status: 'Published' | 'Draft' | 'Archived';
  priority: number;
  createdDateTime: string;
  lastModified: string;
  specificulture: string;
  seoName: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  pageType: string;
  template: string;
  parentId?: string;
  parent?: Page;
  childNavs?: PageNavigation[];
  parentNavs?: PageNavigation[];
  contents?: PageContent[];
}

export interface PageNavigation {
  id: string;
  pageId: string;
  parentId: string;
  priority: number;
  description: string;
  status: string;
  isActived: boolean;
  page?: Page;
  parent?: Page;
}

export interface PageContent {
  id: string;
  content: string;
  status: string;
  priority: number;
  createdDateTime: string;
  lastModified: string;
  specificulture: string;
}

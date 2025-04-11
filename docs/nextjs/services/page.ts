import { PagesApi } from './api';
import { Page } from '@/types/page';

export interface PageListRequest {
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
  sortBy?: string;
  direction?: 'Asc' | 'Desc';
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PageListResponse {
  items: Page[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
}

export const pageService = {
  getPages: async (request: PageListRequest): Promise<PageListResponse> => {
    const {
      pageIndex = 0,
      pageSize = 10,
      searchText,
      sortBy,
      direction,
      status,
      fromDate,
      toDate
    } = request;

    const params = new URLSearchParams();
    params.append('pageIndex', pageIndex.toString());
    params.append('pageSize', pageSize.toString());
    if (searchText) params.append('searchText', searchText);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    if (status) params.append('status', status);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const response = await PagesApi.getPages(
      pageIndex,
      pageSize,
      params.toString()
    );
    return {
      items: response.data.items,
      totalItems: response.data.totalItems,
      pageIndex: response.data.pageIndex,
      pageSize: response.data.pageSize
    };
  },

  getPage: async (id: string): Promise<Page> => {
    const response = await PagesApi.getPage(id);
    return response.data;
  },

  createPage: async (page: Partial<Page>): Promise<Page> => {
    const response = await PagesApi.createPage(page);
    return response.data;
  },

  updatePage: async (id: string, page: Partial<Page>): Promise<Page> => {
    const response = await PagesApi.updatePage(id, page);
    return response.data;
  },

  deletePage: async (id: string): Promise<boolean> => {
    const response = await PagesApi.deletePage(id);
    return response.data;
  }
};

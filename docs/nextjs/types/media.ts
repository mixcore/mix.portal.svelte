import { MixContentStatus } from './content';

export interface Media {
  id: string;
  fileName?: string;
  fileFolder?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  extension?: string;
  webPath?: string;
  thumbnailPath?: string;
  displayName?: string;
  title?: string;
  description?: string;
  createdDateTime?: string;
  createdBy?: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
  status?: MixContentStatus;
}

export interface MediaFile {
  file: File | null;
  fullPath?: string;
  folderName?: string;
  fileFolder?: string;
  fileName?: string;
  extension?: string;
  content?: string;
  fileBase64?: string;
}

export interface MediaUploadDto {
  title?: string;
  description?: string;
  status: MixContentStatus;
  fileFolder?: string;
  mediaFile: MediaFile;
}

export interface MediaQueryParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  fileType?: string;
  sortBy?: string;
  direction?: 'asc' | 'desc';
} 
export enum MixContentStatus {
  Draft = 2,
  Published = 1,
  Archived = 3,
  Deleted = 4
}

export interface BaseContent {
  id: string;
  createdDateTime?: string;
  createdBy?: string;
  modifiedDateTime?: string;
  modifiedBy?: string;
  status?: MixContentStatus;
}

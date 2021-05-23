import { DisplayDirection, MixContentStatus } from '../enums/mix-enums';

export class SearchFilter {
  public specificulture?: string;
  public fromDate?: Date;
  public toDate?: Date;
  public status?: MixContentStatus;
  public keyword?: string;
  public query?: never;
  public pageIndex = 0;
  public page?: number = 1;
  public pageSize?: number;
  public orderBy?: string;
  public direction?: DisplayDirection = DisplayDirection.Asc;
}

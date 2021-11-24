export class PaginationModel<T> {
  public items?: T[];
  public pageIndex = 0;
  public page?: number;
  public pageSize?: number;
  public totalItems?: number;
  public totalPage?: number;
}

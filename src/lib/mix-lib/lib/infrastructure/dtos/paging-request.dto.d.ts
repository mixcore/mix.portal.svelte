import { DisplayDirection } from '../../enums/display-direction.enum';
export declare class PagingRequest {
    pageIndex: number;
    page: number;
    pageSize?: number;
    orderBy?: string;
    direction?: DisplayDirection;
}

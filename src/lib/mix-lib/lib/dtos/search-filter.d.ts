import { DisplayDirection, MixContentStatus } from '../enums/mix-enums';
export declare class SearchFilter {
    specificulture?: string;
    fromDate?: Date;
    toDate?: Date;
    status?: MixContentStatus;
    keyword?: string;
    query?: never;
    pageIndex: number;
    page?: number;
    pageSize?: number;
    orderBy?: string;
    direction?: DisplayDirection;
}

import { DisplayDirection } from '../../enums/display-direction.enum';
import type { MixContentStatus } from '../../enums/mix-content-status.enum';
export declare class SearchFilter {
    specificulture?: string;
    fromDate?: Date;
    toDate?: Date;
    status?: MixContentStatus;
    keyword?: string;
    query?: object;
    pageIndex: number;
    page?: number;
    pageSize?: number;
    orderBy?: string;
    direction?: DisplayDirection;
}

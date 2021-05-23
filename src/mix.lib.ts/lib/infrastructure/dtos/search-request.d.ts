import type { MixContentStatus } from '../../enums/mix-content-status.enum';
import type { PagingRequest } from './paging-request.dto';
export default class SearchFilter {
    specificulture?: string;
    fromDate?: Date;
    toDate?: Date;
    status?: MixContentStatus;
    keyword?: string;
    query?: object;
    direction?: PagingRequest;
}

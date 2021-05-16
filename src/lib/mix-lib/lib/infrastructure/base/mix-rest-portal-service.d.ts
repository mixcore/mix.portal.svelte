import { MixModelType } from '../../enums/mix-enums';
import { MixRestService } from './mix-rest-service';
export declare class MixRestPortalRepository<T> extends MixRestService<T> {
    constructor(modelName: MixModelType);
}

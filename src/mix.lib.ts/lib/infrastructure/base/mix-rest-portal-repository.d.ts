import { MixModelType } from '../../enums/mix-enums';
import { MixRestRepository } from './mix-rest-repository';
export declare class MixRestPortalRepository<T> extends MixRestRepository<T> {
    constructor(modelName: MixModelType);
}

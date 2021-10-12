import { MixModelType } from '../../enums/mix-enums';
import { MixRepository } from '../../infrastructure/base/mix-repository';
export declare class MixPortalRepository<T> extends MixRepository<T> {
    constructor(modelName: MixModelType);
}

import { MixModelType } from '../../enums/mix-enums';
import { MixRestPortalRepository } from './mix-rest-portal-repository';
export declare abstract class ViewModelBase {
    id: string | number;
    repository: MixRestPortalRepository<ViewModelBase>;
    /**
     *
     */
    constructor(modelType: MixModelType);
    create(): Promise<ViewModelBase>;
    update(): Promise<ViewModelBase>;
    delete(id: string | number): Promise<ViewModelBase>;
}

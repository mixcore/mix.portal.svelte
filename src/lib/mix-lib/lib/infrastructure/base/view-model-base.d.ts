import { MixModelType } from '../../enums/mix-enums';
import { MixPortalRepository } from '../../repositories/portal/mix-portal-repository';
export declare abstract class ViewModelBase<T> {
    id?: string | number;
    repository: MixPortalRepository<T>;
    /**
     *
     */
    constructor(modelType: MixModelType, model?: T);
    create(): Promise<T>;
    update(): Promise<T>;
    delete(id: string | number): Promise<T>;
    abstract parseModel(): T;
    abstract parseView(model: T): void;
}

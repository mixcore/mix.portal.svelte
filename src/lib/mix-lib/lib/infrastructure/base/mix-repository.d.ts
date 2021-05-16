import { AxiosRequestConfig } from 'axios';
import { SearchFilter } from '../../dtos/search-filter';
import { MixModelType } from '../../enums/mix-enums';
export declare class MixRepository<T> {
    modelType: MixModelType;
    viewName: string;
    specificulture?: string | null;
    get modelUrl(): string;
    private service;
    constructor(appUrl: string, modelName: MixModelType, viewName: string, specificulture?: string | null, config?: AxiosRequestConfig);
    getSingleModel(id: string | number, queries?: never): Promise<T>;
    getDefaultModel(queries?: never): Promise<T>;
    getListModel(params?: SearchFilter): Promise<T>;
    createModel(model: T): Promise<T>;
    updateModel(id: string | number, model: T): Promise<T>;
    updateFields(id: string | number, fields: never): Promise<T>;
    deleteModel(id: string | number): Promise<T>;
    duplicateModel(id: string | number, queries?: never): Promise<T>;
    exportListModel(queries?: never): Promise<T>;
    clearCache(id?: string | number): Promise<T>;
    setLanguage(specificulture: string): void;
}

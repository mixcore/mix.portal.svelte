import { AxiosRequestConfig } from 'axios';
import { SearchFilter } from '../infrastructure/dtos/search-filter';
import { Api } from '../infrastructure/axios/api';
export declare class MixRestService<T> extends Api {
    modelUrl: string;
    constructor(appUrl: string, modelName: string, viewName: string, specificulture?: string, config?: AxiosRequestConfig);
    getSingleModel(id: any, queries?: any): Promise<T>;
    getDefaultModel(queries?: any): Promise<T>;
    getListModel(queries?: SearchFilter): Promise<T>;
    createModel(model: T): Promise<T>;
    updateModel(id: any, model: T): Promise<T>;
    updateFields(id: any, fields: any): Promise<T>;
    deleteModel(id: any): Promise<T>;
    duplicateModel(id: any, queries?: any): Promise<T>;
    exportListModel(queries?: any): Promise<T>;
    clearCache(id?: any): Promise<T>;
}

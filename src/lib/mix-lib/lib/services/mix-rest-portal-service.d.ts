import { AxiosRequestConfig } from 'axios';
import { MixRestService } from './mix-rest-service';
export declare class MixRestPortalService<T> extends MixRestService<T> {
    modelUrl: string;
    constructor(appUrl: string, modelName: string, viewName: string, specificulture?: string, config?: AxiosRequestConfig);
}

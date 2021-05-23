import { AxiosRequestConfig } from 'axios';

import { SearchFilter } from '../../dtos/search-filter';
import { MixModelType } from '../../enums/mix-enums';
import { MixApiService } from '../axios/api';
export class MixRepository<T> {
  public modelType: MixModelType;
  public viewName: string;
  public specificulture?: string | null;
  public get modelUrl(): string {
    return this.specificulture
      ? `/rest/${this.specificulture}/${this.modelType}/${this.viewName}`
      : `/rest/${this.modelType}/${this.viewName}`;
  }
  private service: MixApiService;
  constructor(
    appUrl: string,
    modelName: MixModelType,
    viewName: string,
    specificulture?: string | null,
    config?: AxiosRequestConfig
  ) {
    this.service = new MixApiService(config);
    this.service.instance.defaults.baseURL = appUrl;
    this.modelType = modelName;
    this.viewName = viewName;
    this.specificulture = specificulture;
  }

  public getSingleModel(id: string | number, queries?: never): Promise<T> {
    this.service.instance.defaults.params = queries;
    return this.service.get(`${this.modelUrl}/${id}`);
  }

  public getDefaultModel(queries?: never): Promise<T> {
    this.service.instance.defaults.params = queries;
    return this.service.get(`default`);
  }

  public getListModel(params?: SearchFilter): Promise<T> {
    this.service.instance.defaults.params = params;
    return this.service.get(this.modelUrl);
  }

  public createModel(model: T): Promise<T> {
    return this.service.post(this.modelUrl, model);
  }

  public updateModel(id: string | number, model: T): Promise<T> {
    return this.service.put(`${this.modelUrl}/${id}`, model);
  }

  public updateFields(id: string | number, fields: never): Promise<T> {
    return this.service.patch(`${this.modelUrl}/${id}`, fields);
  }

  public deleteModel(id: string | number): Promise<T> {
    return this.service.delete(`${id}`);
  }

  public duplicateModel(id: string | number, queries?: never): Promise<T> {
    this.service.instance.defaults.params = queries;
    return this.service.get(`${this.modelUrl}/duplicate/${id}`);
  }

  public exportListModel(queries?: never): Promise<T> {
    this.service.instance.defaults.params = queries;
    return this.service.get(`${this.modelUrl}/export`);
  }

  public clearCache(id?: string | number): Promise<T> {
    return this.service.get(`${this.modelUrl}/remove-cache/${id}`);
  }

  public setLanguage(specificulture: string) {
    this.specificulture = specificulture;
  }
}

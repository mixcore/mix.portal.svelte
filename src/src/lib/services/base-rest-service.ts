import { ApiService } from './api-service';
import { get } from 'svelte/store';
import { localizeSettings } from './api-service';
import { AppSettings } from '$lib/config/app-settings';

export class BaseRestService {
  modelName: string = '';
  lang: string = '';
  prefixUrl: string = '';
  serviceBase?: string;

  constructor(modelName: string, isGlobal: boolean = false, lang?: string, serviceBase?: string) {
    this.init(modelName, isGlobal, lang, serviceBase);
  }

  init(modelName: string, isGlobal: boolean = false, lang?: string, serviceBase?: string): void {
    this.modelName = modelName;
    
    if (serviceBase) {
      this.serviceBase = serviceBase;
    }
    
    if (!isGlobal) {
      const settings = get(localizeSettings);
      if (settings || lang) {
        this.lang = lang || settings?.lang;
        this.prefixUrl = `/rest/${this.lang}/${modelName}`;
      } else {
        this.prefixUrl = `/rest/${modelName}`;
      }
    } else {
      this.prefixUrl = `/rest/${modelName}`;
    }
  }

  async duplicate(params: (string | number | null)[] = [], queries?: Record<string, any>): Promise<any> {
    let url = this.prefixUrl + "/duplicate";
    
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== undefined && params[i] !== null) {
        url += "/" + params[i];
      }
    }
    
    const querystring = this.parseQuery(queries);
    const req = {
      serviceBase: this.serviceBase,
      method: "GET",
      url: `${url}?${querystring}`,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async getSingle(params: (string | number | null)[] = [], queries?: Record<string, any>): Promise<any> {
    let url = this.prefixUrl;
    
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== undefined && params[i] !== null) {
        url += "/" + params[i];
      }
    }
    
    const querystring = this.parseQuery(queries);
    const req = {
      method: "GET",
      url: `${url}?${querystring}`,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async clearCache(params: (string | number | null)[] = [], queries?: Record<string, any>): Promise<any> {
    let url = this.prefixUrl;
    
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== undefined && params[i] !== null) {
        url += "/remove-cache/" + params[i];
      }
    }
    
    const querystring = this.parseQuery(queries);
    const req = {
      method: "GET",
      url: `${url}?${querystring}`,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async getDefault(queriesObj?: Record<string, any>): Promise<any> {
    const url = `${this.prefixUrl}/default`;
    const querystring = this.parseQuery(queriesObj);
    
    const req = {
      method: "GET",
      url: `${url}?${querystring}`,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async count(params: (string | number | null)[] = []): Promise<any> {
    let url = this.prefixUrl + "/count";
    
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== null) {
        url += "/" + params[i];
      }
    }
    
    const req = {
      method: "GET",
      url: url,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async getList(objData: any): Promise<any> {
    const data = this.parseQuery(objData);
    let url = this.prefixUrl;

    if (data) {
      url += "?";
      url = url.concat(data);
    }
    
    const req = {
      serviceBase: this.serviceBase,
      method: "GET",
      url: url,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async exportData(objData: any): Promise<any> {
    const data = this.parseQuery(objData);
    let url = this.prefixUrl + "/export";

    if (data) {
      url += "?";
      url = url.concat(data);
    }
    
    const req = {
      serviceBase: this.serviceBase,
      method: "GET",
      url: url,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async delete(params: (string | number | null)[] = []): Promise<any> {
    let url = this.prefixUrl;
    
    for (let i = 0; i < params.length; i++) {
      if (params[i] !== null) {
        url += "/" + params[i];
      }
    }
    
    const req = {
      serviceBase: this.serviceBase,
      method: "DELETE",
      url: url,
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async save(objData: any): Promise<any> {
    if (objData.id === 0 || objData.id === null) {
      return await this.create(objData);
    } else {
      return await this.update(objData.id, objData);
    }
  }

  async create(objData: any): Promise<any> {
    const url = this.prefixUrl;
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async update(id: string | number, objData: any): Promise<any> {
    const url = this.prefixUrl + "/" + id;
    
    const req = {
      serviceBase: this.serviceBase,
      method: "PUT",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async saveFields(id: string | number, objData: any): Promise<any> {
    const url = this.prefixUrl + "/" + id;
    
    const req = {
      serviceBase: this.serviceBase,
      method: "PATCH",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async saveMany(models: any[]): Promise<any> {
    const req = {
      method: "POST",
      url: this.prefixUrl + "/save-many",
      data: JSON.stringify(models),
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async applyList(objData: any): Promise<any> {
    const url = this.prefixUrl + "/list-action";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getRestApiResult(req);
  }

  async ajaxSubmitForm(form: FormData, url: string, onUploadFileProgress?: (progress: number) => void): Promise<any> {
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      headers: { "Content-Type": undefined },
      data: form,
    };
    
    return await ApiService.getRestApiResult(
      req,
      true,
      false,
      this.serviceBase,
      onUploadFileProgress || this.onUploadFileProgress
    );
  }

  parseQuery(req?: Record<string, any>): string {
    let result = "";
    
    if (req) {
      if (typeof req.query === 'object') {
        req.query = JSON.stringify(req.query);
      }
      
      for (const key in req) {
        if (Object.prototype.hasOwnProperty.call(req, key)) {
          if (result !== "") {
            result += "&";
          }
          result += `${key}=${encodeURIComponent(req[key])}`;
        }
      }
    }
    
    return result;
  }

  onUploadFileProgress(progress: number): void {
    console.log(`Loaded ${progress}%`);
  }

  getRestApiResult = ApiService.getRestApiResult;
}
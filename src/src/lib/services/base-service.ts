import { ApiService } from './api-service';
import { get } from 'svelte/store';
import { localizeSettings } from './api-service';

export class BaseService {
  modelName: string = '';
  lang: string = '';
  prefixUrl: string = '';
  serviceBase?: string;

  constructor(modelName: string, isGlobal: boolean = false, serviceBase?: string) {
    this.init(modelName, isGlobal, serviceBase);
  }

  init(modelName: string, isGlobal: boolean = false, serviceBase?: string): void {
    this.modelName = modelName;
    this.serviceBase = serviceBase;
    
    if (!isGlobal) {
      const settings = get(localizeSettings);
      if (settings) {
        this.lang = settings.lang;
        this.prefixUrl = "/" + this.lang + "/" + modelName;
      } else {
        this.prefixUrl = "/" + modelName;
      }
    } else {
      this.prefixUrl = "/" + modelName;
    }
  }

  async getSingle(params: (string | number | null)[] = []): Promise<any> {
    let url = (this.prefixUrl || "/" + this.lang + "/" + this.modelName) + "/details";
    
    for (let i = 0; i < params.length; i++) {
      if (params[i]) {
        url += "/" + params[i];
      }
    }
    
    const req = {
      method: "GET",
      serviceBase: this.serviceBase,
      url: url,
    };
    
    return await ApiService.getApiResult(req);
  }

  async getList(objData: any, params: (string | number | null)[] = []): Promise<any> {
    let url = this.prefixUrl + "/list";
    
    for (let i = 0; i < params.length; i++) {
      url += "/" + params[i];
    }
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };

    return await ApiService.getApiResult(req);
  }

  async exportData(objData: any, params: (string | number | null)[] = []): Promise<any> {
    let url = this.prefixUrl + "/export";
    
    for (let i = 0; i < params.length; i++) {
      url += "/" + params[i];
    }
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };

    return await ApiService.getApiResult(req);
  }

  async delete(id: string | number): Promise<any> {
    const url = this.prefixUrl + "/delete/" + id;
    
    const req = {
      serviceBase: this.serviceBase,
      method: "GET",
      url: url,
    };
    
    return await ApiService.getApiResult(req);
  }

  async save(objData: any): Promise<any> {
    const url = this.prefixUrl + "/save";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getApiResult(req);
  }

  async saveProperties(objData: any): Promise<any> {
    const url = this.prefixUrl + "/save-properties";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getApiResult(req);
  }

  async saveList(objData: any): Promise<any> {
    const url = this.prefixUrl + "/save-list";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getApiResult(req);
  }

  async updateInfos(objData: any): Promise<any> {
    const url = this.prefixUrl + "/update-infos";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getApiResult(req);
  }

  async ajaxSubmitForm(form: FormData, url: string, onUploadFileProgress?: (progress: number) => void): Promise<any> {
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      headers: { "Content-Type": undefined },
      data: form,
    };
    
    return await ApiService.getApiResult(
      req,
      true,
      false,
      this.serviceBase,
      onUploadFileProgress || this.onUploadFileProgress
    );
  }

  async applyList(objData: any): Promise<any> {
    const url = this.prefixUrl + "/apply-list";
    
    const req = {
      serviceBase: this.serviceBase,
      method: "POST",
      url: url,
      data: JSON.stringify(objData),
    };
    
    return await ApiService.getApiResult(req);
  }

  onUploadFileProgress(progress: number): void {
    console.log(`Loaded ${progress}%`);
  }
}
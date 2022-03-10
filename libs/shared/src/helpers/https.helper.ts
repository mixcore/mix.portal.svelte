import { CryptoService } from "@mix.core/mix.lib";

export interface IAuthorizationData {
  aesKey: string;
  message: string;
  rsaKey: string;
}

export class MixHttps {
  public get<T>(url: string, skipAuthorize: boolean = false): Promise<T> {
    return fetch(url, { method: 'GET', headers: this.processHeader(skipAuthorize) })
      .then(this.interceptor)
      .then((data) => Promise.resolve<T>(data))
      .catch(err => {throw new Error(err)});
  }

  public post<T>(url: string, body: any, skipAuthorize: boolean = false): Promise<T> {
    return fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(body),
      headers: this.processHeader(skipAuthorize)
    })
      .then(this.interceptor)
      .then((data) => Promise.resolve<T>(data));
  }

  public updateHeaderAuthData(encryptData: IAuthorizationData): void {
    localStorage.setItem('authorizationData', JSON.stringify(encryptData))
  }

  public getAuthData(): any {
    let encryptedAuthData = JSON.parse(localStorage.getItem("authorizationData")) as IAuthorizationData;
    let cryptoService = new CryptoService();

    if (encryptedAuthData) {
      return JSON.parse(cryptoService.decryptAES(encryptedAuthData.message, encryptedAuthData.aesKey));
    }

    return {};
  }

  public processHeader(skipAuthorize: boolean): HeadersInit {
    let header = { "Content-Type": "application/json" }
    if (!skipAuthorize) {
      let authData = this.getAuthData();
      header['Authorization'] = `Bearer ${authData.access_token}`
    }
    
    return header;
  }

  private interceptor(res: Response): Promise<any> {
    if (res.ok) {
      return res.status === 204 ? Promise.resolve(res.ok) : res.json();
    } else {
      throw new Error(res.statusText)
    }
  }
}

export const MixApi = new MixHttps();

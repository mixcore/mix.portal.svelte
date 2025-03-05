import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { AppSettings } from '$lib/config/app-settings';
import { CryptoService } from './crypto-service';
import { writable, get } from 'svelte/store';

// Create stores for authentication and settings
export const authStore = writable<any>(null);
export const localizeSettings = writable<any>(null);
export const globalSettings = writable<any>(null);
export const translator = writable<any>(null);

// Helper to get local storage if in browser
const getFromStorage = (key: string) => {
  if (browser) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

// Helper to set local storage if in browser
const setToStorage = (key: string, value: any) => {
  if (browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Helper to remove from local storage if in browser
const removeFromStorage = (key: string) => {
  if (browser) {
    localStorage.removeItem(key);
  }
};

export const ApiService = {
  async refreshToken() {
    const auth = get(authStore);
    const data = {
      refreshToken: auth?.refresh_token,
      accessToken: auth?.access_token,
    };
    if (auth) {
      const apiUrl = `/account/refresh-token`;
      const resp = await this.getApiResult({
        method: 'POST',
        url: apiUrl,
        data: JSON.stringify(data),
      });
      if (resp.isSucceed) {
        const encryptedData = resp.data;
        return this.updateAuthData(encryptedData);
      } else {
        this.logOut();
      }
    } else {
      this.logOut();
    }
  },

  async fillAuthData() {
    const encryptedAuthData = getFromStorage('authorizationData');
    if (encryptedAuthData) {
      const decrypted = JSON.parse(
        CryptoService.decryptAES(encryptedAuthData.data, encryptedAuthData.k)
      );
      authStore.set(decrypted);
      return decrypted;
    }
    return {};
  },

  async updateAuthData(encryptedData: any) {
    setToStorage('authorizationData', encryptedData);
    const decrypted = JSON.parse(
      CryptoService.decryptAES(encryptedData.data, encryptedData.k)
    );
    authStore.set(decrypted);
  },

  async getAllSettings(culture?: string) {
    const settings = getFromStorage('localizeSettings');
    const gSettings = getFromStorage('globalSettings');
    const trans = getFromStorage('translator');
    
    if (settings && gSettings && trans && settings.lang === culture) {
      localizeSettings.set(settings);
      globalSettings.set(gSettings);
      translator.set(trans);
    } else {
      let url = "/rest/shared";
      if (culture) {
        url += "/" + culture;
      }
      url += "/get-shared-settings";
      
      const response = await this.getRestApiResult({
        method: 'GET',
        url: url,
      });
      
      if (response.isSucceed) {
        const data = response.data;
        data.globalSettings.lastUpdateConfiguration = new Date();
        setToStorage('localizeSettings', data.localizeSettings);
        setToStorage('globalSettings', data.globalSettings);
        setToStorage('translator', data.translator);
        
        localizeSettings.set(data.localizeSettings);
        globalSettings.set(data.globalSettings);
        translator.set(data.translator);
      }
      
      return response.data;
    }
  },

  async initAllSettings(culture?: string) {
    removeFromStorage('localizeSettings');
    removeFromStorage('translator');
    removeFromStorage('globalSettings');

    const response = await this.getAllSettings(culture);
    return response;
  },

  async sendRestRequest(req: any, retry = true, skipAuthorize = false) {
    if (!req.headers) {
      req.headers = {
        'Content-Type': 'application/json',
      };
    }

    if (!skipAuthorize) {
      const auth = await this.fillAuthData();
      req.headers.Authorization = `Bearer ${auth.access_token}`;
    }

    try {
      const resp = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.data,
      });
      
      const data = await resp.json();
      
      // Check if we need to update settings based on last update timestamp
      if (
        req.url.indexOf("settings") === -1 &&
        (!get(localizeSettings) ||
          get(localizeSettings).lastUpdateConfiguration < data.lastUpdateConfiguration)
      ) {
        this.initAllSettings();
      }

      return { isSucceed: true, data };
    } catch (error: any) {
      if (error.status === 401 && retry) {
        return this.refreshToken().then(() => 
          this.sendRestRequest(req, false, skipAuthorize)
        );
      } else if (
        error.status === 200 ||
        error.status === 204 ||
        error.status === 205
      ) {
        return {
          isSucceed: true,
          status: error.status,
          errors: [error.statusText || error.status],
        };
      } else {
        if (error.data) {
          return { isSucceed: false, errors: [error.data] };
        } else {
          return {
            isSucceed: false,
            errors: [error.statusText || error.status],
          };
        }
      }
    }
  },

  async sendRequest(req: any, retry = true, skipAuthorize = false, onUploadFileProgress = null) {
    if (!req.headers) {
      req.headers = {
        'Content-Type': 'application/json',
      };
    }

    if (!skipAuthorize) {
      const auth = await this.fillAuthData();
      req.headers.Authorization = `Bearer ${auth.access_token}`;
    }

    try {
      let fetchOptions: RequestInit = {
        method: req.method,
        headers: req.headers,
      };
      
      if (req.data) {
        fetchOptions.body = req.data;
      }
      
      // Handle file upload progress if needed and supported
      if (req.data instanceof FormData && onUploadFileProgress && 'XMLHttpRequest' in window) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(req.method, req.url);
          
          for (const key in req.headers) {
            xhr.setRequestHeader(key, req.headers[key]);
          }
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onUploadFileProgress) {
              onUploadFileProgress(Math.round((e.loaded * 100) / e.total));
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject({
                status: xhr.status,
                statusText: xhr.statusText
              });
            }
          };
          
          xhr.onerror = () => {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            });
          };
          
          xhr.send(req.data);
        });
      }
      
      const resp = await fetch(req.url, fetchOptions);
      const data = await resp.json();
      
      if (
        req.url.indexOf("localizeSettings") === -1 &&
        (!get(localizeSettings) ||
          get(localizeSettings).lastUpdateConfiguration < data.lastUpdateConfiguration)
      ) {
        this.initAllSettings();
      }

      return data;
    } catch (error: any) {
      if (error.status === 401) {
        if (retry) {
          return this.refreshToken().then(() => 
            this.sendRequest(req, false, skipAuthorize, onUploadFileProgress)
          );
        } else {
          return {
            isSucceed: false,
            errors: [error.statusText || error.status],
          };
        }
      } else if (error.status === 403) {
        const t = { isSucceed: false, errors: ["Forbidden"] };
        if (browser) {
          // Handle login popup or redirect
          goto('/security/login');
        }
        return t;
      } else {
        if (error.data) {
          return error.data;
        } else {
          return {
            isSucceed: false,
            errors: [error.statusText || error.status],
          };
        }
      }
    }
  },

  progressHandler(e: any, onUploadFileProgress: (progress: number) => void) {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded * 100) / e.total);
      onUploadFileProgress(progress);
      console.log("progress: " + progress + "%");
      if (e.loaded === e.total) {
        console.log("File upload finished!");
        console.log("Server will perform extra work now...");
      }
    }
  },

  async getApiResult(
    req: any,
    retry = true,
    skipAuthorize = false,
    serviceBase?: string,
    onUploadFileProgress = null
  ) {
    let serviceUrl = AppSettings.serviceBase + "/api/" + AppSettings.apiVersion;
    if (serviceBase || req.serviceBase) {
      serviceUrl = (serviceBase || req.serviceBase) + "/api/" + AppSettings.apiVersion;
    }

    req.url = serviceUrl + req.url;
    if (!req.headers) {
      req.headers = {
        'Content-Type': 'application/json',
      };
    }
    
    const auth = get(authStore);
    req.headers.Authorization = "Bearer " + (req.Authorization || (auth ? auth.access_token : ''));
    
    return this.sendRequest(req, retry, skipAuthorize, onUploadFileProgress);
  },

  async getRestApiResult(
    req: any,
    retry = true,
    skipAuthorize = false,
    serviceBase?: string
  ) {
    let serviceUrl = AppSettings.serviceBase + "/api/" + AppSettings.apiVersion;
    if (serviceBase || req.serviceBase) {
      serviceUrl = (serviceBase || req.serviceBase) + "/api/" + AppSettings.apiVersion;
    }
    
    req.url = serviceUrl + req.url;
    return this.sendRestRequest(req, retry, skipAuthorize);
  },

  async logOut() {
    removeFromStorage('authorizationData');
    authStore.set(null);
    if (browser) {
      window.location.href = "/security/login";
    }
  },

  async getAnonymousApiResult(req: any) {
    const serviceUrl = AppSettings.serviceBase + "/api/" + AppSettings.apiVersion;
    req.url = serviceUrl + req.url;
    req.headers = {
      'Content-Type': 'application/json',
    };
    
    try {
      const resp = await fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.data ? JSON.stringify(req.data) : undefined,
      });
      const data = await resp.json();
      return data;
    } catch (error: any) {
      return {
        isSucceed: false,
        errors: [error.statusText || error.status],
      };
    }
  }
};
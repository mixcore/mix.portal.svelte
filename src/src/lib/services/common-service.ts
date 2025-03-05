import { ApiService } from './api-service';
import { browser } from '$app/environment';

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

export const CommonService = {
  async loadJArrayData(name: string) {
    const req = {
      method: "GET",
      url: "/portal/jarray-data/" + name,
    };
    return await ApiService.getAnonymousApiResult(req);
  },

  async stopApplication() {
    const req = {
      method: "GET",
      url: "/rest/shared/stop-application",
    };
    return await ApiService.getRestApiResult(req, false, true);
  },

  async clearCache() {
    const req = {
      method: "GET",
      url: "/rest/shared/clear-cache",
    };
    return await ApiService.getRestApiResult(req, false, true);
  },

  async loadJsonData(name: string) {
    const req = {
      method: "GET",
      url: "/portal/json-data/" + name,
    };
    return await ApiService.getAnonymousApiResult(req);
  },

  showAlertMsg(title: string, message: string) {
    // This will need to be implemented with a Svelte component
    console.log(`Alert: ${title} - ${message}`);
    // Could dispatch a custom event or use a store to show alerts
  },

  checkfile(sender: HTMLInputElement, validExts: string[]): boolean {
    const fileExt = sender.value.substring(sender.value.lastIndexOf("."));
    if (validExts.indexOf(fileExt) < 0) {
      this.showAlertMsg(
        "",
        "Invalid file selected, valid files are of " +
          validExts.toString() +
          " types."
      );
      sender.value = "";
      return false;
    } else return true;
  },

  async sendMail(subject: string, body: string) {
    const url = "/portal/sendmail";
    const req = {
      method: "POST",
      url: url,
      data: { subject, body },
    };
    const response = await ApiService.getApiResult(req);
    return response.data;
  },

  async getAllSettings(culture?: string) {
    return ApiService.getAllSettings(culture);
  },

  async checkConfig(lastSync?: string) {
    if (!lastSync) {
      this.renewSettings();
    } else {
      const d = new Date(lastSync);
      d.setMinutes(d.getMinutes() + 20);
      const now = new Date();
      if (now > d) {
        this.renewSettings();
      } else {
        const url = "/rest/shared/check-config/" + lastSync;
        const req = {
          method: "GET",
          url: url,
        };
        const response = await ApiService.getApiResult(req, true, true);
        if (response.data) {
          this.renewSettings();
        } else {
          // Settings are up to date, restore from storage
          await ApiService.fillAuthData();
        }
      }
    }
  },

  async renewSettings() {
    await this.removeSettings();
    await this.removeTranslator();
    await ApiService.getAllSettings();
  },

  async generateSitemap() {
    const url = "/portal/sitemap";
    const req = {
      method: "GET",
      url: url,
    };
    const response = await ApiService.getApiResult(req);
    return response.data;
  },

  async getPermissions() {
    const req = {
      method: "GET",
      url: "/rest/shared/permissions",
    };
    return await ApiService.getRestApiResult(req);
  },

  async initAllSettings(culture?: string) {
    return ApiService.initAllSettings(culture);
  },

  async removeSettings() {
    removeFromStorage('localizeSettings');
  },

  async removeTranslator() {
    removeFromStorage('translator');
  },

  async fillAllSettings(culture?: string) {
    const settings = getFromStorage("localizeSettings");
    const globalSettingsData = getFromStorage("globalSettings");
    const translatorData = getFromStorage("translator");
    
    if (
      settings &&
      globalSettingsData &&
      translatorData &&
      (!culture || settings.lang === culture)
    ) {
      await this.checkConfig(globalSettingsData.lastUpdateConfiguration);
    } else {
      if (culture && settings && settings.lang !== culture) {
        await this.removeSettings();
        await this.removeTranslator();
      }
      await ApiService.getAllSettings(culture);
    }
  }
};
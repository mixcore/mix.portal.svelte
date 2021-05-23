import { LocalStorageKeys } from '../constants/local-storage-keys';
import { apiService } from '../infrastructure/axios/api';
import { AllSettingsResponse, GlobalSetting } from '../models/setting.models';

export class MixSettingService {
  public cachedInMinutes = 20;
  public globalSettings!: GlobalSetting;
  public localizeSettings?: unknown;
  public translator?: unknown;
  /**
   *
   */
  constructor() {
    this.getAllSettings();
  }
  public getAllSettings(culture?: string) {
    if (typeof window !== 'undefined') {
      // Check if local browser
      this.localizeSettings = localStorage.getItem(
        LocalStorageKeys.CONF_LOCAL_SETTINGS
      ) as unknown;
      this.globalSettings = JSON.parse(
        localStorage.getItem(LocalStorageKeys.CONF_GLOBAL_SETTINGS) || '{}'
      ) as GlobalSetting;
      this.translator = localStorage.getItem(
        LocalStorageKeys.CONF_TRANSLATOR
      ) as unknown;
    }

    if (this.isRenewSettings()) {
      const url = `/rest/shared${
        culture ? `/${culture}` : ''
      }/get-shared-settings`;
      apiService.get<AllSettingsResponse>(url).then((response) => {
        const resp = response as AllSettingsResponse;
        this.globalSettings = resp.globalSettings || new GlobalSetting();
        this.localizeSettings = resp.localizeSettings;
        this.translator = resp.translator;
        if (typeof window !== undefined) {
          // Check if local browser
          localStorage.setItem(
            LocalStorageKeys.CONF_GLOBAL_SETTINGS,
            JSON.stringify(this.globalSettings)
          );
          localStorage.setItem(
            LocalStorageKeys.CONF_LOCAL_SETTINGS,
            JSON.stringify(this.localizeSettings)
          );
          localStorage.setItem(
            LocalStorageKeys.CONF_TRANSLATOR,
            JSON.stringify(this.translator)
          );
          localStorage.setItem(
            LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION,
            this.globalSettings.lastUpdateConfiguration.toString() || ''
          );
        }
      });
    }
  }

  public setAppUrl(appUrl: string) {
    apiService.setAppUrl(appUrl);
  }

  private isRenewSettings(): boolean {
    const now = new Date();
    let lastSync;
    if (typeof window !== undefined) {
      // Check if local browser
      lastSync = localStorage.getItem(
        LocalStorageKeys.CONF_LAST_SYNC_CONFIGURATION
      );
    }
    const d = new Date(lastSync || '');
    d.setMinutes(d.getMinutes() + 20);
    return (
      !this.localizeSettings ||
      !this.globalSettings ||
      !this.translator ||
      !lastSync ||
      now > d
    );
  }
}

export const mixSettingService = new MixSettingService();

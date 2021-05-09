import { GlobalSetting } from '../models/setting.models';
export declare class MixSettingService {
    cachedInMinutes: number;
    globalSettings: GlobalSetting;
    localizeSettings?: Object;
    translator?: Object;
    /**
     *
     */
    constructor();
    getAllSettings(culture?: string): void;
    setAppUrl(appUrl: string): void;
    private isRenewSettings;
}
export declare const mixSettingService: MixSettingService;

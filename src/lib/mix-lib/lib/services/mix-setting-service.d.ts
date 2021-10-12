import { GlobalSetting } from '../models/shared/setting.models';
export declare class MixSettingService {
    cachedInMinutes: number;
    globalSettings: GlobalSetting;
    localizeSettings?: unknown;
    translator?: unknown;
    /**
     *
     */
    constructor();
    getAllSettings(culture?: string): void;
    setAppUrl(appUrl: string): void;
    private isRenewSettings;
}
export declare const mixSettingService: MixSettingService;

export declare class GlobalSetting {
    domain?: string;
    apiEncryptKey?: string;
    defaultLanguage?: string;
    lastUpdateConfiguration: Date;
}
export declare class AllSettingsResponse {
    globalSettings?: GlobalSetting;
    localizeSettings?: never;
    translator?: never;
}

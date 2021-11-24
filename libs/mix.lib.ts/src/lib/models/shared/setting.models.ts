export class GlobalSetting {
  public domain?: string;
  public apiEncryptKey?: string;
  public defaultLanguage?: string;
  public lastUpdateConfiguration!: Date;
}
export class AllSettingsResponse {
  public globalSettings?: GlobalSetting;
  public localizeSettings?: never;
  public translator?: never;
}

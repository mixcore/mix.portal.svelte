import { CryptoService, MixSharedService } from "@mix.core/mix.lib";
import { environment } from "../environments/environment";
import { MixApi } from "../helpers/https.helper";
import type { IAuthorizationData } from "../helpers/https.helper";
import type { IGetSharedSettingsResult, GlobalSettings } from "@mix.core/mix.lib";

export class AuthService {
    private sharedService = new MixSharedService(environment.baseUrl);
    private cryptoSrv = new CryptoService()

    public userGlobalSetting: GlobalSettings | undefined;

    public login(loginData: any, key: any): Promise<IAuthorizationData> {
        let encrypted = this.cryptoSrv.encryptAES(JSON.stringify(loginData), key['apiEncryptKey']);
        let skipAuthorize: boolean = true;

        return MixApi.post<IAuthorizationData>(this.sharedService.signInEndpoint, { message: encrypted }, skipAuthorize)
    }

    public logout(): Promise<void> {
        return new Promise((resolve) => { 
            localStorage.removeItem('authorizationData');
            resolve();
        })
    }

    public async initUserConfigSetting(): Promise<IGetSharedSettingsResult> {
        localStorage.removeItem("localizeSettings");
        localStorage.removeItem("translator");
        localStorage.removeItem("globalSettings");

        let response = await MixApi.get<IGetSharedSettingsResult>(this.sharedService.getSharedSettingEndpoint);
        this.userGlobalSetting = response.globalSettings;

        return Promise.resolve(response);
    }

    public updateHeaderAuthData(encryptData: IAuthorizationData): void {
        localStorage.setItem('authorizationData', JSON.stringify(encryptData))
    }
}

export const authService = new AuthService();
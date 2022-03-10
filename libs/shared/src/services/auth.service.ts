import { CryptoService, MixSharedService } from "@mix.core/mix.lib";
import { environment } from "../environments/environment";
import { MixApi } from "../helpers/https.helper";
import type { IAuthorizationData } from "../helpers/https.helper";
import type { IGetSharedSettingsResult } from "@mix.core/mix.lib";

export class AuthService {
    private sharedService = new MixSharedService(environment.baseUrl);
    private cryptoSrv = new CryptoService()


    public login(loginData: any, key: any): Promise<IAuthorizationData> {
        let encrypted = this.cryptoSrv.encryptAES(JSON.stringify(loginData), key['apiEncryptKey']);
        let skipAuthorize: boolean = true;

        return MixApi.post<IAuthorizationData>(this.sharedService.signInEndpoint, { message: encrypted }, skipAuthorize)
    }

    public getUserConfigSetting(): Promise<IGetSharedSettingsResult> {
        localStorage.removeItem("localizeSettings");
        localStorage.removeItem("translator");
        localStorage.removeItem("globalSettings");

        return MixApi.get(this.sharedService.getSharedSettingEndpoint);
    }
}

export const authService = new AuthService();
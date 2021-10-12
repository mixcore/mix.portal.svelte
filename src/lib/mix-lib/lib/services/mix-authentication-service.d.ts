import { AxiosRequestConfig } from 'axios';
import { MixApiService } from '../infrastructure/axios/api';
import { LoginModel, Token } from '../models/shared/auth.models';
export declare class MixAuthenticationService extends MixApiService {
    constructor(config?: AxiosRequestConfig);
    userLogin(credentials: LoginModel): Promise<Token>;
}
export declare const userApi: MixAuthenticationService;

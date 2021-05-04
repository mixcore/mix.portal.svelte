import { AxiosRequestConfig } from 'axios';
import { Api } from '../infrastructure/axios/api';
import { LoginModel, Token } from '../models/auth.models';
export declare class MixAuthenticationService extends Api {
    constructor(config?: AxiosRequestConfig);
    userLogin(credentials: LoginModel): Promise<Token>;
}
export declare const userApi: MixAuthenticationService;

import { AxiosInstance, AxiosRequestConfig } from 'axios';
export declare class MixAxios {
    readonly instance: AxiosInstance;
    constructor(conf?: AxiosRequestConfig);
    private _initializeResponseInterceptor;
    private _handleRequest;
    private _handleResponse;
    protected _handleError: (error: unknown) => Promise<never>;
    protected getCredentialToken(): string;
}

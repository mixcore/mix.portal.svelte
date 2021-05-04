import { AxiosRequestConfig, AxiosInstance } from 'axios';
export declare class MixAxios {
    protected readonly instance: AxiosInstance;
    constructor(conf?: AxiosRequestConfig);
    private _initializeResponseInterceptor;
    private _handleRequest;
    private _handleResponse;
    protected _handleError: (error: any) => Promise<never>;
    protected getCredentialToken(): string;
}

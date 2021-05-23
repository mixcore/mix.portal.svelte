import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { MixApiService } from '../infrastructure/axios/api';
import { LoginModel, Token } from '../models/auth.models';
export class MixAuthenticationService extends MixApiService {
  public constructor(config?: AxiosRequestConfig) {
    super(config);
    this.userLogin = this.userLogin.bind(this);
  }

  public userLogin(credentials: LoginModel): Promise<Token> {
    return this.post<string, LoginModel, AxiosResponse<Token>>(
      'security/login',
      credentials
    ).then(this.success);
  }
}

export const userApi = new MixAuthenticationService();

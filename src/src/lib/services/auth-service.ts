import { get } from 'svelte/store';
import { ApiService } from './api-service';
import { CryptoService } from './crypto-service';
import { authorizationData } from './local-storage-service';
import { globalSettings } from './api-service';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

interface Registration {
  username: string;
  password: string;
  email: string;
}

interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ExternalLoginData {
  username: string;
  email: string;
  accessToken: string;
}

export const AuthService = {
  authentication: null as any,

  async saveRegistration(registration: Registration) {
    this.logOut();
    const response = await ApiService.sendRestRequest({
      method: 'POST',
      url: '/rest/auth/user/register',
      data: JSON.stringify(registration),
    });
    return response;
  },

  async forgotPassword(data: any) {
    const apiUrl = '/rest/auth/user/forgot-password';
    const req = {
      method: 'POST',
      url: apiUrl,
      data: JSON.stringify(data),
    };
    const resp = await ApiService.sendRestRequest(req);
    return resp;
  },

  async resetPassword(data: any) {
    const apiUrl = '/rest/auth/user/reset-password';
    const req = {
      method: 'POST',
      url: apiUrl,
      data: JSON.stringify(data),
    };
    const resp = await ApiService.sendRestRequest(req);
    return resp;
  },

  async getExternalLoginProviders() {
    const apiUrl = '/rest/auth/user/get-external-login-providers';
    const req = {
      method: 'GET',
      url: apiUrl,
    };
    const resp = await ApiService.sendRestRequest(req);
    return resp;
  },

  async login(loginData: LoginData, isRedirect = true) {
    const data = {
      UserName: loginData.username,
      Password: loginData.password,
      RememberMe: loginData.rememberMe,
      Email: '',
      ReturnUrl: '',
    };
    const message = CryptoService.encryptAES(JSON.stringify(data));
    const apiUrl = '/rest/auth/user/login';
    const req = {
      method: 'POST',
      url: apiUrl,
      data: JSON.stringify({ message: message }),
    };
    const resp = await ApiService.sendRestRequest(req, true);
    if (resp.isSucceed) {
      const encryptedData = resp.data;
      await ApiService.updateAuthData(encryptedData);
      await ApiService.getAllSettings();
      if (isRedirect) {
        const returnUrl = get(page).url.searchParams.get('ReturnUrl') || document.referrer || '/';
        setTimeout(() => {
          window.top.location.href = returnUrl;
        }, 200);
      }
    } else {
      console.error(resp.errors);
    }
    return resp;
  },

  async externalLogin(loginData: ExternalLoginData, provider: string) {
    const data = {
      provider: provider,
      username: loginData.username,
      email: loginData.email,
      externalAccessToken: loginData.accessToken,
    };
    const message = CryptoService.encryptAES(JSON.stringify(data));
    const apiUrl = '/rest/auth/user/external-login';
    const req = {
      method: 'POST',
      url: apiUrl,
      data: JSON.stringify({ message: message }),
    };
    const resp = await ApiService.sendRestRequest(req, true);
    if (resp.isSucceed) {
      const encryptedData = resp.data;
      await ApiService.updateAuthData(encryptedData);
      await ApiService.initAllSettings();
    } else {
      console.error(resp.errors);
    }
    return resp;
  },

  async logOut() {
    authorizationData.set(null);
    window.top.location.href = '/security/login';
  },

  async fillAuthData() {
    this.authentication = await ApiService.fillAuthData();
    return this.authentication;
  },

  async refreshToken() {
    await ApiService.refreshToken();
    this.authentication = await ApiService.fillAuthData();
    return this.authentication;
  },

  isInRole(roleName: string) {
    if (!this.authentication || !this.authentication.roles) {
      return false;
    }
    const role = this.authentication.roles.find(
      (m: any) => m.description === roleName && m.isActived
    );
    return !!role;
  },
};
// import { writable, derived } from 'svelte/store';
// import { browser } from '$app/environment';
// import { goto } from '$app/navigation';
// import { getApiResult } from './api';
// import type { ApiResponse, LoginData, ForgotPasswordData, ResetPasswordData, User, AuthState } from '$lib/types';

// // Initialize the auth state from localStorage if available
// const initAuthState = (): AuthState => {
//   if (!browser) {
//     return { isAuth: false, isAdmin: false };
//   }

//   const storedAuth = localStorage.getItem('auth');
//   if (!storedAuth) {
//     return { isAuth: false, isAdmin: false };
//   }

//   try {
//     return JSON.parse(storedAuth);
//   } catch (e) {
//     console.error('Failed to parse auth data from localStorage:', e);
//     return { isAuth: false, isAdmin: false };
//   }
// };

// // Create a writable store for authentication state
// export const authStore = writable<AuthState>(initAuthState());

// // Subscribe to changes and update localStorage
// if (browser) {
//   authStore.subscribe((value) => {
//     localStorage.setItem('auth', JSON.stringify(value));
//   });
// }

// // Derived stores for convenience
// export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuth);
// export const isAdmin = derived(authStore, ($auth) => $auth.isAdmin);
// export const username = derived(authStore, ($auth) => $auth.username);
// export const permissions = derived(authStore, ($auth) => $auth.permissions || []);

// // Utility to check permissions
// export function hasPermission(url: string): boolean {
//   const $permissions = permissions;
//   const $isAdmin = isAdmin;
  
//   return (
//     url === '/' ||
//     $isAdmin || 
//     ($permissions && $permissions.includes(url))
//   );
// }

// // Service functions
// export async function login(loginData: LoginData): Promise<ApiResponse> {
//   const result = await getApiResult({
//     method: 'POST',
//     url: '/account/login',
//     data: loginData
//   });

//   if (result.isSucceed && result.data) {
//     authStore.set({
//       isAuth: true,
//       isAdmin: result.data.isAdmin,
//       username: loginData.username,
//       permissions: result.data.permissions,
//       token: result.data.token
//     });
//   }

//   return result;
// }

// export function logout(): void {
//   authStore.set({ isAuth: false, isAdmin: false });
//   goto('/security/login');
// }

// export async function register(user: User): Promise<ApiResponse> {
//   return await getApiResult({
//     method: 'POST',
//     url: '/account/register',
//     data: user
//   });
// }

// export async function forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
//   return await getApiResult({
//     method: 'POST',
//     url: '/account/forgot-password',
//     data
//   });
// }

// export async function resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
//   return await getApiResult({
//     method: 'POST',
//     url: '/account/reset-password',
//     data
//   });
// }

// export async function externalLogin(loginData: any, provider: string): Promise<boolean> {
//   const result = await getApiResult({
//     method: 'POST',
//     url: `/account/external-login/${provider}`,
//     data: loginData
//   });

//   if (result.isSucceed && result.data) {
//     authStore.set({
//       isAuth: true,
//       isAdmin: result.data.isAdmin,
//       username: result.data.username,
//       permissions: result.data.permissions,
//       token: result.data.token
//     });
//     return true;
//   }

//   return false;
// }

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { CryptoService } from './crypto-service';
import { ApiService, authStore } from './api-service';
import { get } from 'svelte/store';

export interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface ExternalLoginData {
  username: string;
  email: string;
  accessToken: string;
}

export const AuthService = {
  async saveRegistration(registration: any) {
    await this.logOut();
    
    const response = await fetch('/account/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registration)
    });
    
    return await response.json();
  },

  async forgotPassword(data: any) {
    const apiUrl = "/account/forgot-password";
    const req = {
      method: "POST",
      url: apiUrl,
      data: JSON.stringify(data),
    };
    
    return await ApiService.getRestApiResult(req);
  },

  async resetPassword(data: any) {
    const apiUrl = "/account/reset-password";
    const req = {
      method: "POST",
      url: apiUrl,
      data: JSON.stringify(data),
    };
    
    return await ApiService.getRestApiResult(req);
  },

  async login(loginData: LoginData) {
    const data = {
      UserName: loginData.username,
      Password: loginData.password,
      RememberMe: loginData.rememberMe,
      Email: "",
      ReturnUrl: "",
    };
    
    const message = CryptoService.encryptAES(JSON.stringify(data));
    const apiUrl = "/account/login";
    const req = {
      method: "POST",
      url: apiUrl,
      data: JSON.stringify({ message }),
    };
    
    const resp = await ApiService.getRestApiResult(req, true);
    
    if (resp.isSucceed) {
      const encryptedData = resp.data;
      await ApiService.updateAuthData(encryptedData);
      await ApiService.initAllSettings();
      
      if (browser) {
        // Handle redirect based on query params or referrer
        const url = new URL(window.location.href);
        const returnUrl = url.searchParams.get('ReturnUrl');
        
        if (returnUrl) {
          setTimeout(() => {
            goto(returnUrl);
          }, 200);
        } else if (document.referrer && document.referrer.indexOf("init") === -1) {
          setTimeout(() => {
            window.location.href = document.referrer;
          }, 200);
        } else {
          setTimeout(() => {
            goto('/');
          }, 200);
        }
      }
    }
    
    return resp;
  },

  async externalLogin(loginData: ExternalLoginData, provider: string) {
    const data = {
      provider,
      username: loginData.username,
      email: loginData.email,
      externalAccessToken: loginData.accessToken,
    };
    
    const message = CryptoService.encryptAES(JSON.stringify(data));
    const apiUrl = "/account/external-login";
    const req = {
      method: "POST",
      url: apiUrl,
      data: JSON.stringify({ message }),
    };
    
    const resp = await ApiService.getRestApiResult(req, true);

    if (resp.isSucceed) {
      const encryptedData = resp.data;
      await ApiService.updateAuthData(encryptedData);
      await ApiService.initAllSettings();
    }
    
    return resp;
  },

  async logOut() {
    ApiService.logOut();
  },

  async refreshToken(id: string, accessToken: string) {
    const data = {
      refreshToken: id,
      accessToken: accessToken,
    };
    
    if (id) {
      const apiUrl = `/account/refresh-token`;
      const req = {
        method: "POST",
        url: apiUrl,
        data: JSON.stringify(data),
      };
      
      const resp = await ApiService.getApiResult(req);
      
      if (resp.isSucceed) {
        const encryptedData = resp.data;
        return ApiService.updateAuthData(encryptedData);
      } else {
        this.logOut();
      }
    } else {
      this.logOut();
    }
  },

  isInRole(roleName: string): boolean {
    const auth = get(authStore);
    
    if (!auth || !auth.info) {
      return false;
    }
    
    const role = auth.info.userRoles.filter(
      (m: any) => m.description === roleName && m.isActived
    );
    
    return role.length > 0;
  }
};
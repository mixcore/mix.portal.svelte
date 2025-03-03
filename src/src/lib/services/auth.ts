import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getApiResult } from './api';
import type { ApiResponse, LoginData, ForgotPasswordData, ResetPasswordData, User, AuthState } from '$lib/types';

// Initialize the auth state from localStorage if available
const initAuthState = (): AuthState => {
  if (!browser) {
    return { isAuth: false, isAdmin: false };
  }

  const storedAuth = localStorage.getItem('auth');
  if (!storedAuth) {
    return { isAuth: false, isAdmin: false };
  }

  try {
    return JSON.parse(storedAuth);
  } catch (e) {
    console.error('Failed to parse auth data from localStorage:', e);
    return { isAuth: false, isAdmin: false };
  }
};

// Create a writable store for authentication state
export const authStore = writable<AuthState>(initAuthState());

// Subscribe to changes and update localStorage
if (browser) {
  authStore.subscribe((value) => {
    localStorage.setItem('auth', JSON.stringify(value));
  });
}

// Derived stores for convenience
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuth);
export const isAdmin = derived(authStore, ($auth) => $auth.isAdmin);
export const username = derived(authStore, ($auth) => $auth.username);
export const permissions = derived(authStore, ($auth) => $auth.permissions || []);

// Utility to check permissions
export function hasPermission(url: string): boolean {
  const $permissions = permissions;
  const $isAdmin = isAdmin;
  
  return (
    url === '/' ||
    $isAdmin || 
    ($permissions && $permissions.includes(url))
  );
}

// Service functions
export async function login(loginData: LoginData): Promise<ApiResponse> {
  const result = await getApiResult({
    method: 'POST',
    url: '/account/login',
    data: loginData
  });

  if (result.isSucceed && result.data) {
    authStore.set({
      isAuth: true,
      isAdmin: result.data.isAdmin,
      username: loginData.username,
      permissions: result.data.permissions,
      token: result.data.token
    });
  }

  return result;
}

export function logout(): void {
  authStore.set({ isAuth: false, isAdmin: false });
  goto('/security/login');
}

export async function register(user: User): Promise<ApiResponse> {
  return await getApiResult({
    method: 'POST',
    url: '/account/register',
    data: user
  });
}

export async function forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
  return await getApiResult({
    method: 'POST',
    url: '/account/forgot-password',
    data
  });
}

export async function resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
  return await getApiResult({
    method: 'POST',
    url: '/account/reset-password',
    data
  });
}

export async function externalLogin(loginData: any, provider: string): Promise<boolean> {
  const result = await getApiResult({
    method: 'POST',
    url: `/account/external-login/${provider}`,
    data: loginData
  });

  if (result.isSucceed && result.data) {
    authStore.set({
      isAuth: true,
      isAdmin: result.data.isAdmin,
      username: result.data.username,
      permissions: result.data.permissions,
      token: result.data.token
    });
    return true;
  }

  return false;
}
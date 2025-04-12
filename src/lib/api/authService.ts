// Authentication service for Mixcore CMS API
import { browser } from '$app/environment';
import { fetchClient, getApiEndpoint } from './apiClient';
import { CryptoService } from './cryptoService';

// Types
export interface AuthResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  roles: string[];
  permissions: string[];
  expiresIn: number;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
}

export const AuthService = {
  // Login user
  login: async (
    username: string,
    password: string,
    rememberMe = false,
    email = '',
    phoneNumber = '',
    returnUrl = ''
  ): Promise<AuthResult<LoginResponse>> => {
    try {
      // Format data according to Mixcore API requirements
      const data = {
        email: email,
        userName: username,
        phoneNumber: phoneNumber,
        password: password,
        rememberMe: rememberMe,
        returnUrl: returnUrl
      };

      console.log('[Auth] Login data:', data);
      
      const endpoint = 'https://mixcore.net/api/v2/rest/auth/user/login-unsecure';
      console.log('[Auth] Using endpoint:', endpoint);
      
      const response = await fetchClient.post<any>(endpoint, data);

      console.log('[Auth] Login response:', response);

      if (response && response.accessToken) {
        // Extract data from response
        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken || '';
        const userId = response.info?.parentId || '';
        
        // Extract roles from JWT token
        let roles: string[] = [];
        try {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length > 1) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            const roleData = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            roles = Array.isArray(roleData) ? roleData : [roleData];
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }
        
        const permissions: string[] = [];

        // Store tokens in localStorage
        if (browser) {
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userId', userId);
          localStorage.setItem('roles', JSON.stringify(roles));
          localStorage.setItem('permissions', JSON.stringify(permissions));
        }

        return {
          success: true,
          data: {
            accessToken,
            refreshToken,
            userId,
            roles,
            permissions,
            expiresIn: response.expiresIn || 0
          }
        };
      }

      return {
        success: false,
        errors: ['Login failed']
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        errors: ['An error occurred during login']
      };
    }
  },

  // Register new user
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult<any>> => {
    try {
      const data = {
        displayName: name,
        userName: email,
        email: email,
        password: password,
        phoneNumber: ''
      };

      // Encrypt the data
      const message = CryptoService.encryptAES(JSON.stringify(data));
      
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/register');
      
      const response = await fetchClient.post<{
        success: boolean;
        data: any;
        errors?: string[];
      }>(endpoint, { message });

      if (response && response.success) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        errors: response.errors || ['Registration failed']
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        errors: ['An error occurred during registration']
      };
    }
  },

  // Forgot password - request reset email
  forgotPassword: async (email: string): Promise<AuthResult<any>> => {
    try {
      const data = {
        email: email
      };

      // Encrypt the data
      const message = CryptoService.encryptAES(JSON.stringify(data));
      
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/forgot-password');
      
      const response = await fetchClient.post<{
        success: boolean;
        data: any;
        errors?: string[];
      }>(endpoint, { message });

      if (response && response.success) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        errors: response.errors || ['Password reset request failed']
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        errors: ['An error occurred while requesting password reset']
      };
    }
  },

  // Reset password with reset token
  resetPassword: async (
    token: string,
    email: string,
    newPassword: string
  ): Promise<AuthResult<any>> => {
    try {
      const data = {
        token: token,
        email: email,
        password: newPassword
      };

      // Encrypt the data
      const message = CryptoService.encryptAES(JSON.stringify(data));
      
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/reset-password');
      
      const response = await fetchClient.post<{
        success: boolean;
        data: any;
        errors?: string[];
      }>(endpoint, { message });

      if (response && response.success) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        errors: response.errors || ['Password reset failed']
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        errors: ['An error occurred while resetting password']
      };
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<AuthResult<User>> => {
    try {
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/my-profile');
      
      const response = await fetchClient.get<{
        success: boolean;
        data: User;
        errors?: string[];
      }>(endpoint);

      if (response && response.success) {
        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        errors: response.errors || ['Failed to get user profile']
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        errors: ['An error occurred while fetching user profile']
      };
    }
  },

  // Get external login providers (Google, Facebook, etc.)
  getExternalLoginProviders: async (): Promise<string[]> => {
    try {
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/get-external-login-providers');
      
      const response = await fetchClient.get<{
        success: boolean;
        data: string[];
        errors?: string[];
      }>(endpoint);

      if (response && response.success) {
        return response.data || [];
      }

      return [];
    } catch (error) {
      console.error('Get external providers error:', error);
      return [];
    }
  },

  // Logout - clear tokens and storage
  logout: (): void => {
    if (browser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('roles');
      localStorage.removeItem('permissions');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!browser) return false;
    return !!localStorage.getItem('authToken');
  },

  // Get user's roles
  getUserRoles: (): string[] => {
    if (!browser) return [];
    
    const rolesString = localStorage.getItem('roles');
    if (!rolesString) return [];
    
    try {
      return JSON.parse(rolesString);
    } catch {
      return [];
    }
  },

  // Check if user has a specific role
  hasRole: (role: string): boolean => {
    const roles = AuthService.getUserRoles();
    return roles.includes(role);
  },

  // Get user's permissions
  getUserPermissions: (): string[] => {
    if (!browser) return [];
    
    const permissionsString = localStorage.getItem('permissions');
    if (!permissionsString) return [];
    
    try {
      return JSON.parse(permissionsString);
    } catch {
      return [];
    }
  },

  // Check if user has a specific permission
  hasPermission: (permission: string): boolean => {
    const permissions = AuthService.getUserPermissions();
    return permissions.includes(permission);
  },
  
  // Refresh access token using refresh token
  refreshToken: async (): Promise<AuthResult<LoginResponse>> => {
    try {
      // Only attempt to refresh if we have the tokens in storage
      if (!browser) {
        return { success: false, errors: ['Not in browser environment'] };
      }
      
      const accessToken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken || !refreshToken) {
        return { success: false, errors: ['No tokens available'] };
      }
      
      const data = {
        accessToken,
        refreshToken
      };
      
      // Encrypt the data
      const message = CryptoService.encryptAES(JSON.stringify(data));
      
      const endpoint = getApiEndpoint('/api/v2/rest/auth/user/renew-token');
      
      const response = await fetchClient.post<{
        success: boolean;
        data: LoginResponse;
        errors?: string[];
      }>(endpoint, { message });
      
      if (response && response.success) {
        const { accessToken, refreshToken, userId, roles, permissions } = 
          response.data;
          
        // Update tokens in localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('roles', JSON.stringify(roles));
        localStorage.setItem('permissions', JSON.stringify(permissions));
        
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        errors: response.errors || ['Token refresh failed']
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        errors: ['An error occurred during token refresh']
      };
    }
  }
}; 
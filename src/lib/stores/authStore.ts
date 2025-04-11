import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { AuthService } from '$lib/api/authService';
import type { User } from '$lib/api/authService';

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: Error | null;
  roles: string[];
  permissions: string[];
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: browser ? !!localStorage.getItem('authToken') : false,
  isLoading: false,
  user: null,
  error: null,
  roles: browser ? AuthService.getUserRoles() : [],
  permissions: browser ? AuthService.getUserPermissions() : []
};

// Create the auth store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Initialize store with user profile if authenticated
  async function initialize() {
    if (browser && AuthService.isAuthenticated()) {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Try to refresh the token first
        const refreshResult = await AuthService.refreshToken();
        
        // If refresh succeeds, get the user profile
        let userResponse;
        if (refreshResult.success) {
          userResponse = await AuthService.getCurrentUser();
        } else {
          // If refresh fails, try with existing token
          userResponse = await AuthService.getCurrentUser();
        }
        
        if (userResponse.success && userResponse.data) {
          update(state => ({
            ...state,
            isLoading: false,
            user: userResponse.data ?? null,
            roles: userResponse.data?.roles ?? [],
            permissions: userResponse.data?.permissions ?? []
          }));
        } else {
          // Failed to get user - probably token expired
          AuthService.logout();
          set({ 
            ...initialState,
            isAuthenticated: false
          });
        }
      } catch (error) {
        AuthService.logout();
        set({ 
          ...initialState,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Failed to initialize auth')
        });
      }
    }
  }

  // Initialize if in browser
  if (browser) {
    initialize();
  }

  return {
    subscribe,
    
    // Login user
    login: async (username: string, password: string, rememberMe = false) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await AuthService.login(username, password, rememberMe);
        
        if (response.success && response.data) {
          // Get user profile after successful login
          const userResponse = await AuthService.getCurrentUser();
          
          if (userResponse.success && userResponse.data) {
            update(state => ({
              ...state,
              isAuthenticated: true,
              isLoading: false,
              user: userResponse.data ?? null,
              roles: userResponse.data?.roles ?? [],
              permissions: userResponse.data?.permissions ?? []
            }));
            return true;
          }
          
          // Fallback if user profile can't be retrieved
          update(state => ({
            ...state,
            isAuthenticated: true,
            isLoading: false,
            roles: AuthService.getUserRoles(),
            permissions: AuthService.getUserPermissions()
          }));
          return true;
        }
        
        update(state => ({
          ...state,
          isLoading: false,
          error: new Error(response.errors?.[0] || 'Login failed')
        }));
        return false;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Login failed')
        }));
        return false;
      }
    },
    
    // Register a new user
    register: async (name: string, email: string, password: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await AuthService.register(name, email, password);
        
        update(state => ({
          ...state,
          isLoading: false,
          error: response.success ? null : new Error(response.errors?.[0] || 'Registration failed')
        }));
        
        return response.success;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Registration failed')
        }));
        return false;
      }
    },
    
    // Request password reset
    forgotPassword: async (email: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await AuthService.forgotPassword(email);
        
        update(state => ({
          ...state,
          isLoading: false,
          error: response.success ? null : new Error(response.errors?.[0] || 'Password reset request failed')
        }));
        
        return response.success;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Password reset request failed')
        }));
        return false;
      }
    },
    
    // Reset password with token
    resetPassword: async (token: string, email: string, newPassword: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await AuthService.resetPassword(token, email, newPassword);
        
        update(state => ({
          ...state,
          isLoading: false,
          error: response.success ? null : new Error(response.errors?.[0] || 'Password reset failed')
        }));
        
        return response.success;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Password reset failed')
        }));
        return false;
      }
    },
    
    // Logout user
    logout: () => {
      AuthService.logout();
      set({
        ...initialState,
        isAuthenticated: false
      });
    },
    
    // Check if user has a specific role
    hasRole: (role: string) => {
      return AuthService.hasRole(role);
    },
    
    // Check if user has a specific permission
    hasPermission: (permission: string) => {
      return AuthService.hasPermission(permission);
    },
    
    // Refresh the auth token
    refreshToken: async () => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await AuthService.refreshToken();
        
        if (response.success) {
          // Get user profile after token refresh
          const userResponse = await AuthService.getCurrentUser();
          
          if (userResponse.success && userResponse.data) {
            update(state => ({
              ...state,
              isAuthenticated: true,
              isLoading: false,
              user: userResponse.data ?? null,
              roles: userResponse.data?.roles ?? [],
              permissions: userResponse.data?.permissions ?? []
            }));
            return true;
          }
          
          // Fallback if user profile can't be retrieved
          update(state => ({
            ...state,
            isAuthenticated: true,
            isLoading: false,
            roles: AuthService.getUserRoles(),
            permissions: AuthService.getUserPermissions()
          }));
          return true;
        }
        
        // If token refresh failed, log the user out
        AuthService.logout();
        set({
          ...initialState,
          isAuthenticated: false,
          error: new Error(response.errors?.[0] || 'Session expired')
        });
        return false;
      } catch (error) {
        // If error during refresh, log the user out
        AuthService.logout();
        set({
          ...initialState,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Session expired')
        });
        return false;
      }
    }
  };
}

// Create and export the auth store instance
export const authStore = createAuthStore();

// Derived stores for common auth queries
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const isLoading = derived(authStore, $auth => $auth.isLoading);
export const currentUser = derived(authStore, $auth => $auth.user);
export const authError = derived(authStore, $auth => $auth.error);
export const userRoles = derived(authStore, $auth => $auth.roles);
export const userPermissions = derived(authStore, $auth => $auth.permissions); 
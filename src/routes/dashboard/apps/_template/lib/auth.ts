import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface AuthOptions {
  authEndpoint: string;
  persistToken?: boolean;
  tokenStorageKey?: string;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  metadata?: Record<string, any>;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserInfo | null;
  isLoading: boolean;
  error: Error | null;
}

export function createAuthStore(options: AuthOptions) {
  const {
    authEndpoint,
    persistToken = true,
    tokenStorageKey = 'mixcore_auth_token'
  } = options;

  // Initialize state
  const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: false,
    error: null
  };

  // Create store
  const { subscribe, set, update } = writable<AuthState>(initialState);

  // Load token from storage
  if (browser && persistToken) {
    try {
      const storedToken = localStorage.getItem(tokenStorageKey);
      if (storedToken) {
        // Mock user info - in a real app, validate token and get user info
        update(state => ({
          ...state,
          isAuthenticated: true,
          token: storedToken,
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            roles: ['Admin'],
            permissions: ['admin.access', 'content.edit']
          }
        }));
      }
    } catch (error) {
      console.warn('Failed to load auth token:', error);
    }
  }

  // Auth methods
  return {
    subscribe,
    login: async (username: string, password: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        // In a real app, make a POST request to your auth endpoint
        // const response = await fetch(authEndpoint, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ username, password })
        // });
        
        // if (!response.ok) throw new Error('Authentication failed');
        // const data = await response.json();
        
        // For demo, simulate successful login
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockToken = 'mock-jwt-token';
        const mockUser = {
          id: '1',
          username,
          email: `${username}@example.com`,
          roles: ['Admin'],
          permissions: ['admin.access', 'content.edit']
        };
        
        // Store token if persistence is enabled
        if (browser && persistToken) {
          localStorage.setItem(tokenStorageKey, mockToken);
        }
        
        update(state => ({
          ...state,
          isAuthenticated: true,
          token: mockToken,
          user: mockUser,
          isLoading: false
        }));
        
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Login failed');
        update(state => ({ 
          ...state, 
          error: err,
          isLoading: false
        }));
        throw err;
      }
    },
    logout: () => {
      // Remove token from storage
      if (browser && persistToken) {
        localStorage.removeItem(tokenStorageKey);
      }
      
      // Reset state
      set(initialState);
    },
    hasRole: (role: string) => {
      let hasRole = false;
      
      subscribe(state => {
        if (state.user && state.user.roles) {
          hasRole = state.user.roles.includes(role);
        }
      })();
      
      return hasRole;
    },
    hasPermission: (permission: string) => {
      let hasPermission = false;
      
      subscribe(state => {
        if (state.user && state.user.permissions) {
          hasPermission = state.user.permissions.includes(permission);
        }
      })();
      
      return hasPermission;
    }
  };
} 
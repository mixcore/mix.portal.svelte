import { writable, derived, get } from 'svelte/store';
import type { ComponentType } from 'svelte';
import { browser } from '$app/environment';

// Mini-app configuration interface
export interface MiniAppConfig {
  appId: string;
  version: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  entryPoint: string;
  mainStyles?: string;
  permissions?: Array<{
    name: string;
    displayName: string;
    description: string;
  }>;
  navigation?: {
    position: string;
    priority: number;
    menuItem: {
      title: string;
      icon: string;
      url: string;
      badge?: number | null;
      contextId: string;
    };
  };
  author?: {
    name: string;
    email: string;
    url: string;
  };
  settings?: Record<string, any>;
  integrations?: Record<string, any>;
}

// Mini-app module interface
export interface MiniAppModule {
  config: MiniAppConfig;
  default: ComponentType;
  styles?: string;
  [key: string]: any;
}

// Mini-app registry store
interface MiniAppRegistryState {
  apps: Record<string, MiniAppModule>;
  activeAppId: string | null;
  loading: boolean;
  error: Error | null;
}

// Create the store
const createMiniAppRegistry = () => {
  // Initial state
  const initialState: MiniAppRegistryState = {
    apps: {},
    activeAppId: null,
    loading: false,
    error: null
  };

  // Create the store
  const { subscribe, update, set } = writable<MiniAppRegistryState>(initialState);

  // Derived stores for convenience
  const activeApp = derived({ subscribe }, ($state) => {
    return $state.activeAppId ? $state.apps[$state.activeAppId] : null;
  });

  const appList = derived({ subscribe }, ($state) => {
    return Object.values($state.apps).map(app => ({
      appId: app.config.appId,
      displayName: app.config.displayName,
      description: app.config.description,
      icon: app.config.icon,
      category: app.config.category
    }));
  });

  // Persist active app ID in localStorage
  const persistActiveAppId = (appId: string | null) => {
    if (browser) {
      if (appId) {
        localStorage.setItem('mixcore_active_mini_app', appId);
      } else {
        localStorage.removeItem('mixcore_active_mini_app');
      }
    }
  };

  // Load persisted active app ID
  const loadPersistedActiveAppId = (): string | null => {
    if (browser) {
      return localStorage.getItem('mixcore_active_mini_app');
    }
    return null;
  };

  // Try to restore the active app from localStorage
  if (browser) {
    const savedAppId = loadPersistedActiveAppId();
    if (savedAppId) {
      update(state => ({ ...state, activeAppId: savedAppId }));
    }
  }

  return {
    subscribe,
    
    // Register a mini-app
    registerApp: (appModule: MiniAppModule) => {
      update(state => {
        // Add or update the app in the registry
        return {
          ...state,
          apps: {
            ...state.apps,
            [appModule.config.appId]: appModule
          }
        };
      });
    },
    
    // Register multiple apps at once
    registerApps: (appModules: MiniAppModule[]) => {
      update(state => {
        const newApps = { ...state.apps };
        
        // Add all apps to the registry
        appModules.forEach(app => {
          newApps[app.config.appId] = app;
        });
        
        return {
          ...state,
          apps: newApps
        };
      });
    },
    
    // Unregister a mini-app
    unregisterApp: (appId: string) => {
      update(state => {
        const newApps = { ...state.apps };
        delete newApps[appId];
        
        // If the active app was removed, set active to null
        const newActiveAppId = state.activeAppId === appId ? null : state.activeAppId;
        
        if (state.activeAppId !== newActiveAppId) {
          persistActiveAppId(newActiveAppId);
        }
        
        return {
          ...state,
          apps: newApps,
          activeAppId: newActiveAppId
        };
      });
    },
    
    // Set the active mini-app
    setActiveApp: (appId: string | null) => {
      update(state => {
        // Only update if the app exists or appId is null
        if (appId === null || state.apps[appId]) {
          persistActiveAppId(appId);
          return {
            ...state,
            activeAppId: appId
          };
        }
        return state;
      });
    },
    
    // Load a mini-app dynamically
    loadApp: async (appId: string, appUrl: string) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        // Dynamically import the mini-app module
        const module = await import(/* @vite-ignore */ appUrl);
        
        if (!module.default || !module.config) {
          throw new Error(`Invalid mini-app module structure for ${appId}`);
        }
        
        // Register the app
        const appModule: MiniAppModule = {
          config: module.config,
          default: module.default,
          ...module
        };
        
        update(state => ({
          ...state,
          apps: {
            ...state.apps,
            [appId]: appModule
          },
          loading: false
        }));
        
        return appModule;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(`Failed to load mini-app ${appId}`);
        update(state => ({ ...state, loading: false, error: err }));
        throw err;
      }
    },
    
    // Get a specific mini-app by ID
    getApp: (appId: string): MiniAppModule | null => {
      const state = get({ subscribe });
      return state.apps[appId] || null;
    },
    
    // Reset the registry
    reset: () => {
      persistActiveAppId(null);
      set(initialState);
    },
    
    // Derived stores
    activeApp,
    appList
  };
};

// Create and export the singleton instance
export const miniAppRegistry = createMiniAppRegistry(); 
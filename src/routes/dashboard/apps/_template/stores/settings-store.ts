import { writable } from 'svelte/store';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  pageSize: number;
  columns: string[];
  isLoading: boolean;
  error: Error | null;
}

export function createSettingsStore() {
  // Default settings
  const initialState: SettingsState = {
    theme: 'system',
    language: 'en-US',
    pageSize: 10,
    columns: ['name', 'status', 'date'],
    isLoading: false,
    error: null
  };

  // Create the store
  const { subscribe, set, update } = writable<SettingsState>(initialState);

  // Initialize from localStorage if available
  if (typeof localStorage !== 'undefined') {
    try {
      const savedSettings = localStorage.getItem('mixcore_app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        update(state => ({ ...state, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }

  return {
    subscribe,
    loadSettings: async () => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Simulate API call or load settings from local storage
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // In a real app, you would fetch settings from an API here
        // const response = await fetch('/api/settings');
        // const settings = await response.json();
        
        // For demo, we'll use default settings
        update(state => ({ 
          ...state, 
          isLoading: false
        }));
        
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to load settings');
        update(state => ({ 
          ...state, 
          error: err,
          isLoading: false
        }));
        throw err;
      }
    },
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
      update(state => {
        const newState = { ...state, [key]: value };
        
        // Save to localStorage
        if (typeof localStorage !== 'undefined') {
          try {
            const { isLoading, error, ...settings } = newState;
            localStorage.setItem('mixcore_app_settings', JSON.stringify(settings));
          } catch (e) {
            console.warn('Failed to save settings to localStorage:', e);
          }
        }
        
        return newState;
      });
    },
    reset: () => {
      set(initialState);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('mixcore_app_settings');
      }
    }
  };
} 
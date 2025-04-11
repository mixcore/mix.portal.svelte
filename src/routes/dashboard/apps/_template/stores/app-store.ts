import { writable } from 'svelte/store';

interface AppState {
  initialized: boolean;
  data: any[];
  isLoading: boolean;
  error: Error | null;
}

export function createAppStore() {
  const initialState: AppState = {
    initialized: false,
    data: [],
    isLoading: false,
    error: null
  };

  const { subscribe, set, update } = writable<AppState>(initialState);

  return {
    subscribe,
    initialize: async () => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Simulate initialization logic
        await new Promise(resolve => setTimeout(resolve, 500));
        
        update(state => ({
          ...state, 
          initialized: true,
          isLoading: false
        }));
        
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error during initialization');
        update(state => ({ 
          ...state, 
          error: err,
          isLoading: false
        }));
        throw err;
      }
    },
    setData: (data: any[]) => {
      update(state => ({ ...state, data }));
    },
    reset: () => {
      set(initialState);
    }
  };
} 
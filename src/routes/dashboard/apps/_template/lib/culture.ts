import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface CultureOptions {
  defaultCulture: string;
  supportedCultures?: string[];
  storageKey?: string;
}

interface CultureState {
  currentCulture: string;
  supportedCultures: string[];
  isRTL: boolean;
}

export function createCultureStore(options: CultureOptions) {
  const {
    defaultCulture = 'en-US',
    supportedCultures = ['en-US'],
    storageKey = 'mixcore_culture'
  } = options;
  
  // RTL languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  
  // Helper to check if a culture is RTL
  const isRTL = (culture: string) => {
    const lang = culture.split('-')[0].toLowerCase();
    return rtlLanguages.includes(lang);
  };
  
  // Initialize state
  const initialState: CultureState = {
    currentCulture: defaultCulture,
    supportedCultures: [...new Set([defaultCulture, ...supportedCultures])],
    isRTL: isRTL(defaultCulture)
  };
  
  // Try to load culture from storage
  if (browser) {
    try {
      const storedCulture = localStorage.getItem(storageKey);
      if (storedCulture && supportedCultures.includes(storedCulture)) {
        initialState.currentCulture = storedCulture;
        initialState.isRTL = isRTL(storedCulture);
      }
    } catch (error) {
      console.warn('Failed to load culture from localStorage:', error);
    }
  }
  
  // Create store
  const { subscribe, set, update } = writable<CultureState>(initialState);
  
  // Create formatters
  let dateFormatter: Intl.DateTimeFormat | null = null;
  let numberFormatter: Intl.NumberFormat | null = null;
  let currencyFormatter: Intl.NumberFormat | null = null;
  
  function getDateFormatter(culture: string): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(culture, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function getNumberFormatter(culture: string): Intl.NumberFormat {
    return new Intl.NumberFormat(culture);
  }
  
  function getCurrencyFormatter(culture: string, currency = 'USD'): Intl.NumberFormat {
    return new Intl.NumberFormat(culture, {
      style: 'currency',
      currency
    });
  }
  
  // Initialize formatters
  if (browser) {
    try {
      dateFormatter = getDateFormatter(initialState.currentCulture);
      numberFormatter = getNumberFormatter(initialState.currentCulture);
      currencyFormatter = getCurrencyFormatter(initialState.currentCulture);
    } catch (error) {
      console.warn('Failed to initialize formatters:', error);
    }
  }
  
  // Return store with methods
  return {
    subscribe,
    
    // Set culture
    setCulture: (culture: string) => {
      // Only set if culture is supported
      if (!supportedCultures.includes(culture)) {
        console.warn(`Culture ${culture} is not supported`);
        return false;
      }
      
      // Update formatters
      if (browser) {
        try {
          dateFormatter = getDateFormatter(culture);
          numberFormatter = getNumberFormatter(culture);
          currencyFormatter = getCurrencyFormatter(culture);
        } catch (error) {
          console.warn('Failed to update formatters:', error);
        }
      }
      
      // Save to storage
      if (browser) {
        try {
          localStorage.setItem(storageKey, culture);
        } catch (error) {
          console.warn('Failed to save culture to localStorage:', error);
        }
      }
      
      // Update state
      update(state => ({
        ...state,
        currentCulture: culture,
        isRTL: isRTL(culture)
      }));
      
      return true;
    },
    
    // Format a date according to the current culture
    formatDate: (date: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
      const dateToFormat = date instanceof Date ? date : new Date(date);
      
      if (browser) {
        try {
          if (options) {
            return new Intl.DateTimeFormat(initialState.currentCulture, options).format(dateToFormat);
          } else if (dateFormatter) {
            return dateFormatter.format(dateToFormat);
          }
        } catch (error) {
          console.warn('Failed to format date:', error);
        }
      }
      
      // Fallback
      return dateToFormat.toLocaleDateString();
    },
    
    // Format a number according to the current culture
    formatNumber: (number: number, options?: Intl.NumberFormatOptions): string => {
      if (browser) {
        try {
          if (options) {
            return new Intl.NumberFormat(initialState.currentCulture, options).format(number);
          } else if (numberFormatter) {
            return numberFormatter.format(number);
          }
        } catch (error) {
          console.warn('Failed to format number:', error);
        }
      }
      
      // Fallback
      return number.toLocaleString();
    },
    
    // Format currency according to the current culture
    formatCurrency: (amount: number, currency = 'USD'): string => {
      if (browser) {
        try {
          return new Intl.NumberFormat(initialState.currentCulture, {
            style: 'currency',
            currency
          }).format(amount);
        } catch (error) {
          console.warn('Failed to format currency:', error);
        }
      }
      
      // Fallback
      return `${currency} ${amount.toFixed(2)}`;
    }
  };
} 
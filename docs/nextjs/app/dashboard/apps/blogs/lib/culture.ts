/**
 * Culture and Localization utilities for Mixcore Mini-Apps
 * 
 * This module provides functionality for managing cultures, translations,
 * and locale-specific formatting in Mixcore mini-applications.
 */

import { Culture, ShellEventType } from './types';

/**
 * Culture service for handling localization, translations, and formatting
 */
export class CultureService {
  private currentCulture: Culture | null = null;
  private availableCultures: Culture[] = [];
  private translations: Record<string, Record<string, string>> = {};
  private listeners: Array<(culture: Culture) => void> = [];
  
  /**
   * Creates a new CultureService instance
   * 
   * @param options Configuration options
   */
  constructor(private options: {
    /** Default culture code */
    defaultCulture?: string;
    /** Storage key for persisting culture preference */
    storageKey?: string;
    /** Whether to use localStorage instead of sessionStorage */
    persistPreference?: boolean;
    /** Function to call when culture is changed */
    onCultureChange?: (culture: Culture) => void;
    /** Translation object or URL to load translations from */
    translations?: Record<string, Record<string, string>> | string;
  } = {}) {
    this.options = {
      defaultCulture: 'en-US',
      storageKey: 'mixcore_culture',
      persistPreference: true,
      ...options
    };
    
    // Initialize with default cultures
    this.initializeDefaultCultures();
    
    // Load saved culture preference if available
    this.loadSavedCulture();
    
    // Load translations if provided
    if (this.options.translations) {
      if (typeof this.options.translations === 'string') {
        this.loadTranslationsFromUrl(this.options.translations);
      } else {
        this.translations = this.options.translations;
      }
    }
    
    // Listen for dashboard shell culture events
    this.setupShellEventListeners();
  }
  
  /**
   * Initialize default cultures
   */
  private initializeDefaultCultures(): void {
    this.availableCultures = [
      {
        code: 'en-US',
        displayName: 'English (US)',
        nativeDisplayName: 'English (US)',
        direction: 'ltr',
        isDefault: true,
        isActive: true
      },
      {
        code: 'fr-FR',
        displayName: 'French',
        nativeDisplayName: 'Français',
        direction: 'ltr',
        isActive: true
      },
      {
        code: 'es-ES',
        displayName: 'Spanish',
        nativeDisplayName: 'Español',
        direction: 'ltr',
        isActive: true
      },
      {
        code: 'ar-SA',
        displayName: 'Arabic',
        nativeDisplayName: 'العربية',
        direction: 'rtl',
        isActive: true
      }
    ];
  }
  
  /**
   * Load saved culture preference
   */
  private loadSavedCulture(): void {
    const storage = this.options.persistPreference ? localStorage : sessionStorage;
    const savedCulture = storage.getItem(this.options.storageKey!);
    
    if (savedCulture) {
      const cultureCode = savedCulture;
      const culture = this.availableCultures.find(c => c.code === cultureCode);
      
      if (culture) {
        this.currentCulture = culture;
      } else {
        this.setDefaultCulture();
      }
    } else {
      this.setDefaultCulture();
    }
  }
  
  /**
   * Set the default culture
   */
  private setDefaultCulture(): void {
    const defaultCulture = this.availableCultures.find(c => 
      c.code === this.options.defaultCulture || c.isDefault
    );
    
    if (defaultCulture) {
      this.currentCulture = defaultCulture;
    } else if (this.availableCultures.length > 0) {
      this.currentCulture = this.availableCultures[0];
    }
  }
  
  /**
   * Setup event listeners for dashboard shell integration
   */
  private setupShellEventListeners(): void {
    window.addEventListener('message', (event) => {
      // Filter messages from the parent dashboard
      if (event.source !== window.parent) {
        return;
      }
      
      // Handle culture-related events
      if (event.data.type === ShellEventType.CULTURE_CHANGED) {
        const culture = event.data.culture;
        if (culture && culture.code) {
          this.setCulture(culture.code);
        }
      }
    });
    
    // Notify dashboard of current culture
    this.sendMessageToDashboard({
      type: ShellEventType.CULTURE_CHANGED,
      culture: this.currentCulture
    });
  }
  
  /**
   * Send a message to the parent dashboard shell
   */
  private sendMessageToDashboard(message: any): void {
    if (window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }
  
  /**
   * Save culture preference to storage
   */
  private saveCulturePreference(cultureCode: string): void {
    const storage = this.options.persistPreference ? localStorage : sessionStorage;
    storage.setItem(this.options.storageKey!, cultureCode);
  }
  
  /**
   * Load translations from a URL
   */
  private async loadTranslationsFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.statusText}`);
      }
      
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }
  
  /**
   * Get the current culture
   */
  getCurrentCulture(): Culture | null {
    return this.currentCulture;
  }
  
  /**
   * Get the current culture code
   */
  getCurrentCultureCode(): string {
    return this.currentCulture?.code || this.options.defaultCulture || 'en-US';
  }
  
  /**
   * Get available cultures
   */
  getAvailableCultures(): Culture[] {
    return this.availableCultures;
  }
  
  /**
   * Set available cultures
   */
  setAvailableCultures(cultures: Culture[]): void {
    this.availableCultures = cultures;
    
    // If current culture is not in the available cultures, set to default
    if (this.currentCulture && !this.availableCultures.some(c => c.code === this.currentCulture!.code)) {
      this.setDefaultCulture();
    }
  }
  
  /**
   * Add a culture to available cultures
   */
  addCulture(culture: Culture): void {
    const index = this.availableCultures.findIndex(c => c.code === culture.code);
    
    if (index === -1) {
      this.availableCultures.push(culture);
    } else {
      this.availableCultures[index] = culture;
    }
  }
  
  /**
   * Set the current culture by code
   * 
   * @param cultureCode The culture code
   * @returns The culture that was set, or null if not found
   */
  setCulture(cultureCode: string): Culture | null {
    const culture = this.availableCultures.find(c => c.code === cultureCode);
    
    if (culture) {
      this.currentCulture = culture;
      this.saveCulturePreference(culture.code);
      
      // Notify listeners
      this.listeners.forEach(listener => listener(culture));
      
      // Call onCultureChange callback if provided
      if (this.options.onCultureChange) {
        this.options.onCultureChange(culture);
      }
      
      // Set HTML lang and dir attributes
      document.documentElement.lang = culture.code;
      document.documentElement.dir = culture.direction;
      
      // Notify dashboard shell
      this.sendMessageToDashboard({
        type: ShellEventType.CULTURE_CHANGED,
        culture: this.currentCulture
      });
      
      return culture;
    }
    
    return null;
  }
  
  /**
   * Add a culture change listener
   */
  addCultureChangeListener(listener: (culture: Culture) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Remove a culture change listener
   */
  removeCultureChangeListener(listener: (culture: Culture) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
  
  /**
   * Add translations for a specific culture
   */
  addTranslations(cultureCode: string, translations: Record<string, string>): void {
    this.translations[cultureCode] = {
      ...this.translations[cultureCode],
      ...translations
    };
  }
  
  /**
   * Translate a key to the current culture
   * 
   * @param key The translation key
   * @param defaultValue Default value if translation is not found
   * @param params Optional parameters to replace placeholders
   */
  translate(key: string, defaultValue: string = key, params?: Record<string, string>): string {
    if (!this.currentCulture) {
      return this.formatWithParams(defaultValue, params);
    }
    
    const cultureTranslations = this.translations[this.currentCulture.code];
    if (!cultureTranslations) {
      return this.formatWithParams(defaultValue, params);
    }
    
    const translation = cultureTranslations[key];
    if (!translation) {
      return this.formatWithParams(defaultValue, params);
    }
    
    return this.formatWithParams(translation, params);
  }
  
  /**
   * Replace parameters in a string
   */
  private formatWithParams(text: string, params?: Record<string, string>): string {
    if (!params) {
      return text;
    }
    
    return Object.entries(params).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`{${key}}`, 'g'), value);
    }, text);
  }
  
  /**
   * Format a date according to the current culture
   * 
   * @param date The date to format
   * @param options Intl.DateTimeFormat options
   */
  formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat(this.getCurrentCultureCode(), options).format(dateObj);
  }
  
  /**
   * Format a number according to the current culture
   * 
   * @param number The number to format
   * @param options Intl.NumberFormat options
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.getCurrentCultureCode(), options).format(number);
  }
  
  /**
   * Format a currency value according to the current culture
   * 
   * @param amount The amount to format
   * @param currencyCode ISO 4217 currency code
   * @param options Additional Intl.NumberFormat options
   */
  formatCurrency(amount: number, currencyCode: string = 'USD', options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.getCurrentCultureCode(), {
      style: 'currency',
      currency: currencyCode,
      ...options
    }).format(amount);
  }
}

/**
 * Helper function to create a translate function for a specific culture service
 * 
 * @param cultureService The culture service to use
 * @returns A translate function
 * 
 * @example
 * ```typescript
 * const t = createTranslator(cultureService);
 * 
 * // Basic usage
 * const message = t('welcome', 'Welcome to Mixcore');
 * 
 * // With parameters
 * const greeting = t('hello_user', 'Hello, {name}!', { name: 'John' });
 * ```
 */
export function createTranslator(cultureService: CultureService): (
  key: string,
  defaultValue?: string,
  params?: Record<string, string>
) => string {
  return (key, defaultValue, params) => cultureService.translate(key, defaultValue, params);
} 
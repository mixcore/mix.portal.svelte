/**
 * Mini-App Library Index
 * 
 * This file exports all components from the lib directory for easy importing.
 * 
 * @example
 * ```typescript
 * // Import the entire API
 * import { MixDbApi, AuthService, CultureService } from '../lib';
 * 
 * // Or import specific components
 * import { createTranslator } from '../lib';
 * ```
 */

// Export MixDB API
export * from './mixdb-api';

// Export authentication utilities
export * from './auth';

// Export culture and localization utilities
export * from './culture';

// Export common types
export * from './types';

// Import specific types for CoreServices interface
import { MixDbApi } from './mixdb-api';
import { AuthService } from './auth';
import { CultureService, createTranslator } from './culture';
import { Culture } from './types';

// Create and export a convenient bundle of all core services
export interface CoreServices {
  api: MixDbApi;
  auth: AuthService;
  culture: CultureService;
  translate: (key: string, defaultValue?: string, params?: Record<string, string>) => string;
}

/**
 * Initialize all core services for a mini-app
 * 
 * @param options Configuration options
 * @returns An object containing all initialized services
 * 
 * @example
 * ```typescript
 * const services = initializeCoreServices({
 *   apiBasePath: '/api/v2/mixdb',
 *   defaultCulture: 'en-US',
 *   authEndpoint: '/api/auth'
 * });
 * 
 * // Now you can use all services
 * const { api, auth, culture, translate } = services;
 * ```
 */
export function initializeCoreServices(options: {
  apiBasePath?: string;
  defaultCulture?: string;
  authEndpoint?: string;
  onCultureChange?: (culture: Culture) => void;
  onAuthError?: (error: Error) => void;
}): CoreServices {
  // Initialize authentication service
  const auth = new AuthService({
    authEndpoint: options.authEndpoint || '/api/auth',
    onAuthError: options.onAuthError
  });
  
  // Initialize culture service
  const culture = new CultureService({
    defaultCulture: options.defaultCulture || 'en-US',
    onCultureChange: options.onCultureChange
  });
  
  // Initialize translator
  const translate = createTranslator(culture);
  
  // Initialize API client with both services
  const api = new MixDbApi({
    basePath: options.apiBasePath || '/api/v2/mixdb',
    authService: auth,
    cultureService: culture,
    includeCulture: true
  });
  
  return { api, auth, culture, translate };
} 
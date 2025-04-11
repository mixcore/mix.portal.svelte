'use client';

import type { MixcoreAppConfig } from '@/types/app';
import appConfig from './config/app.config.json';
import schemaConfig from './config/mixdb.schema.json';
import demoData from './config/demo-data.json';

/**
 * Initialize the Projects mini-app
 * This function is called when the app is first installed or initialized
 */
export async function initializeApp(): Promise<boolean> {
  try {
    console.log('Initializing Projects app...');
    
    // In development mode or if API endpoints are not ready,
    // simulate successful initialization
    if (process.env.NODE_ENV === 'development' || !isApiEndpointAvailable()) {
      console.log('Running in development mode: simulating successful initialization');
      await simulateInitialization();
      return true;
    }
    
    // For production with actual API endpoints
    // Register app with Mixcore
    await registerApp();
    
    // Setup MixDB collections
    await setupMixDBCollections();
    
    // Load demo data if needed
    if (appConfig.init.initOnInstall) {
      await loadDemoData();
    }
    
    // Register permissions
    if (appConfig.init.createDefaultPermissions) {
      await registerPermissions();
    }
    
    console.log('Projects app initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Projects app:', error);
    return false;
  }
}

/**
 * Check if API endpoints are available
 */
function isApiEndpointAvailable(): boolean {
  // This is a placeholder - in a real implementation, you might 
  // check for a feature flag or configuration setting
  return false; // Default to false for now until APIs are ready
}

/**
 * Simulate app initialization for development
 */
async function simulateInitialization(): Promise<void> {
  // Simulate API delays
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log('App registration simulated');
  console.log('MixDB collections setup simulated');
  console.log('Demo data loading simulated');
  console.log('Permissions registration simulated');
}

/**
 * Register the app with Mixcore
 */
async function registerApp(): Promise<void> {
  try {
    // Register app metadata with Mixcore system
    const response = await fetch('/api/apps/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: appConfig.appId,
        version: appConfig.version,
        displayName: appConfig.displayName,
        description: appConfig.description,
        category: appConfig.category,
        icon: appConfig.icon,
        entryPoint: appConfig.entryPoint,
        navigation: appConfig.navigation
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to register app: ${response.statusText}`);
    }
    
    console.log('App registered successfully');
  } catch (error) {
    console.error('Error registering app:', error);
    throw error;
  }
}

/**
 * Set up MixDB collections needed for the app
 */
async function setupMixDBCollections(): Promise<void> {
  try {
    // Create the required collections in MixDB
    const response = await fetch('/api/mixdb/collections/create-many', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schemaConfig.collections),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create collections: ${response.statusText}`);
    }
    
    console.log('MixDB collections created successfully');
  } catch (error) {
    console.error('Error setting up MixDB collections:', error);
    throw error;
  }
}

/**
 * Load demo data into the collections
 */
async function loadDemoData(): Promise<void> {
  try {
    // For each collection in the demo data, insert the records
    for (const [collectionName, records] of Object.entries(demoData.data)) {
      const response = await fetch(`/api/mixdb/collections/${collectionName}/records/create-many`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(records),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to insert records for ${collectionName}: ${response.statusText}`);
      }
    }
    
    console.log('Demo data loaded successfully');
  } catch (error) {
    console.error('Error loading demo data:', error);
    throw error;
  }
}

/**
 * Register app permissions
 */
async function registerPermissions(): Promise<void> {
  try {
    // Register permissions with the auth system
    const response = await fetch('/api/auth/permissions/create-many', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appConfig.permissions),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to register permissions: ${response.statusText}`);
    }
    
    console.log('Permissions registered successfully');
  } catch (error) {
    console.error('Error registering permissions:', error);
    throw error;
  }
}

/**
 * Get app configuration
 */
export function getAppConfig(): MixcoreAppConfig {
  return appConfig as MixcoreAppConfig;
}

/**
 * Uninstall the app
 */
export async function uninstallApp(): Promise<boolean> {
  try {
    // In development mode, simulate successful uninstallation
    if (process.env.NODE_ENV === 'development' || !isApiEndpointAvailable()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Projects app uninstallation simulated');
      return true;
    }
    
    // Clean up app data and registrations
    await fetch(`/api/apps/${appConfig.appId}/uninstall`, {
      method: 'POST',
    });
    
    console.log('Projects app uninstalled successfully');
    return true;
  } catch (error) {
    console.error('Failed to uninstall Projects app:', error);
    return false;
  }
}

export default {
  initializeApp,
  getAppConfig,
  uninstallApp,
}; 
/**
 * Mixcore App Configuration Type Definitions
 */

export interface MixcoreAppConfig {
  appId: string;
  version: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  author: {
    name: string;
    email: string;
    url: string;
  };
  license: string;
  repository: {
    type: string;
    url: string;
  };
  entryPoint: string;
  init: {
    initOnInstall: boolean;
    schemaFile: string;
    demoDataFile: string;
    createDefaultPermissions: boolean;
  };
  mainStyles: string;
  navigation: {
    position: string;
    priority: number;
    menuItem: {
      title: string;
      icon: string;
      url: string;
      badge: string | null;
      contextId: string;
    };
  };
  permissions: Array<{
    name: string;
    displayName: string;
    description: string;
  }>;
  settings: Record<string, any>;
  integrations: {
    cms?: {
      enabled: boolean;
      createContentTypes: boolean;
    };
    mixdb?: {
      enabled: boolean;
    };
    authentication?: {
      enabled: boolean;
      requiredRoles: string[];
    };
    notifications?: {
      enabled: boolean;
      supportedChannels: string[];
    };
    [key: string]: any;
  };
  ui: {
    theme: {
      useSystemTheme: boolean;
      colors: Record<string, string>;
    };
    layout: {
      fluid: boolean;
      container: string;
      padding: string;
    };
    animations: {
      enabled: boolean;
      transition: string;
    };
  };
  storage: {
    local?: {
      enabled: boolean;
      prefix: string;
    };
    persistent?: {
      enabled: boolean;
      schema: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface MixcoreAppRegistry {
  [appId: string]: MixcoreAppConfig;
} 
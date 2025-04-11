/**
 * Authentication and Authorization utilities for Mixcore Mini-Apps
 * 
 * This module provides functionality for user authentication, authorization,
 * role-based access control, and integration with the Mixcore Dashboard shell.
 */

import { User, AuthToken, Role, Permission, AppContext, ShellEventType } from './types';

/**
 * Authentication service for handling user login, logout, and token management
 */
export class AuthService {
  private token: AuthToken | null = null;
  private user: User | null = null;
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  private listeners: Array<(event: ShellEventType, data?: any) => void> = [];
  
  /**
   * Creates a new AuthService instance
   * 
   * @param options Configuration options
   */
  constructor(private options: {
    /** API endpoint for authentication */
    authEndpoint?: string;
    /** Storage key for persisting token */
    storageKey?: string;
    /** Whether to use localStorage instead of sessionStorage */
    persistToken?: boolean;
    /** Function to call on authentication errors */
    onAuthError?: (error: Error) => void;
  } = {}) {
    this.options = {
      authEndpoint: '/api/auth',
      storageKey: 'mixcore_auth_token',
      persistToken: false,
      ...options
    };
    
    // Initialize from storage if available
    this.loadFromStorage();
    
    // Listen for dashboard shell auth events
    this.setupShellEventListeners();
  }
  
  /**
   * Loads authentication data from storage
   */
  private loadFromStorage(): void {
    const storage = this.options.persistToken ? localStorage : sessionStorage;
    const storedData = storage.getItem(this.options.storageKey!);
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        this.token = data.token;
        this.user = data.user;
        
        // Check if token is expired
        if (this.token && this.token.expiresAt < Date.now()) {
          this.clearAuth();
        }
      } catch (error) {
        console.error('Error loading authentication data from storage', error);
        this.clearAuth();
      }
    }
  }
  
  /**
   * Saves authentication data to storage
   */
  private saveToStorage(): void {
    if (!this.token || !this.user) {
      return;
    }
    
    const storage = this.options.persistToken ? localStorage : sessionStorage;
    const dataToStore = JSON.stringify({
      token: this.token,
      user: this.user
    });
    
    storage.setItem(this.options.storageKey!, dataToStore);
  }
  
  /**
   * Sets up event listeners for dashboard shell integration
   */
  private setupShellEventListeners(): void {
    window.addEventListener('message', (event) => {
      // Filter messages from the parent dashboard
      if (event.source !== window.parent) {
        return;
      }
      
      // Handle auth-related events
      if (event.data.type === ShellEventType.AUTH_CHANGED) {
        if (event.data.authenticated) {
          this.setAuth(event.data.token, event.data.user);
        } else {
          this.clearAuth();
        }
        this.notifyListeners(ShellEventType.AUTH_CHANGED, { 
          authenticated: !!this.token 
        });
      } else if (event.data.type === ShellEventType.USER_UPDATED) {
        this.user = event.data.user;
        this.saveToStorage();
        this.notifyListeners(ShellEventType.USER_UPDATED, { user: this.user });
      } else if (event.data.type === ShellEventType.PERMISSION_CHANGED) {
        this.roles = event.data.roles || [];
        this.permissions = event.data.permissions || [];
        this.notifyListeners(ShellEventType.PERMISSION_CHANGED, {
          roles: this.roles,
          permissions: this.permissions
        });
      }
    });
    
    // Notify dashboard that we're ready to receive auth data
    this.sendMessageToDashboard({
      type: ShellEventType.APP_INITIALIZED,
      appId: window.location.pathname.split('/').pop() || 'mini-app'
    });
  }
  
  /**
   * Sends a message to the parent dashboard shell
   */
  private sendMessageToDashboard(message: any): void {
    if (window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }
  
  /**
   * Notifies all listeners of an event
   */
  private notifyListeners(event: ShellEventType, data?: any): void {
    this.listeners.forEach(listener => listener(event, data));
  }
  
  /**
   * Authenticates a user with username and password
   * 
   * @param username The username
   * @param password The password
   * @param remember Whether to persist the token
   * @returns The authenticated user
   */
  async login(username: string, password: string, remember = false): Promise<User> {
    try {
      const response = await fetch(this.options.authEndpoint + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }
      
      const data = await response.json();
      this.options.persistToken = remember;
      this.setAuth(data.token, data.user);
      
      // Load roles and permissions
      await this.loadUserRolesAndPermissions();
      
      return this.user!;
    } catch (error) {
      if (this.options.onAuthError) {
        this.options.onAuthError(error as Error);
      }
      throw error;
    }
  }
  
  /**
   * Refreshes the authentication token
   */
  async refreshToken(): Promise<void> {
    if (!this.token || !this.token.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch(this.options.authEndpoint + '/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.token.refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      this.setAuth(data.token, this.user!);
    } catch (error) {
      this.clearAuth();
      if (this.options.onAuthError) {
        this.options.onAuthError(error as Error);
      }
      throw error;
    }
  }
  
  /**
   * Loads user roles and permissions
   */
  async loadUserRolesAndPermissions(): Promise<void> {
    if (!this.isAuthenticated() || !this.user) {
      return;
    }
    
    try {
      const response = await fetch(this.options.authEndpoint + '/permissions', {
        headers: {
          'Authorization': `${this.token!.tokenType} ${this.token!.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load permissions');
      }
      
      const data = await response.json();
      this.roles = data.roles || [];
      this.permissions = data.permissions || [];
      
      this.notifyListeners(ShellEventType.PERMISSION_CHANGED, {
        roles: this.roles,
        permissions: this.permissions
      });
    } catch (error) {
      console.error('Error loading permissions', error);
    }
  }
  
  /**
   * Sets the authentication data
   */
  setAuth(token: AuthToken, user: User): void {
    this.token = token;
    this.user = user;
    this.saveToStorage();
    
    this.notifyListeners(ShellEventType.AUTH_CHANGED, { 
      authenticated: true,
      user: this.user
    });
  }
  
  /**
   * Clears the authentication data
   */
  clearAuth(): void {
    this.token = null;
    this.user = null;
    this.roles = [];
    this.permissions = [];
    
    const storage = this.options.persistToken ? localStorage : sessionStorage;
    storage.removeItem(this.options.storageKey!);
    
    this.notifyListeners(ShellEventType.AUTH_CHANGED, { 
      authenticated: false 
    });
  }
  
  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    if (!this.token) {
      return;
    }
    
    try {
      await fetch(this.options.authEndpoint + '/logout', {
        method: 'POST',
        headers: {
          'Authorization': `${this.token.tokenType} ${this.token.accessToken}`
        }
      });
    } catch (error) {
      console.error('Error during logout', error);
    } finally {
      this.clearAuth();
      
      // Notify dashboard of logout
      this.sendMessageToDashboard({
        type: ShellEventType.AUTH_CHANGED,
        authenticated: false
      });
    }
  }
  
  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token && this.token.expiresAt > Date.now();
  }
  
  /**
   * Gets the current user
   */
  getUser(): User | null {
    return this.user;
  }
  
  /**
   * Gets the authentication token
   */
  getToken(): AuthToken | null {
    // Check if token is expired and needs refresh
    if (this.token && this.token.expiresAt < Date.now() + 60000) { // Refresh if expiring in less than a minute
      this.refreshToken().catch(() => {
        // Token refresh failed, but we'll still return the current token
        // It might still be valid for a short time
      });
    }
    return this.token;
  }
  
  /**
   * Gets the authorization header for API requests
   */
  getAuthHeader(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    
    return {
      'Authorization': `${this.token.tokenType} ${this.token.accessToken}`
    };
  }
  
  /**
   * Checks if the user has a specific role
   * 
   * @param roleNameOrId The role name or ID to check
   */
  hasRole(roleNameOrId: string): boolean {
    if (!this.user || !this.user.roles) {
      return false;
    }
    
    return this.user.roles.includes(roleNameOrId) || 
      this.roles.some(role => role.id === roleNameOrId || role.name === roleNameOrId);
  }
  
  /**
   * Checks if the user has a specific permission
   * 
   * @param permissionKey The permission key to check
   */
  hasPermission(permissionKey: string): boolean {
    if (!this.user) {
      return false;
    }
    
    // Check direct user permissions
    if (this.user.permissions && this.user.permissions.includes(permissionKey)) {
      return true;
    }
    
    // Check role-based permissions
    return this.roles.some(role => 
      role.permissions && role.permissions.includes(permissionKey)
    );
  }
  
  /**
   * Registers an event listener
   * 
   * @param listener The listener function
   */
  addEventListener(listener: (event: ShellEventType, data?: any) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Removes an event listener
   * 
   * @param listener The listener function to remove
   */
  removeEventListener(listener: (event: ShellEventType, data?: any) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
}

/**
 * Creates a permission guard function that checks if the user has the required permissions
 * 
 * @param auth The authentication service
 * @param requiredPermissions The required permissions
 * @returns A function that returns true if the user has all required permissions
 * 
 * @example
 * ```typescript
 * const canEditUsers = createPermissionGuard(authService, ['users.edit']);
 * 
 * if (canEditUsers()) {
 *   // Show edit button
 * }
 * ```
 */
export function createPermissionGuard(
  auth: AuthService,
  requiredPermissions: string[]
): () => boolean {
  return () => {
    if (!auth.isAuthenticated()) {
      return false;
    }
    
    return requiredPermissions.every(permission => auth.hasPermission(permission));
  };
}

/**
 * Creates a role guard function that checks if the user has the required roles
 * 
 * @param auth The authentication service
 * @param requiredRoles The required roles
 * @returns A function that returns true if the user has any of the required roles
 * 
 * @example
 * ```typescript
 * const isAdmin = createRoleGuard(authService, ['Admin', 'SuperAdmin']);
 * 
 * if (isAdmin()) {
 *   // Show admin panel
 * }
 * ```
 */
export function createRoleGuard(
  auth: AuthService,
  requiredRoles: string[]
): () => boolean {
  return () => {
    if (!auth.isAuthenticated()) {
      return false;
    }
    
    return requiredRoles.some(role => auth.hasRole(role));
  };
} 
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { AuthService } from '$lib/api/authService';

/**
 * Authentication guard for protecting routes
 * Use in +page.ts or +layout.ts files
 */
export async function authGuard() {
  if (browser) {
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      // Get the current URL to redirect back after login
      const currentUrl = window.location.pathname;
      const returnUrl = encodeURIComponent(currentUrl);
      
      // Redirect to login page with return URL
      goto(`/auth/login?returnUrl=${returnUrl}`);
      return { isAuthenticated: false };
    }
    
    // Optionally check for specific roles here
    // For example:
    // if (!AuthService.hasRole('Admin')) {
    //   goto('/access-denied');
    //   return { isAuthenticated: false };
    // }
    
    return { 
      isAuthenticated: true 
    };
  }
  
  // During SSR, we don't redirect
  return { isAuthenticated: false };
}

/**
 * Role-based guard for protecting routes that require specific roles
 */
export async function roleGuard(requiredRoles: string[]) {
  if (browser) {
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      const currentUrl = window.location.pathname;
      const returnUrl = encodeURIComponent(currentUrl);
      goto(`/auth/login?returnUrl=${returnUrl}`);
      return { isAuthenticated: false, hasRole: false };
    }
    
    const hasRequiredRole = requiredRoles.some(role => AuthService.hasRole(role));
    
    if (!hasRequiredRole) {
      goto('/access-denied');
      return { isAuthenticated: true, hasRole: false };
    }
    
    return { 
      isAuthenticated: true, 
      hasRole: true 
    };
  }
  
  // During SSR, we don't redirect
  return { isAuthenticated: false, hasRole: false };
}

/**
 * Permission-based guard for protecting routes that require specific permissions
 */
export async function permissionGuard(requiredPermissions: string[]) {
  if (browser) {
    const isAuthenticated = AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      const currentUrl = window.location.pathname;
      const returnUrl = encodeURIComponent(currentUrl);
      goto(`/auth/login?returnUrl=${returnUrl}`);
      return { isAuthenticated: false, hasPermission: false };
    }
    
    const hasRequiredPermission = requiredPermissions.some(permission => 
      AuthService.hasPermission(permission)
    );
    
    if (!hasRequiredPermission) {
      goto('/access-denied');
      return { isAuthenticated: true, hasPermission: false };
    }
    
    return { 
      isAuthenticated: true, 
      hasPermission: true 
    };
  }
  
  // During SSR, we don't redirect
  return { isAuthenticated: false, hasPermission: false };
} 
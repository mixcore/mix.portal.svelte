'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { appContexts, contextNavItems, personas } from '@/constants/data';
import { NavItem } from '@/types';
import { AuthService } from '@/services/auth';

type NavigationContextType = {
  activeContextId: string | null;
  setActiveContextId: (id: string | null) => void;
  activePersonaId: string | null;
  setActivePersonaId: (id: string | null) => void;
  availableContexts: typeof appContexts;
  availablePersonas: typeof personas;
  filteredNavItems: NavItem[];
  tenantEnabledContexts: string[];
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationContextProvider({ children }: { children: React.ReactNode }) {
  const [activeContextId, setActiveContextId] = useState<string | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [tenantEnabledContexts, setTenantEnabledContexts] = useState<string[]>([]);

  // Load user roles and permissions
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load tenant enabled contexts from localStorage or API
        // For this demo, we'll use localStorage
        const savedEnabledContexts = localStorage.getItem('tenantEnabledContexts');
        let enabledContexts: string[] = [];
        
        if (savedEnabledContexts) {
          try {
            enabledContexts = JSON.parse(savedEnabledContexts);
          } catch (e) {
            console.error('Error parsing tenant contexts:', e);
          }
        } else {
          // Default to all contexts if none saved - in a real app, this would come from the tenant settings
          enabledContexts = appContexts.map(c => c.id);
        }
        
        setTenantEnabledContexts(enabledContexts);
        
        // Get saved context and persona from localStorage if available
        const savedContextId = localStorage.getItem('activeContextId');
        const savedPersonaId = localStorage.getItem('activePersonaId');
        
        if (savedContextId && enabledContexts.includes(savedContextId)) {
          setActiveContextId(savedContextId);
        } else {
          // Default to first enabled context if none saved or previous one is no longer enabled
          setActiveContextId(enabledContexts[0] || null);
        }
        
        if (savedPersonaId) {
          setActivePersonaId(savedPersonaId);
        } else {
          // Default to first persona if none saved
          setActivePersonaId(personas[0]?.id || null);
        }

        // Load roles and permissions from auth service
        if (AuthService.isAuthenticated()) {
          const roles = JSON.parse(localStorage.getItem('roles') || '[]');
          const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
          setUserRoles(roles);
          setUserPermissions(permissions);
        }
      } catch (error) {
        console.error('Error loading navigation context:', error);
      }
    };

    loadUserData();
  }, []);

  // Update localStorage when context or persona changes
  useEffect(() => {
    if (activeContextId) {
      localStorage.setItem('activeContextId', activeContextId);
    }
  }, [activeContextId]);

  useEffect(() => {
    if (activePersonaId) {
      localStorage.setItem('activePersonaId', activePersonaId);
    }
  }, [activePersonaId]);

  // Filter nav items based on active context, persona, roles and permissions
  useEffect(() => {
    const filterNavItems = () => {
      // Start with items that are always visible (no context or persona specified)
      let filtered = contextNavItems.filter(
        (item) => !item.contextId && !item.personaIds
      );

      // Add items for the active context
      if (activeContextId) {
        const contextItems = contextNavItems.filter(
          (item) => item.contextId === activeContextId || 
                   (item.contextId && item.contextId === 'all')
        );
        filtered = [...filtered, ...contextItems];
      }

      // Filter by persona if set
      if (activePersonaId) {
        filtered = filtered.filter(
          (item) => 
            !item.personaIds || 
            item.personaIds.includes(activePersonaId) ||
            item.personaIds.includes('all')
        );
      }

      // Filter by user roles if any
      if (userRoles.length > 0) {
        filtered = filtered.filter(
          (item) => 
            !item.roleIds || 
            item.roleIds.some(role => userRoles.includes(role))
        );
      }

      // Filter by user permissions if any
      if (userPermissions.length > 0) {
        filtered = filtered.filter(
          (item) => 
            !item.permissionIds || 
            item.permissionIds.some(permission => userPermissions.includes(permission))
        );
      }

      // Sort by priority
      filtered.sort((a, b) => {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        return priorityA - priorityB;
      });

      setFilteredNavItems(filtered);
    };

    filterNavItems();
  }, [activeContextId, activePersonaId, userRoles, userPermissions]);

  // Filter available contexts based on tenant-enabled contexts
  const availableContexts = appContexts.filter(context => {
    return tenantEnabledContexts.includes(context.id);
  });

  // Filter available personas based on user roles and permissions
  const availablePersonas = personas.filter(persona => {
    // If no specific role/permission filtering is needed, return all personas
    return true;
  });

  return (
    <NavigationContext.Provider
      value={{
        activeContextId,
        setActiveContextId,
        activePersonaId,
        setActivePersonaId,
        availableContexts,
        availablePersonas,
        filteredNavItems,
        tenantEnabledContexts
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationContextProvider');
  }
  return context;
} 
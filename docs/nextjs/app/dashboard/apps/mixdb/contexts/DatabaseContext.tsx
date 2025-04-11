'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DbContext } from '../components/DbContextSelector';

interface DatabaseContextType {
  activeDbContext: DbContext;
  dbContexts: DbContext[];
  setActiveDbContext: (contextId: string) => void;
  addDbContext: (dbContext: Omit<DbContext, 'id'>) => void;
  removeDbContext: (contextId: string) => void;
  isLoading: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const defaultDbContexts: DbContext[] = [
  { 
    id: 'default', 
    name: 'Default Database', 
    type: 'postgres', 
    isDefault: true, 
    status: 'connected' 
  },
  { 
    id: 'analytics', 
    name: 'Analytics DB', 
    type: 'postgres', 
    status: 'connected' 
  },
  { 
    id: 'legacy', 
    name: 'Legacy System', 
    type: 'mysql', 
    status: 'connected' 
  }
];

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [dbContexts, setDbContexts] = useState<DbContext[]>(defaultDbContexts);
  const [activeDbContextId, setActiveDbContextId] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(false);

  const activeDbContext = dbContexts.find(ctx => ctx.id === activeDbContextId) || dbContexts[0];

  const setActiveDbContext = (contextId: string) => {
    setIsLoading(true);
    
    // Simulate loading data from the new database context
    setTimeout(() => {
      setActiveDbContextId(contextId);
      setIsLoading(false);
    }, 500);
  };

  const addDbContext = (dbContext: Omit<DbContext, 'id'>) => {
    const newContext: DbContext = {
      ...dbContext,
      id: `db-${Date.now()}`
    };
    
    setDbContexts([...dbContexts, newContext]);
    return newContext.id;
  };

  const removeDbContext = (contextId: string) => {
    // Don't allow removing the default context
    const contextToRemove = dbContexts.find(ctx => ctx.id === contextId);
    if (contextToRemove?.isDefault) {
      return false;
    }
    
    setDbContexts(dbContexts.filter(ctx => ctx.id !== contextId));
    
    // If removing the active context, switch to default
    if (contextId === activeDbContextId) {
      const defaultContext = dbContexts.find(ctx => ctx.isDefault);
      if (defaultContext) {
        setActiveDbContextId(defaultContext.id);
      } else {
        setActiveDbContextId(dbContexts[0].id);
      }
    }
    
    return true;
  };

  const value = {
    activeDbContext,
    dbContexts,
    setActiveDbContext,
    addDbContext,
    removeDbContext,
    isLoading
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
} 
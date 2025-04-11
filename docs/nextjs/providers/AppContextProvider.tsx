'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Available app types
export type AppType = 'cms' | 'mixdb' | 'projects';

// App context interface
interface AppContextType {
  activeAppId: AppType;
  setActiveApp: (appId: AppType) => void;
  isAppActive: (appId: AppType) => boolean;
}

// Create context with default values
const AppContext = createContext<AppContextType>({
  activeAppId: 'cms',
  setActiveApp: () => {},
  isAppActive: () => false,
});

// Hook to use app context
export const useAppContext = () => useContext(AppContext);

// Provider component
export function AppContextProvider({ children }: { children: ReactNode }) {
  const [activeAppId, setActiveAppId] = useState<AppType>('cms');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Update active app based on URL when navigating
  useEffect(() => {
    if (pathname.startsWith('/dashboard/apps')) {
      const appParam = searchParams.get('app');
      if (appParam && ['cms', 'mixdb', 'projects'].includes(appParam)) {
        setActiveAppId(appParam as AppType);
      }
    }
  }, [pathname, searchParams]);
  
  // Change active app
  const setActiveApp = (appId: AppType) => {
    setActiveAppId(appId);
  };
  
  // Check if a specific app is active
  const isAppActive = (appId: AppType) => {
    return activeAppId === appId;
  };
  
  // Context value
  const contextValue: AppContextType = {
    activeAppId,
    setActiveApp,
    isAppActive,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
} 
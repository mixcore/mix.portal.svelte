'use client';

import React from 'react';
import { DbContextSelector } from '../components/DbContextSelector';
import { useDatabase } from '../contexts/DatabaseContext';
import { Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { setActiveDbContext, isLoading } = useDatabase();

  return (
    <div className="mixdb-app-shell w-full h-full flex flex-col">
      <header className="mixdb-app-header border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">MixDB</h1>
            <DbContextSelector onContextChange={setActiveDbContext} />
          </div>
          <div className="flex items-center space-x-2">
            {/* App-specific header elements */}
          </div>
        </div>
      </header>
      <div className="mixdb-app-content flex-1 overflow-auto p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Switching database context...</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default AppShell; 
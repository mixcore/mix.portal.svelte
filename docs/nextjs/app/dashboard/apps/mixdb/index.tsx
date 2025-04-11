'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from './layouts/AppShell';
import { TableList } from './components/TableList';
import { TableDetail } from './components/TableDetail';
import { QueryEditor } from './components/QueryEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeApp } from './app-loader';
import { DatabaseProvider } from './contexts/DatabaseContext';
import './app-globals.css';

export interface MixDBAppProps {
  // Define app-specific props
}

export function MixDBApp(props: MixDBAppProps) {
  const [isInitialized, setIsInitialized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'tables' | 'detail' | 'query' | 'import-export' | 'settings'>('tables');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Initialize app if needed
  useEffect(() => {
    const appInitKey = 'mixcore_mixdb_initialized';
    const isAppInitialized = localStorage.getItem(appInitKey) === 'true';
    
    if (!isAppInitialized) {
      setIsLoading(true);
      initializeApp()
        .then(success => {
          if (success) {
            localStorage.setItem(appInitKey, 'true');
          }
          setIsInitialized(success);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error initializing app:', error);
          setIsInitialized(false);
          setIsLoading(false);
        });
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing MixDB...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (!isInitialized) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-md m-4">
        <h2 className="text-xl font-semibold mb-2">Initialization Error</h2>
        <p>Failed to initialize MixDB. Please try reloading the application.</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Reload Application
        </button>
      </div>
    );
  }

  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId);
    setActiveView('detail');
  };

  const handleBackToTables = () => {
    setSelectedTableId(null);
    setActiveView('tables');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'detail':
        return selectedTableId ? (
          <TableDetail 
            tableId={selectedTableId} 
            onBack={handleBackToTables} 
          />
        ) : (
          <div className="text-center py-10">
            <p>No table selected</p>
          </div>
        );
      case 'query':
        return <QueryEditor />;
      case 'import-export':
        return (
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">Import & Export</h3>
            <p className="text-muted-foreground">Import and export functionality coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">MixDB Settings</h3>
            <p className="text-muted-foreground">Settings configuration coming soon</p>
          </div>
        );
      case 'tables':
      default:
        return <TableList onTableClick={handleTableClick} />;
    }
  };

  return (
    <DatabaseProvider>
      <AppShell>
        <div className="mb-6">
          <Tabs 
            defaultValue="tables" 
            className="w-full"
            value={activeView}
            onValueChange={(value) => setActiveView(value as any)}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="query">SQL Editor</TabsTrigger>
              <TabsTrigger value="import-export">Import/Export</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {renderContent()}
      </AppShell>
    </DatabaseProvider>
  );
}

// Default export for dynamic import
export default MixDBApp; 
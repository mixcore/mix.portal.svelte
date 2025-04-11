'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import AppShell from './layouts/AppShell';
import Dashboard from './components/Dashboard';
import useContainerStatus from './hooks/useContainerStatus';
import './app-globals.css'; // Import app-specific styles
import { initializeApp, getAppConfig } from './app-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define possible views for the app
type ViewType = 'dashboard' | 'list' | 'detail' | 'settings' | 'posts' | 'categories' | 'tags' | 'authors' | 'analytics';

export interface MiniAppProps {
  // Define app-specific props
  standalone?: boolean;
}

export function MiniApp(props: MiniAppProps) {
  // Router and URL parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get view from URL parameters
  const viewParam = searchParams.get('view') as ViewType | null;
  const itemIdParam = searchParams.get('id');
  
  // Get app config
  const appConfig = getAppConfig();
  
  // Set initial view based on URL parameter or config
  const getInitialView = (): ViewType => {
    if (viewParam && ['dashboard', 'list', 'detail', 'settings', 'posts', 'categories', 'tags', 'authors', 'analytics'].includes(viewParam)) {
      return viewParam as ViewType;
    }
    return 'dashboard';
  };
  
  const [activeView, setActiveView] = useState<ViewType>(getInitialView());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(itemIdParam || null);
  const isFluidLayout = useContainerStatus();
  const [isInitialized, setIsInitialized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update URL when view or item ID changes
  useEffect(() => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    
    // Set the view parameter
    params.set('view', activeView);
    
    // Set or remove id parameter
    if (selectedItemId && activeView === 'detail') {
      params.set('id', selectedItemId);
    } else {
      params.delete('id');
    }
    
    // Update the URL without triggering navigation
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeView, selectedItemId, pathname, searchParams]);
  
  // Listen for navigation events from AppShell or other components
  useEffect(() => {
    const handleNavigationChange = (event: CustomEvent) => {
      const { view, source } = event.detail;
      
      // Only update our state if we're not the source of the event
      if (source !== 'miniapp') {
        setActiveView(view as ViewType);
        
        // Clear selected item ID if not in detail view
        if (view !== 'detail') {
          setSelectedItemId(null);
        }
      }
    };
    
    // Add event listener for custom navigation events
    window.addEventListener('mixcore:navigation:change', handleNavigationChange as EventListener);
    
    return () => {
      window.removeEventListener('mixcore:navigation:change', handleNavigationChange as EventListener);
    };
  }, []);
  
  // Handle URL parameter changes more aggressively
  useEffect(() => {
    // Check if the URL has a view parameter
    const urlView = searchParams.get('view');
    const urlId = searchParams.get('id');
    
    if (urlView && urlView !== activeView) {
      // Set the active view based on the URL
      setActiveView(urlView as ViewType);
    }
    
    if (urlId !== selectedItemId) {
      // Set the selected item ID based on the URL
      setSelectedItemId(urlId);
    }
  }, [searchParams, activeView, selectedItemId]);
  
  // Initialize app if needed
  useEffect(() => {
    const appInitKey = `mixcore_${appConfig.appId}_initialized`;
    const isAppInitialized = localStorage.getItem(appInitKey) === 'true';
    
    const handleInitialization = async () => {
      // If already initialized or currently initializing, skip
      if (isAppInitialized || isLoading) return;
      
      try {
        setIsLoading(true);
        const success = await initializeApp();
        
        if (success) {
          localStorage.setItem(appInitKey, 'true');
          setIsInitialized(true);
        } else {
          setIsInitialized(false);
          // Only clear initialization flag in development to allow retries
          if (process.env.NODE_ENV === 'development') {
            localStorage.removeItem(appInitKey);
          }
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        setIsInitialized(false);
        // Only clear initialization flag in development to allow retries
        if (process.env.NODE_ENV === 'development') {
          localStorage.removeItem(appInitKey);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Handle initial load
    handleInitialization();
    
    // Clean up (if the component unmounts during initialization)
    return () => {
      if (isLoading) {
        console.log('Initialization interrupted: component unmounted');
      }
    };
  }, [isLoading, appConfig.appId]);
  
  // Handle item selection
  const handleItemClick = (itemId: string) => {
    if (itemId === 'list') {
      setActiveView('posts'); // Change to use 'posts' as the view for list
      setSelectedItemId(null);
    } else if (itemId === 'new') {
      setSelectedItemId('new');
      setActiveView('detail');
    } else {
      setSelectedItemId(itemId);
      setActiveView('detail');
    }
    
    // Update URL to reflect change without full page reload
    const params = new URLSearchParams();
    params.set('view', itemId === 'list' ? 'posts' : itemId === 'new' ? 'detail' : 'detail');
    if (itemId !== 'list') {
      params.set('id', itemId);
    }
    
    // Use history API to update URL
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  
  // Handle view change
  const handleViewChange = (viewType: ViewType) => {
    setActiveView(viewType);
    
    // If changing away from detail view, clear selected item
    if (viewType !== 'detail') {
      setSelectedItemId(null);
    }
  };
  
  // Set body class for fluid layout when this app is active
  useEffect(() => {
    const body = document.body;
    const shouldUseFluidLayout = appConfig.ui?.layout?.fluid || isFluidLayout;
    
    if (shouldUseFluidLayout) {
      body.classList.add(`${appConfig.appId}-app-active`);
    } else {
      body.classList.remove(`${appConfig.appId}-app-active`);
    }
    
    return () => {
      body.classList.remove(`${appConfig.appId}-app-active`);
    };
  }, [isFluidLayout, appConfig.ui?.layout?.fluid, appConfig.appId]);
  
  // Handle retry initialization
  const handleRetryInitialization = () => {
    localStorage.removeItem(`mixcore_${appConfig.appId}_initialized`);
    setIsLoading(true);
    setIsInitialized(true);
  };
  
  // Generate deep link for current view
  const getDeepLink = (view: ViewType, itemId?: string): string => {
    const baseUrl = pathname;
    const params = new URLSearchParams();
    
    params.set('view', view);
    if (itemId && view === 'detail') {
      params.set('id', itemId);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Show loading state while app is initializing
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            
            <div className="text-center text-sm text-muted-foreground animate-pulse">
              Initializing {appConfig.displayName}...
              <RefreshCw className="h-4 w-4 ml-2 inline animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state if initialization failed
  if (!isInitialized) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Initialization Error</AlertTitle>
            <AlertDescription>
              Failed to initialize the {appConfig.displayName}. This could be because the API endpoints are not yet available.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>{appConfig.displayName}</CardTitle>
              <CardDescription>
                {process.env.NODE_ENV === 'development' && (
                  "In development mode, you can retry initialization or skip this step for testing purposes."
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button 
                variant="default"
                onClick={handleRetryInitialization}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem(`mixcore_${appConfig.appId}_initialized`, 'true');
                    setIsInitialized(true);
                  }}
                  className="gap-2"
                >
                  Skip Initialization
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Render the active view
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onItemClick={handleItemClick} />;
      
      case 'posts':
      case 'list': // Handle both 'posts' and 'list' views with the same component
        // Import ItemList component which wraps BlogPostList
        const ItemList = require('./components/ItemList').default;
        return <ItemList onItemClick={handleItemClick} />;
      
      case 'categories':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage blog categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Categories management will appear here.</p>
            </CardContent>
          </Card>
        );
      
      case 'tags':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage blog tags</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tags management will appear here.</p>
            </CardContent>
          </Card>
        );
      
      case 'authors':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
              <CardDescription>Manage blog authors</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Authors management will appear here.</p>
            </CardContent>
          </Card>
        );
      
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View blog analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics will appear here.</p>
            </CardContent>
          </Card>
        );
      
      case 'detail':
        if (selectedItemId) {
          // Import ItemDetail component which wraps BlogPostDetail
          const ItemDetail = require('./components/ItemDetail').default;
          return <ItemDetail itemId={selectedItemId} onBack={() => handleViewChange('posts')} />;
        }
        return <div>No item selected</div>;
      
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your app preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings content will appear here.</p>
            </CardContent>
          </Card>
        );
      
      default:
        return <Dashboard onItemClick={handleItemClick} />;
    }
  };
  
  // Main app rendering
  return (
    <AppShell>
      {renderView()}
    </AppShell>
  );
}

export default MiniApp; 
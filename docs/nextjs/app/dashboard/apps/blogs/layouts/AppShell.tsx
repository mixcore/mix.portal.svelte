'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useBreadcrumb, { BreadcrumbItem } from '../hooks/useBreadcrumb';
import useContainerStatus from '../hooks/useContainerStatus';
import { getAppConfig } from '../app-loader';
import {
  FileText,
  Home,
  Settings,
  Tag,
  Users,
  BarChart,
  Folder,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFluidLayout = useContainerStatus();
  const appConfig = getAppConfig();
  const searchParams = useSearchParams();
  const { setBreadcrumbs } = useBreadcrumb();
  
  // Get view from URL parameters
  const view = searchParams.get('view') || 'dashboard';
  const itemId = searchParams.get('id');
  
  // Set the active tab based on the URL
  const [activeTab, setActiveTab] = useState(view);
  
  // Update breadcrumb when view changes
  useEffect(() => {
    const breadcrumbConfig: BreadcrumbItem[] = [];
    
    breadcrumbConfig.push({
      label: 'Blogs',
      href: '/dashboard/apps/blogs?view=dashboard'
    });
    
    if (view === 'posts') {
      breadcrumbConfig.push({
        label: 'Posts',
        href: '/dashboard/apps/blogs?view=posts'
      });
    } else if (view === 'categories') {
      breadcrumbConfig.push({
        label: 'Categories',
        href: '/dashboard/apps/blogs?view=categories'
      });
    } else if (view === 'tags') {
      breadcrumbConfig.push({
        label: 'Tags',
        href: '/dashboard/apps/blogs?view=tags'
      });
    } else if (view === 'authors') {
      breadcrumbConfig.push({
        label: 'Authors',
        href: '/dashboard/apps/blogs?view=authors'
      });
    } else if (view === 'analytics') {
      breadcrumbConfig.push({
        label: 'Analytics',
        href: '/dashboard/apps/blogs?view=analytics'
      });
    } else if (view === 'settings') {
      breadcrumbConfig.push({
        label: 'Settings',
        href: '/dashboard/apps/blogs?view=settings'
      });
    } else if (view === 'detail' && itemId) {
      breadcrumbConfig.push({
        label: 'Posts',
        href: '/dashboard/apps/blogs?view=posts'
      });
      breadcrumbConfig.push({
        label: itemId === 'new' ? 'New Post' : 'Post Details',
        href: `/dashboard/apps/blogs?view=detail&id=${itemId}`
      });
    }
    
    setBreadcrumbs(breadcrumbConfig);
  }, [view, itemId, setBreadcrumbs]);
  
  // Update active tab when URL changes
  useEffect(() => {
    // Only update if it's a main view (not detail)
    if (view !== 'detail') {
      setActiveTab(view);
    }
  }, [view]);
  
  // Handle tab click
  const handleTabClick = (value: string) => {
    setActiveTab(value);
    
    // Create the URL for the selected tab
    window.history.pushState(
      {},
      '',
      `/dashboard/apps/blogs?view=${value}`
    );
    
    // Dispatch a custom event for navigation
    const event = new CustomEvent('mixcore:navigation:change', { 
      detail: { view: value, source: 'tabs' } 
    });
    window.dispatchEvent(event);
    
    // Also simulate popstate for backward compatibility
    window.dispatchEvent(new Event('popstate'));
  };
  
  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { id: 'posts', label: 'Posts', icon: <FileText className="h-4 w-4" /> },
    { id: 'categories', label: 'Categories', icon: <Folder className="h-4 w-4" /> },
    { id: 'tags', label: 'Tags', icon: <Tag className="h-4 w-4" /> },
    { id: 'authors', label: 'Authors', icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ];
  
  // Determine shell classes
  const containerClass = isFluidLayout
    ? 'p-0 w-full'
    : 'container p-4 md:p-6 max-w-7xl mx-auto';
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* App header */}
      <div className="border-b bg-background p-2 sticky top-0 z-10">
        <div className="px-2 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">{appConfig.displayName}</h1>
            <p className="text-sm text-muted-foreground">{appConfig.description}</p>
          </div>
          
          {/* Hide the top navigation in detail view to save space */}
          {view !== 'detail' && (
            <Tabs
              value={activeTab}
              className="w-auto sm:block hidden"
              onValueChange={handleTabClick}
            >
              <TabsList>
                {navItems.map((item) => (
                  <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-1">
                    {item.icon}
                    <span>{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation on small screens and non-detail view */}
        {view !== 'detail' && (
          <div className="w-[200px] sm:hidden border-r flex-shrink-0">
            <ScrollArea className="h-full">
              <div className="py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                    Navigation
                  </h2>
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleTabClick(item.id)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                        {activeTab === item.id && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className={containerClass}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShell; 
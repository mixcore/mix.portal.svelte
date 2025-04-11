'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useContainerStatus from '../hooks/useContainerStatus';
import { getAppConfig } from '../app-loader';
import { useBreadcrumb } from '../hooks/useBreadcrumb';
import { 
  LayoutDashboard, 
  FileIcon, 
  Eye, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Share, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Save, 
  Printer, 
  Undo, 
  Redo, 
  Link, 
  CheckCircle, 
  Clock, 
  Kanban, 
  CalendarDays, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeView?: 'projects' | 'tasks' | 'gantt' | 'calendar' | 'board';
  onViewChange?: (view: 'projects' | 'tasks' | 'gantt' | 'calendar' | 'board') => void;
  selectedProjectId?: string | null;
  selectedProjectTitle?: string | null;
}

export function AppShell({ 
  children, 
  activeView = 'projects', 
  onViewChange,
  selectedProjectId,
  selectedProjectTitle
}: AppShellProps) {
  const isFluidLayout = useContainerStatus();
  const [activeRibbonTab, setActiveRibbonTab] = useState('file');
  const [appHeight, setAppHeight] = useState(0);
  const appConfig = getAppConfig();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shareTooltip, setShareTooltip] = useState('');
  const { setBreadcrumbs } = useBreadcrumb();
  
  // Set app context for the dashboard header
  useEffect(() => {
    // Define context info for the header
    const appContextInfo = {
      id: 'projects',
      name: 'Projects',
      icon: 'layout-dashboard'
    };
    
    // Dispatch event to update the dashboard context
    const event = new CustomEvent('mixcore:context:set', { 
      detail: { context: appContextInfo } 
    });
    window.dispatchEvent(event);
    
    return () => {
      // Reset context when unmounting
      const resetEvent = new CustomEvent('mixcore:context:reset');
      window.dispatchEvent(resetEvent);
    };
  }, []);
  
  // Update breadcrumbs when view or project changes
  useEffect(() => {
    const breadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Apps', href: '/dashboard/apps' },
      { label: 'Projects', href: '/dashboard/apps/projects' }
    ];

    if (activeView !== 'projects') {
      // Add view-specific breadcrumb
      const viewLabel = activeView.charAt(0).toUpperCase() + activeView.slice(1);
      const viewPath = `/dashboard/apps/projects?view=${activeView}`;
      breadcrumbs.push({ label: viewLabel, href: viewPath });
    }

    if (selectedProjectId && selectedProjectTitle && activeView === 'tasks') {
      // Add project-specific breadcrumb
      const projectPath = `/dashboard/apps/projects?view=tasks&projectId=${selectedProjectId}`;
      breadcrumbs.push({ label: selectedProjectTitle, href: projectPath });
    }

    // Create a contextual indicator that would normally appear in the breadcrumb-style path indicator
    const contextualInfo = {
      icon: activeView === 'projects' ? 'layout-dashboard' : 
            activeView === 'tasks' ? 'check-square' : 
            activeView === 'gantt' ? 'bar-chart-3' : 
            activeView === 'board' ? 'kanban' : 'calendar-days',
      viewLabel: activeView === 'projects' ? 'Projects' : 
                activeView === 'tasks' ? 'Tasks' : 
                activeView === 'gantt' ? 'Timeline' : 
                activeView === 'board' ? 'Board' : 'Calendar',
      projectTitle: selectedProjectTitle
    };

    // Update the dashboard context with view information
    const appContextInfo = {
      id: 'projects',
      name: 'Projects',
      icon: 'layout-dashboard',
      contextualInfo: contextualInfo
    };
    
    // Dispatch event to update the dashboard context with contextual information
    const contextEvent = new CustomEvent('mixcore:context:set', { 
      detail: { context: appContextInfo } 
    });
    window.dispatchEvent(contextEvent);

    // Update the dashboard breadcrumbs
    setBreadcrumbs(breadcrumbs);
  }, [activeView, selectedProjectId, selectedProjectTitle, setBreadcrumbs]);
  
  const handleViewChange = (view: 'projects' | 'tasks' | 'gantt' | 'calendar' | 'board') => {
    if (onViewChange) {
      onViewChange(view);
    }
  };
  
  // Toggle container class on parent dashboard layout
  const toggleContainerClass = () => {
    const dashboardContent = document.querySelector('.dashboard-content');
    const mainContent = document.querySelector('main.flex-1');
    
    if (dashboardContent) {
      if (isFluidLayout) {
        // Switch to contained view
        dashboardContent.classList.add('container', 'mx-auto', 'max-w-7xl', 'p-4', 'md:p-6');
        if (mainContent) {
          mainContent.classList.add('overflow-auto');
          mainContent.classList.remove('overflow-hidden');
          mainContent.setAttribute('data-app-view', 'default');
        }
      } else {
        // Switch to fluid view
        dashboardContent.classList.remove('container', 'mx-auto', 'max-w-7xl', 'p-4', 'md:p-6');
        if (mainContent) {
          mainContent.classList.remove('overflow-auto');
          mainContent.classList.add('overflow-hidden');
          mainContent.setAttribute('data-app-view', 'projects-app');
        }
      }
    }
  };
  
  // Calculate and set the app height dynamically
  const calculateAppHeight = () => {
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
      const mainHeight = mainContent.clientHeight;
      // Subtract header height (ribbon + tabs - around 114px)
      const availableHeight = mainHeight - 114;
      setAppHeight(Math.max(availableHeight, 300)); // Set minimum height
    }
  };
  
  // Set initial layout when component mounts or activeView changes
  useEffect(() => {
    // Get full-screen setting from config
    const shouldUseFullScreen = appConfig.settings.enableFullScreenByDefault;
    const shouldUseFluidLayout = appConfig.ui.layout.fluid;
    
    // Enable full width if configured to use fluid layout by default
    if ((activeView === 'gantt' || shouldUseFullScreen || shouldUseFluidLayout) && !isFluidLayout) {
      toggleContainerClass();
    }
    
    // Set attribute on main content to help with styling
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent && !isFluidLayout) {
      mainContent.setAttribute('data-app-view', 'default');
    } else if (mainContent && isFluidLayout) {
      mainContent.setAttribute('data-app-view', 'projects-app');
    }
    
    // Calculate initial height
    calculateAppHeight();
    
    // Add resize listener
    window.addEventListener('resize', calculateAppHeight);
    
    return () => {
      window.removeEventListener('resize', calculateAppHeight);
    };
  }, [activeView, isFluidLayout]);
  
  // Generate deep link for current state
  const getDeepLink = (): string => {
    // Create a new URLSearchParams with the current parameters
    const params = new URLSearchParams(searchParams.toString());
    
    // Always include the current view
    params.set('view', activeView);
    
    // Include projectId if we're in tasks view
    const projectId = params.get('projectId');
    if (activeView !== 'tasks' && projectId) {
      params.delete('projectId');
    }
    
    // Build the full URL
    return `${window.location.origin}${pathname}?${params.toString()}`;
  };
  
  // Copy current URL to clipboard
  const copyDeepLink = () => {
    const url = getDeepLink();
    navigator.clipboard.writeText(url).then(
      () => {
        setShareTooltip('Link copied!');
        setTimeout(() => setShareTooltip(''), 2000);
      },
      () => {
        setShareTooltip('Failed to copy');
        setTimeout(() => setShareTooltip(''), 2000);
      }
    );
  };
  
  return (
    <div className={`projects-app-shell flex flex-col ${isFluidLayout ? 'h-full overflow-hidden' : ''}`}>
      {/* Shadcn-style app header with minimal, elegant design */}
      <div className="projects-app-header bg-background flex flex-col border-b">
        {/* Title bar with app name and controls - hidden on larger screens as it appears in the dashboard header */}
        <div className="md:hidden flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <LayoutDashboard className="mr-2 text-primary h-5 w-5" />
            <h1 className="text-lg font-medium">Mixcore Projects</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="text-xs px-3 py-1.5 rounded-md flex items-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={copyDeepLink}
            >
              <Share className="h-4 w-4 mr-1.5" />
              Share
            </button>
            <button 
              className={`text-xs px-3 py-1.5 rounded-md flex items-center transition-colors ${isFluidLayout ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
              onClick={toggleContainerClass}
            >
              {isFluidLayout ? <Minimize2 className="h-4 w-4 mr-1.5" /> : <Maximize2 className="h-4 w-4 mr-1.5" />}
              {isFluidLayout ? 'Normal' : 'Full'}
            </button>
          </div>
        </div>
        
        {/* Shadcn-style horizontal menu with minimal design */}
        <div className="flex items-center h-10 px-1">
          {/* App icon */}
          <div className="flex items-center justify-center px-3 h-full">
            <LayoutDashboard className="text-primary h-5 w-5" />
          </div>
          
          {/* Main menu items */}
          <div className="flex h-full">
            <button 
              className={`px-3 h-full flex items-center text-sm transition-colors rounded-md mx-0.5 ${activeRibbonTab === 'file' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => setActiveRibbonTab('file')}
            >
              File
            </button>
            <button 
              className={`px-3 h-full flex items-center text-sm transition-colors rounded-md mx-0.5 ${activeRibbonTab === 'view' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => setActiveRibbonTab('view')}
            >
              View
            </button>
            <button 
              className={`px-3 h-full flex items-center text-sm transition-colors rounded-md mx-0.5 ${activeRibbonTab === 'task' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => setActiveRibbonTab('task')}
            >
              Task
            </button>
            <button 
              className={`px-3 h-full flex items-center text-sm transition-colors rounded-md mx-0.5 ${activeRibbonTab === 'resource' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => setActiveRibbonTab('resource')}
            >
              Resource
            </button>
            <button 
              className={`px-3 h-full flex items-center text-sm transition-colors rounded-md mx-0.5 ${activeRibbonTab === 'report' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
              onClick={() => setActiveRibbonTab('report')}
            >
              Report
            </button>
          </div>
          
          {/* Right-aligned actions */}
          <div className="ml-auto flex items-center h-full">
            <button 
              className="px-3 h-8 flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors rounded-md mx-0.5"
              onClick={copyDeepLink}
            >
              <Link className="h-4 w-4 mr-1.5" />
              Share
            </button>
            <button 
              className="px-3 h-8 flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors rounded-md mx-0.5"
              onClick={toggleContainerClass}
            >
              {isFluidLayout ? <Minimize2 className="h-4 w-4 mr-1.5" /> : <Maximize2 className="h-4 w-4 mr-1.5" />}
              {isFluidLayout ? 'Normal' : 'Full Width'}
            </button>
          </div>
        </div>
        
        {/* Submenu with shadcn styling for each tab */}
        <div className="py-2 px-4 bg-muted/30">
          {activeRibbonTab === 'file' && (
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Print
              </button>
              <div className="h-4 border-r border-muted-foreground/20 mx-2"></div>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Undo className="h-3.5 w-3.5 mr-1.5" />
                Undo
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Redo className="h-3.5 w-3.5 mr-1.5" />
                Redo
              </button>
            </div>
          )}
          
          {activeRibbonTab === 'task' && (
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Task
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Link className="h-3.5 w-3.5 mr-1.5" />
                Link
              </button>
              <div className="h-4 border-r border-muted-foreground/20 mx-2"></div>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Mark Complete
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Reschedule
              </button>
            </div>
          )}
          
          {activeRibbonTab === 'view' && (
            <div className="flex items-center gap-2">
              <div className="flex bg-background rounded-md shadow-sm border">
                <button 
                  className={`px-2.5 py-1 text-xs flex items-center rounded-sm transition-colors ${activeView === 'projects' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  onClick={() => handleViewChange('projects')}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                  Projects
                </button>
                <button 
                  className={`px-2.5 py-1 text-xs flex items-center rounded-sm transition-colors ${activeView === 'tasks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  onClick={() => handleViewChange('tasks')}
                >
                  <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                  Tasks
                </button>
                <button 
                  className={`px-2.5 py-1 text-xs flex items-center rounded-sm transition-colors ${activeView === 'gantt' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  onClick={() => handleViewChange('gantt')}
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Gantt
                </button>
                <button 
                  className={`px-2.5 py-1 text-xs flex items-center rounded-sm transition-colors ${activeView === 'board' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  onClick={() => handleViewChange('board')}
                >
                  <Kanban className="h-3.5 w-3.5 mr-1.5" />
                  Board
                </button>
                <button 
                  className={`px-2.5 py-1 text-xs flex items-center rounded-sm transition-colors ${activeView === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  onClick={() => handleViewChange('calendar')}
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  Calendar
                </button>
              </div>
              <div className="h-4 border-r border-muted-foreground/20 mx-2"></div>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <ZoomIn className="h-3.5 w-3.5 mr-1.5" />
                Zoom In
              </button>
              <button className="px-2.5 py-1 text-xs rounded-md flex items-center hover:bg-accent transition-colors">
                <ZoomOut className="h-3.5 w-3.5 mr-1.5" />
                Zoom Out
              </button>
            </div>
          )}
          
          {(activeRibbonTab === 'resource' || activeRibbonTab === 'report') && (
            <div className="text-xs text-muted-foreground italic">
              Features coming soon...
            </div>
          )}
        </div>
      </div>
      
      {/* App content area with dynamic height calculation */}
      <div 
        className={`projects-app-content ${isFluidLayout ? 'overflow-hidden' : 'flex-1 overflow-auto'}`}
        style={isFluidLayout ? { height: 'calc(100vh - 114px)' } : { height: appHeight ? `${appHeight}px` : 'auto' }}
      >
        {children}
      </div>
    </div>
  );
}

export default AppShell; 
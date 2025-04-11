'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import AppShell from './layouts/AppShell';
import ProjectList from './components/ProjectList';
import Task from './components/Task';
import GanttView from './components/GanttView';
import { mockProjects, mockTasks, mockGanttTasks, ganttStartDate, ganttEndDate } from './lib/mockData';
import useContainerStatus from './hooks/useContainerStatus';
import './app-globals.css'; // Import app-specific styles
import { initializeApp, getAppConfig } from './app-loader';
import { ProjectData } from './lib/types';
import { Project } from './components/ProjectItem';

type ViewType = 'projects' | 'tasks' | 'gantt' | 'calendar' | 'board';

export interface ProjectsAppProps {
  // Define app-specific props
}

export function ProjectsApp(props: ProjectsAppProps) {
  // Router and URL parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get view and project ID from URL parameters
  const viewParam = searchParams.get('view') as ViewType | null;
  const projectIdParam = searchParams.get('projectId');
  
  // Get app config
  const appConfig = getAppConfig();
  
  // Set initial view based on URL parameter or config
  const getInitialView = (): ViewType => {
    if (viewParam && ['projects', 'tasks', 'gantt', 'calendar', 'board'].includes(viewParam)) {
      return viewParam as ViewType;
    }
    return appConfig.settings.enableFullScreenByDefault ? 'gantt' : 'projects';
  };
  
  const [activeView, setActiveView] = useState<ViewType>(getInitialView());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectIdParam || null);
  const isFluidLayout = useContainerStatus();
  const [isInitialized, setIsInitialized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get selected project information from the mockProjects array by ID
  const selectedProject = selectedProjectId 
    ? mockProjects.find(p => p.id === selectedProjectId) 
    : null;
  
  // Get the title of the selected project for breadcrumbs
  const selectedProjectTitle = selectedProject ? selectedProject.title : null;
  
  // Convert the Project type to ProjectData type for the ProjectList component
  const projectsForList: ProjectData[] = mockProjects.map(project => ({
    id: project.id,
    name: project.title,
    description: project.description,
    startDate: project.createdAt,
    dueDate: project.dueDate || '',
    progress: 50, // Default progress or calculate from tasks if available
    status: project.status,
    members: project.collaborators.map(c => c.name),
    tasksCount: {
      total: 10, // Default count or get from tasks if available
      completed: 5  // Default count or get from tasks if available
    }
  }));
  
  // Update URL when view or project changes
  useEffect(() => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());
    
    // Set the view parameter
    params.set('view', activeView);
    
    // Set or remove projectId parameter
    if (selectedProjectId && activeView === 'tasks') {
      params.set('projectId', selectedProjectId);
    } else {
      params.delete('projectId');
    }
    
    // Update the URL without triggering navigation
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeView, selectedProjectId, pathname]);
  
  // Sync with URL parameters when they change
  useEffect(() => {
    if (viewParam && viewParam !== activeView) {
      setActiveView(viewParam as ViewType);
    }
    
    if (projectIdParam !== selectedProjectId) {
      setSelectedProjectId(projectIdParam);
      
      // If project ID is set but view isn't tasks, update view
      if (projectIdParam && activeView !== 'tasks') {
        setActiveView('tasks');
      }
    }
  }, [viewParam, projectIdParam]);
  
  // Initialize app if needed
  useEffect(() => {
    const appInitKey = 'mixcore_projects_initialized';
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
  }, [isLoading]);
  
  // Handle project selection
  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView('tasks');
    
    // Update URL (will be handled by the effect)
  };
  
  // Handle view change
  const handleViewChange = (viewType: ViewType) => {
    setActiveView(viewType);
    
    // If changing away from tasks view, clear selected project
    if (viewType !== 'tasks') {
      setSelectedProjectId(null);
    }
    
    // Update URL (will be handled by the effect)
  };
  
  // Set body class for fluid layout when this app is active
  useEffect(() => {
    const body = document.body;
    const shouldUseFluidLayout = appConfig.ui.layout.fluid || isFluidLayout;
    
    if (shouldUseFluidLayout) {
      body.classList.add('projects-app-active');
    } else {
      body.classList.remove('projects-app-active');
    }
    
    return () => {
      body.classList.remove('projects-app-active');
    };
  }, [isFluidLayout, appConfig.ui.layout.fluid]);
  
  // Handle retry initialization
  const handleRetryInitialization = () => {
    localStorage.removeItem('mixcore_projects_initialized');
    setIsLoading(true);
    setIsInitialized(true);
  };
  
  // Generate deep link for current view
  const getDeepLink = (view: ViewType, projectId?: string): string => {
    const baseUrl = pathname;
    const params = new URLSearchParams();
    
    params.set('view', view);
    if (projectId && view === 'tasks') {
      params.set('projectId', projectId);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Show loading state while app is initializing
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Initializing Projects app...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if initialization failed
  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <span className="material-icons-outlined text-4xl">error_outline</span>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Initialization Error</h3>
          <p className="text-gray-600 mb-4">
            Failed to initialize the Projects app. This could be because the API endpoints are not yet available.
            {process.env.NODE_ENV === 'development' && (
              <span className="block mt-2 text-sm">
                Note: In development mode, we're simulating initialization. The actual API endpoints will be implemented soon.
              </span>
            )}
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleRetryInitialization}
          >
            Retry
          </button>
          {process.env.NODE_ENV === 'development' && (
            <button 
              className="px-4 py-2 ml-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                localStorage.setItem('mixcore_projects_initialized', 'true');
                setIsInitialized(true);
              }}
            >
              Continue Anyway
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Render the currently selected view
  const renderView = () => {
    switch (activeView) {
      case 'projects':
        return (
          <div className="projects-view h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="text-xl font-semibold text-foreground">All Projects</h2>
              <div className="flex items-center space-x-2">
                <button
                  className="text-muted-foreground hover:bg-muted p-1 rounded"
                  title="Copy Deep Link"
                  onClick={() => {
                    const deepLink = window.location.origin + getDeepLink('projects');
                    navigator.clipboard.writeText(deepLink);
                    // Could add a toast notification here
                  }}
                >
                  <span className="material-icons-outlined text-sm">link</span>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center px-6 mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {mockProjects.length} projects
              </div>
              <div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 flex items-center">
                  <span className="material-icons-outlined text-sm mr-1">add</span>
                  New Project
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto px-0">
              <ProjectList 
                projects={projectsForList}
                onProjectClick={handleProjectClick} 
              />
            </div>
          </div>
        );
        
      case 'tasks':
        return (
          <div className="tasks-view h-full overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button 
                    className="text-primary mr-2" 
                    onClick={() => handleViewChange('projects')}
                  >
                    <span className="material-icons-outlined">arrow_back</span>
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">{selectedProject?.title || 'Project Tasks'}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-muted-foreground hover:bg-muted p-1 rounded"
                    title="Copy Deep Link"
                    onClick={() => {
                      const deepLink = window.location.origin + getDeepLink('tasks', selectedProjectId || undefined);
                      navigator.clipboard.writeText(deepLink);
                      // Could add a toast notification here
                    }}
                  >
                    <span className="material-icons-outlined text-sm">link</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-muted-foreground">
                  {mockTasks.length} tasks · Due {selectedProject?.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 flex items-center">
                    <span className="material-icons-outlined text-sm mr-1">add_task</span>
                    Add Task
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="bg-card shadow overflow-hidden mx-6 border rounded-md">
                <div className="px-4 py-2 bg-muted/50 border-b text-sm font-medium text-muted-foreground flex justify-between">
                  <span>Task</span>
                  <span>Details</span>
                </div>
                <div className="task-list divide-y divide-border">
                  {mockTasks.map(task => (
                    <Task key={task.id} {...task} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'gantt':
        return (
          <div className="gantt-view-container h-full overflow-hidden">
            <div className="bg-card h-full overflow-hidden">
              <GanttView 
                tasks={mockGanttTasks}
                startDate={ganttStartDate}
                endDate={ganttEndDate}
              />
            </div>
          </div>
        );
        
      case 'board':
        return (
          <div className="board-view h-full overflow-hidden flex flex-col">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Task Board</h2>
              <div className="flex items-center space-x-2">
                <button
                  className="text-muted-foreground hover:bg-muted p-1 rounded"
                  title="Copy Deep Link"
                  onClick={() => {
                    const deepLink = window.location.origin + getDeepLink('board');
                    navigator.clipboard.writeText(deepLink);
                    // Could add a toast notification here
                  }}
                >
                  <span className="material-icons-outlined text-sm">link</span>
                </button>
                <button className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90 flex items-center">
                  <span className="material-icons-outlined text-sm mr-1">add</span>
                  New Task
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="flex gap-4 overflow-x-auto pb-4 px-6 h-full">
                {/* Not Started column */}
                <div className="board-column min-w-[320px] bg-card rounded-lg shadow border max-h-full flex flex-col">
                  <div className="p-3 bg-muted/50 border-b font-medium sticky top-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-secondary rounded-full mr-2"></span>
                      <span className="text-foreground">Not Started</span>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {mockTasks.filter(task => task.status === 'notStarted').length}
                    </span>
                  </div>
                  <div className="p-2 overflow-auto flex-1">
                    {mockTasks.filter(task => task.status === 'notStarted').map(task => (
                      <div key={task.id} className="bg-card p-3 mb-2 rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="font-medium mb-2 flex items-center text-foreground">
                          {task.name}
                          {task.priority === 'high' && <span className="ml-2 text-red-500 dark:text-red-400 material-icons-outlined text-sm">priority_high</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 flex items-center">
                          <span className="material-icons-outlined text-xs mr-1">event</span>
                          {task.dueDate}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300' : 
                            task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300' : 
                            'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          {task.assignedTo && (
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {task.assignedTo.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* In Progress column */}
                <div className="board-column min-w-[320px] bg-card rounded-lg shadow border max-h-full flex flex-col">
                  <div className="p-3 bg-blue-100 dark:bg-blue-950/50 border-b font-medium text-blue-800 dark:text-blue-300 sticky top-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></span>
                      <span>In Progress</span>
                    </div>
                    <span className="text-xs text-blue-700 dark:text-blue-300 px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded">
                      {mockTasks.filter(task => task.status === 'inProgress').length}
                    </span>
                  </div>
                  <div className="p-2 overflow-auto flex-1">
                    {mockTasks.filter(task => task.status === 'inProgress').map(task => (
                      <div key={task.id} className="bg-card p-3 mb-2 rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="font-medium mb-2 flex items-center text-foreground">
                          {task.name}
                          {task.priority === 'high' && <span className="ml-2 text-red-500 dark:text-red-400 material-icons-outlined text-sm">priority_high</span>}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 flex items-center">
                          <span className="material-icons-outlined text-xs mr-1">event</span>
                          {task.dueDate}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {task.progress}% complete
                          </div>
                          {task.assignedTo && (
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                              {task.assignedTo.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Completed column */}
                <div className="board-column min-w-[320px] bg-card rounded-lg shadow border max-h-full flex flex-col">
                  <div className="p-3 bg-green-100 dark:bg-green-950/50 border-b font-medium text-green-800 dark:text-green-300 sticky top-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-500 dark:bg-green-400 rounded-full mr-2"></span>
                      <span>Completed</span>
                    </div>
                    <span className="text-xs text-green-700 dark:text-green-300 px-2 py-1 bg-green-100/50 dark:bg-green-900/30 rounded">
                      {mockTasks.filter(task => task.status === 'completed').length}
                    </span>
                  </div>
                  <div className="p-2 overflow-auto flex-1">
                    {mockTasks.filter(task => task.status === 'completed').map(task => (
                      <div key={task.id} className="bg-card p-3 mb-2 rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-80">
                        <div className="font-medium mb-2 flex items-center line-through text-gray-500">
                          {task.name}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 flex items-center">
                          <span className="material-icons-outlined text-xs mr-1">event</span>
                          {task.dueDate}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">
                            100% Complete
                          </span>
                          {task.assignedTo && (
                            <div className="h-6 w-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                              {task.assignedTo.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="calendar-view h-full overflow-hidden flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Calendar View</h2>
              <div className="flex items-center space-x-2">
                <button
                  className="text-muted-foreground hover:bg-muted p-1 rounded"
                  title="Copy Deep Link"
                  onClick={() => {
                    const deepLink = window.location.origin + getDeepLink('calendar');
                    navigator.clipboard.writeText(deepLink);
                    // Could add a toast notification here
                  }}
                >
                  <span className="material-icons-outlined text-sm">link</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button className="border bg-card p-1 rounded hover:bg-muted">
                    <span className="material-icons-outlined text-muted-foreground">chevron_left</span>
                  </button>
                  <span className="text-sm font-medium text-foreground">October 2023</span>
                  <button className="border bg-card p-1 rounded hover:bg-muted">
                    <span className="material-icons-outlined text-muted-foreground">chevron_right</span>
                  </button>
                  <button className="border bg-card px-3 py-1 rounded text-sm hover:bg-muted ml-2 text-foreground">
                    Today
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 px-6 pb-6 overflow-auto">
              <div className="bg-card rounded-lg shadow border h-full p-4 flex flex-col">
                <div className="grid grid-cols-7 gap-px bg-muted/90">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-muted/50 font-medium text-sm p-2 text-center text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-muted/90">
                  {Array.from({ length: 35 }).map((_, i) => {
                    // Simplified calendar logic
                    const dayNum = i - 6; // Offset for the month
                    const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                    const isToday = dayNum === 15; // Just for demonstration
                    
                    return (
                      <div 
                        key={i} 
                        className={`bg-card p-1 ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}
                      >
                        <div className="text-xs p-1">{isCurrentMonth ? dayNum : (dayNum <= 0 ? 30 + dayNum : dayNum - 31)}</div>
                        {/* Task indicators for demo */}
                        {isCurrentMonth && dayNum >= 10 && dayNum <= 20 && i % 3 === 0 && (
                          <div className="text-xs p-1 bg-blue-100/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded mt-1 truncate">
                            <div className="font-medium text-blue-800 dark:text-blue-300">Task {dayNum}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <AppShell
      activeView={activeView}
      onViewChange={handleViewChange}
      selectedProjectId={selectedProjectId}
      selectedProjectTitle={selectedProjectTitle}
    >
      <div className="projects-app-main h-full">
        {renderView()}
      </div>
    </AppShell>
  );
}

// Default export for dynamic import
export default ProjectsApp; 
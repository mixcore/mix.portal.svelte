'use client';

import React, { useState, useEffect, useRef } from 'react';
import useContainerStatus from '../hooks/useContainerStatus';
import { getAppConfig } from '../app-loader';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Maximize, 
  Minimize, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Link2, 
  Download, 
  FlipVertical
} from 'lucide-react';

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
  assignedTo?: string;
  isMilestone?: boolean;
  isCritical?: boolean;
}

interface GanttViewProps {
  tasks: GanttTask[];
  startDate: Date;
  endDate: Date;
}

const VIEW_MODES = ['Day', 'Week', 'Month'] as const;
type ViewMode = typeof VIEW_MODES[number];

export function GanttView({ tasks, startDate, endDate }: GanttViewProps) {
  const appConfig = getAppConfig();
  const defaultViewMode = appConfig.settings.ganttDefaultView as ViewMode || 'Day';
  
  // Get default fullscreen setting from config
  const defaultFullScreen = appConfig.settings.enableFullScreenByDefault || false;
  
  const [isFullScreen, setIsFullScreen] = useState(defaultFullScreen);
  const [zoomLevel, setZoomLevel] = useState(100); // Percentage zoom
  const isFluidLayout = useContainerStatus();
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [showDependencies, setShowDependencies] = useState(true);
  const [splitView, setSplitView] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the total number of days in the view
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate array of dates for header
  const dateRange = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Helper to format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Generate week ranges for week mode
  const weekRanges = dateRange.reduce((acc: {start: Date, end: Date}[], date, index) => {
    if (index === 0 || date.getDay() === 0) { // Sunday or first day
      acc.push({ start: date, end: new Date(date) });
    } else {
      acc[acc.length - 1].end = date;
    }
    return acc;
  }, []);
  
  // Generate month ranges
  const monthRanges = dateRange.reduce((acc: {month: string, days: number}[], date) => {
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existingMonth = acc.find(m => m.month === monthYear);
    
    if (existingMonth) {
      existingMonth.days += 1;
    } else {
      acc.push({ month: monthYear, days: 1 });
    }
    
    return acc;
  }, []);
  
  // Helper to calculate position and width for task bars
  const getTaskBarStyles = (task: GanttTask) => {
    const taskStartDiff = Math.max(0, (task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const taskDuration = Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      left: `${(taskStartDiff / totalDays) * 100}%`,
      width: `${(taskDuration / totalDays) * 100}%`,
    };
  };
  
  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  // Handle zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    setZoomLevel(prev => {
      const newZoom = zoomIn ? prev + 10 : prev - 10;
      return Math.min(Math.max(newZoom, 50), 200); // Limit zoom between 50% and 200%
    });
  };
  
  // Calculate and update the container height
  const updateContainerHeight = () => {
    if (ganttContainerRef.current) {
      const parent = ganttContainerRef.current.parentElement;
      if (parent) {
        // Consider the toolbar height (~50px) when calculating available height
        const availableHeight = parent.clientHeight - 50;
        setContainerHeight(Math.max(availableHeight, 200)); // Set minimum height
      }
    }
  };
  
  // Draw dependency lines
  const renderDependencyLines = () => {
    if (!showDependencies) return null;
    
    return tasks.map(task => {
      if (!task.dependencies?.length) return null;
      
      return task.dependencies.map(depId => {
        const dependencyTask = tasks.find(t => t.id === depId);
        if (!dependencyTask) return null;
        
        // Find task positions
        const sourceTaskStyle = getTaskBarStyles(dependencyTask);
        const targetTaskStyle = getTaskBarStyles(task);
        
        // Calculate source and target points for the arrow
        const sourceRight = parseFloat(sourceTaskStyle.left) + parseFloat(sourceTaskStyle.width);
        const targetLeft = parseFloat(targetTaskStyle.left);
        
        if (sourceRight >= targetLeft) return null; // Ignore invalid dependencies
        
        // Draw an SVG path
        const path = `M${sourceRight}% 50% L${targetLeft}% 50%`;
        
        return (
          <svg 
            key={`${depId}-${task.id}`} 
            className="absolute inset-0 pointer-events-none" 
            style={{ zIndex: 1 }}
          >
            <path 
              d={path} 
              stroke={task.isCritical ? "red" : "#999"} 
              strokeWidth="1" 
              strokeDasharray={task.isCritical ? "0" : "4 2"} 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={task.isCritical ? "red" : "#999"} />
              </marker>
            </defs>
          </svg>
        );
      });
    });
  };
  
  // Apply fullscreen effect and handle resize
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    
    const handleResize = () => {
      updateContainerHeight();
    };
    
    document.addEventListener('keydown', handleEsc);
    window.addEventListener('resize', handleResize);
    
    // Apply body styles when fullscreen
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Initial height calculation
    updateContainerHeight();
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);
  
  // Update container height when layout mode changes
  useEffect(() => {
    updateContainerHeight();
  }, [isFluidLayout]);
  
  // Update container when full-width default changes
  useEffect(() => {
    // Set isFullScreen based on config the first time
    if (defaultFullScreen && !isFullScreen) {
      setIsFullScreen(true);
    }
    updateContainerHeight();
  }, []);
  
  // Render task row
  const renderTaskRow = (task: GanttTask) => {
    const barStyles = getTaskBarStyles(task);
    const barClasses = task.isMilestone 
      ? "absolute top-3 h-4 w-4 bg-purple-600 dark:bg-purple-500 rotate-45 transform -translate-x-2 -translate-y-2" 
      : task.isCritical && showCriticalPath
        ? "absolute top-1 h-8 bg-red-500 dark:bg-red-600 rounded opacity-90 task-bar"
        : "absolute top-1 h-8 bg-blue-500 dark:bg-blue-600 rounded opacity-90 task-bar";
    
    return (
      <div key={task.id} className="task-row flex border-b hover:bg-accent/10">
        {/* Task details area */}
        <div className="task-name-column w-96 min-w-96 flex-shrink-0 p-2 border-r flex items-center">
          <div className="flex items-center w-full">
            <div className="w-5 flex justify-center mr-1">
              {task.isMilestone ? (
                <span className="material-icons-outlined text-purple-600 dark:text-purple-500 text-sm">diamond</span>
              ) : (
                <span className="w-3 h-3 block rounded-sm border border-muted-foreground"></span>
              )}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div className={`truncate ${task.isCritical && showCriticalPath ? 'text-red-600 dark:text-red-400 font-medium' : 'text-foreground'}`}>
                {task.name}
              </div>
              <div className="flex items-center space-x-1">
                {task.assignedTo && (
                  <div className="h-5 w-5 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {task.assignedTo.slice(0, 2).toUpperCase()}
                  </div>
                )}
                {task.dependencies?.length ? (
                  <span className="material-icons-outlined text-muted-foreground text-sm">link</span>
                ) : null}
                {task.isCritical && (
                  <span className="material-icons-outlined text-red-500 dark:text-red-400 text-sm" title="Critical Path">priority_high</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline area */}
        <div className="timeline-column flex-grow relative h-10">
          {/* Timeline background */}
          <div className="absolute inset-0 flex">
            {dateRange.map((date, index) => (
              <div 
                key={index} 
                className={`flex-1 border-r ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/80' : 'bg-card'}`}
              />
            ))}
          </div>
          
          {/* Timeline grid lines for weeks or months */}
          {viewMode === 'Week' && weekRanges.map((week, i) => {
            const startIdx = dateRange.findIndex(d => d.getTime() === week.start.getTime());
            const weekWidth = ((week.end.getTime() - week.start.getTime()) / (1000 * 60 * 60 * 24) + 1) / totalDays * 100;
            
            return (
              <div 
                key={`week-${i}`} 
                className="absolute h-full border-l border-border"
                style={{
                  left: `${(startIdx / totalDays) * 100}%`,
                  width: `${weekWidth}%`,
                  borderRight: i === weekRanges.length - 1 ? '1px solid var(--border)' : 'none'
                }}
              />
            );
          })}
          
          {/* Task visualization */}
          {task.isMilestone ? (
            <div 
              className={barClasses}
              style={{ left: barStyles.left }}
            />
          ) : (
            <div 
              className={barClasses}
              style={barStyles}
            >
              <div className="h-full flex items-center px-2 overflow-hidden text-white text-xs">
                <span className="truncate">{task.name}</span>
              </div>
              {/* Progress overlay */}
              <div 
                className="absolute top-0 left-0 h-full bg-opacity-70 rounded-l"
                style={{ 
                  width: `${task.progress}%`, 
                  backgroundColor: task.isCritical && showCriticalPath ? 'var(--destructive)' : 'var(--primary)' 
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div 
      ref={ganttContainerRef}
      className={`gantt-view-wrapper ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : 'h-full flex flex-col'}`}
    >
      {/* Enhanced MS Project-like toolbar with shadcn components */}
      <div className="gantt-toolbar flex items-center justify-between bg-muted/50 dark:bg-muted/30 border-b p-2">
        <div className="left-controls flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullScreen} 
            className="gap-1"
          >
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            <span className="text-xs">{isFullScreen ? 'Exit' : 'Full Screen'}</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* View mode selector as ToggleGroup */}
          <ToggleGroup type="single" variant="outline" size="sm" value={viewMode} onValueChange={(value: string) => {
            if (value) setViewMode(value as ViewMode);
          }}>
            {VIEW_MODES.map(mode => (
              <ToggleGroupItem key={mode} value={mode} aria-label={`View by ${mode}`} className="text-xs">
                {mode}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-transparent">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleZoom(false)}
              disabled={zoomLevel <= 50}
              title="Zoom Out"
              className="h-7 w-7"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium px-1 text-foreground">{zoomLevel}%</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleZoom(true)}
              disabled={zoomLevel >= 200}
              title="Zoom In"
              className="h-7 w-7"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Feature toggle buttons */}
          <div className="flex items-center gap-1.5">
            <Button 
              variant={showCriticalPath ? "secondary" : "outline"} 
              size="sm" 
              className="h-7 text-xs gap-1 px-2 py-1"
              onClick={() => setShowCriticalPath(!showCriticalPath)}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Critical Path</span>
            </Button>
            <Button 
              variant={showDependencies ? "secondary" : "outline"} 
              size="sm" 
              className="h-7 text-xs gap-1 px-2 py-1"
              onClick={() => setShowDependencies(!showDependencies)}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Links</span>
            </Button>
            <Button 
              variant={splitView ? "secondary" : "outline"} 
              size="sm" 
              className="h-7 text-xs gap-1 px-2 py-1"
              onClick={() => setSplitView(!splitView)}
            >
              <FlipVertical className="h-3.5 w-3.5" />
              <span>Split</span>
            </Button>
          </div>
        </div>
        
        <div className="right-controls flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 text-foreground">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Select defaultValue="today">
            <SelectTrigger className="h-7 text-xs w-32">
              <SelectValue placeholder="View range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today" className="text-xs">Today</SelectItem>
              <SelectItem value="this-week" className="text-xs">This Week</SelectItem>
              <SelectItem value="this-month" className="text-xs">This Month</SelectItem>
              <SelectItem value="custom" className="text-xs">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 px-2.5 py-1">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div 
        className="gantt-view overflow-x-auto flex-1"
        style={{ height: isFullScreen ? 'calc(100vh - 90px)' : containerHeight ? `${containerHeight}px` : '300px' }}
      >
        <div className="gantt-container min-w-full h-full" style={{ fontSize: `${zoomLevel}%` }}>
          {/* Enhanced timeline header with multiple levels (MS Project style) */}
          <div className="timeline-header sticky top-0 bg-card dark:bg-card/95 z-10 border-b">
            {/* Month header for Month view */}
            {viewMode !== 'Day' && (
              <div className="flex border-b">
                <div className="w-96 min-w-96 flex-shrink-0 border-r bg-muted/50 dark:bg-muted/20">
                  <div className="px-3 py-1 font-medium text-xs text-muted-foreground">Task Name</div>
                </div>
                <div className="flex-grow flex">
                  {viewMode === 'Month' ? (
                    monthRanges.map((month, i) => (
                      <div 
                        key={`month-${i}`} 
                        className="border-r text-center font-medium text-xs py-1 bg-muted/50 dark:bg-muted/20 text-muted-foreground"
                        style={{ width: `${(month.days / totalDays) * 100}%` }}
                      >
                        {month.month}
                      </div>
                    ))
                  ) : (
                    weekRanges.map((week, i) => {
                      const startDate = week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const endDate = week.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const weekWidth = ((week.end.getTime() - week.start.getTime()) / (1000 * 60 * 60 * 24) + 1) / totalDays * 100;
                      
                      return (
                        <div 
                          key={`week-header-${i}`} 
                          className="border-r text-center font-medium text-xs py-1 bg-muted/50 dark:bg-muted/20 text-muted-foreground"
                          style={{ width: `${weekWidth}%` }}
                        >
                          {`${startDate} - ${endDate}`}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            
            {/* Day header always shown */}
            <div className="flex">
              <div className="w-96 min-w-96 flex-shrink-0 p-2 border-r bg-muted/50 dark:bg-muted/20 flex items-center">
                <div className="w-5 mr-1"></div>
                <div className="text-xs text-muted-foreground font-medium">Task</div>
              </div>
              <div className="timeline-column flex-grow overflow-hidden">
                <div className="flex">
                  {dateRange.map((date, index) => (
                    <div 
                      key={index} 
                      className={`date-header flex-1 text-center py-1 text-xs border-r ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/80 dark:bg-muted/40' : 'bg-card dark:bg-card'}`}
                    >
                      {date.getDate()}
                      {viewMode === 'Day' && (
                        <div className="text-muted-foreground text-[10px]">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Task rows with timeline */}
          <div 
            className="task-rows overflow-y-auto relative" 
            style={{ height: isFullScreen ? 'calc(100% - 70px)' : 'calc(100% - 70px)' }}
          >
            {/* Task grid with dependency lines */}
            <div className="relative">
              {showDependencies && renderDependencyLines()}
              {tasks.map(task => renderTaskRow(task))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Full screen mode footer status bar */}
      {isFullScreen && (
        <div className="gantt-footer border-t bg-muted/50 dark:bg-muted/20 p-2 text-xs text-muted-foreground flex justify-between">
          <div>Tasks: {tasks.length} • Critical Tasks: {tasks.filter(t => t.isCritical).length} • Date Range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</div>
          <div>Press ESC to exit full screen</div>
        </div>
      )}
    </div>
  );
}

export default GanttView; 
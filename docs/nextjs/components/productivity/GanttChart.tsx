'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, differenceInDays, isSameDay, parseISO } from 'date-fns';
import { ProjectTask } from '@/types/project';
import { cn } from '@/lib/utils';

interface GanttChartProps {
  tasks: ProjectTask[];
  startDate: Date | string;
  endDate: Date | string;
  onTaskClick?: (task: ProjectTask) => void;
  onTaskUpdate?: (task: ProjectTask) => void;
}

export function GanttChart({ tasks, startDate, endDate, onTaskClick, onTaskUpdate }: GanttChartProps) {
  const [visibleTasks, setVisibleTasks] = useState<ProjectTask[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [chartStartDate, setChartStartDate] = useState<Date>(typeof startDate === 'string' ? parseISO(startDate) : startDate);
  const [chartEndDate, setChartEndDate] = useState<Date>(typeof endDate === 'string' ? parseISO(endDate) : endDate);
  const [timelineWidth, setTimelineWidth] = useState(1000);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [resizingTask, setResizingTask] = useState<{ id: string; edge: 'start' | 'end' } | null>(null);

  const daysInRange = differenceInDays(chartEndDate, chartStartDate) + 1;
  const cellWidth = 40; // width of each day cell in pixels
  
  // Calculate the dates for the timeline
  const timelineDates: Date[] = [];
  for (let i = 0; i < daysInRange; i++) {
    timelineDates.push(addDays(chartStartDate, i));
  }
  
  // Process tasks to ensure all tasks are visible
  useEffect(() => {
    // Create an object to track expanded state
    const expandedMap = new Map<string, boolean>();
    
    // Initialize with current state
    visibleTasks.forEach(task => {
      if (task.isGroup) {
        expandedMap.set(task.id, task.isExpanded || false);
      }
    });
    
    // Process tasks to determine visibility
    const processedTasks = tasks.filter(task => {
      // If this is a top-level task, always show it
      if (!task.parentId) {
        return true;
      }
      
      // Check if this task's parent is expanded
      let currentParentId = task.parentId;
      while (currentParentId) {
        const parentTask = tasks.find(t => t.id === currentParentId);
        if (!parentTask) {
          return false;
        }
        
        const isParentExpanded = expandedMap.get(currentParentId);
        if (!isParentExpanded) {
          return false;
        }
        
        currentParentId = parentTask.parentId;
      }
      
      return true;
    });
    
    // Apply the expanded state to the processed tasks
    const tasksWithExpandedState = processedTasks.map(task => {
      if (task.isGroup) {
        return {
          ...task,
          isExpanded: expandedMap.has(task.id) ? expandedMap.get(task.id) : task.isExpanded
        };
      }
      return task;
    });
    
    setVisibleTasks(tasksWithExpandedState);
  }, [tasks]);

  // Toggle expansion of a group task
  const toggleTaskExpansion = (taskId: string) => {
    setVisibleTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId && task.isGroup) {
          return { ...task, isExpanded: !task.isExpanded };
        }
        return task;
      })
    );
  };

  // Get the horizontal position and width for a task bar
  const getTaskBarStyle = (task: ProjectTask) => {
    const taskStartDate = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
    const taskEndDate = typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate;
    
    const startPosition = differenceInDays(taskStartDate, chartStartDate) * cellWidth;
    const taskWidth = (differenceInDays(taskEndDate, taskStartDate) + 1) * cellWidth;
    
    const style: React.CSSProperties = {
      left: `${startPosition}px`,
      width: `${taskWidth}px`,
    };
    
    return style;
  };

  // Get the CSS classes for a task bar based on its status
  const getTaskBarClasses = (task: ProjectTask) => {
    const baseClasses = 'absolute h-6 rounded-sm cursor-pointer flex items-center text-xs text-white overflow-hidden';
    
    const statusClasses = {
      'not-started': 'bg-blue-500',
      'in-progress': 'bg-amber-500',
      'completed': 'bg-green-500',
      'delayed': 'bg-red-500',
      'cancelled': 'bg-gray-500',
    };
    
    const selectedClass = selectedTaskId === task.id ? 'ring-2 ring-offset-1 ring-primary' : '';
    
    return cn(
      baseClasses,
      statusClasses[task.status],
      selectedClass,
      task.isMilestone ? 'diamond-shape h-6 w-6 flex items-center justify-center' : ''
    );
  };

  // Calculate the indentation level for a task
  const getTaskIndentLevel = (task: ProjectTask): number => {
    let level = 0;
    let currentParentId = task.parentId;
    
    while (currentParentId) {
      level++;
      const parentTask = tasks.find(t => t.id === currentParentId);
      if (!parentTask) {
        break;
      }
      currentParentId = parentTask.parentId;
    }
    
    return level;
  };

  // Handle task click
  const handleTaskClick = (task: ProjectTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTaskId(task.id);
    onTaskClick?.(task);
  };

  // Handle expanding/collapsing a group task
  const handleExpandCollapseClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskExpansion(taskId);
  };

  // Handle task bar drag start
  const handleTaskDragStart = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingTask(taskId);
    document.addEventListener('mousemove', handleTaskDrag);
    document.addEventListener('mouseup', handleTaskDragEnd);
  };

  // Handle task dragging
  const handleTaskDrag = (e: MouseEvent) => {
    if (!draggingTask || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const dayOffset = Math.floor(relativeX / cellWidth);
    
    const task = tasks.find(t => t.id === draggingTask);
    if (!task) return;
    
    const taskStartDate = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
    const taskEndDate = typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate;
    const taskDuration = differenceInDays(taskEndDate, taskStartDate);
    
    const newStartDate = addDays(chartStartDate, Math.max(0, dayOffset));
    const newEndDate = addDays(newStartDate, taskDuration);
    
    const updatedTask: ProjectTask = {
      ...task,
      startDate: newStartDate,
      endDate: newEndDate,
    };
    
    // Update the task
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  // Handle task drag end
  const handleTaskDragEnd = () => {
    setDraggingTask(null);
    document.removeEventListener('mousemove', handleTaskDrag);
    document.removeEventListener('mouseup', handleTaskDragEnd);
  };

  // Handle task resizing start
  const handleTaskResizeStart = (taskId: string, edge: 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    setResizingTask({ id: taskId, edge });
    document.addEventListener('mousemove', handleTaskResize);
    document.addEventListener('mouseup', handleTaskResizeEnd);
  };

  // Handle task resizing
  const handleTaskResize = (e: MouseEvent) => {
    if (!resizingTask || !timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const dayOffset = Math.floor(relativeX / cellWidth);
    
    const task = tasks.find(t => t.id === resizingTask.id);
    if (!task) return;
    
    const taskStartDate = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
    const taskEndDate = typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate;
    
    if (resizingTask.edge === 'start') {
      const newStartDate = addDays(chartStartDate, Math.max(0, dayOffset));
      if (differenceInDays(taskEndDate, newStartDate) < 0) return;
      
      const updatedTask: ProjectTask = {
        ...task,
        startDate: newStartDate,
        duration: differenceInDays(taskEndDate, newStartDate) + 1,
      };
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } else {
      const newEndDate = addDays(chartStartDate, Math.max(0, dayOffset));
      if (differenceInDays(newEndDate, taskStartDate) < 0) return;
      
      const updatedTask: ProjectTask = {
        ...task,
        endDate: newEndDate,
        duration: differenceInDays(newEndDate, taskStartDate) + 1,
      };
      
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    }
  };

  // Handle task resize end
  const handleTaskResizeEnd = () => {
    setResizingTask(null);
    document.removeEventListener('mousemove', handleTaskResize);
    document.removeEventListener('mouseup', handleTaskResizeEnd);
  };

  // Render the milestone element
  const renderMilestone = (task: ProjectTask) => {
    const taskDate = typeof task.milestoneDate === 'string' ? parseISO(task.milestoneDate) : task.milestoneDate;
    const left = differenceInDays(taskDate, chartStartDate) * cellWidth - 6; // Adjust to center
    
    const statusColors = {
      'not-started': 'bg-blue-500',
      'in-progress': 'bg-amber-500',
      'completed': 'bg-green-500',
      'delayed': 'bg-red-500',
      'cancelled': 'bg-gray-500',
    };
    
    return (
      <div 
        className={cn('absolute diamond-shape h-6 w-6', statusColors[task.status])}
        style={{ left: `${left}px`, top: '0px' }}
        onClick={(e) => handleTaskClick(task, e)}
      >
        <div className="opacity-50">{task.name[0]}</div>
      </div>
    );
  };

  // Render dependency lines
  const renderDependencyLines = () => {
    const lines: JSX.Element[] = [];
    
    tasks.forEach(task => {
      if (!task.dependencies || task.dependencies.length === 0) return;
      
      const taskStartDate = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
      const taskStartX = differenceInDays(taskStartDate, chartStartDate) * cellWidth;
      
      task.dependencies.forEach((dep, index) => {
        const sourceTask = tasks.find(t => t.id === dep.taskId);
        if (!sourceTask) return;
        
        const sourceEndDate = typeof sourceTask.endDate === 'string' ? parseISO(sourceTask.endDate) : sourceTask.endDate;
        const sourceX = differenceInDays(sourceEndDate, chartStartDate) * cellWidth + cellWidth / 2;
        
        const sourceTaskIndex = visibleTasks.findIndex(t => t.id === dep.taskId);
        const targetTaskIndex = visibleTasks.findIndex(t => t.id === task.id);
        
        if (sourceTaskIndex === -1 || targetTaskIndex === -1) return;
        
        // Calculate vertical positions
        const sourceY = (sourceTaskIndex * 40) + 20; // 40px per row, center of the row
        const targetY = (targetTaskIndex * 40) + 20;
        
        // Draw a path: horizontal line from source end + arrow to target start
        const path = `M ${sourceX} ${sourceY} 
                      H ${taskStartX - 5}
                      L ${taskStartX} ${targetY}`;
        
        lines.push(
          <g key={`dep-${task.id}-${index}`} className="dependency-line">
            <path 
              d={path} 
              stroke="gray" 
              strokeWidth="1.5" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
              strokeDasharray="4"
            />
          </g>
        );
      });
    });
    
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <marker 
            id="arrowhead" 
            markerWidth="5" 
            markerHeight="5" 
            refX="5" 
            refY="2.5" 
            orient="auto"
          >
            <polygon points="0 0, 5 2.5, 0 5" fill="gray" />
          </marker>
        </defs>
        {lines}
      </svg>
    );
  };

  return (
    <div className="gantt-chart overflow-auto bg-white border rounded-md">
      <div className="flex">
        {/* Task names column */}
        <div className="task-list bg-muted min-w-[250px] border-r sticky left-0 z-10">
          <div className="h-12 p-2 border-b font-medium bg-muted-foreground/10">Task</div>
          {visibleTasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                'flex items-center p-2 border-b h-10',
                selectedTaskId === task.id ? 'bg-muted-foreground/10' : index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/5'
              )}
              onClick={() => setSelectedTaskId(task.id)}
            >
              <div
                className="flex items-center"
                style={{ paddingLeft: `${getTaskIndentLevel(task) * 12}px` }}
              >
                {task.isGroup && (
                  <button
                    className="w-4 h-4 mr-1 text-xs"
                    onClick={(e) => handleExpandCollapseClick(task.id, e)}
                  >
                    {task.isExpanded ? '−' : '+'}
                  </button>
                )}
                <span className="truncate text-sm">{task.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline and task bars */}
        <div className="timeline-container overflow-auto">
          {/* Timeline header */}
          <div className="timeline-header h-12 border-b sticky top-0 bg-muted-foreground/10">
            <div className="flex">
              {timelineDates.map((date, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'text-center border-r min-w-[40px] h-12 flex flex-col justify-center text-sm',
                    format(date, 'EEE') === 'Sat' || format(date, 'EEE') === 'Sun' ? 'bg-muted/30' : ''
                  )}
                >
                  <div className="text-xs">{format(date, 'EEE')}</div>
                  <div>{format(date, 'd')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline grid and task bars */}
          <div className="relative" ref={timelineRef}>
            {/* Grid lines */}
            <div className="timeline-grid">
              {timelineDates.map((date, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'inline-block border-r min-w-[40px] h-[calc(40px*var(--task-count,1))]',
                    format(date, 'EEE') === 'Sat' || format(date, 'EEE') === 'Sun' ? 'bg-muted/30' : ''
                  )}
                  style={{ '--task-count': visibleTasks.length } as any}
                ></div>
              ))}
            </div>

            {/* Today marker */}
            {timelineDates.some(date => isSameDay(date, new Date())) && (
              <div
                className="absolute top-0 bottom-0 w-px bg-red-500 z-20"
                style={{
                  left: `${
                    differenceInDays(new Date(), chartStartDate) * cellWidth + cellWidth / 2
                  }px`,
                }}
              ></div>
            )}

            {/* Task rows */}
            {visibleTasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  'h-10 border-b relative',
                  selectedTaskId === task.id ? 'bg-muted-foreground/10' : index % 2 === 0 ? 'bg-muted/20' : 'bg-muted/5'
                )}
                style={{ width: `${timelineDates.length * cellWidth}px` }}
              >
                {/* Render task bar, or milestone marker */}
                {task.isMilestone ? (
                  renderMilestone(task)
                ) : (
                  <div
                    className={getTaskBarClasses(task)}
                    style={getTaskBarStyle(task)}
                    onClick={(e) => handleTaskClick(task, e)}
                    onMouseDown={(e) => handleTaskDragStart(task.id, e)}
                  >
                    {!task.isMilestone && (
                      <>
                        <div 
                          className="absolute left-0 top-0 h-full w-1 bg-black bg-opacity-20 cursor-ew-resize"
                          onMouseDown={(e) => handleTaskResizeStart(task.id, 'start', e)}
                        ></div>
                        
                        <div className="px-2 truncate">{task.name}</div>
                        
                        <div 
                          className="absolute right-0 top-0 h-full w-1 bg-black bg-opacity-20 cursor-ew-resize"
                          onMouseDown={(e) => handleTaskResizeStart(task.id, 'end', e)}
                        ></div>
                        
                        {/* Progress bar */}
                        {task.progress > 0 && (
                          <div 
                            className="absolute left-0 top-0 h-full bg-black bg-opacity-20"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Render dependency lines */}
            {renderDependencyLines()}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .gantt-chart {
          height: calc(100vh - 250px);
          min-height: 400px;
        }
        
        .timeline-container {
          overflow-x: auto;
          overflow-y: hidden;
        }
        
        .diamond-shape {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
} 
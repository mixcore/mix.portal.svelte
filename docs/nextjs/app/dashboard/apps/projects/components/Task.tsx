'use client';

import React from 'react';

export interface TaskProps {
  id: string;
  name: string;
  startDate: string;
  dueDate: string;
  assignedTo?: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  status: 'notStarted' | 'inProgress' | 'completed' | 'blocked';
}

export function Task({
  id,
  name,
  startDate,
  dueDate,
  assignedTo,
  progress,
  priority,
  status
}: TaskProps) {
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300',
    medium: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300'
  };
  
  // Status colors and labels
  const statusConfig = {
    notStarted: { color: 'bg-secondary text-secondary-foreground', label: 'Not Started' },
    inProgress: { color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300', label: 'In Progress' },
    completed: { color: 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300', label: 'Completed' },
    blocked: { color: 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300', label: 'Blocked' }
  };
  
  return (
    <div className="task-item border-b hover:bg-accent/10 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="font-medium text-foreground">{name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div>{startDate} - {dueDate}</div>
          {assignedTo && (
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {assignedTo.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}
          <div className={`rounded-full px-2 py-0.5 text-xs ${statusConfig[status].color}`}>
            {statusConfig[status].label}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-2 w-full bg-muted rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Task; 
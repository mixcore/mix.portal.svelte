'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectData } from '../lib/types';
import useContainerStatus from '../hooks/useContainerStatus';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  FolderIcon, 
  FolderXIcon, 
  Edit, 
  CheckSquare, 
  BarChart3, 
  MoreVertical 
} from 'lucide-react';

export interface ProjectListProps {
  projects: ProjectData[];
  onProjectClick: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'progress' | 'status'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const isFluidLayout = useContainerStatus();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle sort toggle
  const handleSort = (column: 'name' | 'dueDate' | 'progress' | 'status') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Adjust container width based on layout
  useEffect(() => {
    if (containerRef.current) {
      if (isFluidLayout) {
        containerRef.current.classList.remove('mx-6');
      } else {
        if (!containerRef.current.classList.contains('mx-6')) {
          containerRef.current.classList.add('mx-6');
        }
      }
    }
  }, [isFluidLayout]);
  
  // Sort projects based on current sorting criteria
  const sortedProjects = [...projects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Calculate days remaining for a project
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get appropriate status colors and indicators
  const getStatusInfo = (status: string, daysRemaining: number) => {
    let statusColor = 'bg-secondary text-secondary-foreground';
    let indicator = '';
    
    switch (status.toLowerCase()) {
      case 'on track':
        statusColor = 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300';
        indicator = '●';
        break;
      case 'at risk':
        statusColor = 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300';
        indicator = '▲';
        break;
      case 'delayed':
        statusColor = 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300';
        indicator = '■';
        break;
      case 'completed':
        statusColor = 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300';
        indicator = '✓';
        break;
    }
    
    // Override status color if due date is very close
    if (daysRemaining < 0 && status.toLowerCase() !== 'completed') {
      statusColor = 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300';
    } else if (daysRemaining <= 3 && status.toLowerCase() !== 'completed') {
      statusColor = 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300';
    }
    
    return { statusColor, indicator };
  };
  
  return (
    <div 
      ref={containerRef}
      className="project-list-container bg-card dark:bg-card/90 shadow overflow-hidden mx-6 border rounded-md"
    >
      {/* Table header with sorting */}
      <div className="grid grid-cols-12 bg-muted/50 text-xs font-medium text-muted-foreground border-b sticky top-0 z-10">
        <div 
          className="col-span-4 p-3 cursor-pointer hover:bg-muted flex items-center"
          onClick={() => handleSort('name')}
        >
          PROJECT NAME
          {sortBy === 'name' && (
            <ArrowUpIcon className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />
          )}
        </div>
        <div 
          className="col-span-2 p-3 cursor-pointer hover:bg-muted flex items-center"
          onClick={() => handleSort('dueDate')}
        >
          DUE DATE
          {sortBy === 'dueDate' && (
            <ArrowUpIcon className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />
          )}
        </div>
        <div 
          className="col-span-2 p-3 cursor-pointer hover:bg-muted flex items-center"
          onClick={() => handleSort('progress')}
        >
          PROGRESS
          {sortBy === 'progress' && (
            <ArrowUpIcon className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />
          )}
        </div>
        <div 
          className="col-span-2 p-3 cursor-pointer hover:bg-muted flex items-center"
          onClick={() => handleSort('status')}
        >
          STATUS
          {sortBy === 'status' && (
            <ArrowUpIcon className={`h-3 w-3 ml-1 ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />
          )}
        </div>
        <div className="col-span-2 p-3">
          ACTIONS
        </div>
      </div>
      
      {/* Project rows */}
      <div className="divide-y divide-border">
        {sortedProjects.map(project => {
          const daysRemaining = getDaysRemaining(project.dueDate);
          const { statusColor, indicator } = getStatusInfo(project.status, daysRemaining);
          
          return (
            <div 
              key={project.id}
              className={`grid grid-cols-12 text-sm hover:bg-accent/10 transition-colors cursor-pointer ${selectedRow === project.id ? 'bg-accent/10 border-l-4 border-primary' : ''}`}
              onClick={() => {
                setSelectedRow(project.id);
                onProjectClick(project.id);
              }}
            >
              <div className="col-span-4 p-4 flex items-center">
                <div className="text-primary font-medium flex items-center">
                  <FolderIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                  {project.name}
                </div>
              </div>
              <div className="col-span-2 p-4 flex items-center">
                <div className="flex flex-col">
                  <span className="text-foreground">{project.dueDate}</span>
                  <span className={`text-xs mt-1 ${daysRemaining < 0 ? 'text-destructive dark:text-red-400 font-medium' : (daysRemaining <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground')}`}>
                    {daysRemaining < 0 
                      ? `${Math.abs(daysRemaining)} days overdue` 
                      : daysRemaining === 0 
                        ? 'Due today'
                        : `${daysRemaining} days remaining`}
                  </span>
                </div>
              </div>
              <div className="col-span-2 p-4 flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted dark:bg-muted/70 rounded-full h-2">
                    <div 
                      className="bg-primary dark:bg-primary/90 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 p-4 flex items-center">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                  {indicator && <span className="mr-1">{indicator}</span>}
                  {project.status}
                </span>
              </div>
              <div className="col-span-2 p-4 flex items-center space-x-2">
                <button className="p-1 rounded-full hover:bg-muted" title="Edit project">
                  <Edit className="text-muted-foreground h-4 w-4" />
                </button>
                <button className="p-1 rounded-full hover:bg-muted" title="View tasks">
                  <CheckSquare className="text-muted-foreground h-4 w-4" />
                </button>
                <button className="p-1 rounded-full hover:bg-muted" title="View Gantt chart">
                  <BarChart3 className="text-muted-foreground h-4 w-4" />
                </button>
                <button className="p-1 rounded-full hover:bg-muted" title="More options">
                  <MoreVertical className="text-muted-foreground h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state */}
      {sortedProjects.length === 0 && (
        <div className="p-8 text-center">
          <FolderXIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No projects found</p>
          <button className="mt-4 px-4 py-2 bg-primary dark:bg-primary/90 text-primary-foreground rounded-md text-sm hover:bg-primary/90 dark:hover:bg-primary/80">
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList; 
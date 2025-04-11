export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';

export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';

export type TaskDependencyType = 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';

export interface TaskDependency {
  taskId: string;
  type: TaskDependencyType;
}

export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  duration: number; // in days
  progress: number; // 0-100
  status: TaskStatus;
  dependencies?: TaskDependency[];
  assignees?: string[];
  parentId?: string; // for sub-tasks
  isExpanded?: boolean; // UI state for expanding/collapsing sub-tasks
  isGroup?: boolean; // Is this a group task with children
  milestoneDate?: Date | string; // If task is a milestone
  isMilestone?: boolean;
  color?: string; // For custom styling
  priority?: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  cost?: number;
  costCurrency?: string;
  resourceHours?: number; // Allocated resource hours
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  status: ProjectStatus;
  owner: string;
  team?: string[];
  tasks: ProjectTask[];
  createdAt: Date | string;
  updatedAt: Date | string;
  budget?: number;
  currency?: string;
  client?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  category?: string;
}

export interface Resource {
  id: string;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  capacity?: number; // hours per day
  cost?: number; // cost rate
  avatar?: string;
  tags?: string[];
}

export interface ResourceAssignment {
  id: string;
  resourceId: string;
  taskId: string;
  allocation: number; // percentage of time allocated
  startDate: Date | string;
  endDate: Date | string;
  role?: string;
} 
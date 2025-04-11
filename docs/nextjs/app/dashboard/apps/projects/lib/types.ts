export interface ProjectData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: string;
  members: string[];
  tasksCount: {
    total: number;
    completed: number;
  };
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
  projectId: string;
  progress: number;
  subtasks?: {
    total: number;
    completed: number;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'task' | 'milestone';
  projectId: string;
  status: string;
}

export interface ProjectFilter {
  status: string[];
  members: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
} 
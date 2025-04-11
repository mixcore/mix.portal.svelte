import { Project, ProjectTask } from '@/types/project';

// Sample project data for initial demo
const SAMPLE_PROJECT: Project = {
  id: 'project-1',
  name: 'Website Redesign',
  description: 'Complete redesign of the corporate website',
  startDate: new Date('2023-10-01'),
  endDate: new Date('2024-01-31'),
  status: 'active',
  owner: 'john.doe@example.com',
  team: ['jane.smith@example.com', 'bob.jones@example.com'],
  tasks: [
    {
      id: 'task-1',
      name: 'Planning Phase',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-15'),
      duration: 15,
      progress: 100,
      status: 'completed',
      isGroup: true,
      isExpanded: true,
    },
    {
      id: 'task-1-1',
      name: 'Requirements Gathering',
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-10-07'),
      duration: 7,
      progress: 100,
      status: 'completed',
      parentId: 'task-1',
      assignees: ['john.doe@example.com'],
    },
    {
      id: 'task-1-2',
      name: 'Stakeholder Interviews',
      startDate: new Date('2023-10-08'),
      endDate: new Date('2023-10-14'),
      duration: 7,
      progress: 100,
      status: 'completed',
      parentId: 'task-1',
      assignees: ['jane.smith@example.com'],
      dependencies: [{ taskId: 'task-1-1', type: 'finish-to-start' }],
    },
    {
      id: 'task-1-3',
      name: 'Project Kickoff',
      startDate: new Date('2023-10-15'),
      endDate: new Date('2023-10-15'),
      duration: 1,
      progress: 100,
      status: 'completed',
      parentId: 'task-1',
      assignees: ['john.doe@example.com', 'jane.smith@example.com', 'bob.jones@example.com'],
      dependencies: [{ taskId: 'task-1-2', type: 'finish-to-start' }],
      isMilestone: true,
      milestoneDate: new Date('2023-10-15'),
    },
    {
      id: 'task-2',
      name: 'Design Phase',
      startDate: new Date('2023-10-16'),
      endDate: new Date('2023-11-15'),
      duration: 31,
      progress: 80,
      status: 'in-progress',
      isGroup: true,
      isExpanded: true,
      dependencies: [{ taskId: 'task-1', type: 'finish-to-start' }],
    },
    {
      id: 'task-2-1',
      name: 'Wireframes',
      startDate: new Date('2023-10-16'),
      endDate: new Date('2023-10-31'),
      duration: 16,
      progress: 100,
      status: 'completed',
      parentId: 'task-2',
      assignees: ['jane.smith@example.com'],
    },
    {
      id: 'task-2-2',
      name: 'UI Design',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2023-11-15'),
      duration: 15,
      progress: 60,
      status: 'in-progress',
      parentId: 'task-2',
      assignees: ['bob.jones@example.com'],
      dependencies: [{ taskId: 'task-2-1', type: 'finish-to-start' }],
    },
    {
      id: 'task-3',
      name: 'Development Phase',
      startDate: new Date('2023-11-16'),
      endDate: new Date('2023-12-31'),
      duration: 46,
      progress: 30,
      status: 'in-progress',
      isGroup: true,
      isExpanded: true,
      dependencies: [{ taskId: 'task-2', type: 'finish-to-start' }],
    },
    {
      id: 'task-3-1',
      name: 'Frontend Development',
      startDate: new Date('2023-11-16'),
      endDate: new Date('2023-12-15'),
      duration: 30,
      progress: 40,
      status: 'in-progress',
      parentId: 'task-3',
      assignees: ['bob.jones@example.com'],
    },
    {
      id: 'task-3-2',
      name: 'Backend Development',
      startDate: new Date('2023-11-16'),
      endDate: new Date('2023-12-15'),
      duration: 30,
      progress: 35,
      status: 'in-progress',
      parentId: 'task-3',
      assignees: ['john.doe@example.com'],
    },
    {
      id: 'task-3-3',
      name: 'Code Freeze',
      startDate: new Date('2023-12-16'),
      endDate: new Date('2023-12-16'),
      duration: 1,
      progress: 0,
      status: 'not-started',
      parentId: 'task-3',
      assignees: ['john.doe@example.com', 'bob.jones@example.com'],
      dependencies: [
        { taskId: 'task-3-1', type: 'finish-to-start' },
        { taskId: 'task-3-2', type: 'finish-to-start' },
      ],
      isMilestone: true,
      milestoneDate: new Date('2023-12-16'),
    },
    {
      id: 'task-4',
      name: 'Testing Phase',
      startDate: new Date('2023-12-17'),
      endDate: new Date('2024-01-15'),
      duration: 30,
      progress: 0,
      status: 'not-started',
      isGroup: true,
      isExpanded: true,
      dependencies: [{ taskId: 'task-3', type: 'finish-to-start' }],
    },
    {
      id: 'task-4-1',
      name: 'QA Testing',
      startDate: new Date('2023-12-17'),
      endDate: new Date('2024-01-05'),
      duration: 20,
      progress: 0,
      status: 'not-started',
      parentId: 'task-4',
      assignees: ['jane.smith@example.com'],
    },
    {
      id: 'task-4-2',
      name: 'User Acceptance Testing',
      startDate: new Date('2024-01-06'),
      endDate: new Date('2024-01-15'),
      duration: 10,
      progress: 0,
      status: 'not-started',
      parentId: 'task-4',
      assignees: ['john.doe@example.com', 'jane.smith@example.com'],
      dependencies: [{ taskId: 'task-4-1', type: 'finish-to-start' }],
    },
    {
      id: 'task-5',
      name: 'Deployment',
      startDate: new Date('2024-01-16'),
      endDate: new Date('2024-01-31'),
      duration: 16,
      progress: 0,
      status: 'not-started',
      isGroup: true,
      isExpanded: true,
      dependencies: [{ taskId: 'task-4', type: 'finish-to-start' }],
    },
    {
      id: 'task-5-1',
      name: 'Staging Deployment',
      startDate: new Date('2024-01-16'),
      endDate: new Date('2024-01-22'),
      duration: 7,
      progress: 0,
      status: 'not-started',
      parentId: 'task-5',
      assignees: ['bob.jones@example.com'],
    },
    {
      id: 'task-5-2',
      name: 'Production Deployment',
      startDate: new Date('2024-01-23'),
      endDate: new Date('2024-01-30'),
      duration: 8,
      progress: 0,
      status: 'not-started',
      parentId: 'task-5',
      assignees: ['bob.jones@example.com', 'john.doe@example.com'],
      dependencies: [{ taskId: 'task-5-1', type: 'finish-to-start' }],
    },
    {
      id: 'task-5-3',
      name: 'Project Completion',
      startDate: new Date('2024-01-31'),
      endDate: new Date('2024-01-31'),
      duration: 1,
      progress: 0,
      status: 'not-started',
      parentId: 'task-5',
      assignees: ['john.doe@example.com', 'jane.smith@example.com', 'bob.jones@example.com'],
      dependencies: [{ taskId: 'task-5-2', type: 'finish-to-start' }],
      isMilestone: true,
      milestoneDate: new Date('2024-01-31'),
    },
  ],
  createdAt: new Date('2023-09-15'),
  updatedAt: new Date('2023-10-01'),
  budget: 50000,
  currency: 'USD',
  client: 'ACME Corp',
  priority: 'high',
  tags: ['website', 'redesign', 'corporate'],
  category: 'Web Development',
};

let projectStore: Project[] = [SAMPLE_PROJECT];

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    // In a real app, this would be an API call
    return Promise.resolve([...projectStore]);
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<Project | undefined> => {
    // In a real app, this would be an API call
    const project = projectStore.find(p => p.id === id);
    return Promise.resolve(project ? { ...project } : undefined);
  },

  // Create a new project
  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    // In a real app, this would be an API call
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    projectStore.push(newProject);
    return Promise.resolve({ ...newProject });
  },

  // Update an existing project
  updateProject: async (project: Project): Promise<Project> => {
    // In a real app, this would be an API call
    const index = projectStore.findIndex(p => p.id === project.id);
    if (index === -1) {
      throw new Error(`Project with ID ${project.id} not found`);
    }
    
    const updatedProject = {
      ...project,
      updatedAt: new Date(),
    };
    
    projectStore[index] = updatedProject;
    return Promise.resolve({ ...updatedProject });
  },

  // Delete a project
  deleteProject: async (id: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const index = projectStore.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    
    projectStore.splice(index, 1);
    return Promise.resolve(true);
  },

  // Add a task to a project
  addTask: async (projectId: string, task: Omit<ProjectTask, 'id'>): Promise<ProjectTask> => {
    // In a real app, this would be an API call
    const project = projectStore.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    const newTask: ProjectTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    
    project.tasks.push(newTask);
    project.updatedAt = new Date();
    
    return Promise.resolve({ ...newTask });
  },

  // Update a task
  updateTask: async (projectId: string, task: ProjectTask): Promise<ProjectTask> => {
    // In a real app, this would be an API call
    const project = projectStore.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    const taskIndex = project.tasks.findIndex(t => t.id === task.id);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${task.id} not found in project ${projectId}`);
    }
    
    project.tasks[taskIndex] = { ...task };
    project.updatedAt = new Date();
    
    return Promise.resolve({ ...task });
  },

  // Delete a task
  deleteTask: async (projectId: string, taskId: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const project = projectStore.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    const initialTaskCount = project.tasks.length;
    project.tasks = project.tasks.filter(t => t.id !== taskId);
    project.updatedAt = new Date();
    
    return Promise.resolve(project.tasks.length < initialTaskCount);
  },
}; 
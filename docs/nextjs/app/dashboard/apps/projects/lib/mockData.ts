import { Project } from '../components/ProjectItem';
import { GanttTask } from '../components/GanttView';
import { TaskProps } from '../components/Task';

// Sample projects data
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding and improved user experience',
    status: 'active',
    createdAt: new Date('2023-09-15').toISOString(),
    updatedAt: new Date('2023-10-05').toISOString(),
    dueDate: new Date('2023-12-31').toISOString(),
    owner: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    collaborators: [
      { id: 'user2', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user3', name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=3' }
    ],
    tags: ['design', 'frontend', 'branding']
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a cross-platform mobile application for iOS and Android',
    status: 'active',
    createdAt: new Date('2023-08-10').toISOString(),
    updatedAt: new Date('2023-10-01').toISOString(),
    dueDate: new Date('2024-02-15').toISOString(),
    owner: {
      id: 'user2',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    collaborators: [
      { id: 'user4', name: 'David Chen', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: 'user5', name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    tags: ['mobile', 'react native', 'api integration']
  },
  {
    id: '3',
    title: 'Database Migration',
    description: 'Migrate legacy database to a modern cloud-based solution with improved performance',
    status: 'completed',
    createdAt: new Date('2023-07-05').toISOString(),
    updatedAt: new Date('2023-09-20').toISOString(),
    dueDate: new Date('2023-09-15').toISOString(),
    owner: {
      id: 'user3',
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    collaborators: [
      { id: 'user1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user6', name: 'Lisa Wang', avatar: 'https://i.pravatar.cc/150?img=6' }
    ],
    tags: ['database', 'migration', 'cloud']
  },
  {
    id: '4',
    title: 'Customer Portal Enhancement',
    description: 'Add new features and improve user experience for the customer self-service portal',
    status: 'on_hold',
    createdAt: new Date('2023-09-01').toISOString(),
    updatedAt: new Date('2023-10-10').toISOString(),
    dueDate: new Date('2024-01-15').toISOString(),
    owner: {
      id: 'user4',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    collaborators: [
      { id: 'user2', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user7', name: 'James Miller', avatar: 'https://i.pravatar.cc/150?img=7' }
    ],
    tags: ['ux', 'customer', 'portal']
  },
  {
    id: '5',
    title: 'Security Audit',
    description: 'Comprehensive security review and implementation of best practices',
    status: 'active',
    createdAt: new Date('2023-09-25').toISOString(),
    updatedAt: new Date('2023-10-15').toISOString(),
    dueDate: new Date('2023-11-30').toISOString(),
    owner: {
      id: 'user5',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    collaborators: [
      { id: 'user3', name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 'user8', name: 'Sophia Garcia', avatar: 'https://i.pravatar.cc/150?img=8' }
    ],
    tags: ['security', 'audit', 'compliance']
  },
  {
    id: '6',
    title: 'API Integration',
    description: 'Integrate third-party services and build custom API endpoints',
    status: 'canceled',
    createdAt: new Date('2023-07-15').toISOString(),
    updatedAt: new Date('2023-08-30').toISOString(),
    dueDate: null,
    owner: {
      id: 'user6',
      name: 'Lisa Wang',
      avatar: 'https://i.pravatar.cc/150?img=6'
    },
    collaborators: [
      { id: 'user4', name: 'David Chen', avatar: 'https://i.pravatar.cc/150?img=4' }
    ],
    tags: ['api', 'integration', 'backend']
  },
  {
    id: '7',
    title: 'Performance Optimization',
    description: 'Improve application performance and page load times',
    status: 'active',
    createdAt: new Date('2023-09-10').toISOString(),
    updatedAt: new Date('2023-10-12').toISOString(),
    dueDate: new Date('2023-11-15').toISOString(),
    owner: {
      id: 'user7',
      name: 'James Miller',
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    collaborators: [
      { id: 'user1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 'user5', name: 'Emily Rodriguez', avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    tags: ['performance', 'optimization', 'frontend']
  },
  {
    id: '8',
    title: 'Content Management System',
    description: 'Develop a custom CMS for marketing team to manage website content',
    status: 'completed',
    createdAt: new Date('2023-06-15').toISOString(),
    updatedAt: new Date('2023-09-01').toISOString(),
    dueDate: new Date('2023-08-31').toISOString(),
    owner: {
      id: 'user8',
      name: 'Sophia Garcia',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    collaborators: [
      { id: 'user2', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 'user6', name: 'Lisa Wang', avatar: 'https://i.pravatar.cc/150?img=6' }
    ],
    tags: ['cms', 'content', 'marketing']
  }
];

// Sample tasks for selected project (Website Redesign)
export const mockTasks: TaskProps[] = [
  {
    id: 't1',
    name: 'Requirements gathering',
    startDate: '2023-08-15',
    dueDate: '2023-08-25',
    assignedTo: 'John Doe',
    progress: 100,
    priority: 'high',
    status: 'completed'
  },
  {
    id: 't2',
    name: 'Wireframing',
    startDate: '2023-08-26',
    dueDate: '2023-09-05',
    assignedTo: 'Jane Smith',
    progress: 100,
    priority: 'high',
    status: 'completed'
  },
  {
    id: 't3',
    name: 'UI Design',
    startDate: '2023-09-06',
    dueDate: '2023-09-25',
    assignedTo: 'Jane Smith',
    progress: 100,
    priority: 'high',
    status: 'completed'
  },
  {
    id: 't4',
    name: 'Frontend Development',
    startDate: '2023-09-26',
    dueDate: '2023-10-15',
    assignedTo: 'Robert Johnson',
    progress: 65,
    priority: 'medium',
    status: 'inProgress'
  },
  {
    id: 't5',
    name: 'Backend Integration',
    startDate: '2023-10-10',
    dueDate: '2023-10-20',
    assignedTo: 'Lisa Wong',
    progress: 30,
    priority: 'medium',
    status: 'inProgress'
  },
  {
    id: 't6',
    name: 'Testing',
    startDate: '2023-10-21',
    dueDate: '2023-10-27',
    assignedTo: 'John Doe',
    progress: 0,
    priority: 'medium',
    status: 'notStarted'
  },
  {
    id: 't7',
    name: 'Deployment',
    startDate: '2023-10-28',
    dueDate: '2023-10-30',
    assignedTo: 'Lisa Wong',
    progress: 0,
    priority: 'high',
    status: 'notStarted'
  }
];

// Enhanced Gantt data with dependencies, critical paths, and milestones
export const mockGanttTasks: GanttTask[] = [
  {
    id: 't1',
    name: 'Project Kickoff',
    startDate: new Date('2023-08-15'),
    endDate: new Date('2023-08-15'),
    progress: 100,
    assignedTo: 'John Doe',
    isMilestone: true,
    isCritical: true
  },
  {
    id: 't2',
    name: 'Requirements Gathering',
    startDate: new Date('2023-08-16'),
    endDate: new Date('2023-08-25'),
    progress: 100,
    assignedTo: 'John Doe',
    dependencies: ['t1'],
    isCritical: true
  },
  {
    id: 't3',
    name: 'Wireframing',
    startDate: new Date('2023-08-26'),
    endDate: new Date('2023-09-05'),
    progress: 100,
    assignedTo: 'Jane Smith',
    dependencies: ['t2'],
    isCritical: true
  },
  {
    id: 't4',
    name: 'Review Wireframes',
    startDate: new Date('2023-09-06'),
    endDate: new Date('2023-09-06'),
    progress: 100,
    isMilestone: true,
    dependencies: ['t3'],
    isCritical: true
  },
  {
    id: 't5',
    name: 'UI Design',
    startDate: new Date('2023-09-07'),
    endDate: new Date('2023-09-25'),
    progress: 100,
    assignedTo: 'Jane Smith',
    dependencies: ['t4'],
    isCritical: true
  },
  {
    id: 't6',
    name: 'Design Approval',
    startDate: new Date('2023-09-26'),
    endDate: new Date('2023-09-26'),
    progress: 100,
    isMilestone: true,
    dependencies: ['t5'],
    isCritical: true
  },
  {
    id: 't7',
    name: 'Frontend Development',
    startDate: new Date('2023-09-27'),
    endDate: new Date('2023-10-15'),
    progress: 65,
    assignedTo: 'Robert Johnson',
    dependencies: ['t6'],
    isCritical: true
  },
  {
    id: 't8',
    name: 'Backend Integration',
    startDate: new Date('2023-10-10'),
    endDate: new Date('2023-10-20'),
    progress: 30,
    assignedTo: 'Lisa Wong',
    dependencies: ['t6'],
    isCritical: false
  },
  {
    id: 't9',
    name: 'Content Creation',
    startDate: new Date('2023-09-27'),
    endDate: new Date('2023-10-10'),
    progress: 100,
    assignedTo: 'Emily Davis',
    dependencies: ['t6'],
    isCritical: false
  },
  {
    id: 't10',
    name: 'Testing',
    startDate: new Date('2023-10-16'),
    endDate: new Date('2023-10-27'),
    progress: 0,
    assignedTo: 'John Doe',
    dependencies: ['t7', 't8'],
    isCritical: true
  },
  {
    id: 't11',
    name: 'Client Review',
    startDate: new Date('2023-10-20'),
    endDate: new Date('2023-10-25'),
    progress: 0,
    assignedTo: 'Jane Smith',
    dependencies: ['t9'],
    isCritical: false
  },
  {
    id: 't12',
    name: 'Final Adjustments',
    startDate: new Date('2023-10-26'),
    endDate: new Date('2023-10-28'),
    progress: 0,
    assignedTo: 'Robert Johnson',
    dependencies: ['t11'],
    isCritical: false
  },
  {
    id: 't13',
    name: 'Deployment',
    startDate: new Date('2023-10-28'),
    endDate: new Date('2023-10-30'),
    progress: 0,
    assignedTo: 'Lisa Wong',
    dependencies: ['t10', 't12'],
    isCritical: true
  },
  {
    id: 't14',
    name: 'Website Launch',
    startDate: new Date('2023-10-30'),
    endDate: new Date('2023-10-30'),
    progress: 0,
    isMilestone: true,
    dependencies: ['t13'],
    isCritical: true
  }
];

export const ganttStartDate = new Date('2023-08-15');
export const ganttEndDate = new Date('2023-11-05');

// Use this function to get projects with optional delay to simulate API calls
export function getMockProjects(delay = 1000): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects);
    }, delay);
  });
}

// Use this to get a single project by ID
export function getMockProjectById(id: string, delay = 500): Promise<Project | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find(p => p.id === id);
      resolve(project);
    }, delay);
  });
} 
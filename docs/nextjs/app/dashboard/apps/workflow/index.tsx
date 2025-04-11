'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './app-globals.css';
import { initializeApp } from './app-loader';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, Layout, Activity, Star, MessagesSquare, Database, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Play, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TemplateCard } from './components/shared/TemplateCard';
import { WorkflowCard } from './components/shared/WorkflowCard';
import { DashboardStatsCard } from './components/shared/DashboardStatsCard';

export interface WorkflowAppProps {
  // Define app-specific props
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  updatedAt?: string;
}

export function WorkflowApp(props: WorkflowAppProps) {
  const [isInitialized, setIsInitialized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // State for workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  
  // Featured templates data
  const [featuredTemplates, setFeaturedTemplates] = useState([
    {
      id: 'whatsapp-support',
      title: 'WhatsApp Customer Support',
      description: 'Automate product training & customer support via WhatsApp, GPT-4 & Google Sheets',
      category: 'Support',
      tags: ['AI', 'WhatsApp', 'Automation'],
      image: '/images/workflow-templates/whatsapp-support.png',
      author: 'Mixcore',
      nodes: 15,
      connections: 18
    },
    {
      id: 'data-processing',
      title: 'Data Processing Pipeline',
      description: 'Extract, transform and load data between different systems automatically',
      category: 'Data',
      tags: ['ETL', 'Database', 'API'],
      image: '/images/workflow-templates/data-pipeline.png',
      author: 'Mixcore',
      nodes: 8,
      connections: 10
    },
    {
      id: 'social-monitoring',
      title: 'Social Media Monitoring',
      description: 'Track mentions and engage with customers across multiple platforms',
      category: 'Marketing',
      tags: ['Social', 'Monitoring', 'Engagement'],
      image: '/images/workflow-templates/social-monitor.png',
      author: 'Mixcore',
      nodes: 12,
      connections: 15
    }
  ]);
  
  // Load workflows from localStorage for demo
  useEffect(() => {
    try {
      // Get workflows from localStorage
      const storedWorkflows = localStorage.getItem('mixcore_workflows');
      if (storedWorkflows) {
        const parsedWorkflows = JSON.parse(storedWorkflows);
        setWorkflows(parsedWorkflows);
      }
    } catch (err) {
      console.error('Error loading workflows:', err);
    }
  }, []);
  
  // Initialize app if needed
  useEffect(() => {
    const appInitKey = 'mixcore_workflow_initialized';
    const isAppInitialized = localStorage.getItem(appInitKey) === 'true';
    
    if (!isAppInitialized) {
      setIsLoading(true);
      initializeApp()
        .then(success => {
          if (success) {
            localStorage.setItem(appInitKey, 'true');
          }
          setIsInitialized(success);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error initializing app:', error);
          setIsInitialized(false);
          setIsLoading(false);
        });
    }
  }, []);
  
  // Workflow management functions
  const handleCreateWorkflow = () => {
    router.push('/dashboard/apps/workflow/editor/new');
  };
  
  const handleEditWorkflow = (id: string) => {
    router.push(`/dashboard/apps/workflow/editor/${id}`);
  };
  
  const handleViewWorkflowDetails = (id: string) => {
    router.push(`/dashboard/apps/workflow/${id}`);
  };
  
  const handleDeleteWorkflow = (id: string) => {
    // Filter out the workflow with the given ID
    const updatedWorkflows = workflows.filter(workflow => workflow.id !== id);
    setWorkflows(updatedWorkflows);
    
    // Update localStorage
    localStorage.setItem('mixcore_workflows', JSON.stringify(updatedWorkflows));
  };
  
  const handleToggleActive = (id: string, active: boolean) => {
    // Update the active status of the workflow
    const updatedWorkflows = workflows.map(workflow => {
      if (workflow.id === id) {
        return { ...workflow, active };
      }
      return workflow;
    });
    
    setWorkflows(updatedWorkflows);
    
    // Update localStorage
    localStorage.setItem('mixcore_workflows', JSON.stringify(updatedWorkflows));
  };
  
  const handleExecuteWorkflow = (id: string) => {
    console.log(`Executing workflow: ${id}`);
    // In a real implementation, this would call an API
    alert(`Workflow ${id} executed successfully`);
  };
  
  const handleUseTemplate = (templateId: string) => {
    // Redirect to the editor with the template
    router.push(`/dashboard/apps/workflow/editor/new?template=${templateId}`);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show error state
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <h2 className="text-xl font-bold">Initialization Error</h2>
        <p>Unable to initialize the Workflow Automation app. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="workflow-app-shell">
      <div className="workflow-app-header flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Workflow Automation</h1>
        <Button asChild>
          <Link href="/dashboard/apps/workflow/editor/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Workflow
          </Link>
        </Button>
      </div>
      
      <div className="workflow-app-content p-4">
        <div className="workflow-app-container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto">
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="workflows">My Workflows</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dashboard" className="mt-0">
              <p className="text-lg mb-6">Design and automate your workflows with a visual editor</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <DashboardStatsCard
                  title="Recent Workflows"
                  icon={<Clock className="h-5 w-5 mr-2 text-primary" />}
                  actionText="Create New Workflow"
                  onAction={() => setActiveTab('workflows')}
                >
                  {workflows.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">No recent workflows</p>
                  ) : (
                    <div className="space-y-2">
                      {workflows.slice(0, 3).map(workflow => (
                        <div key={workflow.id} className="flex items-center justify-between text-sm">
                          <span>{workflow.name}</span>
                          <Badge variant={workflow.active ? "default" : "outline"}>
                            {workflow.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </DashboardStatsCard>
                
                <DashboardStatsCard
                  title="Templates"
                  icon={<Layout className="h-5 w-5 mr-2 text-primary" />}
                  actionText="Browse Templates"
                  onAction={() => setActiveTab('templates')}
                >
                  <p className="text-sm text-muted-foreground mt-2">No templates available</p>
                </DashboardStatsCard>
                
                <DashboardStatsCard
                  title="Activity"
                  icon={<Activity className="h-5 w-5 mr-2 text-primary" />}
                  actionText="Go to Workflows"
                  onAction={() => setActiveTab('workflows')}
                >
                  <p className="text-sm text-muted-foreground mt-2">No recent activity</p>
                </DashboardStatsCard>
              </div>
              
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Featured Templates</h2>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('templates')}>
                    Explore all templates
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                      <div className="relative h-40 bg-slate-100 overflow-hidden">
                        <div className="absolute inset-0 opacity-80 bg-gradient-to-tr from-blue-50 to-indigo-50">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary opacity-20"></div>
                          <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400 opacity-20"></div>
                          <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-indigo-400 opacity-20"></div>
                          <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-green-400 opacity-20"></div>
                          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 rounded-full bg-purple-400 opacity-20"></div>
                          <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 -rotate-45 -translate-x-10 -translate-y-2"></div>
                          <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 rotate-45 -translate-x-10 -translate-y-2"></div>
                          <div className="absolute top-1/3 left-1/3 w-15 h-1 bg-gray-300 opacity-30 rotate-90 -translate-x-5"></div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="flex items-center mr-2"><MessagesSquare className="h-3 w-3 mr-1" />{template.nodes}</span>
                            <span className="flex items-center"><Database className="h-3 w-3 mr-1" />{template.connections}</span>
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-medium">{template.title}</CardTitle>
                          <Badge variant="secondary" className="ml-2">{template.category}</Badge>
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between items-center pt-2">
                        <div className="text-xs text-muted-foreground">
                          By {template.author}
                        </div>
                        <Button size="sm" variant="default" onClick={() => handleUseTemplate(template.id)}>
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <h3 className="text-lg font-medium mb-4">Need help getting started?</h3>
                <div className="flex justify-center gap-4">
                  <Button variant="secondary" onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/help/workflow">View Documentation</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="workflows" className="mt-0">
              {workflows.length === 0 ? (
                <Alert>
                  <AlertTitle>No workflows found</AlertTitle>
                  <AlertDescription>
                    Create your first workflow to get started. You can create a new workflow from scratch or use one of our templates.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflows.map(workflow => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onView={handleViewWorkflowDetails}
                      onEdit={handleEditWorkflow}
                      onDelete={handleDeleteWorkflow}
                      onExecute={handleExecuteWorkflow}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUseTemplate={handleUseTemplate}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="workflow-app-footer p-4 text-center border-t mt-6">
        <p className="text-sm text-muted-foreground">Workflow Automation Engine v1.0</p>
      </div>
    </div>
  );
}

// Default export for dynamic import
export default WorkflowApp; 
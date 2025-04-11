'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './app-globals.css';
import { initializeApp } from './app-loader';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Types
import { Workflow, WorkflowTemplate } from './lib/types';

// Utilities
import { 
  loadWorkflows, 
  saveWorkflow, 
  deleteWorkflow, 
  toggleWorkflowActive 
} from './lib/workflowUtils';

// Components
import WorkflowList from './components/shared/WorkflowList';
import TemplatesList from './components/dashboard/TemplatesList';
import Dashboard from './components/dashboard/Dashboard';

export interface WorkflowAppProps {
  // Define app-specific props
}

export function WorkflowApp(props: WorkflowAppProps) {
  const [isInitialized, setIsInitialized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { toast } = useToast();
  
  // State for workflows
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  
  // Featured templates data
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([
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
  
  // Load workflows from localStorage
  useEffect(() => {
    try {
      const loadedWorkflows = loadWorkflows();
      setWorkflows(loadedWorkflows);
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
  
  // Event Handlers
  const handleViewWorkflow = (id: string) => {
    router.push(`/dashboard/apps/workflow/${id}`);
  };
  
  const handleEditWorkflow = (id: string) => {
    router.push(`/dashboard/apps/workflow/editor/${id}`);
  };
  
  const handleDeleteWorkflow = (id: string) => {
    if (deleteWorkflow(id)) {
      setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
      
      toast({
        title: "Workflow deleted",
        description: "Workflow has been permanently deleted",
      });
    }
  };
  
  const handleToggleWorkflowActive = (id: string, active: boolean) => {
    const updatedWorkflow = toggleWorkflowActive(id, active);
    
    if (updatedWorkflow) {
      setWorkflows(prev => 
        prev.map(workflow => workflow.id === id ? updatedWorkflow : workflow)
      );
    }
  };
  
  const handleExecuteWorkflow = (id: string) => {
    toast({
      title: "Workflow executed",
      description: `Workflow execution started`,
    });
  };
  
  const handleUseTemplate = (templateId: string) => {
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
              <Dashboard 
                workflows={workflows}
                templates={templates}
                onViewAllWorkflows={() => setActiveTab('workflows')}
                onViewAllTemplates={() => setActiveTab('templates')}
              />
            </TabsContent>
            
            <TabsContent value="workflows" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">My Workflows</h2>
                  <Button asChild>
                    <Link href="/dashboard/apps/workflow/editor/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Workflow
                    </Link>
                  </Button>
                </div>
                
                <WorkflowList 
                  workflows={workflows}
                  onView={handleViewWorkflow}
                  onEdit={handleEditWorkflow}
                  onDelete={handleDeleteWorkflow}
                  onToggleActive={handleToggleWorkflowActive}
                  onExecute={handleExecuteWorkflow}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Workflow Templates</h2>
                </div>
                
                <TemplatesList 
                  templates={templates}
                  onUseTemplate={handleUseTemplate}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default WorkflowApp; 
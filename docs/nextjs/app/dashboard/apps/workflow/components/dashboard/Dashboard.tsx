'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, Clock, Layout, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Workflow, WorkflowTemplate } from '../../lib/types';

interface DashboardProps {
  workflows: Workflow[];
  templates: WorkflowTemplate[];
  onViewAllWorkflows: () => void;
  onViewAllTemplates: () => void;
}

export function Dashboard({ 
  workflows, 
  templates, 
  onViewAllWorkflows, 
  onViewAllTemplates 
}: DashboardProps) {
  return (
    <>
      <p className="text-lg mb-6">Design and automate your workflows with a visual editor</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Recent Workflows */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Workflows
            </h3>
            <Button variant="ghost" size="sm" onClick={onViewAllWorkflows}>
              View All
            </Button>
          </div>
          
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
          
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/apps/workflow/editor/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Workflow
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Templates */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <Layout className="h-5 w-5 mr-2 text-primary" />
              Templates
            </h3>
            <Button variant="ghost" size="sm" onClick={onViewAllTemplates}>
              View All
            </Button>
          </div>
          
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">No templates available</p>
          ) : (
            <div className="space-y-2">
              {templates.slice(0, 3).map(template => (
                <div key={template.id} className="flex items-center justify-between text-sm">
                  <span>{template.title}</span>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onViewAllTemplates} className="w-full">
              <Layout className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </h3>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">No recent activity</p>
          
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/apps/workflow/editor/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Workflow
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard; 
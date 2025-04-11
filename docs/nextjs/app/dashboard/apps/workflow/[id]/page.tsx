'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Edit, Play, Pause, Clock, Calendar, BarChart, 
  Calendar as CalendarIcon, Eye, Download, Trash2, Share2, Copy
} from 'lucide-react';
import ReactFlow, { 
  Background, Controls, MiniMap, ReactFlowProvider,
  Node, Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  runCount?: number;
  lastRun?: string;
  schedule?: {
    enabled: boolean;
    cron?: string;
  };
  tags?: string[];
}

interface ExecutionRecord {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  nodeCount: number;
}

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Fetch workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from API
        // For now, we'll simulate it with localStorage
        const storedWorkflows = localStorage.getItem('mixcore_workflows');
        if (storedWorkflows) {
          const workflows = JSON.parse(storedWorkflows);
          const found = workflows.find((w: Workflow) => w.id === id);
          
          if (found) {
            // Add some demo data for the UI
            setWorkflow({
              ...found,
              createdAt: found.createdAt || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: found.updatedAt || new Date().toISOString(),
              runCount: found.runCount || Math.floor(Math.random() * 50),
              lastRun: found.lastRun || new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              tags: found.tags || ['automation', 'data', 'integration']
            });
            
            // Generate fake execution history
            generateExecutionHistory(id);
          } else {
            router.push('/dashboard/apps?app=workflow');
          }
        } else {
          router.push('/dashboard/apps?app=workflow');
        }
      } catch (err) {
        console.error('Error fetching workflow:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkflow();
  }, [id, router]);
  
  // Generate fake execution history for demo
  const generateExecutionHistory = (workflowId: string) => {
    const records: ExecutionRecord[] = [];
    const now = new Date();
    
    // Generate 10 records with decreasing dates
    for (let i = 0; i < 10; i++) {
      const startTime = new Date(now.getTime() - i * 12 * 60 * 60 * 1000);
      const success = Math.random() > 0.2; // 80% success rate
      const duration = success ? Math.floor(Math.random() * 120000) + 5000 : Math.floor(Math.random() * 30000) + 5000;
      const endTime = new Date(startTime.getTime() + duration);
      
      records.push({
        id: `exec_${Date.now() - i}`,
        workflowId,
        status: success ? 'success' : 'failed',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        error: success ? undefined : 'Error executing node: http.request',
        nodeCount: Math.floor(Math.random() * 10) + 2
      });
    }
    
    setExecutions(records);
  };
  
  const handleEdit = () => {
    router.push(`/dashboard/apps/workflow/editor/${id}`);
  };
  
  const handleRun = () => {
    toast({
      title: "Workflow started",
      description: `Running ${workflow?.name}...`,
    });
  };
  
  const handleToggleActive = () => {
    if (!workflow) return;
    
    const updatedWorkflow = {
      ...workflow,
      active: !workflow.active
    };
    
    // In a real implementation, this would call the API
    // For now, update localStorage
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    if (storedWorkflows) {
      const workflows = JSON.parse(storedWorkflows);
      const updatedWorkflows = workflows.map((w: Workflow) => 
        w.id === id ? updatedWorkflow : w
      );
      
      localStorage.setItem('mixcore_workflows', JSON.stringify(updatedWorkflows));
      setWorkflow(updatedWorkflow);
      
      toast({
        title: updatedWorkflow.active ? "Workflow activated" : "Workflow deactivated",
        description: updatedWorkflow.active 
          ? "Workflow will run according to its schedule" 
          : "Workflow will not run automatically",
      });
    }
  };
  
  const handleDelete = () => {
    // Delete workflow from localStorage
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    if (storedWorkflows) {
      const workflows = JSON.parse(storedWorkflows);
      const filteredWorkflows = workflows.filter((w: Workflow) => w.id !== id);
      
      localStorage.setItem('mixcore_workflows', JSON.stringify(filteredWorkflows));
      
      toast({
        title: "Workflow deleted",
        description: "Workflow has been permanently deleted",
      });
      
      router.push('/dashboard/apps?app=workflow');
    }
  };
  
  const handleDuplicate = () => {
    if (!workflow) return;
    
    const newWorkflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to localStorage
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    let workflows = storedWorkflows ? JSON.parse(storedWorkflows) : [];
    workflows.push(newWorkflow);
    
    localStorage.setItem('mixcore_workflows', JSON.stringify(workflows));
    
    toast({
      title: "Workflow duplicated",
      description: "A copy of the workflow has been created",
    });
    
    router.push(`/dashboard/apps/workflow/${newWorkflow.id}`);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Workflow Not Found</h2>
        <p className="mt-2">The requested workflow could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/apps?app=workflow">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="workflow-detail-page">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/apps?app=workflow">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">{workflow.name}</h1>
          <Badge variant={workflow.active ? "default" : "outline"}>
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch 
              checked={workflow.active} 
              onCheckedChange={handleToggleActive}
              id="workflow-active"
            />
            <label htmlFor="workflow-active" className="text-sm">
              {workflow.active ? "Active" : "Inactive"}
            </label>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRun}>
            <Play className="mr-2 h-4 w-4" />
            Run Now
          </Button>
          
          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="executions">Execution History</TabsTrigger>
                <TabsTrigger value="preview">Workflow Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {workflow.description || "No description provided"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Last Run
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{formatDate(workflow.lastRun)}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <Play className="h-4 w-4 mr-2 text-muted-foreground" />
                          Total Runs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{workflow.runCount || 0}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          Created On
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{formatDate(workflow.createdAt)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Workflow Details</h3>
                    <div className="bg-card rounded-md border p-4">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                          <dd className="mt-1 flex items-center">
                            {workflow.active ? (
                              <>
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                Active
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                                Inactive
                              </>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                          <dd className="mt-1">{formatDate(workflow.updatedAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Node Count</dt>
                          <dd className="mt-1">{workflow.nodes?.length || 0}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Connection Count</dt>
                          <dd className="mt-1">{workflow.edges?.length || 0}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Scheduled</dt>
                          <dd className="mt-1">
                            {workflow.schedule?.enabled ? (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                {workflow.schedule.cron || "Custom schedule"}
                              </span>
                            ) : (
                              "Not scheduled"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                          <dd className="mt-1 flex flex-wrap gap-1">
                            {workflow.tags?.map(tag => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="executions" className="p-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-muted p-3 text-sm font-medium">
                    <div className="col-span-2">Timestamp</div>
                    <div>Status</div>
                    <div>Duration</div>
                    <div>Nodes</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {executions.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No execution history available
                      </div>
                    ) : (
                      executions.map(execution => (
                        <div key={execution.id} className="grid grid-cols-6 p-3 text-sm">
                          <div className="col-span-2">
                            <div>{formatDate(execution.startTime)}</div>
                            {execution.error && (
                              <div className="text-xs text-destructive mt-1">{execution.error}</div>
                            )}
                          </div>
                          <div>
                            <Badge variant={
                              execution.status === 'success' ? 'default' :
                              execution.status === 'running' ? 'outline' : 'destructive'
                            }>
                              {execution.status}
                            </Badge>
                          </div>
                          <div>{formatDuration(execution.duration)}</div>
                          <div>{execution.nodeCount}</div>
                          <div className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="p-4">
                <div className="border rounded-md h-[500px] overflow-hidden">
                  <ReactFlowProvider>
                    <ReactFlow
                      nodes={workflow.nodes || []}
                      edges={workflow.edges || []}
                      fitView
                      nodesDraggable={false}
                      nodesConnectable={false}
                      elementsSelectable={false}
                      zoomOnScroll={false}
                      panOnScroll={true}
                    >
                      <Background />
                      <Controls showInteractive={false} />
                      <MiniMap />
                    </ReactFlow>
                  </ReactFlowProvider>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Workflow
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={handleRun}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Now
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                
                <Separator />
                
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <AlertDialogTrigger className="flex items-center w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Workflow
                  </AlertDialogTrigger>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Configure automatic runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="schedule-active" />
                    <label htmlFor="schedule-active">
                      Enable Scheduling
                    </label>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>
                    This workflow is currently not scheduled to run automatically.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Set up a schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow
              and all associated execution history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 
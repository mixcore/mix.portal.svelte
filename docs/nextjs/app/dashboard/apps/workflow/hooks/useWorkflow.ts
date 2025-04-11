'use client';

import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface Workflow {
  id?: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
  schedule?: {
    enabled: boolean;
    cron?: string;
  };
}

interface UseWorkflowReturn {
  workflow: Workflow | null;
  loading: boolean;
  error: string | null;
  saveWorkflow: (workflow: Workflow) => Promise<void>;
  executeWorkflow: () => Promise<void>;
}

export function useWorkflow(workflowId?: string): UseWorkflowReturn {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!workflowId) {
          // Create a new empty workflow if no ID provided
          setWorkflow({
            name: 'New Workflow',
            description: '',
            nodes: [],
            edges: [],
            active: false
          });
          setLoading(false);
          return;
        }

        // In a real implementation, this would fetch from API
        // For now, we'll simulate it with localStorage
        const storedWorkflows = localStorage.getItem('mixcore_workflows');
        if (storedWorkflows) {
          const workflows = JSON.parse(storedWorkflows);
          const found = workflows.find((w: Workflow) => w.id === workflowId);
          if (found) {
            setWorkflow(found);
          } else {
            setError('Workflow not found');
          }
        } else {
          setError('No workflows found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workflow');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId]);

  // Save workflow
  const saveWorkflow = useCallback(async (updatedWorkflow: Workflow) => {
    try {
      setError(null);
      
      // Create new workflow ID if needed
      if (!updatedWorkflow.id) {
        updatedWorkflow.id = `workflow_${Date.now()}`;
      }
      
      // In a real implementation, this would call the API
      // For now, we'll simulate it with localStorage
      const storedWorkflows = localStorage.getItem('mixcore_workflows');
      let workflows = storedWorkflows ? JSON.parse(storedWorkflows) : [];
      
      const existingIndex = workflows.findIndex((w: Workflow) => w.id === updatedWorkflow.id);
      if (existingIndex >= 0) {
        workflows[existingIndex] = updatedWorkflow;
      } else {
        workflows.push(updatedWorkflow);
      }
      
      localStorage.setItem('mixcore_workflows', JSON.stringify(workflows));
      setWorkflow(updatedWorkflow);
      
      // For demo, simulate a slight delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
      throw err;
    }
  }, []);

  // Execute workflow
  const executeWorkflow = useCallback(async () => {
    try {
      if (!workflow) {
        throw new Error('No workflow loaded');
      }
      
      setError(null);
      
      // For demo purposes, just log the execution
      console.log(`Executing workflow: ${workflow.name}`);
      console.log('Nodes:', workflow.nodes);
      console.log('Edges:', workflow.edges);
      
      // In a real implementation, this would call the API to execute the workflow
      // For demo, simulate a slight delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Workflow execution completed');
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      throw err;
    }
  }, [workflow]);

  return {
    workflow,
    loading,
    error,
    saveWorkflow,
    executeWorkflow
  };
} 
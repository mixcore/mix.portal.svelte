'use client';

import { Workflow, ExecutionRecord } from './types';

/**
 * Load workflows from localStorage
 * 
 * In a real implementation, this would be an API call
 */
export const loadWorkflows = (): Workflow[] => {
  try {
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    if (storedWorkflows) {
      return JSON.parse(storedWorkflows);
    }
  } catch (err) {
    console.error('Error loading workflows:', err);
  }
  return [];
};

/**
 * Load a single workflow by ID from localStorage
 */
export const loadWorkflowById = (id: string): Workflow | null => {
  try {
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    if (storedWorkflows) {
      const workflows = JSON.parse(storedWorkflows);
      return workflows.find((w: Workflow) => w.id === id) || null;
    }
  } catch (err) {
    console.error('Error loading workflow:', err);
  }
  return null;
};

/**
 * Save a workflow to localStorage
 */
export const saveWorkflow = (workflow: Workflow): Workflow => {
  try {
    // Create new workflow ID if needed
    if (!workflow.id) {
      workflow.id = `workflow_${Date.now()}`;
    }
    
    // Add timestamps
    workflow.updatedAt = new Date().toISOString();
    if (!workflow.createdAt) {
      workflow.createdAt = workflow.updatedAt;
    }
    
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    let workflows = storedWorkflows ? JSON.parse(storedWorkflows) : [];
    
    const existingIndex = workflows.findIndex((w: Workflow) => w.id === workflow.id);
    if (existingIndex >= 0) {
      workflows[existingIndex] = workflow;
    } else {
      workflows.push(workflow);
    }
    
    localStorage.setItem('mixcore_workflows', JSON.stringify(workflows));
    return workflow;
  } catch (err) {
    console.error('Error saving workflow:', err);
    throw err;
  }
};

/**
 * Delete a workflow from localStorage
 */
export const deleteWorkflow = (id: string): boolean => {
  try {
    const storedWorkflows = localStorage.getItem('mixcore_workflows');
    if (storedWorkflows) {
      const workflows = JSON.parse(storedWorkflows);
      const filteredWorkflows = workflows.filter((w: Workflow) => w.id !== id);
      localStorage.setItem('mixcore_workflows', JSON.stringify(filteredWorkflows));
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error deleting workflow:', err);
    return false;
  }
};

/**
 * Toggle workflow active status
 */
export const toggleWorkflowActive = (id: string, active: boolean): Workflow | null => {
  try {
    const workflow = loadWorkflowById(id);
    if (workflow) {
      const updatedWorkflow = { ...workflow, active };
      saveWorkflow(updatedWorkflow);
      return updatedWorkflow;
    }
    return null;
  } catch (err) {
    console.error('Error toggling workflow status:', err);
    return null;
  }
};

/**
 * Generate mock execution history for a workflow
 */
export const generateExecutionHistory = (workflowId: string, count = 10): ExecutionRecord[] => {
  const records: ExecutionRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
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
  
  return records;
};

/**
 * Format a date string in a readable format
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a duration in milliseconds
 */
export const formatDuration = (ms?: number): string => {
  if (!ms) return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}; 
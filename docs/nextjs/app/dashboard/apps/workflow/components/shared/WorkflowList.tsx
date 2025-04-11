'use client';

import React from 'react';
import { Workflow } from '../../lib/types';
import WorkflowCard from './WorkflowCard';

interface WorkflowListProps {
  workflows: Workflow[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onExecute: (id: string) => void;
}

export function WorkflowList({ 
  workflows, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onExecute 
}: WorkflowListProps) {
  if (!workflows || workflows.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-card">
        <p className="text-muted-foreground">No workflows found.</p>
        <p className="text-sm text-muted-foreground mt-1">Create a new workflow to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.map(workflow => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onExecute={onExecute}
        />
      ))}
    </div>
  );
}

export default WorkflowList; 
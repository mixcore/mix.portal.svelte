'use client';

import React from 'react';
import { Workflow } from '../../lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '../../lib/workflowUtils';

interface WorkflowDetailsProps {
  workflow: Workflow;
}

export function WorkflowDetails({ workflow }: WorkflowDetailsProps) {
  return (
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
            {(!workflow.tags || workflow.tags.length === 0) && (
              <span className="text-muted-foreground text-sm">No tags</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default WorkflowDetails; 
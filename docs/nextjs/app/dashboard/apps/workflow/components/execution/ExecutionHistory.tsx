'use client';

import React from 'react';
import { ExecutionRecord } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatDate, formatDuration } from '../../lib/workflowUtils';
import ExecutionStatusBadge from '../shared/ExecutionStatusBadge';

interface ExecutionHistoryProps {
  executions: ExecutionRecord[];
  onViewExecution?: (id: string) => void;
}

export function ExecutionHistory({ executions, onViewExecution }: ExecutionHistoryProps) {
  if (executions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No execution history available
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 bg-muted p-3 text-sm font-medium">
        <div className="col-span-2">Timestamp</div>
        <div>Status</div>
        <div>Duration</div>
        <div>Nodes</div>
        <div className="text-right">Actions</div>
      </div>
      <div className="divide-y">
        {executions.map(execution => (
          <div key={execution.id} className="grid grid-cols-6 p-3 text-sm">
            <div className="col-span-2">
              <div>{formatDate(execution.startTime)}</div>
              {execution.error && (
                <div className="text-xs text-destructive mt-1">{execution.error}</div>
              )}
            </div>
            <div>
              <ExecutionStatusBadge status={execution.status} />
            </div>
            <div>{formatDuration(execution.duration)}</div>
            <div>{execution.nodeCount}</div>
            <div className="text-right">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onViewExecution && onViewExecution(execution.id)}
                disabled={!onViewExecution}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutionHistory; 
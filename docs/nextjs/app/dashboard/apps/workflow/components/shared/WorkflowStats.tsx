'use client';

import React from 'react';
import { Workflow } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Play, CalendarIcon } from 'lucide-react';
import { formatDate } from '../../lib/workflowUtils';

interface WorkflowStatsProps {
  workflow: Workflow;
}

export function WorkflowStats({ workflow }: WorkflowStatsProps) {
  return (
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
  );
}

export default WorkflowStats; 
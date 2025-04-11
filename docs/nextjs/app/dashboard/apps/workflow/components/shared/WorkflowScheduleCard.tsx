'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface WorkflowScheduleCardProps {
  isScheduled: boolean;
  scheduleExpression?: string;
  onToggleSchedule: (enabled: boolean) => void;
  onConfigureSchedule: () => void;
}

export function WorkflowScheduleCard({
  isScheduled,
  scheduleExpression,
  onToggleSchedule,
  onConfigureSchedule
}: WorkflowScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
        <CardDescription>Configure automatic runs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="schedule-active" 
              checked={isScheduled}
              onCheckedChange={onToggleSchedule}
            />
            <label htmlFor="schedule-active">
              Enable Scheduling
            </label>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {isScheduled && scheduleExpression ? (
            <p>
              This workflow is scheduled to run: <br />
              <span className="font-mono bg-muted px-1 rounded">
                {scheduleExpression}
              </span>
            </p>
          ) : (
            <p>
              This workflow is currently not scheduled to run automatically.
            </p>
          )}
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={onConfigureSchedule}
          >
            {isScheduled ? 'Update schedule' : 'Set up a schedule'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkflowScheduleCard; 
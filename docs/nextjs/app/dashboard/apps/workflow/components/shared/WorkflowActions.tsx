'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, Play, Copy, Download, Trash2 
} from 'lucide-react';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface WorkflowActionsProps {
  onEdit: () => void;
  onRun: () => void;
  onDuplicate: () => void;
  onExport?: () => void;
  showDeleteTrigger?: boolean;
}

export function WorkflowActions({ 
  onEdit, 
  onRun, 
  onDuplicate, 
  onExport,
  showDeleteTrigger = true
}: WorkflowActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Workflow
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={onRun}>
          <Play className="mr-2 h-4 w-4" />
          Run Now
        </Button>
        
        <Button variant="outline" className="w-full justify-start" onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>
        
        {onExport && (
          <Button variant="outline" className="w-full justify-start" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        
        {showDeleteTrigger && (
          <>
            <Separator />
            
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <AlertDialogTrigger className="flex items-center w-full justify-start">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Workflow
              </AlertDialogTrigger>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkflowActions; 
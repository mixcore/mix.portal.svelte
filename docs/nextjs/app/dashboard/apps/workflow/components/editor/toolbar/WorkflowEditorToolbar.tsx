'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Save, Undo, Redo, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WorkflowEditorToolbarProps {
  workflowName: string;
  workflowDesc: string;
  onNameChange: (name: string) => void;
  onDescChange: (desc: string) => void;
  onSave: () => void;
  onExecute: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  isSaving: boolean;
}

export function WorkflowEditorToolbar({
  workflowName,
  workflowDesc,
  onNameChange,
  onDescChange,
  onSave,
  onExecute,
  onUndo,
  onRedo,
  onExport,
  isSaving
}: WorkflowEditorToolbarProps) {
  return (
    <div className="workflow-editor-toolbar flex items-center gap-2 p-2 border-b">
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="workflow-name" className="text-sm">Name:</Label>
          <Input
            id="workflow-name"
            value={workflowName}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-8 w-48"
            placeholder="Workflow name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="workflow-desc" className="text-sm">Description:</Label>
          <Input
            id="workflow-desc"
            value={workflowDesc}
            onChange={(e) => onDescChange(e.target.value)}
            className="h-8 w-64"
            placeholder="Workflow description"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onUndo} title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Workflow</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to save this workflow?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button variant="outline" size="sm" onClick={onExecute}>
          <Play className="h-4 w-4 mr-1" />
          Run
        </Button>
        
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
} 
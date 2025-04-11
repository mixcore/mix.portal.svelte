'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, Play, MoreHorizontal, Trash2 } from 'lucide-react';

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    description?: string;
    active: boolean;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function WorkflowCard({ 
  workflow, 
  onView, 
  onEdit, 
  onDelete, 
  onExecute,
  onToggleActive 
}: WorkflowCardProps) {
  return (
    <div className="group relative flex items-center justify-between p-4 bg-card rounded-md border hover:shadow-md transition-shadow">
      <div onClick={() => onView(workflow.id)} className="cursor-pointer flex-1">
        <div className="flex items-center">
          <h3 className="font-medium">{workflow.name}</h3>
          <Badge variant={workflow.active ? "default" : "outline"} className="ml-2">
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        {workflow.description && (
          <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Switch 
            checked={workflow.active} 
            onCheckedChange={(checked) => onToggleActive(workflow.id, checked)}
          />
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => onExecute(workflow.id)}>
          <Play className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(workflow.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(workflow.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(workflow.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default WorkflowCard; 
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NodePalette } from './NodePalette';
import { Properties } from './Properties';
import { Node } from 'reactflow';
import { WorkflowNodeData } from '../../../lib/types';

interface WorkflowEditorSidebarProps {
  collapsed: boolean;
  selectedNode: Node<WorkflowNodeData> | null;
  onToggleCollapse: () => void;
  onNodeUpdate: (node: Node<WorkflowNodeData>) => void;
}

export function WorkflowEditorSidebar({
  collapsed,
  selectedNode,
  onToggleCollapse,
  onNodeUpdate
}: WorkflowEditorSidebarProps) {
  if (collapsed) {
    return (
      <div className="workflow-sidebar workflow-sidebar-collapsed">
        <Button 
          variant="ghost" 
          size="icon" 
          className="m-2" 
          onClick={onToggleCollapse}
          title="Expand Sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="workflow-sidebar">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="font-medium">Editor Tools</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          title="Collapse Sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="nodes">
        <TabsList className="w-full">
          <TabsTrigger value="nodes" className="flex-1">Nodes</TabsTrigger>
          <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes" className="mt-2 overflow-auto h-[calc(100%-40px)]">
          <NodePalette />
        </TabsContent>
        
        <TabsContent value="properties" className="mt-2 overflow-auto h-[calc(100%-40px)]">
          <Properties 
            node={selectedNode} 
            onChange={onNodeUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 
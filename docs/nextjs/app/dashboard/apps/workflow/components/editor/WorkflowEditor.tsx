'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider, addEdge } from 'reactflow';
import { Node, Edge, Connection } from 'reactflow';
import { WorkflowCanvas } from './canvas/WorkflowCanvas';
import { WorkflowEditorToolbar } from './toolbar/WorkflowEditorToolbar';
import { WorkflowEditorSidebar } from './sidebar/WorkflowEditorSidebar';
import { useWorkflow } from '../../hooks/useWorkflow';
import { WorkflowNodeData } from '../../lib/types';
import { nodeTypes } from './nodes';

interface WorkflowEditorProps {
  workflowId?: string;
}

function WorkflowEditorContent({ workflowId }: WorkflowEditorProps) {
  const { workflow, loading, error, saveWorkflow, executeWorkflow } = useWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDesc, setWorkflowDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Load workflow data when available
  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
      setWorkflowName(workflow.name || 'New Workflow');
      setWorkflowDesc(workflow.description || '');
    }
  }, [workflow]);
  
  const onNodesChange = useCallback((changes: any) => {
    setNodes(nds => {
      const newNodes = [...nds];
      changes.forEach((change: any) => {
        if (change.type === 'add') {
          newNodes.push(change.item);
        } else if (change.type === 'remove') {
          const index = newNodes.findIndex(n => n.id === change.id);
          if (index !== -1) {
            newNodes.splice(index, 1);
          }
        } else if (change.type === 'update') {
          const index = newNodes.findIndex(n => n.id === change.id);
          if (index !== -1) {
            newNodes[index] = { ...newNodes[index], ...change.updates };
          }
        }
      });
      return newNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges(eds => {
      const newEdges = [...eds];
      changes.forEach((change: any) => {
        if (change.type === 'add') {
          newEdges.push(change.item);
        } else if (change.type === 'remove') {
          const index = newEdges.findIndex(e => e.id === change.id);
          if (index !== -1) {
            newEdges.splice(index, 1);
          }
        } else if (change.type === 'update') {
          const index = newEdges.findIndex(e => e.id === change.id);
          if (index !== -1) {
            newEdges[index] = { ...newEdges[index], ...change.updates };
          }
        }
      });
      return newEdges;
    });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({ ...connection, type: 'smoothstep' }, eds));
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<WorkflowNodeData>);
  }, []);

  const handleNodeUpdate = useCallback((updatedNode: Node<WorkflowNodeData>) => {
    setNodes(nds => nds.map(node => (node.id === updatedNode.id ? updatedNode : node)));
    setSelectedNode(updatedNode);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveWorkflow({
        ...(workflow || {}),
        id: workflow?.id,
        name: workflowName,
        description: workflowDesc,
        nodes,
        edges,
        active: workflow?.active || false
      });
    } catch (err) {
      console.error('Failed to save workflow:', err);
    } finally {
      setIsSaving(false);
    }
  }, [workflow, workflowName, workflowDesc, nodes, edges, saveWorkflow]);

  const handleExecute = useCallback(() => {
    executeWorkflow();
  }, [executeWorkflow]);

  const handleUndo = useCallback(() => {
    // TODO: Implement undo functionality
  }, []);

  const handleRedo = useCallback(() => {
    // TODO: Implement redo functionality
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-destructive text-xl font-bold">Error</div>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="workflow-editor h-full flex flex-col">
      <WorkflowEditorToolbar
        workflowName={workflowName}
        workflowDesc={workflowDesc}
        onNameChange={setWorkflowName}
        onDescChange={setWorkflowDesc}
        onSave={handleSave}
        onExecute={handleExecute}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
        isSaving={isSaving}
      />
      
      <div className="workflow-editor-main flex-1 flex">
        <WorkflowEditorSidebar
          collapsed={sidebarCollapsed}
          selectedNode={selectedNode}
          onToggleCollapse={toggleSidebar}
          onNodeUpdate={handleNodeUpdate}
        />
        
        <div className="workflow-editor-content flex-1">
          <WorkflowCanvas
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
          />
        </div>
      </div>
    </div>
  );
}

export function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent {...props} />
    </ReactFlowProvider>
  );
} 
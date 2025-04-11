'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  useReactFlow,
  Panel,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowNodeData } from '../../../lib/types';
import { getNodeType } from '../../../lib/nodeRegistry';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface WorkflowCanvasProps {
  initialNodes: Node<WorkflowNodeData>[];
  initialEdges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  nodeTypes: Record<string, React.ComponentType<any>>;
}

export function WorkflowCanvas({
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  nodeTypes
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeLocal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeLocal] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();

  // Sync local state with parent state
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const nodeType = event.dataTransfer.getData('application/reactflow');
    
    if (!nodeType || !reactFlowInstance) {
      return;
    }
    
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    const nodeTypeInfo = getNodeType(nodeType);
    if (!nodeTypeInfo) {
      console.error(`Unknown node type: ${nodeType}`);
      return;
    }
    
    const newNode: Node<WorkflowNodeData> = {
      id: `node_${Date.now()}`,
      type: 'default',
      position,
      data: {
        type: nodeType,
        label: nodeTypeInfo.label,
        properties: {}
      }
    };
    
    nodeTypeInfo.properties.forEach(prop => {
      if (prop.default !== undefined) {
        newNode.data.properties[prop.name] = prop.default;
      }
    });
    
    setNodes(nds => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);
  
  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);
  
  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeLocal(changes);
    onNodesChange(changes);
  }, [onNodesChangeLocal, onNodesChange]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeLocal(changes);
    onEdgesChange(changes);
  }, [onEdgesChangeLocal, onEdgesChange]);

  const handleConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({ ...params, type: 'smoothstep' }, eds));
    onConnect(params);
  }, [setEdges, onConnect]);

  return (
    <div className="workflow-canvas h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        deleteKeyCode="Delete"
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#64748b' }
        }}
      >
        <Background gap={12} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor="#94a3b8"
          maskColor="#f1f5f9"
          style={{ backgroundColor: '#ffffff' }}
        />
        <Panel position="top-right" className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg shadow-sm p-1">
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleFitView} title="Fit View">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
} 
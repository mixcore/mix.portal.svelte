'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowGraphPreviewProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
}

export function WorkflowGraphPreview({ nodes, edges, className = 'h-[500px]' }: WorkflowGraphPreviewProps) {
  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes || []}
          edges={edges || []}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnScroll={true}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default WorkflowGraphPreview; 
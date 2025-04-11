'use client';

import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { getNodeType } from '../../../lib/nodeRegistry';
import { WorkflowNodeData } from '../../../lib/types';
import { Database, GitBranch, Globe, Repeat, Webhook, Clock } from 'lucide-react';

const getIconForNode = (type: string) => {
  const nodeType = type.split('.')[0];
  
  switch (nodeType) {
    case 'trigger':
      if (type === 'trigger.webhook') return <Webhook className="h-4 w-4" />;
      if (type === 'trigger.schedule') return <Clock className="h-4 w-4" />;
      return <Clock className="h-4 w-4" />;
    case 'database':
      return <Database className="h-4 w-4" />;
    case 'logic':
      if (type === 'logic.conditional') return <GitBranch className="h-4 w-4" />;
      if (type === 'logic.foreach') return <Repeat className="h-4 w-4" />;
      return <GitBranch className="h-4 w-4" />;
    case 'http':
      return <Globe className="h-4 w-4" />;
    default:
      return null;
  }
};

const BaseNode = ({ data, id, isConnectable }: NodeProps<WorkflowNodeData>) => {
  const nodeType = getNodeType(data.type);
  
  if (!nodeType) {
    return (
      <div className="workflow-node bg-destructive/10 border-destructive">
        <div className="workflow-node-header">
          <div className="workflow-node-icon bg-destructive text-destructive-foreground">
            !
          </div>
          <div className="workflow-node-title">Unknown Node Type</div>
        </div>
        <div className="text-xs text-destructive">
          Type: {data.type}
        </div>
      </div>
    );
  }
  
  return (
    <div className="workflow-node">
      <div className="workflow-node-header">
        <div className="workflow-node-icon">
          {getIconForNode(data.type)}
        </div>
        <div className="workflow-node-title">
          {data.label || nodeType.label}
        </div>
      </div>
      
      <div className="workflow-node-ports">
        {/* Input Ports */}
        {nodeType.inputs.map(input => (
          <Handle
            key={`input-${input.name}`}
            type="target"
            position={Position.Left}
            id={input.name}
            style={{ left: -8, backgroundColor: 'var(--primary)' }}
            isConnectable={isConnectable}
          />
        ))}
        
        {/* Output Ports */}
        {nodeType.outputs.map(output => (
          <Handle
            key={`output-${output.name}`}
            type="source"
            position={Position.Right}
            id={output.name}
            style={{ right: -8, backgroundColor: 'var(--primary)' }}
            isConnectable={isConnectable}
          />
        ))}
        
        {/* Node specific content */}
        {data.properties && (
          <div className="mt-2 text-xs text-muted-foreground">
            {Object.entries(data.properties).map(([key, value]) => {
              // Only show select properties in the node display
              const prop = nodeType.properties.find(p => p.name === key);
              if (!prop || prop.type === 'json' || prop.type === 'code' || prop.type === 'textarea') {
                return null;
              }
              return (
                <div key={key} className="truncate">
                  <span className="font-medium">{prop.label}: </span>
                  <span>{String(value)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const nodeTypes = {
  default: memo(BaseNode),
}; 
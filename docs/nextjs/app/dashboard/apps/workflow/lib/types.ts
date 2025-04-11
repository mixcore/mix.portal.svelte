import { Node, Edge } from 'reactflow';

export interface NodeTypePort {
  name: string;
  label: string;
  multiple?: boolean;
}

export interface NodeTypeProperty {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json' | 'textarea' | 'code';
  required?: boolean;
  default?: any;
  options?: string[] | { label: string; value: string }[];
}

export interface NodeType {
  type: string;
  label: string;
  category: string;
  description: string;
  icon: string;
  inputs: NodeTypePort[];
  outputs: NodeTypePort[];
  properties: NodeTypeProperty[];
  execute?: (inputs: any, properties: any) => Promise<any>;
}

export interface WorkflowNodeData {
  label?: string;
  type: string;
  [key: string]: any;
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData;
}

// Workflow type definitions

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  runCount?: number;
  lastRun?: string;
  schedule?: {
    enabled: boolean;
    cron?: string;
  };
  tags?: string[];
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  author: string;
  nodes: number;
  connections: number;
}

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration?: number;
  error?: string;
  nodeCount: number;
} 
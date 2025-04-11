'use client';

import { NodeType } from './types';

const nodeTypes: Record<string, NodeType> = {};

export function registerNodeType(type: string, nodeConfig: NodeType) {
  nodeTypes[type] = nodeConfig;
}

export function getNodeTypes(): Record<string, NodeType> {
  return nodeTypes;
}

export function getNodeType(type: string): NodeType | undefined {
  return nodeTypes[type];
}

export function getNodeCategories(): string[] {
  const categories = new Set<string>();
  Object.values(nodeTypes).forEach(node => {
    categories.add(node.category);
  });
  return Array.from(categories);
}

// Define and register basic node types

// Trigger Nodes
registerNodeType('trigger.webhook', {
  type: 'trigger.webhook',
  label: 'Webhook',
  category: 'Triggers',
  description: 'Trigger workflow via HTTP request',
  icon: 'webhook',
  inputs: [],
  outputs: [
    {
      name: 'output',
      label: 'Output',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'path',
      label: 'Path',
      type: 'string',
      required: true
    },
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'POST'
    }
  ]
});

registerNodeType('trigger.schedule', {
  type: 'trigger.schedule',
  label: 'Schedule',
  category: 'Triggers',
  description: 'Trigger workflow on a schedule',
  icon: 'schedule',
  inputs: [],
  outputs: [
    {
      name: 'output',
      label: 'Output',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'schedule',
      label: 'Cron Expression',
      type: 'string',
      required: true,
      default: '0 0 * * *'
    },
    {
      name: 'name',
      label: 'Schedule Name',
      type: 'string'
    }
  ]
});

// Database Nodes
registerNodeType('database.query', {
  type: 'database.query',
  label: 'Database Query',
  category: 'Database',
  description: 'Query records from MixDB',
  icon: 'database',
  inputs: [
    {
      name: 'input',
      label: 'Input',
      multiple: false
    }
  ],
  outputs: [
    {
      name: 'output',
      label: 'Output',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'collection',
      label: 'Collection',
      type: 'string',
      required: true
    },
    {
      name: 'query',
      label: 'Query',
      type: 'json',
      default: '{}'
    },
    {
      name: 'limit',
      label: 'Limit',
      type: 'number',
      default: 10
    }
  ]
});

registerNodeType('database.update', {
  type: 'database.update',
  label: 'Database Update',
  category: 'Database',
  description: 'Update records in MixDB',
  icon: 'edit',
  inputs: [
    {
      name: 'input',
      label: 'Input',
      multiple: true
    }
  ],
  outputs: [
    {
      name: 'output',
      label: 'Output',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'collection',
      label: 'Collection',
      type: 'string',
      required: true
    },
    {
      name: 'update',
      label: 'Update',
      type: 'json',
      default: '{}'
    }
  ]
});

// Logic Nodes
registerNodeType('logic.conditional', {
  type: 'logic.conditional',
  label: 'Conditional',
  category: 'Logic',
  description: 'Branch based on a condition',
  icon: 'git-branch',
  inputs: [
    {
      name: 'input',
      label: 'Input',
      multiple: false
    }
  ],
  outputs: [
    {
      name: 'true',
      label: 'True',
      multiple: true
    },
    {
      name: 'false',
      label: 'False',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'condition',
      label: 'Condition',
      type: 'code',
      required: true,
      default: 'return input.value === true;'
    }
  ]
});

registerNodeType('logic.foreach', {
  type: 'logic.foreach',
  label: 'ForEach',
  category: 'Logic',
  description: 'Loop through array items',
  icon: 'repeat',
  inputs: [
    {
      name: 'input',
      label: 'Input',
      multiple: false
    }
  ],
  outputs: [
    {
      name: 'item',
      label: 'Item',
      multiple: true
    },
    {
      name: 'completed',
      label: 'Completed',
      multiple: false
    }
  ],
  properties: []
});

// HTTP Nodes
registerNodeType('http.request', {
  type: 'http.request',
  label: 'HTTP Request',
  category: 'HTTP',
  description: 'Make HTTP requests to external services',
  icon: 'globe',
  inputs: [
    {
      name: 'input',
      label: 'Input',
      multiple: false
    }
  ],
  outputs: [
    {
      name: 'output',
      label: 'Output',
      multiple: true
    }
  ],
  properties: [
    {
      name: 'url',
      label: 'URL',
      type: 'string',
      required: true
    },
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET'
    },
    {
      name: 'headers',
      label: 'Headers',
      type: 'json',
      default: '{}'
    },
    {
      name: 'body',
      label: 'Body',
      type: 'textarea'
    }
  ]
}); 
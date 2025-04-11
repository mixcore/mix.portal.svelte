'use client';

import React, { useMemo } from 'react';
import { getNodeTypes, getNodeCategories } from '../../../lib/nodeRegistry';
import { Database, GitBranch, Globe, Repeat, Webhook, Clock, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const getIconForNodeType = (type: string) => {
  const nodeType = type.split('.')[0];
  
  switch (nodeType) {
    case 'trigger':
      if (type === 'trigger.webhook') return <Webhook className="h-4 w-4" />;
      if (type === 'trigger.schedule') return <Clock className="h-4 w-4" />;
      return <Clock className="h-4 w-4" />;
    case 'database':
      if (type === 'database.update') return <Edit className="h-4 w-4" />;
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

export function NodePalette() {
  const [search, setSearch] = React.useState('');
  
  const nodeTypes = useMemo(() => getNodeTypes(), []);
  const categories = useMemo(() => getNodeCategories(), []);
  
  const filteredCategories = useMemo(() => {
    if (!search.trim()) {
      return categories;
    }
    
    const searchLower = search.toLowerCase();
    return categories.filter(category => {
      // Check if any nodes in this category match the search
      return Object.values(nodeTypes).some(
        node => node.category === category && 
          (node.label.toLowerCase().includes(searchLower) || 
           node.description.toLowerCase().includes(searchLower))
      );
    });
  }, [categories, nodeTypes, search]);
  
  const getFilteredNodes = (category: string) => {
    const searchLower = search.toLowerCase();
    return Object.values(nodeTypes).filter(
      node => node.category === category && 
        (!search.trim() || 
          node.label.toLowerCase().includes(searchLower) || 
          node.description.toLowerCase().includes(searchLower))
    );
  };
  
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div className="node-palette">
      <div className="mb-3">
        <Input 
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      
      <Accordion 
        type="multiple" 
        defaultValue={categories}
        className="space-y-1"
      >
        {filteredCategories.map(category => (
          <AccordionItem key={category} value={category} className="border rounded-md">
            <AccordionTrigger className="px-3 py-2 text-sm font-medium">
              {category}
            </AccordionTrigger>
            <AccordionContent className="p-1">
              {getFilteredNodes(category).map(node => (
                <div
                  key={node.type}
                  className="node-palette-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, node.type)}
                  title={node.description}
                >
                  <div className="node-palette-item-icon">
                    {getIconForNodeType(node.type)}
                  </div>
                  <div className="node-palette-item-title">
                    {node.label}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 
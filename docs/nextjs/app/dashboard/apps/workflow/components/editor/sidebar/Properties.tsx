'use client';

import React from 'react';
import { Node } from 'reactflow';
import { getNodeType } from '../../../lib/nodeRegistry';
import { WorkflowNodeData } from '../../../lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertiesProps {
  node: Node<WorkflowNodeData> | null;
  onChange: (updatedNode: Node<WorkflowNodeData>) => void;
}

export function Properties({ node, onChange }: PropertiesProps) {
  if (!node) {
    return (
      <div className="properties-panel-empty">
        Select a node to view its properties
      </div>
    );
  }
  
  const nodeType = getNodeType(node.data.type);
  
  if (!nodeType) {
    return (
      <div className="properties-panel-empty text-destructive">
        Unknown node type: {node.data.type}
      </div>
    );
  }
  
  const handleChange = (name: string, value: any) => {
    const updatedNode = { 
      ...node,
      data: {
        ...node.data,
        properties: {
          ...node.data.properties,
          [name]: value
        }
      }
    };
    
    onChange(updatedNode);
  };
  
  const handleLabelChange = (value: string) => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        label: value
      }
    };
    
    onChange(updatedNode);
  };
  
  return (
    <div className="properties-panel">
      <div className="properties-form-row">
        <Label htmlFor="node-label" className="properties-form-label">
          Label
        </Label>
        <Input
          id="node-label"
          value={node.data.label || nodeType.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="mt-4 mb-2 text-sm font-medium">
        Properties
      </div>
      
      {nodeType.properties.map(property => {
        const value = node.data.properties?.[property.name] ?? property.default;
        
        return (
          <div key={property.name} className="properties-form-row">
            <Label 
              htmlFor={`property-${property.name}`} 
              className="properties-form-label"
            >
              {property.label}
              {property.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {property.type === 'string' && (
              <Input
                id={`property-${property.name}`}
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                className="w-full"
              />
            )}
            
            {property.type === 'number' && (
              <Input
                id={`property-${property.name}`}
                type="number"
                value={value || ''}
                onChange={(e) => handleChange(property.name, parseFloat(e.target.value))}
                className="w-full"
              />
            )}
            
            {property.type === 'boolean' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`property-${property.name}`}
                  checked={!!value}
                  onCheckedChange={(checked) => handleChange(property.name, checked)}
                />
                <Label htmlFor={`property-${property.name}`}>
                  {value ? 'Yes' : 'No'}
                </Label>
              </div>
            )}
            
            {property.type === 'select' && property.options && (
              <Select
                value={String(value)}
                onValueChange={(value) => handleChange(property.name, value)}
              >
                <SelectTrigger id={`property-${property.name}`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {property.options.map(option => {
                    const optionValue = typeof option === 'string' ? option : option.value;
                    const optionLabel = typeof option === 'string' ? option : option.label;
                    
                    return (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            
            {property.type === 'textarea' && (
              <Textarea
                id={`property-${property.name}`}
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                className="w-full"
                rows={4}
              />
            )}
            
            {property.type === 'json' && (
              <Textarea
                id={`property-${property.name}`}
                value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || '{}'}
                onChange={(e) => {
                  try {
                    const jsonValue = JSON.parse(e.target.value);
                    handleChange(property.name, jsonValue);
                  } catch (err) {
                    // Keep the string value even if it's not valid JSON yet
                    handleChange(property.name, e.target.value);
                  }
                }}
                className="w-full font-mono text-xs"
                rows={6}
              />
            )}
            
            {property.type === 'code' && (
              <Textarea
                id={`property-${property.name}`}
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                className="w-full font-mono text-xs"
                rows={8}
              />
            )}
          </div>
        );
      })}
    </div>
  );
} 
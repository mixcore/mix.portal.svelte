'use client';

import React from 'react';
import { WorkflowTemplate } from '../../lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessagesSquare, Database } from 'lucide-react';

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    author: string;
    nodes: number;
    connections: number;
  };
  onUseTemplate: (id: string) => void;
}

export function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-80 bg-gradient-to-tr from-blue-50 to-indigo-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400 opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-indigo-400 opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-green-400 opacity-20"></div>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 rounded-full bg-purple-400 opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 -rotate-45 -translate-x-10 -translate-y-2"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-1 bg-gray-300 opacity-30 rotate-45 -translate-x-10 -translate-y-2"></div>
          <div className="absolute top-1/3 left-1/3 w-15 h-1 bg-gray-300 opacity-30 rotate-90 -translate-x-5"></div>
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center mr-2"><MessagesSquare className="h-3 w-3 mr-1" />{template.nodes}</span>
            <span className="flex items-center"><Database className="h-3 w-3 mr-1" />{template.connections}</span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{template.title}</CardTitle>
          <Badge variant="secondary" className="ml-2">{template.category}</Badge>
        </div>
        <CardDescription className="text-sm mt-1">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="text-xs text-muted-foreground">
          By {template.author}
        </div>
        <Button size="sm" variant="default" onClick={() => onUseTemplate(template.id)}>
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TemplateCard; 
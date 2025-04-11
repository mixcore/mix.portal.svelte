'use client';

import React from 'react';
import { WorkflowTemplate } from '../../lib/types';
import TemplateCard from '../shared/TemplateCard';

interface TemplatesListProps {
  templates: WorkflowTemplate[];
  onUseTemplate: (id: string) => void;
  onViewTemplate?: (id: string) => void;
}

export function TemplatesList({ templates, onUseTemplate, onViewTemplate }: TemplatesListProps) {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-card">
        <p className="text-muted-foreground">No templates found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onUse={onUseTemplate}
          onView={onViewTemplate}
        />
      ))}
    </div>
  );
}

export default TemplatesList; 
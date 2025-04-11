'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WorkflowStatusBadgeProps {
  active: boolean;
  className?: string;
}

export function WorkflowStatusBadge({ active, className = '' }: WorkflowStatusBadgeProps) {
  return (
    <Badge 
      variant={active ? "default" : "outline"} 
      className={className}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export default WorkflowStatusBadge; 
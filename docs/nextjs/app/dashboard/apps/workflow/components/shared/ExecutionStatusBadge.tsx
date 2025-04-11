'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ExecutionStatusBadgeProps {
  status: 'success' | 'failed' | 'running';
  className?: string;
}

export function ExecutionStatusBadge({ status, className = '' }: ExecutionStatusBadgeProps) {
  const variant = 
    status === 'success' ? 'default' :
    status === 'running' ? 'outline' : 
    'destructive';

  return (
    <Badge 
      variant={variant}
      className={className}
    >
      {status}
    </Badge>
  );
}

export default ExecutionStatusBadge; 
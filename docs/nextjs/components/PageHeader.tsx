'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('bg-background border-b', className)}>
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
        {description && (
          <p className='text-muted-foreground mt-2'>{description}</p>
        )}
      </div>
    </div>
  );
}

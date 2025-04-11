'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('bg-background min-h-screen', className)}>
      {children}
    </div>
  );
}

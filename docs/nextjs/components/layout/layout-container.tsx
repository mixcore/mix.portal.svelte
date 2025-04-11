'use client';

import React from 'react';
import { useLayoutContext } from '@/providers/layout-context-provider';

export default function LayoutContainer({
  children
}: {
  children: React.ReactNode;
}) {
  const { width } = useLayoutContext();
  
  return (
    <div className={`dashboard-content p-4 md:p-6 ${
      width === 'normal' 
        ? 'container mx-auto max-w-7xl' 
        : 'w-full'
    }`}>
      {children}
    </div>
  );
} 
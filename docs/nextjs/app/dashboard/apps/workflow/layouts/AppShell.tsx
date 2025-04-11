'use client';

import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="workflow-app-shell">
      {/* Workflow app-specific header elements */}
      <div className="workflow-app-header">
        <h1 className="text-2xl font-bold">Workflow Automation</h1>
      </div>
      
      {/* App content area - no padding to allow full-width/height canvas */}
      <div className="workflow-app-content">
        {children}
      </div>
      
      {/* Workflow app-specific footer elements */}
      <div className="workflow-app-footer">
        <p className="text-sm text-muted-foreground">Workflow Automation Engine v1.0</p>
      </div>
    </div>
  );
}

export default AppShell; 
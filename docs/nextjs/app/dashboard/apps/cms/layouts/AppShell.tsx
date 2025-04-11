'use client';

import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="cms-app-shell">
      {/* CMS app-specific header elements */}
      <div className="cms-app-header">
        <h1 className="text-2xl font-bold">CMS</h1>
      </div>
      
      {/* App content area */}
      <div className="cms-app-content">
        {children}
      </div>
      
      {/* CMS app-specific footer elements */}
      <div className="cms-app-footer">
        <p className="text-sm text-gray-500">CMS Footer</p>
      </div>
    </div>
  );
}

export default AppShell; 
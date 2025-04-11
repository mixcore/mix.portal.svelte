'use client';

import React from 'react';
import AppShell from './layouts/AppShell';

export interface CMSAppProps {
  // Define app-specific props
}

export function CMSApp(props: CMSAppProps) {
  return (
    <AppShell>
      <div className="cms-app-container p-4">
        <h2 className="text-xl mb-4">CMS Dashboard</h2>
        <p>Welcome to the Content Management System</p>
        
        {/* Main CMS functionality goes here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">Recent Pages</h3>
            {/* Content here */}
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">Recent Posts</h3>
            {/* Content here */}
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">Recent Media</h3>
            {/* Content here */}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// Default export for dynamic import
export default CMSApp; 
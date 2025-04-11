'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AppLoader from '@/components/app/AppLoader';
import { PageLayout } from '@/components/layouts/PageLayout';
import { PageHeader } from '@/components/PageHeader';

export default function AppsPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('app') || 'cms'; // Default to CMS app if not specified
  
  // Map of app IDs to human-readable names
  const appNames: Record<string, string> = {
    cms: 'Content Management',
    mixdb: 'MixDB',
    projects: 'Projects',
    workflow: 'Workflow Automation'
  };
  
  return (
    <PageLayout>
      {/*<PageHeader title={`${appNames[appId] || appId} App`} />*/}
      <main className="app-container">
        <AppLoader appId={appId} />
      </main>
    </PageLayout>
  );
} 
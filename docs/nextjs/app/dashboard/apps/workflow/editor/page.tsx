'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkflowEditor } from '../components/editor/WorkflowEditor';
import useContainerStatus from '../hooks/useContainerStatus';

export default function WorkflowEditorPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get('id');
  const isFluidLayout = useContainerStatus();
  
  // Return the WorkflowEditor directly to maximize available space
  return <WorkflowEditor workflowId={workflowId || undefined} />;
} 
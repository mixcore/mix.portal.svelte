'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkflowRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the query parameter path for better UI
    router.replace('/dashboard/apps?app=workflow');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
} 
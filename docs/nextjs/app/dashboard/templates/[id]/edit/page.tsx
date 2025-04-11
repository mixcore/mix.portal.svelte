'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { edit: 'demo-1' },
    { edit: 'demo-2' }
  ];
}


import { useParams } from 'next/navigation';
import { TemplateEditLayout } from '@/components/shared/template-edit-layout';

export default function EditTemplatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <TemplateEditLayout
      title='Edit Template'
      templateId={id}
      backPath='/dashboard/templates'
    />
  );
}

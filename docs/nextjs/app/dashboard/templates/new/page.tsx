'use client';

import { useSearchParams } from 'next/navigation';
import { TemplateEditLayout } from '@/components/shared/template-edit-layout';
import { TemplateFolderType } from '@/types/template';

export default function NewTemplatePage() {
  const searchParams = useSearchParams();
  const themeId = searchParams.get('themeId') || '';
  const folderType =
    (searchParams.get('folderType') as TemplateFolderType) || 'Pages';

  return (
    <TemplateEditLayout
      title='Create New Template'
      isNew
      themeId={themeId}
      folderType={folderType}
      backPath='/dashboard/templates'
    />
  );
}

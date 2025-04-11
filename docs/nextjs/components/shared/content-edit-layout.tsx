'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AlertModal } from '@/components/modals/alert-modal';
import { MixContentStatus } from '@/types/content';

interface ContentEditLayoutProps {
  title: string;
  description?: string;
  backPath: string;
  isLoading: boolean;
  isSaving: boolean;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  status?: MixContentStatus;
  setStatus?: (status: MixContentStatus) => void;
  disableSubmit?: boolean;
  actionButtons?: ReactNode;
  isCancelModalOpen: boolean;
  setIsCancelModalOpen: (open: boolean) => void;
  onCancelConfirm: () => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  onDeleteConfirm: () => Promise<void>;
  deleteBtnLabel?: string;
  saveBtnLabel?: string;
  cancelBtnLabel?: string;
}

export function ContentEditLayout({
  title,
  description,
  backPath,
  isLoading,
  isSaving,
  children,
  onSubmit,
  status,
  setStatus,
  disableSubmit = false,
  actionButtons,
  isCancelModalOpen,
  setIsCancelModalOpen,
  onCancelConfirm,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  onDeleteConfirm,
  deleteBtnLabel = 'Delete',
  saveBtnLabel = 'Save Changes',
  cancelBtnLabel = 'Cancel'
}: ContentEditLayoutProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className='px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        <div className='flex h-[400px] w-full items-center justify-center'>
          <div className='border-primary h-10 w-10 animate-spin rounded-full border-b-2'></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={onCancelConfirm}
        loading={isSaving}
        title='Cancel editing'
        description='Are you sure you want to cancel? Any unsaved changes will be lost.'
      />

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={isSaving}
        title={`${deleteBtnLabel} content`}
        description={`Are you sure you want to ${deleteBtnLabel.toLowerCase()} this content? This action cannot be undone.`}
      />

      <div className='px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => router.push(backPath)}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Heading
              title={title}
              description={description || 'Edit your content'}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              disabled={isSaving}
              onClick={() => setIsCancelModalOpen(true)}
            >
              {cancelBtnLabel}
            </Button>
            <Button
              variant='destructive'
              disabled={isSaving}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              {deleteBtnLabel}
            </Button>
            {actionButtons}
            <Button
              disabled={disableSubmit || isSaving}
              onClick={(e) => onSubmit(e as unknown as React.FormEvent)}
            >
              {isSaving ? 'Saving...' : saveBtnLabel}
            </Button>
          </div>
        </div>

        <Separator className='my-4' />

        <form className='space-y-8' onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </>
  );
}

interface ContentFormGroupProps {
  children: ReactNode;
  className?: string;
}

export function ContentFormGrid({
  children,
  className = ''
}: ContentFormGroupProps) {
  return (
    <div className={`grid grid-cols-1 gap-8 lg:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

export function ContentMainColumn({
  children,
  className = ''
}: ContentFormGroupProps) {
  return (
    <div className={`space-y-6 lg:col-span-2 ${className}`}>{children}</div>
  );
}

export function ContentSideColumn({
  children,
  className = ''
}: ContentFormGroupProps) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

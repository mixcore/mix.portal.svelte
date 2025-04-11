'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Pencil,
  Trash2,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { StatusBadge } from './content-list-layout';
import { MixContentStatus } from '@/types/content';

export interface ContentDetailLayoutProps {
  title: string;
  description?: string;
  backPath: string;
  editPath?: string;
  previewPath?: string;
  publishPath?: string;
  children: ReactNode;
  isLoading?: boolean;
  contentNotFound?: boolean;
  contentType?: string;
  status?: MixContentStatus;
  deleteModalProps?: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title: string;
    description: string;
  };
  actionButtons?: ReactNode;
}

export function ContentDetailLayout({
  title,
  description,
  backPath,
  editPath,
  previewPath,
  publishPath,
  children,
  isLoading = false,
  contentNotFound = false,
  contentType = 'content',
  status,
  deleteModalProps,
  actionButtons
}: ContentDetailLayoutProps) {
  const router = useRouter();

  // Loading state
  if (isLoading) {
    return (
      <div className='px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        <div className='flex h-[400px] w-full items-center justify-center'>
          <div className='border-primary h-10 w-10 animate-spin rounded-full border-b-2'></div>
        </div>
      </div>
    );
  }

  // Content not found state
  if (contentNotFound) {
    return (
      <div className='px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        <div className='flex h-[400px] w-full flex-col items-center justify-center'>
          <h3 className='text-lg font-medium'>{contentType} not found</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            The requested {contentType} could not be found.
          </p>
          <Button className='mt-4' onClick={() => router.push(backPath)}>
            Back to {contentType}s
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {deleteModalProps && (
        <AlertModal
          isOpen={deleteModalProps.isOpen}
          onClose={deleteModalProps.onClose}
          onConfirm={deleteModalProps.onConfirm}
          loading={deleteModalProps.loading}
          title={deleteModalProps.title}
          description={deleteModalProps.description}
        />
      )}

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
            <Heading title={title} description={description} />
            {status !== undefined && (
              <div className='ml-2'>
                <StatusBadge status={status} />
              </div>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {previewPath && (
              <Button
                variant='outline'
                onClick={() => window.open(previewPath, '_blank')}
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                Preview
              </Button>
            )}
            {editPath && (
              <Button onClick={() => router.push(editPath)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </Button>
            )}
            {actionButtons}
          </div>
        </div>

        <Separator className='my-4' />

        {children}
      </div>
    </>
  );
}

// Helper for content metadata display
export interface ContentMetadataProps {
  label: string;
  value: string | ReactNode;
}

export function ContentMetadata({ items }: { items: ContentMetadataProps[] }) {
  return (
    <dl className='space-y-4'>
      {items.map((item, index) => (
        <div key={index}>
          <dt className='text-muted-foreground text-sm font-medium'>
            {item.label}
          </dt>
          <dd className='mt-1 text-sm'>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

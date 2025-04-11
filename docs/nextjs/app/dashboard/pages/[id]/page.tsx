'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { id: 'demo-1' },
    { id: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
  ContentDetailLayout,
  ContentMetadata
} from '@/components/shared/content-detail-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MixContentStatus } from '@/types/content';

// Mock data for pages - this would be replaced with actual API call
interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdDateTime: string;
  modifiedDateTime?: string;
  status: MixContentStatus;
  author?: string;
}

const mockPages = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    content: '<p>Welcome to our site. This is the home page content.</p>',
    excerpt: 'Welcome to our website',
    createdDateTime: '2023-10-01T08:00:00Z',
    modifiedDateTime: '2023-11-15T14:30:00Z',
    status: MixContentStatus.Published,
    author: 'Admin'
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about-us',
    content: '<p>Learn more about our company and what we do.</p>',
    excerpt: 'Learn more about our company',
    createdDateTime: '2023-10-05T09:15:00Z',
    modifiedDateTime: '2023-11-10T11:45:00Z',
    status: MixContentStatus.Published,
    author: 'Admin'
  }
];

export default function ViewPagePage() {
  const router = useRouter();
  const { id } = useParams();
  const pageId = typeof id === 'string' ? id : id?.[0] || '';

  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch page data
  const fetchPage = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundPage = mockPages.find((p) => p.id === pageId);
      setPage(foundPage || null);
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page deletion
  const handleDelete = async () => {
    if (!pageId) return;

    try {
      setIsDeleteLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to pages list after deletion
      router.push('/dashboard/pages');
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeleteLoading(false);
      setDeletePageId(null);
    }
  };

  // Fetch page on component mount
  useEffect(() => {
    fetchPage();
  }, [pageId]);

  return (
    <ContentDetailLayout
      title={page?.title || 'Page Details'}
      description={page?.slug ? `Details for "${page.slug}"` : undefined}
      backPath='/dashboard/pages'
      editPath={page ? `/dashboard/pages/${page.id}/edit` : undefined}
      previewPath={page?.slug ? `/${page.slug}` : undefined}
      isLoading={isLoading}
      contentNotFound={!isLoading && !page}
      contentType='page'
      status={page?.status}
      deleteModalProps={{
        isOpen: !!deletePageId,
        onClose: () => setDeletePageId(null),
        onConfirm: handleDelete,
        loading: isDeleteLoading,
        title: 'Delete Page',
        description:
          'Are you sure you want to delete this page? This action cannot be undone.'
      }}
      actionButtons={
        <button
          className='text-destructive hover:text-destructive/90 px-4 py-2 text-sm font-medium'
          onClick={() => setDeletePageId(pageId)}
        >
          Delete
        </button>
      }
    >
      <div className='space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0'>
        {/* Content Column */}
        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              {page?.content ? (
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              ) : (
                <p className='text-muted-foreground'>No content available</p>
              )}

              {page?.excerpt && (
                <>
                  <h3 className='mt-6 text-lg font-medium'>Excerpt</h3>
                  <p className='mt-2'>{page.excerpt}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata Column */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent>
              {page && (
                <ContentMetadata
                  items={[
                    {
                      label: 'Slug',
                      value: page.slug
                    },
                    {
                      label: 'Created',
                      value: new Date(page.createdDateTime).toLocaleString()
                    },
                    ...(page.modifiedDateTime
                      ? [
                          {
                            label: 'Last Modified',
                            value: new Date(
                              page.modifiedDateTime
                            ).toLocaleString()
                          }
                        ]
                      : []),
                    ...(page.author
                      ? [
                          {
                            label: 'Author',
                            value: page.author
                          }
                        ]
                      : [])
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentDetailLayout>
  );
}

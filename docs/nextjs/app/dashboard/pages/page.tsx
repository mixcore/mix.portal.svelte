'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Edit, Trash, Eye, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ContentListLayout,
  ContentCard,
  StatusBadge
} from '@/components/shared/content-list-layout';
import { MixContentStatus } from '@/types/content';

// Mock data for pages - this will be replaced with actual API calls
interface Page {
  id: string;
  title: string;
  slug: string;
  createdDateTime: string;
  modifiedDateTime?: string;
  status: MixContentStatus;
  excerpt?: string;
  author?: string;
}

// Temporary mock data - replace with API call later
const mockPages: Page[] = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    createdDateTime: '2023-10-01T08:00:00Z',
    modifiedDateTime: '2023-11-15T14:30:00Z',
    status: MixContentStatus.Published,
    excerpt: 'Welcome to our website',
    author: 'Admin'
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about-us',
    createdDateTime: '2023-10-05T09:15:00Z',
    modifiedDateTime: '2023-11-10T11:45:00Z',
    status: MixContentStatus.Published,
    excerpt: 'Learn more about our company',
    author: 'Admin'
  },
  {
    id: '3',
    title: 'Contact',
    slug: 'contact',
    createdDateTime: '2023-10-10T14:20:00Z',
    status: MixContentStatus.Published,
    excerpt: 'Get in touch with us',
    author: 'Admin'
  },
  {
    id: '4',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    createdDateTime: '2023-11-01T10:00:00Z',
    status: MixContentStatus.Published,
    excerpt: 'Our terms and conditions',
    author: 'Legal'
  },
  {
    id: '5',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    createdDateTime: '2023-11-01T10:30:00Z',
    status: MixContentStatus.Published,
    excerpt: 'Our privacy policies',
    author: 'Legal'
  },
  {
    id: '6',
    title: 'New Features (Draft)',
    slug: 'new-features',
    createdDateTime: '2023-12-01T09:00:00Z',
    status: MixContentStatus.Draft,
    excerpt: 'Upcoming features preview',
    author: 'Marketing'
  }
];

export default function PagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Search params
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const viewMode = searchParams.get('view') || 'table';

  // Fetch pages (mock implementation)
  const fetchPages = async () => {
    try {
      setIsLoading(true);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter by search and status
      const filteredPages = mockPages.filter((page) => {
        const matchesSearch =
          searchQuery === '' ||
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (page.excerpt &&
            page.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' || page.status.toString() === statusFilter;

        return matchesSearch && matchesStatus;
      });

      setPages(filteredPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search query changes
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle status filter changes
  const handleStatusFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle view mode changes
  const handleViewModeChange = (value: 'grid' | 'table') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle page deletion
  const handleDelete = async () => {
    if (!deletePageId) return;

    try {
      setIsDeleteLoading(true);
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove the page from the local state
      setPages(pages.filter((page) => page.id !== deletePageId));
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeleteLoading(false);
      setDeletePageId(null);
    }
  };

  // Fetch pages on initial render or when search/filter changes
  useEffect(() => {
    fetchPages();
  }, [searchQuery, statusFilter]);

  return (
    <ContentListLayout
      title='Pages'
      description='Manage your website pages'
      createNewPath='/dashboard/pages/new'
      createNewLabel='New Page'
      emptyStateIcon={<FileText className='h-8 w-8' />}
      emptyStateTitle='No pages found'
      emptyStateDescription={
        searchQuery
          ? `No pages matching "${searchQuery}"`
          : "You haven't created any pages yet."
      }
      filters={{
        showStatusFilter: true,
        showViewModeToggle: true
      }}
      isLoading={isLoading}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      onViewModeChange={handleViewModeChange}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      viewMode={viewMode as 'grid' | 'table'}
      totalItems={pages.length}
      hasItems={pages.length > 0}
      contentType='pages'
      deleteModalProps={{
        isOpen: !!deletePageId,
        onClose: () => setDeletePageId(null),
        onConfirm: handleDelete,
        loading: isDeleteLoading,
        title: 'Delete Page',
        description:
          'Are you sure you want to delete this page? This action cannot be undone.'
      }}
    >
      {viewMode === 'table' ? (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className='font-medium'>{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>
                    <StatusBadge status={page.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(page.createdDateTime), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {page.modifiedDateTime
                      ? format(new Date(page.modifiedDateTime), 'MMM dd, yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/pages/${page.id}`)
                          }
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/pages/${page.id}/edit`)
                          }
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePageId(page.id)}
                          className='text-destructive focus:text-destructive'
                        >
                          <Trash className='mr-2 h-4 w-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {pages.map((page) => (
            <ContentCard
              key={page.id}
              id={page.id}
              title={page.title}
              excerpt={page.excerpt}
              status={page.status}
              createdDateTime={page.createdDateTime}
              modifiedDateTime={page.modifiedDateTime}
              author={page.author}
              type='page'
              onClick={() => router.push(`/dashboard/pages/${page.id}`)}
            />
          ))}
        </div>
      )}
    </ContentListLayout>
  );
}

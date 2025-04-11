'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Page } from '@/types/page';
import { pageService } from '@/services/page';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { PageHeader } from '@/components/PageHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface PageListResponse {
  items: Page[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
}

const columns: ColumnDef<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-2'>
          {row.original.thumbnailUrl && (
            <img
              src={row.original.thumbnailUrl}
              alt={row.original.title}
              className='h-8 w-8 rounded-md object-cover'
            />
          )}
          <span>{row.original.title}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === 'Published'
          ? 'default'
          : status === 'Draft'
            ? 'secondary'
            : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  {
    accessorKey: 'pageType',
    header: 'Type'
  },
  {
    accessorKey: 'createdDateTime',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdDateTime)
  },
  {
    accessorKey: 'lastModified',
    header: 'Last Modified',
    cell: ({ row }) => formatDate(row.original.lastModified)
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const page = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => router.push(`/pages/${page.id}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/pages/${page.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/pages/${page.id}/delete`)}
              className='text-destructive'
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function PageList() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<Page[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [pageToDelete, setPageToDelete] = React.useState<Page | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = (await pageService.getPages({
        pageIndex,
        pageSize,
        searchText: searchValue
      })) as PageListResponse;
      setData(response.items);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to load pages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, searchValue]);

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
    setPageIndex(0); // Reset to first page when searching
  };

  const handleDeleteClick = (page: Page) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;

    try {
      setIsDeleting(true);
      await pageService.deletePage(pageToDelete.id);
      toast({
        title: 'Success',
        description: 'Page deleted successfully'
      });
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete page. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setPageToDelete(null);
    }
  };

  return (
    <PageLayout>
      <PageHeader title='Pages' description='Manage your website pages' />

      <main className='container mx-auto py-6'>
        <div className='mb-4 flex justify-end'>
          <Button onClick={() => router.push('/pages/new')}>
            <Plus className='mr-2 h-4 w-4' />
            New Page
          </Button>
        </div>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DataTable
          columns={columns}
          data={data}
          searchKey='title'
          searchPlaceholder='Search pages...'
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Page</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{pageToDelete?.title}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </PageLayout>
  );
}

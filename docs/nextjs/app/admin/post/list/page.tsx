'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react';
import { PostsApi } from '@/services/api';
import { Post, PaginationResult } from '@/types';
import { format } from 'date-fns';

export default function PostListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await PostsApi.getPosts(0, 20);
        if (response.success) {
          setPosts(response.data.items);
          setTotalPosts(response.data.totalItems);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Define table columns
  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div className='font-medium'>{row.original.title}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusText = 'Unknown';
        let statusClass = 'bg-gray-200 text-gray-800';

        switch (status) {
          case 0:
            statusText = 'Draft';
            statusClass = 'bg-gray-200 text-gray-800';
            break;
          case 1:
            statusText = 'Published';
            statusClass = 'bg-green-100 text-green-800';
            break;
          case 2:
            statusText = 'Archived';
            statusClass = 'bg-yellow-100 text-yellow-800';
            break;
        }

        return (
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
          >
            {statusText}
          </div>
        );
      }
    },
    {
      accessorKey: 'createdDate',
      header: 'Created Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdDate), 'MMM dd, yyyy')
    },
    {
      accessorKey: 'createdBy',
      header: 'Author'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push(`/admin/post/edit/${row.original.id}`)}
            >
              <Pencil className='h-4 w-4' />
              <span className='sr-only'>Edit</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => window.open(`/post/${row.original.id}`, '_blank')}
            >
              <ExternalLink className='h-4 w-4' />
              <span className='sr-only'>View</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-destructive hover:bg-destructive hover:text-destructive-foreground'
              onClick={() => {
                if (confirm('Are you sure you want to delete this post?')) {
                  // Delete post logic here
                  console.log('Delete post:', row.original.id);
                }
              }}
            >
              <Trash2 className='h-4 w-4' />
              <span className='sr-only'>Delete</span>
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Posts</h1>
        <Button onClick={() => router.push('/admin/post/create')}>
          <Plus className='mr-2 h-4 w-4' />
          Create Post
        </Button>
      </div>

      <div className='rounded-md border'>
        {loading ? (
          <div className='py-20 text-center'>
            <div className='border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2'></div>
            <p className='text-muted-foreground mt-4 text-sm'>
              Loading posts...
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={posts}
            searchColumn='title'
            searchPlaceholder='Search posts...'
            pageSize={10}
          />
        )}
      </div>
    </div>
  );
}

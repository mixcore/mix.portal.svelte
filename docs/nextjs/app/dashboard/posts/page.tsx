'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash, Eye, MoreHorizontal, Tag } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { postService } from '@/services/post';
import { Post, PostQueryParams } from '@/types/post';
import { MixContentStatus } from '@/types/content';
import {
  ContentListLayout,
  ContentCard
} from '@/components/shared/content-list-layout';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get('page') || '0');
  const pageSize = Number(searchParams.get('size') || '10');
  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const viewMode = searchParams.get('view') || 'table';

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);

      // Create query params object
      const queryParams: PostQueryParams = {
        pageIndex,
        pageSize,
        search
      };

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        try {
          const statusNumber = Number(statusFilter);
          if (!isNaN(statusNumber)) {
            queryParams.status = statusNumber as MixContentStatus;
          }
        } catch (e) {
          console.error('Error parsing status filter:', e);
        }
      }

      const response = await postService.getPosts(queryParams);

      setPosts(response.items || []);
      setTotalItems(response.totalItems || 0);
      setPageCount(Math.ceil((response.totalItems || 0) / pageSize));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination changes
  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageIndex.toString());
    params.set('size', pageSize.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.set('page', '0'); // Reset to first page on search
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

    params.set('page', '0'); // Reset to first page on filter change
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle view mode changes
  const handleViewModeChange = (value: 'grid' | 'table') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Handle post deletion
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleteLoading(true);
      await postService.deletePost(deleteId);
      // Refetch posts after deletion
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Fetch posts when params change
  useEffect(() => {
    fetchPosts();
  }, [pageIndex, pageSize, search, statusFilter]);

  // Table columns definition
  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.title || 'Untitled'}</div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || MixContentStatus.Draft;

        let badgeVariant: 'default' | 'secondary' | 'outline' | 'destructive' =
          'default';
        let label = 'Unknown';

        switch (status) {
          case MixContentStatus.Published:
            badgeVariant = 'default';
            label = 'Published';
            break;
          case MixContentStatus.Draft:
            badgeVariant = 'secondary';
            label = 'Draft';
            break;
          case MixContentStatus.Archived:
            badgeVariant = 'outline';
            label = 'Archived';
            break;
          case MixContentStatus.Deleted:
            badgeVariant = 'destructive';
            label = 'Deleted';
            break;
        }

        return <Badge variant={badgeVariant}>{label}</Badge>;
      }
    },
    {
      accessorKey: 'createdDateTime',
      header: 'Created',
      cell: ({ row }) => {
        return row.original.createdDateTime
          ? format(new Date(row.original.createdDateTime), 'MMM dd, yyyy')
          : '-';
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const post = row.original;

        return (
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
                onClick={() => router.push(`/dashboard/posts/${post.id}`)}
              >
                <Eye className='mr-2 h-4 w-4' />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteId(post.id)}
                className='text-destructive focus:text-destructive'
              >
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return (
    <ContentListLayout
      title='Post Management'
      description='Manage your blog posts and content'
      createNewPath='/dashboard/posts/new'
      createNewLabel='Add New Post'
      emptyStateIcon={<Tag className='h-8 w-8' />}
      emptyStateTitle='No posts found'
      emptyStateDescription={
        search
          ? `No posts matching "${search}"`
          : "You haven't created any posts yet."
      }
      apiEndpoint='/rest/posts/list'
      filters={{
        showStatusFilter: true,
        showViewModeToggle: true
      }}
      isLoading={isLoading}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      onViewModeChange={handleViewModeChange}
      searchQuery={search}
      statusFilter={statusFilter}
      viewMode={viewMode as 'grid' | 'table'}
      totalItems={totalItems}
      hasItems={posts.length > 0}
      contentType='posts'
      deleteModalProps={{
        isOpen: !!deleteId,
        onClose: () => setDeleteId(null),
        onConfirm: handleDelete,
        loading: isDeleteLoading,
        title: 'Delete Post',
        description:
          'Are you sure you want to delete this post? This action cannot be undone.'
      }}
    >
      {viewMode === 'table' ? (
        <div className='bg-card rounded-md border'>
          <DataTable
            columns={columns}
            data={posts}
            totalItems={totalItems}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <ContentCard
              key={post.id}
              id={post.id}
              title={post.title || 'Untitled'}
              excerpt={post.excerpt}
              image={post.image}
              status={post.status || MixContentStatus.Draft}
              createdDateTime={post.createdDateTime}
              modifiedDateTime={post.modifiedDateTime}
              type='post'
              onClick={() => router.push(`/dashboard/posts/${post.id}`)}
            />
          ))}
        </div>
      )}
    </ContentListLayout>
  );
}

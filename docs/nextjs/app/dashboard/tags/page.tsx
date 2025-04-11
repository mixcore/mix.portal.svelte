'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  TagIcon,
  FilterIcon,
  SlidersIcon,
  GridIcon,
  ListIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, tagService } from '@/services/tagService';
import { formatDistanceToNow } from 'date-fns';

// Define views
type ViewMode = 'table' | 'grid';
type SortField = 'name' | 'usage' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function TagsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTags, setTotalTags] = useState(0);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const pageSize = 10;

  // Initialize search query and view mode from URL
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }

    const viewParam = searchParams.get('view') as ViewMode;
    if (viewParam && (viewParam === 'table' || viewParam === 'grid')) {
      setViewMode(viewParam);
    }

    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setSelectedFilter(filterParam);
    }
  }, [searchParams]);

  // Fetch tags with pagination
  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await tagService.getList({
        page: currentPage,
        limit: pageSize,
        search: searchQuery
      });

      // Apply client-side filtering if needed
      // In a real application, this would be handled by the API
      let filteredTags = [...response.data];

      // Simulate sorting (this would be handled by the API in a real application)
      filteredTags.sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortField === 'createdAt') {
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default to name sort
        return a.name.localeCompare(b.name);
      });

      setTags(filteredTags);
      setTotalTags(response.total);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tags',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tags on mount and when search/pagination changes
  useEffect(() => {
    fetchTags();
  }, [currentPage, searchQuery, sortField, sortOrder, selectedFilter]);

  // Update URL when search or view changes
  const updateUrl = (options: {
    q?: string;
    view?: ViewMode;
    filter?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (options.q !== undefined) {
      if (options.q) {
        params.set('q', options.q);
      } else {
        params.delete('q');
      }
    }

    if (options.view) {
      params.set('view', options.view);
    }

    if (options.filter) {
      params.set('filter', options.filter);
    }

    const newUrl = `/dashboard/tags${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle search changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    updateUrl({ q: query });
  };

  // Handle view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateUrl({ view: mode });
  };

  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page on new filter
    updateUrl({ filter });
  };

  // Handle tag deletion
  const handleDelete = async () => {
    if (!deleteTagId) return;

    try {
      setIsDeleteLoading(true);
      await tagService.delete(deleteTagId);

      toast({
        title: 'Success',
        description: 'Tag deleted successfully'
      });

      fetchTags(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteLoading(false);
      setDeleteTagId(null);
    }
  };

  // Generate a slug from the tag name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };

  // Analytics data - in a real app, this would come from the API
  const analyticsData = {
    totalTags: totalTags,
    mostUsedTags: tags.slice(0, 5), // Just show the first 5 as most used for this mock
    recentlyAddedTags: [...tags]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3)
  };

  // Render loading skeletons for table/grid views
  const renderSkeletons = () => {
    if (viewMode === 'table') {
      return (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-8 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-48' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-8 w-24' />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Skeleton className='ml-auto h-8 w-10' />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      );
    } else {
      return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className='overflow-hidden'>
                <CardHeader className='pb-2'>
                  <Skeleton className='mb-1 h-6 w-24' />
                  <Skeleton className='h-4 w-32' />
                </CardHeader>
                <CardContent className='pb-3'>
                  <Skeleton className='h-14 w-full' />
                </CardContent>
                <CardFooter className='flex justify-between border-t pt-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-8 w-16' />
                </CardFooter>
              </Card>
            ))}
        </div>
      );
    }
  };

  // Empty state component
  const EmptyState = () => (
    <Card className='w-full py-10'>
      <div className='flex flex-col items-center justify-center px-4 text-center'>
        <div className='bg-primary/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
          <TagIcon className='text-primary h-10 w-10' />
        </div>
        <h3 className='text-xl font-semibold'>No tags found</h3>
        <p className='text-muted-foreground mt-2 mb-6 max-w-md'>
          {searchQuery
            ? `No tags match "${searchQuery}". Try a different search term or clear your filters.`
            : "You haven't created any tags yet. Tags help organize your content and make it easier for users to find related items."}
        </p>
        <div className='flex flex-wrap justify-center gap-2'>
          {searchQuery && (
            <Button variant='outline' onClick={() => handleSearch('')}>
              Clear search
            </Button>
          )}
          <Button onClick={() => router.push('/dashboard/tags/new')}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Create a tag
          </Button>
        </div>
      </div>
    </Card>
  );

  // Render table view
  const renderTableView = () => (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className='cursor-pointer'
              onClick={() => {
                if (sortField === 'name') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('name');
                  setSortOrder('asc');
                }
              }}
            >
              Name{' '}
              {sortField === 'name' && (
                <span className='ml-1'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className='cursor-pointer'
              onClick={() => {
                if (sortField === 'createdAt') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('createdAt');
                  setSortOrder('desc');
                }
              }}
            >
              Created{' '}
              {sortField === 'createdAt' && (
                <span className='ml-1'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow
              key={tag.id}
              className='group hover:bg-muted/40 cursor-pointer transition-colors'
              onClick={() => router.push(`/dashboard/tags/${tag.id}/edit`)}
            >
              <TableCell className='font-medium'>{tag.name}</TableCell>
              <TableCell className='text-muted-foreground'>
                {tag.slug}
              </TableCell>
              <TableCell>
                {tag.description
                  ? tag.description.length > 60
                    ? `${tag.description.substring(0, 60)}...`
                    : tag.description
                  : '—'}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(tag.createdAt), {
                  addSuffix: true
                })}
              </TableCell>
              <TableCell
                className='text-right'
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100'
                    >
                      <span className='sr-only'>Open menu</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <circle cx='12' cy='12' r='1' />
                        <circle cx='12' cy='5' r='1' />
                        <circle cx='12' cy='19' r='1' />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/tags/${tag.id}/edit`)
                      }
                    >
                      <EditIcon className='mr-2 h-4 w-4' /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-destructive focus:text-destructive'
                      onClick={() => setDeleteTagId(tag.id)}
                    >
                      <TrashIcon className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Render grid view
  const renderGridView = () => (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {tags.map((tag) => (
        <Card
          key={tag.id}
          className='cursor-pointer overflow-hidden transition-shadow hover:shadow-md'
          onClick={() => router.push(`/dashboard/tags/${tag.id}/edit`)}
        >
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{tag.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='h-4 w-4'
                    >
                      <circle cx='12' cy='12' r='1' />
                      <circle cx='12' cy='5' r='1' />
                      <circle cx='12' cy='19' r='1' />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/tags/${tag.id}/edit`);
                    }}
                  >
                    <EditIcon className='mr-2 h-4 w-4' /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive'
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTagId(tag.id);
                    }}
                  >
                    <TrashIcon className='mr-2 h-4 w-4' /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className='font-mono text-xs'>
              {tag.slug}
            </CardDescription>
          </CardHeader>
          <CardContent className='pb-3'>
            <p className='text-muted-foreground line-clamp-3 text-sm'>
              {tag.description || 'No description provided.'}
            </p>
          </CardContent>
          <CardFooter className='text-muted-foreground flex justify-between border-t pt-2 text-xs'>
            <div>
              Created{' '}
              {formatDistanceToNow(new Date(tag.createdAt), {
                addSuffix: true
              })}
            </div>
            <Badge variant='outline' className='text-xs'>
              5 posts
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <AlertModal
        isOpen={!!deleteTagId}
        onClose={() => setDeleteTagId(null)}
        onConfirm={handleDelete}
        loading={isDeleteLoading}
        title='Delete Tag'
        description='Are you sure you want to delete this tag? This will remove the tag from all associated content.'
      />

      <div className='px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <Heading title='Tags' description='Manage your content tags' />
          <Button onClick={() => router.push('/dashboard/tags/new')}>
            <PlusIcon className='mr-2 h-4 w-4' />
            New Tag
          </Button>
        </div>

        <Separator className='my-4' />

        {/* Analytics Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <TagIcon className='text-muted-foreground h-5 w-5' />
                <div className='text-muted-foreground text-sm font-medium'>
                  Total Tags
                </div>
              </div>
              <div className='mt-1 text-3xl font-bold'>
                {analyticsData.totalTags}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='text-muted-foreground mb-2 text-sm font-medium'>
                Most Used Tags
              </div>
              <div className='flex flex-wrap gap-2'>
                {analyticsData.mostUsedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant='outline'
                    className='hover:bg-primary/10 cursor-pointer text-xs transition-colors'
                    onClick={() =>
                      router.push(`/dashboard/tags/${tag.id}/edit`)
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='text-muted-foreground mb-2 text-sm font-medium'>
                Recently Added
              </div>
              <div className='flex flex-col gap-2'>
                {analyticsData.recentlyAddedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className='hover:text-primary flex cursor-pointer items-center justify-between text-sm transition-colors'
                    onClick={() =>
                      router.push(`/dashboard/tags/${tag.id}/edit`)
                    }
                  >
                    <span>{tag.name}</span>
                    <span className='text-muted-foreground text-xs'>
                      {formatDistanceToNow(new Date(tag.createdAt), {
                        addSuffix: true
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className='mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
          <div className='relative w-full md:max-w-sm'>
            <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              type='search'
              placeholder='Search tags...'
              className='pl-9'
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-2 self-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-9'>
                  <FilterIcon className='mr-2 h-4 w-4' />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuLabel>Filter by Usage</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={selectedFilter}
                  onValueChange={handleFilterChange}
                >
                  <DropdownMenuRadioItem value='all'>
                    All tags
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='used'>
                    Used in content
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='unused'>
                    Unused tags
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex overflow-hidden rounded-md border'>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                className={`h-9 rounded-none ${viewMode === 'table' ? 'pointer-events-none' : ''}`}
                onClick={() => handleViewModeChange('table')}
              >
                <ListIcon className='h-4 w-4' />
                <span className='sr-only'>Table view</span>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                className={`h-9 rounded-none ${viewMode === 'grid' ? 'pointer-events-none' : ''}`}
                onClick={() => handleViewModeChange('grid')}
              >
                <GridIcon className='h-4 w-4' />
                <span className='sr-only'>Grid view</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tags List */}
        {isLoading ? (
          renderSkeletons()
        ) : tags.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'table' ? (
          renderTableView()
        ) : (
          renderGridView()
        )}

        {/* Pagination */}
        {!isLoading && totalTags > pageSize && (
          <div className='mt-4 flex flex-wrap items-center justify-between space-y-2 space-x-0 md:space-y-0 md:space-x-2'>
            <div className='text-muted-foreground text-sm'>
              Showing{' '}
              <span className='font-medium'>
                {Math.min((currentPage - 1) * pageSize + 1, totalTags)}
              </span>{' '}
              to{' '}
              <span className='font-medium'>
                {Math.min(currentPage * pageSize, totalTags)}
              </span>{' '}
              of <span className='font-medium'>{totalTags}</span> tags
            </div>

            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <div className='text-sm'>
                Page {currentPage} of {Math.ceil(totalTags / pageSize)}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  currentPage >= Math.ceil(totalTags / pageSize) || isLoading
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

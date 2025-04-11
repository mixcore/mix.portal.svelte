'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Plus,
  Filter,
  Table,
  Grid,
  Tag,
  Search,
  FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AlertModal } from '@/components/modals/alert-modal';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { MixContentStatus } from '@/types/content';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface ContentListLayoutProps {
  title: string;
  description: string;
  createNewPath: string;
  createNewLabel: string;
  emptyStateIcon?: ReactNode;
  emptyStateTitle: string;
  emptyStateDescription: string;
  apiEndpoint?: string; // For API diagnostics
  filters?: {
    showStatusFilter?: boolean;
    showAuthorFilter?: boolean;
    showDateFilter?: boolean;
    showViewModeToggle?: boolean;
    showCategoryFilter?: boolean;
  };
  children: ReactNode;
  isLoading?: boolean;
  onSearchChange?: (search: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onViewModeChange?: (mode: 'grid' | 'table') => void;
  searchQuery?: string;
  statusFilter?: string;
  viewMode?: 'grid' | 'table';
  totalItems?: number;
  hasItems?: boolean;
  contentType?: string; // 'posts', 'pages', 'media', etc.
  customFilters?: ReactNode;
  deleteModalProps?: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title: string;
    description: string;
  };
}

export function ContentListLayout({
  title,
  description,
  createNewPath,
  createNewLabel,
  emptyStateIcon = <FileText className='h-8 w-8' />,
  emptyStateTitle,
  emptyStateDescription,
  apiEndpoint,
  filters = {
    showStatusFilter: true,
    showViewModeToggle: true
  },
  children,
  isLoading = false,
  onSearchChange,
  onStatusFilterChange,
  onViewModeChange,
  searchQuery = '',
  statusFilter = 'all',
  viewMode = 'table',
  totalItems = 0,
  hasItems = false,
  contentType = 'items',
  customFilters,
  deleteModalProps
}: ContentListLayoutProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  };

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
        <div className='mb-6 flex items-center justify-between'>
          <Heading title={title} description={description} />
          <Button onClick={() => router.push(createNewPath)}>
            <Plus className='mr-2 h-4 w-4' />
            {createNewLabel}
          </Button>
        </div>

        <Separator className='my-4' />

        {/* Filters and controls */}
        <div className='mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4'>
          <div className='flex flex-1 items-center space-x-2'>
            <div className='relative w-full max-w-xs'>
              <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
              <Input
                placeholder={`Search ${contentType}...`}
                className='pl-8'
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {filters.showStatusFilter && (
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  if (onStatusFilterChange) {
                    onStatusFilterChange(value);
                  }
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value={MixContentStatus.Published.toString()}>
                    Published
                  </SelectItem>
                  <SelectItem value={MixContentStatus.Draft.toString()}>
                    Draft
                  </SelectItem>
                  <SelectItem value={MixContentStatus.Archived.toString()}>
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            {customFilters}
          </div>

          {filters.showViewModeToggle && (
            <div className='flex items-center space-x-2'>
              <span className='text-muted-foreground text-sm'>View:</span>
              <Tabs
                value={viewMode}
                className='h-9'
                onValueChange={(value) => {
                  if (onViewModeChange) {
                    onViewModeChange(value as 'grid' | 'table');
                  }
                }}
              >
                <TabsList className='h-9'>
                  <TabsTrigger value='table' className='text-xs'>
                    <Table className='mr-2 h-3.5 w-3.5' />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value='grid' className='text-xs'>
                    <Grid className='mr-2 h-3.5 w-3.5' />
                    Grid
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {totalItems > 0 && (
            <div className='text-muted-foreground hidden text-sm md:block'>
              {totalItems} {contentType}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className='flex w-full justify-center p-12'>
            <div className='border-primary h-10 w-10 animate-spin rounded-full border-b-2'></div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {!hasItems ? (
              <Card className='flex flex-col items-center justify-center p-12 text-center'>
                <div className='bg-muted mb-4 rounded-full p-4'>
                  {emptyStateIcon}
                </div>
                <h3 className='mb-2 text-xl font-semibold'>
                  {emptyStateTitle}
                </h3>
                <p className='text-muted-foreground mb-6 max-w-sm'>
                  {emptyStateDescription}
                </p>
                <Button onClick={() => router.push(createNewPath)}>
                  <Plus className='mr-2 h-4 w-4' />
                  {createNewLabel}
                </Button>
                {apiEndpoint && (
                  <div className='mt-4'>
                    <Button variant='outline' size='sm'>
                      Diagnose API Connection
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              /* Main Content Area */
              <>{children}</>
            )}
          </>
        )}
      </div>
    </>
  );
}

// Helper components for common use cases
export function StatusBadge({ status }: { status: MixContentStatus }) {
  switch (status) {
    case MixContentStatus.Published:
      return (
        <Badge className='bg-green-500 hover:bg-green-600'>Published</Badge>
      );
    case MixContentStatus.Draft:
      return <Badge variant='secondary'>Draft</Badge>;
    case MixContentStatus.Archived:
      return <Badge variant='outline'>Archived</Badge>;
    case MixContentStatus.Deleted:
      return <Badge variant='destructive'>Deleted</Badge>;
    default:
      return null;
  }
}

// Generic content card for grid view
export interface ContentCardProps {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  status?: MixContentStatus;
  createdDateTime?: string;
  modifiedDateTime?: string;
  author?: string;
  type: string; // 'post', 'page', 'media', etc.
  onClick?: () => void;
}

export function ContentCard({
  id,
  title,
  excerpt,
  image,
  status = MixContentStatus.Draft,
  createdDateTime,
  modifiedDateTime,
  author,
  type,
  onClick
}: ContentCardProps) {
  return (
    <Card
      className='flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md'
      onClick={onClick}
    >
      {image && (
        <div className='aspect-video w-full overflow-hidden rounded-t-lg'>
          <img
            src={image}
            alt={title || 'Content'}
            className='h-full w-full object-cover transition-all hover:scale-105'
          />
        </div>
      )}
      <CardHeader className={image ? 'pt-3' : ''}>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='line-clamp-1'>{title}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>
          {excerpt ? (
            <span className='line-clamp-2'>{excerpt}</span>
          ) : (
            <span className='text-muted-foreground italic'>No excerpt</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-grow'>
        <div className='text-muted-foreground text-sm'>
          {createdDateTime && (
            <div className='flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              <span>
                Created: {new Date(createdDateTime).toLocaleDateString()}
              </span>
            </div>
          )}
          {modifiedDateTime && (
            <div className='mt-1 flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              <span>
                Updated: {new Date(modifiedDateTime).toLocaleDateString()}
              </span>
            </div>
          )}
          {author && (
            <div className='mt-1 flex items-center gap-1'>
              <User className='h-3 w-3' />
              <span>{author}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Calendar, User } from 'lucide-react';

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  MoreHorizontal, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BlogService, BlogPost, BlogPostQueryParams } from '../lib/blog-service';
import { MixDbApi } from '../lib/mixdb-api';
import { AuthService } from '../lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BlogPostListProps {
  onItemClick: (itemId: string) => void;
  onCreateClick: () => void;
}

export function BlogPostList({ onItemClick, onCreateClick }: BlogPostListProps) {
  // State for posts and pagination
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for query parameters
  const [queryParams, setQueryParams] = useState<BlogPostQueryParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'publishedDate',
    sortDirection: 'desc',
    status: undefined
  });
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  
  // Initialize blog service
  const api = new MixDbApi({
    apiBasePath: '/api/v2/mixdb',
    culture: 'en-US'
  });
  const authService = new AuthService();
  const blogService = new BlogService(api, authService);
  
  // Load posts based on current query parameters
  useEffect(() => {
    loadPosts();
  }, [queryParams]);
  
  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== queryParams.search) {
        setQueryParams({
          ...queryParams,
          page: 1, // Reset to first page on new search
          search: searchQuery
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await blogService.getPosts(queryParams);
      
      setPosts(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    const status = value === 'all' ? undefined : value;
    setStatusFilter(value === 'all' ? undefined : value);
    setQueryParams({
      ...queryParams,
      page: 1, // Reset to first page on filter change
      status
    });
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    const direction = 
      queryParams.sortBy === field && queryParams.sortDirection === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setQueryParams({
      ...queryParams,
      sortBy: field,
      sortDirection: direction
    });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setQueryParams({
      ...queryParams,
      page
    });
  };
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await blogService.deletePost(postToDelete);
      loadPosts();
      setPostToDelete(null);
    } catch (error) {
      console.error(`Error deleting post with ID ${postToDelete}:`, error);
    }
  };
  
  // Format date helper function
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get post status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Edit3 className="h-3 w-3" /> Draft
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Scheduled
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Calculate pagination range
  const getPaginationRange = () => {
    const start = (queryParams.page! - 1) * queryParams.pageSize! + 1;
    const end = Math.min(start + queryParams.pageSize! - 1, totalItems);
    return `${start}-${end} of ${totalItems}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={statusFilter || 'all'}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading skeleton
            <div className="space-y-3">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => handleSortChange('title')}>
                        <div className="flex items-center">
                          Title
                          {queryParams.sortBy === 'title' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer hover:bg-accent/50" onClick={() => handleSortChange('publishedDate')}>
                        <div className="flex items-center">
                          Published
                          {queryParams.sortBy === 'publishedDate' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow 
                        key={post.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => onItemClick(post.id)}
                      >
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <div className="w-6 h-6 flex items-center justify-center">
                                  {post.isFeatured && (
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {post.isFeatured ? 'Featured post' : ''}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium truncate max-w-[300px]">{post.title}</div>
                          <div className="text-xs text-muted-foreground">{post.slug}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>{post.publishedDate ? formatDate(post.publishedDate) : '-'}</TableCell>
                        <TableCell>{post.createdBy || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onItemClick(post.id); }}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => { e.preventDefault(); setPostToDelete(post.id); }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the post &quot;{post.title}&quot;. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={handleDeletePost}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {getPaginationRange()}
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (queryParams.page! > 1) {
                            handlePageChange(queryParams.page! - 1);
                          }
                        }}
                        className={queryParams.page! <= 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {queryParams.page! > 2 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {queryParams.page! > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Previous page */}
                    {queryParams.page! > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(queryParams.page! - 1);
                          }}
                        >
                          {queryParams.page! - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        isActive
                        onClick={(e) => e.preventDefault()}
                      >
                        {queryParams.page}
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Next page */}
                    {queryParams.page! < totalPages && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(queryParams.page! + 1);
                          }}
                        >
                          {queryParams.page! + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {queryParams.page! < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    {queryParams.page! < totalPages - 1 && totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (queryParams.page! < totalPages) {
                            handlePageChange(queryParams.page! + 1);
                          }
                        }}
                        className={queryParams.page! >= totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No posts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first blog post.'}
              </p>
              {!searchQuery && (
                <Button onClick={onCreateClick} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Post
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
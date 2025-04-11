'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { Upload, Trash, Eye, MoreHorizontal, Plus, Image, File, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { InputFile } from '@/components/ui/input-file';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Media, MediaQueryParams } from '@/types/media';
import { mediaService } from '@/services/media';
import { MixContentStatus } from '@/types/content';

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Parse search params with defaults
  const pageIndex = Number(searchParams.get('page') || '0');
  const pageSize = Number(searchParams.get('pageSize') || '20'); // More items per page for gallery view
  const search = searchParams.get('search') || '';
  const fileType = searchParams.get('fileType') || '';

  // Fetch media files with query params
  const fetchMedia = async (params: MediaQueryParams) => {
    try {
      setIsLoading(true);
      const result = await mediaService.getMediaList(params);
      setMedia(result.items);
      setTotalItems(result.totalItems);
      setPageCount(result.totalPages);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media files',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPageIndex.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', newSearch);
    params.set('page', '0'); // Reset to first page on search
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle file type filter change
  const handleFileTypeChange = (newFileType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('fileType', newFileType);
    params.set('page', '0');
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle media deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleteLoading(true);
      const success = await mediaService.deleteMedia(deleteId);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Media file deleted successfully',
        });
        
        // Refetch media after deletion
        fetchMedia({
          pageIndex,
          pageSize,
          search,
          fileType
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete media file',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the media file',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteLoading(false);
      setDeleteId(null);
    }
  };

  // Handle file selection
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      // Generate preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsUploading(true);
      await mediaService.uploadMedia(file, title, description);
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setFilePreview(null);
      
      // Refresh media list
      fetchMedia({
        pageIndex,
        pageSize,
        search,
        fileType
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Check if a file is an image
  const isImageFile = (fileName: string): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
  };

  // Get icon based on file type
  const getFileIcon = (fileName: string) => {
    return isImageFile(fileName) ? <Image className="h-6 w-6" /> : <File className="h-6 w-6" />;
  };

  // Fetch media when params change
  useEffect(() => {
    fetchMedia({
      pageIndex,
      pageSize,
      search,
      fileType
    });
  }, [pageIndex, pageSize, search, fileType]);

  return (
    <>
      <AlertModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={isDeleteLoading}
        title="Delete Media"
        description="Are you sure you want to delete this media file? This action cannot be undone."
      />
      
      <div className="px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between mb-6">
          <Heading
            title="Media Library"
            description="Manage your media files and uploads"
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Upload New File</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="File title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="File description"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="file">File</Label>
                    <InputFile
                      id="file"
                      className="w-full"
                      accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    />
                  </div>
                  
                  {filePreview && (
                    <div className="mt-2">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-h-40 rounded-md object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Filter Files</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search media files..."
                      />
                    </div>
                    
                    <div>
                      <Label>File Type</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          variant={fileType === '' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFileTypeChange('')}
                        >
                          All
                        </Button>
                        <Button
                          variant={fileType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFileTypeChange('image')}
                        >
                          Images
                        </Button>
                        <Button
                          variant={fileType === 'document' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFileTypeChange('document')}
                        >
                          Documents
                        </Button>
                        <Button
                          variant={fileType === 'other' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleFileTypeChange('other')}
                        >
                          Other
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Media Gallery */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex h-[400px] w-full items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : media.length === 0 ? (
              <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No media files found</h3>
                <p className="text-sm text-muted-foreground">
                  Upload files using the form on the left.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative aspect-square bg-muted">
                        {item.fileName && isImageFile(item.fileName) ? (
                          <img
                            src={item.webPath || item.filePath}
                            alt={item.displayName || item.fileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            {getFileIcon(item.fileName || '')}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="truncate">
                            <h3 className="text-sm font-medium truncate">
                              {item.displayName || item.fileName || 'Untitled'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.createdDateTime && format(new Date(item.createdDateTime), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  window.open(item.webPath || item.filePath, '_blank');
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = item.webPath || item.filePath || '';
                                  link.download = item.fileName || 'download';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(item.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems} files
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaginationChange(pageIndex - 1)}
                      disabled={pageIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaginationChange(pageIndex + 1)}
                      disabled={pageIndex >= pageCount - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 
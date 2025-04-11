'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { edit: 'demo-1' },
    { edit: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
  ContentEditLayout,
  ContentFormGrid,
  ContentMainColumn,
  ContentSideColumn
} from '@/components/shared/content-edit-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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

// Mock pages data - would come from an API
const mockPages: Page[] = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    content: 'Welcome to our website. This is the home page content.',
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
    content: 'Learn more about our company and our mission.',
    excerpt: 'Learn more about our company',
    createdDateTime: '2023-10-05T09:15:00Z',
    modifiedDateTime: '2023-11-10T11:45:00Z',
    status: MixContentStatus.Published,
    author: 'Admin'
  }
];

export default function EditPagePage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const pageId = typeof id === 'string' ? id : id?.[0] || '';

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<MixContentStatus>(
    MixContentStatus.Draft
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch page data
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);

        // This would be an API call in the real implementation
        // Mock implementation using the pageId
        const page = mockPages.find((p) => p.id === pageId);

        if (!page) {
          toast({
            title: 'Error',
            description: 'Page not found',
            variant: 'destructive'
          });
          router.push('/dashboard/pages');
          return;
        }

        // Set form values
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
        setExcerpt(page.excerpt || '');
        setStatus(page.status);
      } catch (error) {
        console.error('Error fetching page:', error);
        toast({
          title: 'Error',
          description: 'Failed to load page',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageId, router, toast]);

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Only auto-generate slug if it hasn't been manually modified
    if (slug === createSlug(title)) {
      setSlug(createSlug(newTitle));
    }
  };

  // Create slug from string
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug) {
      toast({
        title: 'Error',
        description: 'Title and slug are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);

      // This would be an API call in the real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Page updated successfully'
      });

      router.push('/dashboard/pages');
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: 'Error',
        description: 'Failed to update page',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsSaving(true);

      // This would be an API call in the real implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Page deleted successfully'
      });

      router.push('/dashboard/pages');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete page',
        variant: 'destructive'
      });
      setIsSaving(false);
    }
  };

  // Action buttons for quick publishing
  const quickPublishButtons = (
    <>
      <Button
        variant='outline'
        disabled={isSaving}
        onClick={() => {
          setStatus(MixContentStatus.Draft);
          handleSubmit(new Event('click') as unknown as React.FormEvent);
        }}
      >
        Save as Draft
      </Button>
    </>
  );

  return (
    <ContentEditLayout
      title={`Edit Page: ${title}`}
      description='Modify your page content and settings'
      backPath='/dashboard/pages'
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit}
      status={status}
      setStatus={setStatus}
      disableSubmit={!title || !slug}
      actionButtons={quickPublishButtons}
      isCancelModalOpen={isCancelOpen}
      setIsCancelModalOpen={setIsCancelOpen}
      onCancelConfirm={() => router.push('/dashboard/pages')}
      isDeleteModalOpen={isDeleteOpen}
      setIsDeleteModalOpen={setIsDeleteOpen}
      onDeleteConfirm={handleDelete}
      deleteBtnLabel='Delete'
      saveBtnLabel='Publish'
    >
      <ContentFormGrid>
        {/* Main Content Column */}
        <ContentMainColumn>
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>The main content for your page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    placeholder='Page Title'
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug</Label>
                  <div className='flex items-center space-x-2'>
                    <Input
                      id='slug'
                      placeholder='page-slug'
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    The URL-friendly version of the page title
                  </p>
                </div>

                <Tabs defaultValue='editor'>
                  <TabsList className='mb-2'>
                    <TabsTrigger value='editor'>Editor</TabsTrigger>
                    <TabsTrigger value='preview'>Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value='editor'>
                    <div className='space-y-2'>
                      <Label htmlFor='content'>Content</Label>
                      <Textarea
                        id='content'
                        placeholder='Page content...'
                        className='min-h-[300px]'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent
                    value='preview'
                    className='min-h-[300px] rounded-md border p-4'
                  >
                    {content ? (
                      <div className='prose max-w-none'>
                        {/* Would use a Markdown renderer here in a real implementation */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.replace(/\n/g, '<br/>')
                          }}
                        />
                      </div>
                    ) : (
                      <div className='text-muted-foreground py-10 text-center'>
                        Content preview will appear here
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </ContentMainColumn>

        {/* Sidebar Column */}
        <ContentSideColumn>
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={status.toString()}
                  onValueChange={(value) =>
                    setStatus(Number(value) as MixContentStatus)
                  }
                >
                  <SelectTrigger id='status'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MixContentStatus.Draft.toString()}>
                      Draft
                    </SelectItem>
                    <SelectItem value={MixContentStatus.Published.toString()}>
                      Published
                    </SelectItem>
                    <SelectItem value={MixContentStatus.Archived.toString()}>
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Accordion type='single' collapsible defaultValue='excerpt'>
                <AccordionItem value='excerpt'>
                  <AccordionTrigger>Excerpt</AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-2 pt-2'>
                      <Textarea
                        placeholder='Brief description of the page...'
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className='min-h-[100px]'
                      />
                      <p className='text-muted-foreground text-xs'>
                        A short summary displayed in search results and page
                        listings
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='seo'>
                  <AccordionTrigger>SEO</AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-4 pt-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='meta-title'>Meta Title</Label>
                        <Input
                          id='meta-title'
                          placeholder='SEO Title'
                          defaultValue={title}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='meta-description'>
                          Meta Description
                        </Label>
                        <Textarea
                          id='meta-description'
                          placeholder='SEO Description'
                          defaultValue={excerpt}
                          className='min-h-[80px]'
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>ID:</span>
                  <span>{pageId}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Created:</span>
                  <span>
                    {new Date(
                      mockPages.find((p) => p.id === pageId)?.createdDateTime ||
                        ''
                    ).toLocaleDateString()}
                  </span>
                </div>
                {mockPages.find((p) => p.id === pageId)?.modifiedDateTime && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Last Modified:
                    </span>
                    <span>
                      {new Date(
                        mockPages.find((p) => p.id === pageId)
                          ?.modifiedDateTime || ''
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {mockPages.find((p) => p.id === pageId)?.author && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Author:</span>
                    <span>
                      {mockPages.find((p) => p.id === pageId)?.author}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ContentSideColumn>
      </ContentFormGrid>
    </ContentEditLayout>
  );
}

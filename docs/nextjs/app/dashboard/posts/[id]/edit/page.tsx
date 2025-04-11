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
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';

import { MixContentStatus } from '@/types/content';

// Mock data for posts - this would be replaced with actual API call
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  createdDateTime: string;
  modifiedDateTime?: string;
  publishedDate?: string;
  status: MixContentStatus;
  author?: string;
  featured?: boolean;
  tags?: string[];
}

// Mock posts data - would come from an API
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Mixcore',
    slug: 'getting-started-with-mixcore',
    content:
      'Welcome to Mixcore. This is a guide on how to get started with the CMS.',
    excerpt: 'A beginners guide to using Mixcore CMS',
    createdDateTime: '2023-10-01T08:00:00Z',
    modifiedDateTime: '2023-11-15T14:30:00Z',
    publishedDate: '2023-11-15T14:30:00Z',
    status: MixContentStatus.Published,
    author: 'Admin',
    featured: true,
    tags: ['guide', 'cms', 'getting-started']
  },
  {
    id: '2',
    title: 'Advanced Mixcore Features',
    slug: 'advanced-mixcore-features',
    content:
      'Explore the advanced features of Mixcore CMS and how to use them effectively.',
    excerpt: 'Take your Mixcore site to the next level',
    createdDateTime: '2023-10-05T09:15:00Z',
    modifiedDateTime: '2023-11-10T11:45:00Z',
    publishedDate: '2023-11-10T12:00:00Z',
    status: MixContentStatus.Published,
    author: 'Admin',
    featured: false,
    tags: ['advanced', 'features', 'tutorial']
  }
];

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const postId = typeof id === 'string' ? id : id?.[0] || '';

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<MixContentStatus>(
    MixContentStatus.Draft
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);

        // This would be an API call in the real implementation
        // Mock implementation using the postId
        const post = mockPosts.find((p) => p.id === postId);

        if (!post) {
          toast({
            title: 'Error',
            description: 'Post not found',
            variant: 'destructive'
          });
          router.push('/dashboard/posts');
          return;
        }

        // Set form values
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setTags(post.tags || []);
        setStatus(post.status);
        setIsFeatured(post.featured || false);
        setPublishDate(
          post.publishedDate ? new Date(post.publishedDate) : undefined
        );
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load post',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, router, toast]);

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

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsText = e.target.value;
    setTags(
      tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '')
    );
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
        description: 'Post updated successfully'
      });

      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
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
        description: 'Post deleted successfully'
      });

      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
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

  const onCancelConfirm = () => router.push('/dashboard/posts');

  return (
    <ContentEditLayout
      title={`Edit Post: ${title}`}
      description='Modify your post content and settings'
      backPath='/dashboard/posts'
      isLoading={isLoading}
      isSaving={isSaving}
      onSubmit={handleSubmit}
      status={status}
      setStatus={setStatus}
      disableSubmit={!title || !slug}
      actionButtons={quickPublishButtons}
      isCancelModalOpen={isCancelOpen}
      setIsCancelModalOpen={setIsCancelOpen}
      onCancelConfirm={onCancelConfirm}
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
              <CardTitle>Post Content</CardTitle>
              <CardDescription>The main content for your post</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    placeholder='Post Title'
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug</Label>
                  <div className='flex items-center space-x-2'>
                    <Input
                      id='slug'
                      placeholder='post-slug'
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    The URL-friendly version of the post title
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
                        placeholder='Post content...'
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
              <CardTitle>Post Settings</CardTitle>
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

              <div className='space-y-2'>
                <Label htmlFor='publishDate'>Publish Date</Label>
                <DatePicker
                  date={publishDate}
                  setDate={setPublishDate}
                  className='w-full'
                />
                <p className='text-muted-foreground text-xs'>
                  Schedule when this post should be published
                </p>
              </div>

              <div className='flex items-center space-x-2'>
                <Switch
                  id='featured'
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor='featured' className='flex-1 cursor-pointer'>
                  Featured Post
                </Label>
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
                        placeholder='Brief description of the post...'
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className='min-h-[100px]'
                      />
                      <p className='text-muted-foreground text-xs'>
                        A short summary displayed in search results and post
                        listings
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='tags'>
                  <AccordionTrigger>Tags</AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-2 pt-2'>
                      <Input
                        placeholder='Enter tags separated by commas'
                        value={tags.join(', ')}
                        onChange={handleTagsChange}
                      />
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className='bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs'
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Tags help users find related content
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
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>ID:</span>
                  <span>{postId}</span>
                </div>
                {mockPosts.find((p) => p.id === postId)?.createdDateTime && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Created:</span>
                    <span>
                      {new Date(
                        mockPosts.find((p) => p.id === postId)
                          ?.createdDateTime || ''
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {mockPosts.find((p) => p.id === postId)?.modifiedDateTime && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Last Modified:
                    </span>
                    <span>
                      {new Date(
                        mockPosts.find((p) => p.id === postId)
                          ?.modifiedDateTime || ''
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {mockPosts.find((p) => p.id === postId)?.author && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Author:</span>
                    <span>
                      {mockPosts.find((p) => p.id === postId)?.author}
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

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
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TagIcon, ArrowLeftIcon, Loader2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { tagService, CreateTagDto, Tag } from '@/services/tagService';
import { AlertModal } from '@/components/modals/alert-modal';

// Tag form schema
const tagFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Tag name must be at least 2 characters.'
  }),
  slug: z
    .string()
    .min(2, {
      message: 'Slug must be at least 2 characters.'
    })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens.'
    }),
  description: z.string().optional()
});

type TagFormValues = z.infer<typeof tagFormSchema>;

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;

  const [tag, setTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form with default values
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: ''
    }
  });

  // Load tag data
  useEffect(() => {
    const fetchTag = async () => {
      try {
        setIsLoading(true);
        const tagData = await tagService.getById(id);
        setTag(tagData);

        // Set form values
        form.reset({
          name: tagData.name,
          slug: tagData.slug,
          description: tagData.description || ''
        });
      } catch (error) {
        console.error('Error fetching tag:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tag',
          variant: 'destructive'
        });
        router.push('/dashboard/tags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTag();
  }, [id, form, router, toast]);

  // Generate a slug from the tag name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };

  // Update slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    if (
      !form.getFieldState('slug').isDirty ||
      form.getValues('slug') === tag?.slug
    ) {
      form.setValue('slug', generateSlug(name));
    }
  };

  // Submit handler
  const onSubmit = async (data: TagFormValues) => {
    if (!tag) return;

    try {
      setIsSaving(true);

      const tagData: Partial<CreateTagDto> = {
        name: data.name,
        slug: data.slug,
        description: data.description
      };

      await tagService.update(id, tagData);

      toast({
        title: 'Success',
        description: 'Tag updated successfully'
      });

      router.push('/dashboard/tags');
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tag',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await tagService.delete(id);

      toast({
        title: 'Success',
        description: 'Tag deleted successfully'
      });

      router.push('/dashboard/tags');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-[calc(100vh-10rem)] items-center justify-center'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <Loader2Icon className='text-primary h-10 w-10 animate-spin' />
          <h3 className='mt-2 text-lg font-semibold'>Loading tag...</h3>
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className='flex h-[calc(100vh-10rem)] items-center justify-center'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <TagIcon className='text-muted-foreground h-10 w-10' />
          <h3 className='mt-2 text-lg font-semibold'>Tag not found</h3>
          <p className='text-muted-foreground mb-4'>
            The tag you are looking for does not exist
          </p>
          <Button onClick={() => router.push('/dashboard/tags')}>
            Go back to tags
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertModal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title='Delete Tag'
        description='Are you sure you want to delete this tag? This will remove the tag from all associated content.'
      />

      <div className='space-y-6 px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push('/dashboard/tags')}
              className='mr-4'
            >
              <ArrowLeftIcon className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Edit Tag</h1>
              <p className='text-muted-foreground'>Update tag information</p>
            </div>
          </div>

          <Button
            variant='destructive'
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting || isSaving}
          >
            Delete Tag
          </Button>
        </div>

        <Separator />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Main Form */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Tag Information</CardTitle>
              <CardDescription>Edit tag details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-8'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={handleNameChange}
                            placeholder='Enter tag name'
                            disabled={isSaving}
                          />
                        </FormControl>
                        <FormDescription>
                          The name that will be displayed for this tag
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='slug'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Enter slug'
                            disabled={isSaving}
                          />
                        </FormControl>
                        <FormDescription>
                          The URL-friendly version of the name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder='Enter tag description'
                            disabled={isSaving}
                            className='h-20 resize-none'
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of what this tag represents
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex justify-end gap-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => router.push('/dashboard/tags')}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type='submit' disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TagIcon className='h-5 w-5' />
                Tag Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Created
                </h3>
                <p>{new Date(tag.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Last Updated
                </h3>
                <p>{new Date(tag.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  ID
                </h3>
                <p className='font-mono text-xs break-all'>{tag.id}</p>
              </div>

              <Separator />

              <div className='pt-2'>
                <p className='text-sm'>
                  <strong>Note:</strong> Editing a tag will update it across all
                  content where it is used.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

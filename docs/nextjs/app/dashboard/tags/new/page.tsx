'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TagIcon, ArrowLeftIcon } from 'lucide-react';

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
import { tagService, CreateTagDto } from '@/services/tagService';

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

export default function NewTagPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with default values
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: ''
    }
  });

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

    if (!form.getFieldState('slug').isDirty) {
      form.setValue('slug', generateSlug(name));
    }
  };

  // Submit handler
  const onSubmit = async (data: TagFormValues) => {
    try {
      setIsLoading(true);

      const tagData: CreateTagDto = {
        name: data.name,
        slug: data.slug,
        description: data.description
      };

      await tagService.create(tagData);

      toast({
        title: 'Success',
        description: 'Tag created successfully'
      });

      router.push('/dashboard/tags');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tag',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6 px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
      {/* Header */}
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
          <h1 className='text-2xl font-bold tracking-tight'>Create Tag</h1>
          <p className='text-muted-foreground'>Add a new content tag</p>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main Form */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Tag Information</CardTitle>
            <CardDescription>Provide details for the new tag</CardDescription>
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Tag'}
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
              About Tags
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm'>
            <p className='mb-4'>
              Tags help organize your content and make it easier for users to
              find related items.
            </p>
            <ul className='text-muted-foreground list-inside list-disc space-y-2'>
              <li>Use descriptive, concise tag names</li>
              <li>Create tags that are reusable across content</li>
              <li>Avoid creating too many similar tags</li>
              <li>Tags are searchable and will appear in tag clouds</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

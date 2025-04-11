'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { postService } from '@/services/post';
import { MixContentStatus } from '@/types/content';
import { FormRichTextEditor } from '@/components/forms/FormRichTextEditor';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  status: z.nativeEnum(MixContentStatus, {
    required_error: 'Please select a status'
  }),
  isPublic: z.boolean().default(true),
  image: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  specificulture: z.string().optional(),
  priority: z.coerce.number().min(0).default(0)
});

type PostFormValues = z.infer<typeof formSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Default values for the form
  const defaultValues: PostFormValues = {
    title: '',
    excerpt: '',
    content: '',
    status: MixContentStatus.Draft,
    isPublic: true,
    image: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    specificulture: 'en-US',
    priority: 0
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      setIsLoading(true);
      await postService.createPost(data);
      toast({
        title: 'Success',
        description: 'Post created successfully'
      });
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => router.push('/dashboard/posts')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Heading title='Create Post' description='Create a new blog post' />
        </div>
        <Button
          type='submit'
          disabled={isLoading}
          onClick={form.handleSubmit(onSubmit)}
        >
          <Save className='mr-2 h-4 w-4' />
          {isLoading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>

      <Separator className='my-4' />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardContent className='space-y-4 pt-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Post title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='excerpt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief summary of the post'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormRichTextEditor
                name='content'
                label='Content'
                placeholder='Write your post content here...'
              />
            </CardContent>
          </Card>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardContent className='space-y-4 pt-6'>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={MixContentStatus.Draft.toString()}>
                            Draft
                          </SelectItem>
                          <SelectItem
                            value={MixContentStatus.Published.toString()}
                          >
                            Published
                          </SelectItem>
                          <SelectItem
                            value={MixContentStatus.Archived.toString()}
                          >
                            Archived
                          </SelectItem>
                          <SelectItem
                            value={MixContentStatus.Deleted.toString()}
                          >
                            Deleted
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isPublic'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                      <div className='space-y-0.5'>
                        <FormLabel>Public</FormLabel>
                        <div className='text-muted-foreground text-sm'>
                          Make this post publicly accessible
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          placeholder='0'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://example.com/image.jpg'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className='space-y-4 pt-6'>
                <FormField
                  control={form.control}
                  name='seoTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input placeholder='SEO optimized title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='seoDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Meta description for SEO'
                          className='resize-none'
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='seoKeywords'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='keyword1, keyword2, keyword3'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='specificulture'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Culture</FormLabel>
                      <FormControl>
                        <Input placeholder='en-US' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <CardFooter className='flex justify-between rounded-lg border'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.push('/dashboard/posts')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}

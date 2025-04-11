'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { id: 'demo-1' },
    { id: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import {
  ContentDetailLayout,
  ContentMetadata
} from '@/components/shared/content-detail-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Post } from '@/types/post';
import { MixContentStatus } from '@/types/content';
import { postService } from '@/services/post';
import { RichTextEditor } from '@/components/RichTextEditor';

interface ExtendedPost extends Post {
  slug?: string;
  specificulture?: string;
  isPublic?: boolean;
  priority?: number;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadPost(Number(params.id));
    }
  }, [params.id]);

  const loadPost = async (id: number) => {
    try {
      setIsLoading(true);
      const postData = await postService.getPost(id);
      setPost(postData as ExtendedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load post details',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleteLoading(true);
      if (post?.id) {
        await postService.deletePost(Number(post.id));
        toast({
          title: 'Success',
          description: 'Post deleted successfully'
        });
        router.push('/dashboard/posts');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteLoading(false);
      setOpenDeleteAlert(false);
    }
  };

  return (
    <ContentDetailLayout
      title={post?.title || 'Post Details'}
      description={post?.excerpt}
      backPath='/dashboard/posts'
      editPath={post ? `/dashboard/posts/${post.id}/edit` : undefined}
      previewPath={post?.slug ? `/blog/${post.slug}` : undefined}
      isLoading={isLoading}
      contentNotFound={!isLoading && !post}
      contentType='post'
      status={post?.status}
      deleteModalProps={{
        isOpen: openDeleteAlert,
        onClose: () => setOpenDeleteAlert(false),
        onConfirm: handleDelete,
        loading: isDeleteLoading,
        title: 'Delete Post',
        description:
          'Are you sure you want to delete this post? This action cannot be undone.'
      }}
      actionButtons={
        <button
          className='text-destructive hover:text-destructive/90 px-4 py-2 text-sm font-medium'
          onClick={() => setOpenDeleteAlert(true)}
        >
          Delete
        </button>
      }
    >
      <div className='space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0'>
        {/* Content Column */}
        <div className='space-y-6 md:col-span-2'>
          {/* Featured Image */}
          {post?.image && (
            <Card>
              <CardContent className='overflow-hidden p-0'>
                <div className='relative aspect-video w-full overflow-hidden'>
                  <img
                    src={post.image}
                    alt={post.title || 'Post image'}
                    className='h-full w-full object-cover'
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              {post?.content ? (
                <div className='prose dark:prose-invert max-w-full'>
                  <RichTextEditor
                    content={post.content}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
              ) : (
                <p className='text-muted-foreground'>No content available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata Column */}
        <div className='space-y-6'>
          {/* Post Details */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              {post && (
                <ContentMetadata
                  items={[
                    ...(post.specificulture
                      ? [
                          {
                            label: 'Culture',
                            value: post.specificulture
                          }
                        ]
                      : []),
                    ...(post.slug
                      ? [
                          {
                            label: 'Slug',
                            value: post.slug
                          }
                        ]
                      : []),
                    {
                      label: 'Created',
                      value: post.createdDateTime
                        ? new Date(post.createdDateTime).toLocaleString()
                        : 'Unknown'
                    },
                    ...(post.modifiedDateTime
                      ? [
                          {
                            label: 'Last Modified',
                            value: new Date(
                              post.modifiedDateTime
                            ).toLocaleString()
                          }
                        ]
                      : []),
                    ...(post.createdBy
                      ? [
                          {
                            label: 'Author',
                            value: post.createdBy
                          }
                        ]
                      : []),
                    ...(post.priority !== undefined
                      ? [
                          {
                            label: 'Priority',
                            value: post.priority.toString()
                          }
                        ]
                      : []),
                    ...(post.isPublic !== undefined
                      ? [
                          {
                            label: 'Public',
                            value: post.isPublic ? 'Yes' : 'No'
                          }
                        ]
                      : [])
                  ]}
                />
              )}
            </CardContent>
          </Card>

          {/* SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
            </CardHeader>
            <CardContent>
              {post && (
                <ContentMetadata
                  items={[
                    {
                      label: 'SEO Title',
                      value: post.seoTitle || post.title || 'Not set'
                    },
                    {
                      label: 'SEO Description',
                      value: post.seoDescription || post.excerpt || 'Not set'
                    },
                    {
                      label: 'SEO Keywords',
                      value: post.seoKeywords || 'Not set'
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentDetailLayout>
  );
}

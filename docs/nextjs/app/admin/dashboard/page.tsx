'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PostsApi } from '@/services/api';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 0,
    pages: 0,
    users: 0,
    media: 0
  });

  // Simulate loading stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with actual API calls when available
        const postsData = await PostsApi.getPosts(0, 1);

        setStats({
          posts: postsData.data.totalItems || 0,
          pages: 12, // Mock data
          users: 5, // Mock data
          media: 24 // Mock data
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dashboard stat cards
  const statsCards = [
    {
      title: 'Total Posts',
      value: isLoading ? '...' : stats.posts,
      icon: <Icons.post className='text-muted-foreground h-4 w-4' />,
      description: 'All published and draft posts',
      href: '/admin/post'
    },
    {
      title: 'Total Pages',
      value: isLoading ? '...' : stats.pages,
      icon: <Icons.file className='text-muted-foreground h-4 w-4' />,
      description: 'All published and draft pages',
      href: '/admin/page'
    },
    {
      title: 'Registered Users',
      value: isLoading ? '...' : stats.users,
      icon: <Icons.user className='text-muted-foreground h-4 w-4' />,
      description: 'All registered users',
      href: '/admin/user'
    },
    {
      title: 'Media Items',
      value: isLoading ? '...' : stats.media,
      icon: <Icons.media className='text-muted-foreground h-4 w-4' />,
      description: 'All uploaded media files',
      href: '/admin/media'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Create New Post',
      description: 'Start writing a new blog post',
      icon: <Icons.post className='h-4 w-4' />,
      href: '/admin/post/create'
    },
    {
      title: 'Add New Page',
      description: 'Create a new website page',
      icon: <Icons.file className='h-4 w-4' />,
      href: '/admin/page/create'
    },
    {
      title: 'Upload Media',
      description: 'Add images or documents',
      icon: <Icons.media className='h-4 w-4' />,
      href: '/admin/media/upload'
    },
    {
      title: 'Manage Settings',
      description: 'Configure your website',
      icon: <Icons.settings className='h-4 w-4' />,
      href: '/admin/settings'
    }
  ];

  // Recent activity feed (mock data)
  const activityFeed = (
    <div className='space-y-4'>
      {[
        {
          user: 'admin',
          action: 'created a new post',
          time: '2 hours ago',
          type: 'post'
        },
        {
          user: 'editor',
          action: 'updated a page',
          time: '5 hours ago',
          type: 'page'
        },
        {
          user: 'admin',
          action: 'uploaded media',
          time: '1 day ago',
          type: 'media'
        },
        {
          user: 'contributor',
          action: 'commented on a post',
          time: '2 days ago',
          type: 'comment'
        }
      ].map((activity, i) => (
        <div key={i} className='flex items-start space-x-3 py-2'>
          <span className='bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full'>
            {activity.type === 'post' && <Icons.post className='h-4 w-4' />}
            {activity.type === 'page' && <Icons.file className='h-4 w-4' />}
            {activity.type === 'media' && <Icons.media className='h-4 w-4' />}
            {activity.type === 'comment' && <Icons.post className='h-4 w-4' />}
          </span>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>
              <span className='font-semibold'>{activity.user}</span>{' '}
              {activity.action}
            </p>
            <p className='text-muted-foreground text-xs'>{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Main content
  const mainContent = (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground mb-4'>
          This is your Mixcore dashboard. Get started by creating content or
          managing your site.
        </p>
        <div className='grid gap-4 md:grid-cols-2'>
          <Link href='/admin/post/create' className='block'>
            <Button className='w-full justify-start' variant='outline'>
              <Icons.post className='mr-2 h-4 w-4' />
              Create New Post
            </Button>
          </Link>
          <Link href='/admin/page/create' className='block'>
            <Button className='w-full justify-start' variant='outline'>
              <Icons.file className='mr-2 h-4 w-4' />
              Create New Page
            </Button>
          </Link>
          <Link href='/admin/media/upload' className='block'>
            <Button className='w-full justify-start' variant='outline'>
              <Icons.media className='mr-2 h-4 w-4' />
              Upload Media
            </Button>
          </Link>
          <Link href='/admin/settings' className='block'>
            <Button className='w-full justify-start' variant='outline'>
              <Icons.settings className='mr-2 h-4 w-4' />
              Site Settings
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout
      statsCards={statsCards}
      quickActions={quickActions}
      activityFeed={activityFeed}
      contentArea={mainContent}
    />
  );
}

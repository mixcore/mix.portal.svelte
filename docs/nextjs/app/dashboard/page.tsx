'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  FileText,
  LineChart,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  IconChartBar,
  IconUserCircle,
  IconPhoto,
  IconNews
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/overview');
  }, [router]);

  // Mock data
  const stats = [
    {
      title: 'Total Posts',
      value: '125',
      trend: '+12%',
      icon: <FileText className='text-primary h-5 w-5' />
    },
    {
      title: 'Total Pages',
      value: '43',
      trend: '+5%',
      icon: <IconNews className='text-primary h-5 w-5' />
    },
    {
      title: 'Active Users',
      value: '1,234',
      trend: '+15%',
      icon: <Users className='text-primary h-5 w-5' />
    },
    {
      title: 'Media Files',
      value: '562',
      trend: '+8%',
      icon: <IconPhoto className='text-primary h-5 w-5' />
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'Getting Started with Mixcore CMS',
      views: 1543,
      status: 'Published',
      date: '2023-11-15'
    },
    {
      id: 2,
      title: 'Introducing New Features in v2.0',
      views: 932,
      status: 'Published',
      date: '2023-11-10'
    },
    {
      id: 3,
      title: 'Best Practices for Content Management',
      views: 621,
      status: 'Draft',
      date: '2023-11-05'
    },
    {
      id: 4,
      title: 'Upcoming Events and Webinars',
      views: 412,
      status: 'Scheduled',
      date: '2023-11-01'
    }
  ];

  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'published a post',
      target: 'Getting Started with Mixcore CMS',
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'updated a page',
      target: 'About Us',
      time: '5 hours ago'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'uploaded 5 images',
      target: '',
      time: 'Yesterday'
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      action: 'created a new role',
      target: 'Editor Plus',
      time: 'Yesterday'
    },
    {
      id: 5,
      user: 'Tim Brown',
      action: 'changed site settings',
      target: '',
      time: '2 days ago'
    }
  ];

  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground mt-1'>
            Welcome back to your content management dashboard.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/dashboard/posts/new'>
            <Button>New Post</Button>
          </Link>
          <Link href='/dashboard/pages/new'>
            <Button variant='outline'>New Page</Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    {stat.title}
                  </p>
                  <div className='flex items-baseline gap-1'>
                    <h3 className='text-2xl font-bold'>{stat.value}</h3>
                    <Badge
                      variant='outline'
                      className='bg-emerald-50 text-xs font-medium text-emerald-500'
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
                <div className='bg-primary/10 rounded-full p-2'>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-7'>
        <Card className='md:col-span-4'>
          <CardHeader className='pb-2'>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Visitor statistics for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='text-muted-foreground flex h-[240px] items-center justify-center rounded-md border-2 border-dashed'>
              <div className='flex flex-col items-center gap-2'>
                <BarChart3 className='h-8 w-8' />
                <p>Analytics chart would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-3'>
          <CardHeader className='pb-2'>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className='flex items-start gap-3'>
                  <div className='relative mt-1'>
                    <div className='bg-background flex h-7 w-7 items-center justify-center rounded-full border'>
                      <Activity className='h-4 w-4' />
                    </div>
                    {activity.id !== activities.slice(0, 4).length && (
                      <div className='bg-border absolute top-7 bottom-0 left-3.5 w-[1px]' />
                    )}
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm leading-none'>
                      <span className='font-medium'>{activity.user}</span>{' '}
                      {activity.action}
                      {activity.target && (
                        <span className='font-medium'> {activity.target}</span>
                      )}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 flex justify-center'>
              <Button variant='link' size='sm'>
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-7'>
        <Card className='md:col-span-4'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>
                  Your recently published and draft content
                </CardDescription>
              </div>
              <Tabs defaultValue='posts' className='w-[200px]'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='posts'>Posts</TabsTrigger>
                  <TabsTrigger value='pages'>Pages</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className='hover:bg-muted/50 flex items-center justify-between rounded-md p-2 transition-colors'
                >
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Link
                        href={`/dashboard/posts/${post.id}`}
                        className='truncate text-sm font-medium hover:underline'
                      >
                        {post.title}
                      </Link>
                      <Badge
                        variant={
                          post.status === 'Published'
                            ? 'default'
                            : post.status === 'Draft'
                              ? 'outline'
                              : 'secondary'
                        }
                        className='text-xs'
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon' asChild>
                    <Link href={`/dashboard/posts/${post.id}`}>
                      <LineChart className='h-4 w-4' />
                      <span className='sr-only'>View stats</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className='mt-4 flex justify-center'>
              <Button variant='link' size='sm' asChild>
                <Link href='/dashboard/posts'>View all posts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-3'>
          <CardHeader className='pb-2'>
            <CardTitle>Website Health</CardTitle>
            <CardDescription>System performance and security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='font-medium'>System Performance</span>
                  <span className='text-emerald-500'>Good</span>
                </div>
                <Progress value={85} className='h-2' />
                <p className='text-muted-foreground text-xs'>
                  Response time: 0.3s avg
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='font-medium'>Database Usage</span>
                  <span className='text-amber-500'>Warning</span>
                </div>
                <Progress value={72} className='h-2' />
                <p className='text-muted-foreground text-xs'>
                  8.6 GB of 12 GB used
                </p>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='font-medium'>Security Status</span>
                  <span className='text-emerald-500'>Protected</span>
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <div className='rounded-full bg-emerald-100 p-1.5'>
                    <Shield className='h-4 w-4 text-emerald-500' />
                  </div>
                  <p className='text-xs'>All security checks passed</p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='font-medium'>Updates Available</span>
                  <span>2 updates</span>
                </div>
                <Button variant='outline' size='sm' className='w-full'>
                  View Updates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

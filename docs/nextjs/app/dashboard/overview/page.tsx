'use client';

import { Heading } from '@/components/ui/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OverviewPage() {
  return (
    <div className='space-y-6'>
      <Heading
        title='Dashboard Overview'
        description='Welcome to Mixcore Dashboard'
      />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>15</div>
            <p className='text-muted-foreground text-xs'>
              Content management statistics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-muted-foreground text-xs'>
              User management statistics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Media Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-muted-foreground text-xs'>
              Media management statistics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

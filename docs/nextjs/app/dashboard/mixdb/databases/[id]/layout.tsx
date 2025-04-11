'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase } from '@/types/mixdb';
import { LoadingSection } from '@/components/loading-section';
import Link from 'next/link';

export default function DatabaseLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const databaseId = Number(params.id);

  const [database, setDatabase] = useState<MixDatabase | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    if (pathname.endsWith('/data')) return 'data';
    if (pathname.endsWith('/api')) return 'api';
    if (pathname.endsWith('/settings')) return 'settings';
    return 'schema'; // Default tab
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (databaseId) {
      fetchDatabase();
    }
  }, [databaseId]);

  const fetchDatabase = async () => {
    try {
      setLoading(true);
      const data = await MixDbService.getDatabase(databaseId);
      setDatabase(data);
    } catch (error) {
      console.error('Error fetching database:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-4 w-64' />
          </div>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
        <Skeleton className='h-12 w-full rounded-lg' />
        <LoadingSection />
      </div>
    );
  }

  if (!database) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8 text-center'>
        <Icons.database className='text-muted-foreground h-12 w-12' />
        <h2 className='text-2xl font-semibold'>Database Not Found</h2>
        <p className='text-muted-foreground max-w-md text-sm'>
          The database you're looking for doesn't exist or you don't have
          permission to access it.
        </p>
        <Button
          variant='default'
          onClick={() => router.push('/dashboard/mixdb/databases')}
        >
          <Icons.arrowLeft className='mr-2 h-4 w-4' />
          Go Back to Databases
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Link
              href='/dashboard/mixdb/databases'
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              <Icons.arrowLeft className='mr-1 inline h-4 w-4' />
              Databases
            </Link>
            <span className='text-muted-foreground'>/</span>
            <h2 className='text-xl font-semibold'>{database.name}</h2>
            <Badge
              variant={database.status === 'Published' ? 'default' : 'outline'}
            >
              {database.status}
            </Badge>
          </div>
          <p className='text-muted-foreground text-sm'>
            {database.description || `Database ID: ${database.id}`}
          </p>
        </div>
        <Button
          variant='outline'
          size='icon'
          onClick={() =>
            router.push(`/dashboard/mixdb/databases/${database.id}/edit`)
          }
        >
          <Icons.pencil className='h-4 w-4' />
          <span className='sr-only'>Edit Database</span>
        </Button>
      </div>

      <Tabs value={activeTab} className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <Link
            href={`/dashboard/mixdb/databases/${database.id}/schema`}
            className='w-full'
          >
            <TabsTrigger value='schema' className='w-full'>
              <Icons.code className='mr-2 h-4 w-4' />
              Schema
            </TabsTrigger>
          </Link>
          <Link
            href={`/dashboard/mixdb/databases/${database.id}/data`}
            className='w-full'
          >
            <TabsTrigger value='data' className='w-full'>
              <Icons.database className='mr-2 h-4 w-4' />
              Data
            </TabsTrigger>
          </Link>
          <Link
            href={`/dashboard/mixdb/databases/${database.id}/api`}
            className='w-full'
          >
            <TabsTrigger value='api' className='w-full'>
              <Icons.code className='mr-2 h-4 w-4' />
              API
            </TabsTrigger>
          </Link>
          <Link
            href={`/dashboard/mixdb/databases/${database.id}/settings`}
            className='w-full'
          >
            <TabsTrigger value='settings' className='w-full'>
              <Icons.settings className='mr-2 h-4 w-4' />
              Settings
            </TabsTrigger>
          </Link>
        </TabsList>
        <Card>
          <CardContent className='pt-6'>{children}</CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

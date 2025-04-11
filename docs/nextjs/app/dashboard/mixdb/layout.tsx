'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export default function MixDbLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.includes(path);
  const isDashboard =
    pathname === '/dashboard/mixdb' || pathname === '/dashboard/mixdb/';

  // Determine active tab
  let activeTab = 'dashboard';
  if (isActive('/databases')) activeTab = 'databases';
  if (isActive('/forms')) activeTab = 'forms';

  return (
    <div className='container mx-auto space-y-6 py-4'>
      <div className='flex items-center space-x-4'>
        <Icons.database className='text-primary h-8 w-8' />
        <div>
          <h1 className='text-2xl font-bold'>MixDB</h1>
          <p className='text-muted-foreground text-sm'>
            Database and form management system
          </p>
        </div>
      </div>

      <Tabs defaultValue='dashboard' value={activeTab}>
        <TabsList className='grid w-full grid-cols-3'>
          <Link href='/dashboard/mixdb' className={cn('w-full')}>
            <TabsTrigger value='dashboard' className='w-full'>
              <Icons.dashboard className='mr-2 h-4 w-4' />
              Dashboard
            </TabsTrigger>
          </Link>
          <Link href='/dashboard/mixdb/databases' className={cn('w-full')}>
            <TabsTrigger value='databases' className='w-full'>
              <Icons.database className='mr-2 h-4 w-4' />
              Databases
            </TabsTrigger>
          </Link>
          <Link href='/dashboard/mixdb/forms' className={cn('w-full')}>
            <TabsTrigger value='forms' className='w-full'>
              <Icons.form className='mr-2 h-4 w-4' />
              Form Builder
            </TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent value='dashboard' className={!isDashboard ? 'hidden' : ''}>
          {children}
        </TabsContent>
        <TabsContent
          value='databases'
          className={!isActive('/databases') ? 'hidden' : ''}
        >
          {children}
        </TabsContent>
        <TabsContent
          value='forms'
          className={!isActive('/forms') ? 'hidden' : ''}
        >
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase, MixDatabaseForm, MixDatabaseData } from '@/types/mixdb';
import { LoadingSection } from '@/components/loading-section';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: keyof typeof Icons;
  change?: string;
  positive?: boolean;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  change,
  positive
}: StatsCardProps) => {
  const Icon = Icons[icon];
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='text-muted-foreground h-4 w-4' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-muted-foreground text-xs'>{description}</p>
        {change && (
          <div className='mt-2 flex items-center text-xs'>
            {positive ? (
              <Icons.arrowUp className='mr-1 h-3 w-3 text-green-500' />
            ) : (
              <Icons.arrowDown className='mr-1 h-3 w-3 text-red-500' />
            )}
            <span className={positive ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface RecentActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  icon: keyof typeof Icons;
  iconColor?: string;
}

const RecentActivityItem = ({
  title,
  description,
  timestamp,
  icon,
  iconColor = 'text-primary'
}: RecentActivityItemProps) => {
  const Icon = Icons[icon];
  return (
    <div className='flex items-start space-x-4 py-3'>
      <div className={`bg-primary/10 rounded-full p-2 ${iconColor}`}>
        <Icon className='h-4 w-4' />
      </div>
      <div className='flex-1 space-y-1'>
        <p className='text-sm leading-none font-medium'>{title}</p>
        <p className='text-muted-foreground text-xs'>{description}</p>
      </div>
      <div className='text-muted-foreground text-xs'>{timestamp}</div>
    </div>
  );
};

export default function MixDbDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState<MixDatabase[]>([]);
  const [forms, setForms] = useState<MixDatabaseForm[]>([]);
  const [stats, setStats] = useState({
    totalDatabases: 0,
    totalForms: 0,
    totalRecords: 0,
    storageUsed: '0 MB',
    queriesPerDay: 0,
    dataProcessed: '0 MB'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch databases
      const dbResponse = await MixDbService.getDatabases({
        pageIndex: 0,
        pageSize: 5,
        orderBy: 'createdDateTime',
        direction: 'desc'
      });

      // Fetch forms
      const formsResponse = await MixDbService.getForms({
        pageIndex: 0,
        pageSize: 5,
        orderBy: 'createdDateTime',
        direction: 'desc'
      });

      setDatabases(dbResponse.items);
      setForms(formsResponse.items);

      // Set mock stats for the dashboard
      setStats({
        totalDatabases: dbResponse.pagingData.totalItems,
        totalForms: formsResponse.pagingData.totalItems,
        totalRecords: Math.floor(Math.random() * 10000),
        storageUsed: `${Math.floor(Math.random() * 100)} MB`,
        queriesPerDay: Math.floor(Math.random() * 1000),
        dataProcessed: `${Math.floor(Math.random() * 500)} MB`
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSection className='min-h-[500px]' />;
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <StatsCard
          title='Total Databases'
          value={stats.totalDatabases}
          description='Number of databases in your project'
          icon='database'
          change='+12% from last month'
          positive={true}
        />
        <StatsCard
          title='Total Forms'
          value={stats.totalForms}
          description='Number of form builders'
          icon='form'
          change='+8% from last month'
          positive={true}
        />
        <StatsCard
          title='Total Records'
          value={stats.totalRecords.toLocaleString()}
          description='Total records across all databases'
          icon='file'
          change='+15% from last month'
          positive={true}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>Database Usage</CardTitle>
            <CardDescription>
              Storage and query metrics for your databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <div>Storage Used</div>
                  <div className='text-muted-foreground'>
                    {stats.storageUsed} / 500 MB
                  </div>
                </div>
                <Progress
                  value={parseInt(stats.storageUsed) / 5}
                  className='h-2'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <div>Queries per Day</div>
                  <div className='text-muted-foreground'>
                    {stats.queriesPerDay} / 10,000
                  </div>
                </div>
                <Progress
                  value={(stats.queriesPerDay / 10000) * 100}
                  className='h-2'
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <div>Data Processed</div>
                  <div className='text-muted-foreground'>
                    {stats.dataProcessed} / 1 GB
                  </div>
                </div>
                <Progress
                  value={parseInt(stats.dataProcessed) / 10}
                  className='h-2'
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='outline' className='w-full'>
              <Icons.chart className='mr-2 h-4 w-4' />
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>

        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common MixDB tasks</CardDescription>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-2'>
            <Button
              variant='outline'
              className='justify-start'
              onClick={() => router.push('/dashboard/mixdb/databases')}
            >
              <Icons.database className='mr-2 h-4 w-4' />
              Create Database
            </Button>
            <Button
              variant='outline'
              className='justify-start'
              onClick={() => router.push('/dashboard/mixdb/forms')}
            >
              <Icons.form className='mr-2 h-4 w-4' />
              Create Form
            </Button>
            <Button variant='outline' className='justify-start'>
              <Icons.upload className='mr-2 h-4 w-4' />
              Import Data
            </Button>
            <Button variant='outline' className='justify-start'>
              <Icons.download className='mr-2 h-4 w-4' />
              Export Data
            </Button>
            <Button variant='outline' className='justify-start'>
              <Icons.settings className='mr-2 h-4 w-4' />
              Database Settings
            </Button>
            <Button variant='outline' className='justify-start'>
              <Icons.help className='mr-2 h-4 w-4' />
              View Documentation
            </Button>
          </CardContent>
          <CardFooter>
            <div className='text-muted-foreground text-xs'>
              Need help?{' '}
              <a href='#' className='text-primary underline'>
                Contact support
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Recent Databases</CardTitle>
              <CardDescription>Your recently created databases</CardDescription>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/mixdb/databases')}
            >
              View All
              <Icons.arrowRight className='ml-2 h-4 w-4' />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[300px]'>
              {databases.length > 0 ? (
                databases.map((db) => (
                  <div key={db.id} className='mb-4 last:mb-0'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <Icons.database className='text-primary mr-2 h-5 w-5' />
                        <Link
                          href={`/dashboard/mixdb/databases/${db.id}`}
                          className='font-medium hover:underline'
                        >
                          {db.name}
                        </Link>
                      </div>
                      <Badge
                        variant={
                          db.status === 'Published' ? 'default' : 'outline'
                        }
                      >
                        {db.status}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                      {db.description ||
                        db.displayName ||
                        'No description provided'}
                    </p>
                    <div className='text-muted-foreground mt-2 flex justify-between text-xs'>
                      <div>Status: {db.status}</div>
                      <div>
                        Created:{' '}
                        {new Date(db.createdDateTime).toLocaleDateString()}
                      </div>
                    </div>
                    <Separator className='mt-3' />
                  </div>
                ))
              ) : (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <Icons.database className='text-muted-foreground/50 h-10 w-10' />
                  <p className='mt-2 text-sm font-medium'>No databases found</p>
                  <p className='text-muted-foreground text-xs'>
                    Create your first database to get started
                  </p>
                  <Button
                    className='mt-4'
                    onClick={() => router.push('/dashboard/mixdb/databases')}
                  >
                    Create Database
                  </Button>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent actions in your MixDB</CardDescription>
              </div>
              <Button variant='ghost' size='sm'>
                View All
                <Icons.arrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[300px]'>
              <RecentActivityItem
                title='New Database Created'
                description="'Customer Survey' database was created"
                timestamp='2 hours ago'
                icon='database'
                iconColor='text-green-500'
              />
              <Separator />
              <RecentActivityItem
                title='Form Updated'
                description="'Product Feedback' form was updated"
                timestamp='4 hours ago'
                icon='form'
                iconColor='text-blue-500'
              />
              <Separator />
              <RecentActivityItem
                title='Data Imported'
                description="500 records imported to 'Users' database"
                timestamp='Yesterday'
                icon='upload'
                iconColor='text-orange-500'
              />
              <Separator />
              <RecentActivityItem
                title='Database Schema Changed'
                description="'Products' schema was modified"
                timestamp='2 days ago'
                icon='settings'
                iconColor='text-purple-500'
              />
              <Separator />
              <RecentActivityItem
                title='New Form Created'
                description="'Customer Registration' form was created"
                timestamp='3 days ago'
                icon='form'
                iconColor='text-green-500'
              />
              <Separator />
              <RecentActivityItem
                title='Data Exported'
                description="'Sales' data was exported to CSV"
                timestamp='4 days ago'
                icon='download'
                iconColor='text-blue-500'
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Recent Forms</CardTitle>
              <CardDescription>Your recently created forms</CardDescription>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard/mixdb/forms')}
            >
              View All
              <Icons.arrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            {forms.length > 0 ? (
              forms.map((form) => (
                <Card key={form.id} className='overflow-hidden'>
                  <CardHeader className='p-4'>
                    <CardTitle className='text-base'>{form.name}</CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {form.description ||
                        'Form for database: ' + form.mixDatabaseName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='space-y-2 text-xs'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Database:</span>
                        <span>{form.mixDatabaseName}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Fields:</span>
                        <span>{form.fields?.length || 0}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Created:</span>
                        <span>
                          {new Date(form.createdDateTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between p-4 pt-0'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        router.push(`/dashboard/mixdb/forms/${form.id}`)
                      }
                    >
                      <Icons.view className='mr-2 h-3 w-3' />
                      Preview
                    </Button>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={() =>
                        router.push(`/dashboard/mixdb/forms/${form.id}/edit`)
                      }
                    >
                      <Icons.pencil className='mr-2 h-3 w-3' />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className='col-span-3 flex flex-col items-center justify-center py-8 text-center'>
                <Icons.form className='text-muted-foreground/50 h-10 w-10' />
                <p className='mt-2 text-sm font-medium'>No forms found</p>
                <p className='text-muted-foreground text-xs'>
                  Create your first form to get started
                </p>
                <Button
                  className='mt-4'
                  onClick={() => router.push('/dashboard/mixdb/forms')}
                >
                  Create Form
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

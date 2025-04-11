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
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  BuildingIcon,
  UsersIcon,
  GlobeIcon,
  CalendarIcon,
  SettingsIcon,
  EditIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BanIcon,
  ChartBarIcon,
  ServerIcon,
  CreditCardIcon,
  LayoutGridIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

// Mock tenant types and data
interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  usersCount: number;
  createdAt: string;
  expiresAt?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  billingMode: 'monthly' | 'yearly';
  isCustomBranding: boolean;
  isMultiRegion: boolean;
  enabledContexts: string[];
  notes?: string;
  storageUsed: number;
  storageLimit: number;
  apiUsage: {
    current: number;
    limit: number;
  };
  lastBillingDate?: string;
  nextBillingDate?: string;
}

// Mock data
const mockTenant: Tenant = {
  id: '1',
  name: 'Acme Corporation',
  domain: 'acme.example.com',
  plan: 'Enterprise',
  status: 'active',
  usersCount: 25,
  createdAt: '2023-08-15T08:00:00Z',
  expiresAt: '2024-08-15T08:00:00Z',
  contactName: 'John Doe',
  contactEmail: 'john.doe@acme.example.com',
  contactPhone: '+1 (555) 123-4567',
  billingMode: 'yearly',
  isCustomBranding: true,
  isMultiRegion: false,
  enabledContexts: ['website', 'sales', 'finance', 'hr'],
  notes: 'Key enterprise client with multiple departments using our platform.',
  storageUsed: 256, // in GB
  storageLimit: 500, // in GB
  apiUsage: {
    current: 845790,
    limit: 1000000
  },
  lastBillingDate: '2023-08-15T08:00:00Z',
  nextBillingDate: '2024-08-15T08:00:00Z'
};

// Mock usage data
const mockMonthlyUsers = [
  { name: 'Jan', users: 18 },
  { name: 'Feb', users: 20 },
  { name: 'Mar', users: 22 },
  { name: 'Apr', users: 19 },
  { name: 'May', users: 23 },
  { name: 'Jun', users: 24 },
  { name: 'Jul', users: 25 },
  { name: 'Aug', users: 25 },
  { name: 'Sep', users: 25 },
  { name: 'Oct', users: 25 },
  { name: 'Nov', users: 25 },
  { name: 'Dec', users: 25 }
];

const mockApiCalls = [
  { name: 'Jan', value: 120000 },
  { name: 'Feb', value: 180000 },
  { name: 'Mar', value: 250000 },
  { name: 'Apr', value: 310000 },
  { name: 'May', value: 380000 },
  { name: 'Jun', value: 450000 },
  { name: 'Jul', value: 520000 },
  { name: 'Aug', value: 610000 },
  { name: 'Sep', value: 680000 },
  { name: 'Oct', value: 750000 },
  { name: 'Nov', value: 820000 },
  { name: 'Dec', value: 845790 }
];

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Add mock data for app contexts
  const [availableAppContexts] = useState([
    { id: 'website', name: 'Website', description: 'Website, eCommerce and online content' },
    { id: 'sales', name: 'Sales', description: 'CRM, Sales and Point of Sale' },
    { id: 'finance', name: 'Finance', description: 'Accounting, Invoicing and Documents' },
    { id: 'inventory', name: 'Inventory', description: 'Inventory & Manufacturing' },
    { id: 'hr', name: 'HR', description: 'Human Resources management' },
    { id: 'marketing', name: 'Marketing', description: 'Marketing campaigns and Events' },
    { id: 'services', name: 'Services', description: 'Projects, Timesheet and Helpdesk' },
    { id: 'productivity', name: 'Productivity', description: 'Discuss, Approvals and Knowledge' },
    { id: 'customization', name: 'Customization', description: 'Studio and app customization' }
  ]);

  // Fetch tenant data
  useEffect(() => {
    const fetchTenant = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setTenant(mockTenant);
        setIsLoading(false);
      }, 500);
    };

    fetchTenant();
  }, [id]);

  // Handle tenant suspension
  const handleSuspendTenant = async () => {
    setIsSuspending(true);

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (tenant) {
      setTenant({
        ...tenant,
        status: 'suspended'
      });
    }

    setIsSuspending(false);
    setShowSuspendDialog(false);
  };

  // Handle tenant activation
  const handleActivateTenant = async () => {
    setIsActivating(true);

    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (tenant) {
      setTenant({
        ...tenant,
        status: 'active'
      });
    }

    setIsActivating(false);
    setShowActivateDialog(false);
  };

  // Get status badge
  const getStatusBadge = (status: 'active' | 'inactive' | 'suspended') => {
    switch (status) {
      case 'active':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>Active</Badge>
        );
      case 'inactive':
        return <Badge variant='secondary'>Inactive</Badge>;
      case 'suspended':
        return <Badge variant='destructive'>Suspended</Badge>;
      default:
        return null;
    }
  };

  // Calculate storage usage percentage
  const storageUsagePercentage = tenant
    ? Math.floor((tenant.storageUsed / tenant.storageLimit) * 100)
    : 0;

  // Calculate API usage percentage
  const apiUsagePercentage = tenant
    ? Math.floor((tenant.apiUsage.current / tenant.apiUsage.limit) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <div className='border-primary h-12 w-12 animate-spin rounded-full border-b-2'></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className='flex h-[80vh] w-full flex-col items-center justify-center gap-2'>
        <AlertTriangleIcon className='h-12 w-12 text-yellow-500' />
        <h2 className='text-2xl font-bold'>Tenant Not Found</h2>
        <p className='text-muted-foreground'>
          The tenant you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button
          onClick={() => router.push('/dashboard/tenants')}
          className='mt-4'
        >
          <ArrowLeftIcon className='mr-2 h-4 w-4' />
          Back to Tenants List
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Suspend Tenant Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this tenant? This will
              temporarily disable all access for users of this tenant until
              reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendTenant}
              className='bg-yellow-500 text-white hover:bg-yellow-600'
              disabled={isSuspending}
            >
              {isSuspending ? 'Suspending...' : 'Suspend Tenant'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Tenant Dialog */}
      <AlertDialog
        open={showActivateDialog}
        onOpenChange={setShowActivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate this tenant? This will re-enable
              all access for users of this tenant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateTenant}
              className='bg-green-500 text-white hover:bg-green-600'
              disabled={isActivating}
            >
              {isActivating ? 'Activating...' : 'Activate Tenant'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='space-y-6 px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4'>
        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => router.push('/dashboard/tenants')}
              className='h-10 w-10 rounded-full'
            >
              <ArrowLeftIcon className='h-5 w-5' />
            </Button>

            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-bold'>{tenant.name}</h1>
                {getStatusBadge(tenant.status)}
              </div>
              <div className='text-muted-foreground flex items-center gap-2'>
                <GlobeIcon className='h-4 w-4' />
                <span>{tenant.domain}</span>
              </div>
            </div>
          </div>

          <div className='flex w-full justify-between gap-2 md:w-auto md:justify-end'>
            {tenant.status === 'active' ? (
              <Button
                variant='outline'
                onClick={() => setShowSuspendDialog(true)}
              >
                <BanIcon className='mr-2 h-4 w-4' />
                Suspend Tenant
              </Button>
            ) : tenant.status === 'suspended' ? (
              <Button
                variant='outline'
                onClick={() => setShowActivateDialog(true)}
              >
                <CheckCircleIcon className='mr-2 h-4 w-4' />
                Activate Tenant
              </Button>
            ) : null}

            <Button
              onClick={() => router.push(`/dashboard/tenants/${id}/edit`)}
            >
              <EditIcon className='mr-2 h-4 w-4' />
              Edit Tenant
            </Button>
          </div>
        </div>

        <Separator />

        {/* Main Content */}
        <Tabs defaultValue='overview'>
          <TabsList className='grid w-full max-w-md grid-cols-3'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='usage'>Usage & Statistics</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='mt-6 space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {/* General Information */}
              <Card className='col-span-2'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BuildingIcon className='h-5 w-5' />
                    Tenant Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Tenant Name
                      </div>
                      <div className='text-base'>{tenant.name}</div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Domain
                      </div>
                      <div className='text-base'>{tenant.domain}</div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Status
                      </div>
                      <div>{getStatusBadge(tenant.status)}</div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Plan
                      </div>
                      <div className='text-base'>{tenant.plan}</div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Created On
                      </div>
                      <div className='text-base'>
                        {format(new Date(tenant.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Expires On
                      </div>
                      <div className='text-base'>
                        {tenant.expiresAt
                          ? format(new Date(tenant.expiresAt), 'MMM dd, yyyy')
                          : '—'}
                      </div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Billing Mode
                      </div>
                      <div className='text-base capitalize'>
                        {tenant.billingMode}
                      </div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Total Users
                      </div>
                      <div className='text-base'>{tenant.usersCount}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className='text-muted-foreground mb-2 text-sm font-medium'>
                      Notes
                    </div>
                    <div className='text-base'>
                      {tenant.notes || 'No notes available.'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <UsersIcon className='h-5 w-5' />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Primary contact for this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <div className='text-muted-foreground mb-1 text-sm font-medium'>
                      Contact Name
                    </div>
                    <div className='text-base'>{tenant.contactName}</div>
                  </div>
                  <div>
                    <div className='text-muted-foreground mb-1 text-sm font-medium'>
                      Email
                    </div>
                    <div className='text-base'>{tenant.contactEmail}</div>
                  </div>
                  <div>
                    <div className='text-muted-foreground mb-1 text-sm font-medium'>
                      Phone
                    </div>
                    <div className='text-base'>
                      {tenant.contactPhone || '—'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card className='col-span-full'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ServerIcon className='h-5 w-5' />
                    Resource Usage
                  </CardTitle>
                  <CardDescription>
                    Current resource utilization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Storage Usage */}
                    <div className='space-y-2'>
                      <div className='mb-2 flex items-end justify-between'>
                        <div>
                          <div className='text-sm font-medium'>
                            Storage Usage
                          </div>
                          <div className='text-2xl font-bold'>
                            {tenant.storageUsed} GB{' '}
                            <span className='text-muted-foreground text-sm font-normal'>
                              of {tenant.storageLimit} GB
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${storageUsagePercentage > 90 ? 'text-red-500' : storageUsagePercentage > 70 ? 'text-yellow-500' : 'text-green-500'}`}
                        >
                          {storageUsagePercentage}%
                        </div>
                      </div>
                      <div className='bg-muted h-2.5 w-full rounded-full'>
                        <div
                          className={`h-2.5 rounded-full ${
                            storageUsagePercentage > 90
                              ? 'bg-red-500'
                              : storageUsagePercentage > 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${storageUsagePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* API Usage */}
                    <div className='space-y-2'>
                      <div className='mb-2 flex items-end justify-between'>
                        <div>
                          <div className='text-sm font-medium'>API Calls</div>
                          <div className='text-2xl font-bold'>
                            {tenant.apiUsage.current.toLocaleString()}{' '}
                            <span className='text-muted-foreground text-sm font-normal'>
                              of {tenant.apiUsage.limit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${apiUsagePercentage > 90 ? 'text-red-500' : apiUsagePercentage > 70 ? 'text-yellow-500' : 'text-green-500'}`}
                        >
                          {apiUsagePercentage}%
                        </div>
                      </div>
                      <div className='bg-muted h-2.5 w-full rounded-full'>
                        <div
                          className={`h-2.5 rounded-full ${
                            apiUsagePercentage > 90
                              ? 'bg-red-500'
                              : apiUsagePercentage > 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${apiUsagePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value='usage' className='mt-6 space-y-6'>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* User Trends */}
              <Card className='col-span-1'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <UsersIcon className='h-5 w-5' />
                    User Trends
                  </CardTitle>
                  <CardDescription>
                    Monthly active users over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='h-80'>
                    <div className='flex h-full w-full flex-col'>
                      <div className='mb-4 flex items-center justify-between'>
                        <div className='text-sm font-medium'>
                          Users over time
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          Current:{' '}
                          {mockMonthlyUsers[mockMonthlyUsers.length - 1].users}{' '}
                          users
                        </div>
                      </div>
                      <div className='flex flex-1 items-end'>
                        {mockMonthlyUsers.map((data, index) => (
                          <div
                            key={index}
                            className='flex flex-1 flex-col items-center'
                          >
                            <div
                              className='mx-auto w-full max-w-[30px] rounded-t-sm bg-blue-500'
                              style={{ height: `${(data.users / 30) * 100}%` }}
                            ></div>
                            <div className='text-muted-foreground mt-2 text-xs'>
                              {data.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Usage Trends */}
              <Card className='col-span-1'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ChartBarIcon className='h-5 w-5' />
                    API Usage Trends
                  </CardTitle>
                  <CardDescription>API calls per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='h-80'>
                    <div className='flex h-full w-full flex-col'>
                      <div className='mb-4 flex items-center justify-between'>
                        <div className='text-sm font-medium'>
                          API calls per month
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          Total: {tenant.apiUsage.current.toLocaleString()}{' '}
                          calls
                        </div>
                      </div>
                      <div className='flex flex-1 items-end'>
                        {mockApiCalls.map((data, index) => (
                          <div
                            key={index}
                            className='flex flex-1 flex-col items-center'
                          >
                            <div
                              className='mx-auto w-full max-w-[30px] rounded-t-sm bg-blue-500'
                              style={{
                                height: `${(data.value / tenant.apiUsage.limit) * 100}%`
                              }}
                            ></div>
                            <div className='text-muted-foreground mt-2 text-xs'>
                              {data.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card className='col-span-1 lg:col-span-2'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <CreditCardIcon className='h-5 w-5' />
                    Billing Information
                  </CardTitle>
                  <CardDescription>
                    Current billing status and upcoming charges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Current Plan
                      </div>
                      <div className='text-base font-medium'>{tenant.plan}</div>
                      <div className='text-muted-foreground text-sm capitalize'>
                        Billed {tenant.billingMode}
                      </div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Last Billing Date
                      </div>
                      <div className='text-base'>
                        {tenant.lastBillingDate
                          ? format(
                              new Date(tenant.lastBillingDate),
                              'MMM dd, yyyy'
                            )
                          : '—'}
                      </div>
                    </div>
                    <div>
                      <div className='text-muted-foreground mb-1 text-sm font-medium'>
                        Next Billing Date
                      </div>
                      <div className='text-base'>
                        {tenant.nextBillingDate
                          ? format(
                              new Date(tenant.nextBillingDate),
                              'MMM dd, yyyy'
                            )
                          : '—'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value='settings' className='mt-6 space-y-6'>
            <div className='grid grid-cols-1 gap-6'>
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <SettingsIcon className='h-5 w-5' />
                    Tenant Features
                  </CardTitle>
                  <CardDescription>
                    Configure special features for this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Custom Branding */}
                    <div className='flex items-start gap-4'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${tenant.isCustomBranding ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}
                      >
                        {tenant.isCustomBranding ? (
                          <CheckCircleIcon className='h-6 w-6' />
                        ) : (
                          <BanIcon className='h-6 w-6' />
                        )}
                      </div>
                      <div>
                        <div className='mb-1 font-medium'>Custom Branding</div>
                        <div className='text-muted-foreground text-sm'>
                          {tenant.isCustomBranding
                            ? 'This tenant can use custom branding and themes.'
                            : 'This tenant is using default branding.'}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Region */}
                    <div className='flex items-start gap-4'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${tenant.isMultiRegion ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}
                      >
                        {tenant.isMultiRegion ? (
                          <CheckCircleIcon className='h-6 w-6' />
                        ) : (
                          <BanIcon className='h-6 w-6' />
                        )}
                      </div>
                      <div>
                        <div className='mb-1 font-medium'>
                          Multi-Region Deployment
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {tenant.isMultiRegion
                            ? 'This tenant is deployed across multiple regions.'
                            : 'This tenant is deployed in a single region.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                  <Button
                    variant='outline'
                    onClick={() => router.push(`/dashboard/tenants/${id}/edit`)}
                  >
                    <EditIcon className='mr-2 h-4 w-4' />
                    Edit Features
                  </Button>
                </CardFooter>
              </Card>

              {/* App Context Settings - New Card */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <LayoutGridIcon className='h-5 w-5' />
                    App Context Settings
                  </CardTitle>
                  <CardDescription>
                    Configure which app contexts are enabled for this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {availableAppContexts.map((context) => (
                      <div 
                        key={context.id} 
                        className={`flex items-start gap-3 rounded-md border p-3 ${
                          tenant.enabledContexts?.includes(context.id) 
                            ? 'border-primary/50 bg-primary/5' 
                            : 'border-muted bg-muted/10'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-md ${
                            tenant.enabledContexts?.includes(context.id) 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tenant.enabledContexts?.includes(context.id) ? (
                            <CheckCircleIcon className='h-5 w-5' />
                          ) : (
                            <BanIcon className='h-5 w-5' />
                          )}
                        </div>
                        <div>
                          <div className='font-medium'>{context.name}</div>
                          <div className='text-muted-foreground text-xs'>
                            {context.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className='border-t pt-6'>
                  <Button
                    variant='outline'
                    onClick={() => router.push(`/dashboard/tenants/${id}/edit-contexts`)}
                  >
                    <EditIcon className='mr-2 h-4 w-4' />
                    Edit App Contexts
                  </Button>
                </CardFooter>
              </Card>

              {/* Danger Zone */}
              <Card className='border-destructive'>
                <CardHeader>
                  <CardTitle className='text-destructive flex items-center gap-2'>
                    <AlertTriangleIcon className='h-5 w-5' />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Actions that may have serious consequences
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='border-destructive rounded-md border p-4'>
                    <div className='mb-2 font-medium'>Delete Tenant</div>
                    <div className='text-muted-foreground mb-4 text-sm'>
                      This will permanently delete the tenant and all associated
                      data. This action cannot be undone.
                    </div>
                    <Button variant='destructive'>Delete Tenant</Button>
                  </div>

                  {tenant.status !== 'suspended' && (
                    <div className='rounded-md border p-4'>
                      <div className='mb-2 font-medium'>Suspend Tenant</div>
                      <div className='text-muted-foreground mb-4 text-sm'>
                        This will temporarily disable all access for users of
                        this tenant until reactivated.
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => setShowSuspendDialog(true)}
                      >
                        Suspend Tenant
                      </Button>
                    </div>
                  )}

                  {tenant.status === 'suspended' && (
                    <div className='rounded-md border p-4'>
                      <div className='mb-2 font-medium'>Activate Tenant</div>
                      <div className='text-muted-foreground mb-4 text-sm'>
                        This will re-enable all access for users of this tenant.
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => setShowActivateDialog(true)}
                        className='border-green-200 bg-green-100 text-green-700 hover:bg-green-200'
                      >
                        <CheckCircleIcon className='mr-2 h-4 w-4' />
                        Activate Tenant
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

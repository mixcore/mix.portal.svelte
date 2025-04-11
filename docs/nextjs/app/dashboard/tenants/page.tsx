'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, CheckIcon, BuildingIcon, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Mock data for tenants
interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  usersCount: number;
  createdAt: string;
  expiresAt?: string;
}

// Temporary mock data
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.example.com',
    plan: 'Enterprise',
    status: 'active',
    usersCount: 25,
    createdAt: '2023-08-15T08:00:00Z',
    expiresAt: '2024-08-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Globex Industries',
    domain: 'globex.example.com',
    plan: 'Professional',
    status: 'active',
    usersCount: 12,
    createdAt: '2023-09-05T09:15:00Z',
    expiresAt: '2024-09-05T09:15:00Z'
  },
  {
    id: '3',
    name: 'Wayne Enterprises',
    domain: 'wayne.example.com',
    plan: 'Enterprise',
    status: 'active',
    usersCount: 42,
    createdAt: '2023-07-10T14:20:00Z',
    expiresAt: '2024-07-10T14:20:00Z'
  },
  {
    id: '4',
    name: 'Stark Industries',
    domain: 'stark.example.com',
    plan: 'Professional',
    status: 'active',
    usersCount: 18,
    createdAt: '2023-10-01T10:00:00Z',
    expiresAt: '2024-10-01T10:00:00Z'
  },
  {
    id: '5',
    name: 'Umbrella Corp',
    domain: 'umbrella.example.com',
    plan: 'Basic',
    status: 'suspended',
    usersCount: 8,
    createdAt: '2023-11-01T10:30:00Z',
    expiresAt: '2024-11-01T10:30:00Z'
  },
  {
    id: '6',
    name: 'Initech',
    domain: 'initech.example.com',
    plan: 'Basic',
    status: 'inactive',
    usersCount: 5,
    createdAt: '2023-06-01T09:00:00Z'
  },
];

export default function TenantsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch tenants (currently using mock data)
  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      // This would be an API call in the real implementation
      setTimeout(() => {
        setTenants(mockTenants);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tenants',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  // Delete tenant handler
  const handleDelete = async () => {
    if (!deleteTenantId) return;

    try {
      setIsDeleteLoading(true);
      // This would be an API call in the real implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setTenants(tenants.filter(tenant => tenant.id !== deleteTenantId));
      
      toast({
        title: 'Success',
        description: 'Tenant deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tenant',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteLoading(false);
      setDeleteTenantId(null);
    }
  };

  // Filter tenants based on search query, status and plan
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = searchQuery === '' || 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Status badge UI component
  const StatusBadge = ({ status }: { status: 'active' | 'inactive' | 'suspended' }) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return null;
    }
  };

  // Get unique plans for filter dropdown
  const uniquePlans = Array.from(new Set(tenants.map(tenant => tenant.plan)));

  // Load tenants on initial render
  useEffect(() => {
    fetchTenants();
  }, []);

  // Analytics data for the dashboard
  const analyticsData = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.status === 'active').length,
    inactiveTenants: tenants.filter(t => t.status === 'inactive').length,
    suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
    totalUsers: tenants.reduce((sum, tenant) => sum + tenant.usersCount, 0)
  };

  return (
    <>
      <AlertModal
        isOpen={!!deleteTenantId}
        onClose={() => setDeleteTenantId(null)}
        onConfirm={handleDelete}
        loading={isDeleteLoading}
        title="Delete Tenant"
        description="Are you sure you want to delete this tenant? All data associated with this tenant will be permanently removed. This action cannot be undone."
      />

      <div className="px-1 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <Heading
            title="Tenants"
            description="Manage your multi-tenant environment"
          />
          <Button onClick={() => router.push('/dashboard/tenants/new')}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Tenant
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Tenants</div>
              <div className="text-3xl font-bold">{analyticsData.totalTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Active</div>
              <div className="text-3xl font-bold text-green-500">{analyticsData.activeTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Inactive</div>
              <div className="text-3xl font-bold text-gray-500">{analyticsData.inactiveTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Suspended</div>
              <div className="text-3xl font-bold text-red-500">{analyticsData.suspendedTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Users</div>
              <div className="text-3xl font-bold">{analyticsData.totalUsers}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Status:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Plan:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all">All</option>
                {uniquePlans.map(plan => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Tenants Table */}
        {isLoading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <BuildingIcon className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No tenants found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' || planFilter !== 'all'
                ? 'Try changing your search or filter criteria'
                : 'Get started by creating a new tenant'}
            </p>
            {!searchQuery && statusFilter === 'all' && planFilter === 'all' && (
              <Button
                className="mt-4"
                onClick={() => router.push('/dashboard/tenants/new')}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                New Tenant
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.domain}</TableCell>
                    <TableCell>{tenant.plan}</TableCell>
                    <TableCell>
                      <StatusBadge status={tenant.status} />
                    </TableCell>
                    <TableCell>{tenant.usersCount}</TableCell>
                    <TableCell>{format(new Date(tenant.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {tenant.expiresAt 
                        ? format(new Date(tenant.expiresAt), 'MMM dd, yyyy') 
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                          >
                            <BuildingIcon className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => router.push(`/dashboard/tenants/${tenant.id}/edit`)}
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {tenant.status !== 'active' && (
                            <DropdownMenuItem>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTenantId(tenant.id)}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
} 
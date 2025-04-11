'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase } from '@/types/mixdb';
import { PaginatedResponse, Request } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Internal component for Loading
const LoadingSection = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <Icons.spinner className='text-primary h-10 w-10 animate-spin' />
      <p className='text-muted-foreground mt-4 text-sm'>Loading...</p>
    </div>
  );
};

// Internal component for Empty State
interface EmptySectionProps {
  title: string;
  description: string;
  icon: keyof typeof Icons;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptySection = ({
  title,
  description,
  icon = 'fileText',
  action,
  className = ''
}: EmptySectionProps) => {
  const Icon = Icons[icon] || Icons.fileText;

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}
    >
      <Icon className='text-muted-foreground mb-4 h-12 w-12' />
      <h3 className='text-lg font-medium'>{title}</h3>
      {description && (
        <p className='text-muted-foreground mt-2 max-w-md text-sm'>
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className='mt-4'>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default function DatabasesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState<MixDatabase[]>([]);
  const [paging, setPaging] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPage: 0
  });
  const [searchText, setSearchText] = useState('');
  const [request, setRequest] = useState<Request>({
    pageIndex: 0,
    pageSize: 10,
    searchText: '',
    searchColumns: ['name', 'displayName', 'description'],
    orderBy: 'createdDateTime',
    direction: 'desc'
  });

  // Create database state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newDatabase, setNewDatabase] = useState<Partial<MixDatabase>>({
    name: '',
    displayName: '',
    description: '',
    status: 'Published',
    specificulture: 'en-us',
    cultures: ['en-us'],
    priority: 0,
    isPublic: true,
    enableApi: true,
    enableRls: false,
    maxRecords: 1000
  });

  useEffect(() => {
    fetchDatabases();
  }, [request]);

  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const response = await MixDbService.getDatabases(request);
      setDatabases(response.items);
      setPaging(response.pagingData);
    } catch (error) {
      console.error('Error fetching databases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setRequest((prev) => ({ ...prev, searchText, pageIndex: 0 }));
  };

  const handlePageChange = (page: number) => {
    setRequest((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSort = (column: string) => {
    setRequest((prev) => ({
      ...prev,
      orderBy: column,
      direction:
        prev.orderBy === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this database? This action cannot be undone.'
      )
    ) {
      try {
        await MixDbService.deleteDatabase(id);
        fetchDatabases();
      } catch (error) {
        console.error('Error deleting database:', error);
      }
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await MixDbService.duplicateDatabase(id);
      fetchDatabases();
    } catch (error) {
      console.error('Error duplicating database:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewDatabase((prev) => ({ ...prev, [name]: value }));

    // Auto-generate system name from display name if name is empty
    if (name === 'displayName' && !newDatabase.name) {
      const systemName = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      setNewDatabase((prev) => ({ ...prev, name: systemName }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDatabase((prev) => ({ ...prev, [name]: value }));
  };

  const createDatabase = async () => {
    if (!newDatabase.name) {
      toast({
        title: 'Validation Error',
        description: 'Database name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreating(true);
      const createdDatabase = await MixDbService.createDatabase(newDatabase);
      toast({
        title: 'Success',
        description: 'Database created successfully'
      });
      setCreateDialogOpen(false);
      fetchDatabases();

      // Navigate to the newly created database
      router.push(`/dashboard/mixdb/databases/${createdDatabase.id}`);
    } catch (error) {
      console.error('Error creating database:', error);
      toast({
        title: 'Error',
        description: 'Failed to create database. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Database Management</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Icons.plus className='mr-2 h-4 w-4' />
          Create Database
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>
            Create, view, edit, and manage your MixDB databases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex w-full max-w-sm items-center gap-2'>
              <Input
                placeholder='Search databases...'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Icons.search className='h-4 w-4' />
              </Button>
            </div>
            <Select
              value={request.pageSize?.toString()}
              onValueChange={(value) =>
                setRequest((prev) => ({
                  ...prev,
                  pageSize: parseInt(value),
                  pageIndex: 0
                }))
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Rows per page' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 per page</SelectItem>
                <SelectItem value='10'>10 per page</SelectItem>
                <SelectItem value='20'>20 per page</SelectItem>
                <SelectItem value='50'>50 per page</SelectItem>
                <SelectItem value='100'>100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingSection className='min-h-[300px]' />
          ) : databases.length === 0 ? (
            <EmptySection
              title='No databases found'
              description='Create your first database to get started.'
              icon='database'
              action={{
                label: 'Create Database',
                onClick: () => setCreateDialogOpen(true)
              }}
            />
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => handleSort('name')}
                    >
                      Name{' '}
                      {request.orderBy === 'name' &&
                        (request.direction === 'asc' ? (
                          <Icons.arrowUp className='ml-2 inline h-4 w-4' />
                        ) : (
                          <Icons.arrowDown className='ml-2 inline h-4 w-4' />
                        ))}
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => handleSort('displayName')}
                    >
                      Display Name{' '}
                      {request.orderBy === 'displayName' &&
                        (request.direction === 'asc' ? (
                          <Icons.arrowUp className='ml-2 inline h-4 w-4' />
                        ) : (
                          <Icons.arrowDown className='ml-2 inline h-4 w-4' />
                        ))}
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => handleSort('status')}
                    >
                      Status{' '}
                      {request.orderBy === 'status' &&
                        (request.direction === 'asc' ? (
                          <Icons.arrowUp className='ml-2 inline h-4 w-4' />
                        ) : (
                          <Icons.arrowDown className='ml-2 inline h-4 w-4' />
                        ))}
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => handleSort('createdDateTime')}
                    >
                      Created Date{' '}
                      {request.orderBy === 'createdDateTime' &&
                        (request.direction === 'asc' ? (
                          <Icons.arrowUp className='ml-2 inline h-4 w-4' />
                        ) : (
                          <Icons.arrowDown className='ml-2 inline h-4 w-4' />
                        ))}
                    </TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {databases.map((database) => (
                    <TableRow key={database.id}>
                      <TableCell className='font-medium'>
                        {database.name}
                      </TableCell>
                      <TableCell>
                        {database.displayName || database.name}
                      </TableCell>
                      <TableCell>{database.status}</TableCell>
                      <TableCell>
                        {new Date(
                          database.createdDateTime
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <Icons.ellipsisVertical className='h-4 w-4' />
                              <span className='sr-only'>Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/mixdb/databases/${database.id}`
                                )
                              }
                            >
                              <Icons.view className='mr-2 h-4 w-4' />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/mixdb/databases/${database.id}/data`
                                )
                              }
                            >
                              <Icons.database className='mr-2 h-4 w-4' />
                              Data
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/mixdb/databases/${database.id}/edit`
                                )
                              }
                            >
                              <Icons.pencil className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(database.id)}
                            >
                              <Icons.copy className='mr-2 h-4 w-4' />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                MixDbService.migrateDatabase(database.name)
                              }
                              className='text-blue-600'
                            >
                              <Icons.refresh className='mr-2 h-4 w-4' />
                              Migrate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                MixDbService.backupDatabase(database.name)
                              }
                              className='text-green-600'
                            >
                              <Icons.download className='mr-2 h-4 w-4' />
                              Backup
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                MixDbService.restoreDatabase(database.name)
                              }
                              className='text-yellow-600'
                            >
                              <Icons.upload className='mr-2 h-4 w-4' />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(database.id)}
                              className='text-red-600'
                            >
                              <Icons.trash className='mr-2 h-4 w-4' />
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
        </CardContent>
        <CardFooter>
          {!loading && databases.length > 0 && (
            <Pagination className='w-full'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      request.pageIndex !== undefined &&
                      request.pageIndex > 0 &&
                      handlePageChange(request.pageIndex - 1)
                    }
                    className={
                      request.pageIndex === 0
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>

                {Array.from({ length: paging.totalPage }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={request.pageIndex === i}
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      request.pageIndex !== undefined &&
                      request.pageIndex < paging.totalPage - 1 &&
                      handlePageChange(request.pageIndex + 1)
                    }
                    className={
                      request.pageIndex !== undefined &&
                      request.pageIndex >= paging.totalPage - 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>

      {/* Create Database Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className='sm:max-w-[550px]'>
          <DialogHeader>
            <DialogTitle>Create Database</DialogTitle>
            <DialogDescription>
              Create a new MixDB database to store and manage your data.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='displayName' className='text-right'>
                Display Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='displayName'
                name='displayName'
                className='col-span-3'
                value={newDatabase.displayName || ''}
                onChange={handleInputChange}
                placeholder='Customer Database'
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                System Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                className='col-span-3 font-mono'
                value={newDatabase.name || ''}
                onChange={handleInputChange}
                placeholder='customer_database'
              />
              <div className='text-muted-foreground col-span-3 col-start-2 text-xs'>
                Used in API routes and code. Use lowercase letters, numbers, and
                underscores only.
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='description'
                name='description'
                className='col-span-3'
                value={newDatabase.description || ''}
                onChange={handleInputChange}
                placeholder='A database to store customer information'
                rows={3}
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={newDatabase.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id='status' className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Published'>Published</SelectItem>
                  <SelectItem value='Draft'>Draft</SelectItem>
                  <SelectItem value='Archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='isPublic' className='text-right'>
                Public Access
              </Label>
              <Select
                value={newDatabase.isPublic ? 'true' : 'false'}
                onValueChange={(value) => handleSelectChange('isPublic', value)}
              >
                <SelectTrigger id='isPublic' className='col-span-3'>
                  <SelectValue placeholder='Select public access' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='true'>Public</SelectItem>
                  <SelectItem value='false'>Private</SelectItem>
                </SelectContent>
              </Select>
              <div className='text-muted-foreground col-span-3 col-start-2 text-xs'>
                Public databases can be accessed without authentication
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setCreateDialogOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={createDatabase}
              disabled={creating || !newDatabase.name}
            >
              {creating ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Database'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

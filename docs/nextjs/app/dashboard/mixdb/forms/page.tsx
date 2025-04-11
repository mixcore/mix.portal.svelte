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
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabaseForm } from '@/types/mixdb';
import { Request } from '@/types';
import { LoadingSection } from '@/components/loading-section';
import { EmptySection } from '@/components/empty-section';

export default function FormsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<MixDatabaseForm[]>([]);
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
    searchColumns: ['name', 'title', 'description'],
    orderBy: 'createdDateTime',
    direction: 'desc'
  });

  useEffect(() => {
    fetchForms();
  }, [request]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await MixDbService.getForms(request);
      setForms(response.items);
      setPaging(response.pagingData);
    } catch (error) {
      console.error('Error fetching forms:', error);
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
        'Are you sure you want to delete this form? This action cannot be undone.'
      )
    ) {
      try {
        await MixDbService.deleteForm(id);
        fetchForms();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Form Builder</h2>
        <Button onClick={() => router.push('/dashboard/mixdb/forms/create')}>
          <Icons.plus className='mr-2 h-4 w-4' />
          Create Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Management</CardTitle>
          <CardDescription>
            Create, view, edit, and manage your MixDB forms for data collection
            and display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex w-full max-w-sm items-center gap-2'>
              <Input
                placeholder='Search forms...'
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
          ) : forms.length === 0 ? (
            <EmptySection
              title='No forms found'
              description='Create your first form to get started collecting data.'
              icon='form'
              action={{
                label: 'Create Form',
                onClick: () => router.push('/dashboard/mixdb/forms/create')
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
                      onClick={() => handleSort('title')}
                    >
                      Title{' '}
                      {request.orderBy === 'title' &&
                        (request.direction === 'asc' ? (
                          <Icons.arrowUp className='ml-2 inline h-4 w-4' />
                        ) : (
                          <Icons.arrowDown className='ml-2 inline h-4 w-4' />
                        ))}
                    </TableHead>
                    <TableHead
                      className='cursor-pointer'
                      onClick={() => handleSort('mixDatabaseName')}
                    >
                      Database{' '}
                      {request.orderBy === 'mixDatabaseName' &&
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
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className='font-medium'>{form.name}</TableCell>
                      <TableCell>{form.title || '-'}</TableCell>
                      <TableCell>{form.mixDatabaseName}</TableCell>
                      <TableCell>
                        {new Date(form.createdDateTime).toLocaleDateString()}
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
                                router.push(`/dashboard/mixdb/forms/${form.id}`)
                              }
                            >
                              <Icons.view className='mr-2 h-4 w-4' />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/mixdb/forms/${form.id}/edit`
                                )
                              }
                            >
                              <Icons.pencil className='mr-2 h-4 w-4' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(form.id)}
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
          {!loading && forms.length > 0 && (
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
    </div>
  );
}

'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { data: 'demo-1' },
    { data: 'demo-2' }
  ];
}


import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MixDbService } from '@/lib/services/mixdb-service';
import {
  MixDatabase,
  MixDatabaseColumn,
  MixDatabaseData,
  MixDatabaseDataValue
} from '@/types/mixdb';
import { Icons } from '@/components/icons';
import { LoadingSection } from '@/components/loading-section';
import { Request } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';

// Define a custom loading component for this page
const PageLoadingSection = ({ children }: { children?: React.ReactNode }) => (
  <div className='flex items-center justify-center p-8'>
    <Icons.spinner className='text-primary h-8 w-8 animate-spin' />
    {children}
  </div>
);

// New interface for advanced filtering
interface FilterCondition {
  field: string;
  operator: string;
  value: string;
  conjunction: 'and' | 'or';
}

const formatValue = (
  value: string | null,
  dataType: string
): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className='text-muted-foreground italic'>null</span>;
  }

  switch (dataType) {
    case 'Boolean':
      return <Checkbox checked={value === 'true'} disabled />;
    case 'Json':
      try {
        const jsonObj = JSON.parse(value);
        return (
          <Badge variant='outline' className='font-mono'>
            {`{${Object.keys(jsonObj).length} fields}`}
          </Badge>
        );
      } catch {
        return value;
      }
    case 'DateTime':
    case 'Date':
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    case 'ImageUrl':
      return (
        <div className='flex items-center gap-2'>
          <div className='bg-muted h-6 w-6 overflow-hidden rounded-full'>
            <img
              src={value}
              alt='Thumbnail'
              className='h-full w-full object-cover'
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/40';
              }}
            />
          </div>
          <span className='max-w-[120px] truncate text-xs'>{value}</span>
        </div>
      );
    default:
      return value;
  }
};

export default function DatabaseDataPage() {
  const params = useParams();
  const router = useRouter();
  const databaseId = Number(params.id);

  const [database, setDatabase] = useState<MixDatabase | null>(null);
  const [columns, setColumns] = useState<MixDatabaseColumn[]>([]);
  const [data, setData] = useState<MixDatabaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
    totalPage: 0
  });

  const [request, setRequest] = useState<Request>({
    pageIndex: 0,
    pageSize: 10,
    orderBy: 'createdDateTime',
    direction: 'desc'
  });

  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [selectedItem, setSelectedItem] = useState<MixDatabaseData | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<MixDatabaseData | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState<string>('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([
    { field: '', operator: 'contains', value: '', conjunction: 'and' }
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48, // approximate row height
    overscan: 10
  });

  useEffect(() => {
    if (databaseId) {
      fetchDatabase();
    }
  }, [databaseId]);

  useEffect(() => {
    if (database?.name) {
      fetchData();
    }
  }, [database, request]);

  const fetchDatabase = async () => {
    try {
      setLoading(true);
      const data = await MixDbService.getDatabase(databaseId);
      setDatabase(data);
      setColumns(data.columns || []);
    } catch (error) {
      console.error('Error fetching database schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!database?.name) return;

    try {
      setLoading(true);
      const response = await MixDbService.getDatabaseData(
        database.name,
        request
      );
      setData(response.items);
      setPaging(response.pagingData);
    } catch (error) {
      console.error('Error fetching database data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setRequest((prev) => ({ ...prev, pageIndex: page }));
  };

  const handleSort = (column: string) => {
    setRequest((prev) => ({
      ...prev,
      orderBy: column,
      direction:
        prev.orderBy === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleAddItem = () => {
    // Prepare a new item with default values for each column
    const defaultValues: Record<string, any> = {};
    columns.forEach((column) => {
      switch (column.dataType) {
        case 'Boolean':
          defaultValues[column.name] = false;
          break;
        case 'Integer':
        case 'Double':
          defaultValues[column.name] = 0;
          break;
        case 'DateTime':
        case 'Date':
          defaultValues[column.name] = new Date().toISOString();
          break;
        case 'Json':
          defaultValues[column.name] = '{}';
          break;
        default:
          defaultValues[column.name] = '';
      }
    });

    setNewItem(defaultValues);
    setShowAddDialog(true);
  };

  const handleNewItemChange = (columnName: string, value: any) => {
    setNewItem((prev) => ({ ...prev, [columnName]: value }));
  };

  const saveNewItem = async () => {
    if (!database?.name) return;

    try {
      // Convert the flat object to MixDatabaseData with dataValues
      const dataValues: MixDatabaseDataValue[] = [];

      Object.entries(newItem).forEach(([key, value]) => {
        const column = columns.find((c) => c.name === key);
        if (column) {
          dataValues.push({
            id: 0, // This will be assigned by the server
            specificulture: 'en-us', // Default culture
            mixDatabaseColumnId: column.id,
            mixDatabaseColumnName: column.name,
            dataType: column.dataType,
            value: String(value),
            status: 'Published',
            priority: 0,
            createdDateTime: new Date().toISOString()
          });
        }
      });

      const newData: Partial<MixDatabaseData> = {
        mixDatabaseId: databaseId,
        mixDatabaseName: database.name,
        status: 'Published',
        priority: 0,
        data: dataValues,
        specificulture: 'en-us', // Default culture
        cultures: ['en-us'] // Default culture
      };

      // In a real implementation, we would call the API here
      // For now, we'll just close the dialog and refresh the data
      setShowAddDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error saving new item:', error);
    }
  };

  // Advanced filter handlers
  const addFilterCondition = () => {
    setFilterConditions([
      ...filterConditions,
      { field: '', operator: 'contains', value: '', conjunction: 'and' }
    ]);
  };

  const removeFilterCondition = (index: number) => {
    if (filterConditions.length > 1) {
      const newConditions = [...filterConditions];
      newConditions.splice(index, 1);
      setFilterConditions(newConditions);
    }
  };

  const updateFilterCondition = (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => {
    const newConditions = [...filterConditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    setFilterConditions(newConditions);
  };

  const applyAdvancedFilter = () => {
    // Build advanced filter query
    const filterQuery = filterConditions
      .filter((condition) => condition.field && condition.value)
      .map((condition) => {
        return {
          field: condition.field,
          operator: condition.operator,
          value: condition.value,
          conjunction: condition.conjunction
        };
      });

    // Apply the filter
    setRequest((prev) => ({
      ...prev,
      pageIndex: 0,
      searchText: filter,
      advancedFilters: filterQuery.length > 0 ? filterQuery : undefined
    }));

    // Close advanced filter dialog
    setShowAdvancedFilter(false);
  };

  const exportData = async (format: 'csv' | 'json' | 'excel') => {
    if (!database?.name) return;

    try {
      setIsExporting(true);

      // Call the export service
      const result = await MixDbService.exportDatabase(database.name, {
        ...request,
        format
      });

      // Create a download link
      const blob = new Blob([result.data], {
        type:
          format === 'json'
            ? 'application/json'
            : format === 'csv'
              ? 'text/csv'
              : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${database.name}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error exporting data as ${format}:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !database?.name) return;

    try {
      // Upload the file
      await MixDbService.importDatabase(database.name, file);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const applyFilter = () => {
    // For now, we'll just update the request to include the filter
    // In a real implementation, we would need a more sophisticated filter builder
    setRequest((prev) => ({
      ...prev,
      pageIndex: 0,
      searchText: filter
    }));
  };

  // Handle editing record
  const handleEditItem = (item: MixDatabaseData) => {
    // Initialize edit values from the current data
    const initialValues: Record<string, any> = {};
    item.data.forEach((dataValue) => {
      initialValues[dataValue.mixDatabaseColumnName] = dataValue.value;
    });

    setEditingItem(item);
    setEditValues(initialValues);
    setIsEditing(true);
  };

  const handleEditValueChange = (columnName: string, value: any) => {
    setEditValues((prev) => ({ ...prev, [columnName]: value }));
  };

  const saveEditedItem = async () => {
    if (!editingItem || !database?.name) return;

    try {
      setIsSaving(true);

      // Convert the flat object to MixDatabaseData with dataValues
      const dataValues: MixDatabaseDataValue[] = [];

      Object.entries(editValues).forEach(([key, value]) => {
        const column = columns.find((c) => c.name === key);
        if (column) {
          // Find the original data value to preserve its ID
          const originalValue = editingItem.data.find(
            (d) => d.mixDatabaseColumnName === key
          );

          dataValues.push({
            id: originalValue?.id || 0,
            specificulture: editingItem.specificulture,
            mixDatabaseColumnId: column.id,
            mixDatabaseColumnName: column.name,
            dataType: column.dataType,
            value: String(value),
            status: 'Published',
            priority: originalValue?.priority || 0,
            createdDateTime:
              originalValue?.createdDateTime || new Date().toISOString()
          });
        }
      });

      const updatedData: MixDatabaseData = {
        ...editingItem,
        data: dataValues
      };

      // Update the data
      await MixDbService.updateData(database.name, updatedData);

      // Close dialog and refresh data
      setIsEditing(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecord = async (id: number) => {
    if (!database?.name) return;

    try {
      setIsDeleting(true);

      // Call the API to delete the record
      await MixDbService.deleteData(database.name, id);

      // Close dialog and refresh data
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Keyboard shortcuts
  useHotkeys(
    'ctrl+f, cmd+f',
    (event: KeyboardEvent) => {
      event.preventDefault();
      const inputEl = document.querySelector(
        'input[placeholder="Filter records..."]'
      ) as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
      }
    },
    []
  );

  useHotkeys(
    'ctrl+n, cmd+n',
    (event: KeyboardEvent) => {
      event.preventDefault();
      handleAddItem();
    },
    []
  );

  useHotkeys(
    'ctrl+e, cmd+e',
    (event: KeyboardEvent) => {
      event.preventDefault();
      if (selectedItem) {
        handleEditItem(selectedItem);
      }
    },
    [selectedItem]
  );

  useHotkeys(
    'ctrl+h, cmd+h',
    (event: KeyboardEvent) => {
      event.preventDefault();
      setShowAdvancedFilter(true);
    },
    []
  );

  useHotkeys(
    'escape',
    () => {
      if (showAdvancedFilter) {
        setShowAdvancedFilter(false);
      } else if (isEditing) {
        setIsEditing(false);
      } else if (selectedItem) {
        setSelectedItem(null);
      }
    },
    [showAdvancedFilter, isEditing, selectedItem]
  );

  if (loading && !database) {
    return <PageLoadingSection />;
  }

  if (!database) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center'>
        <Icons.database className='text-muted-foreground/50 h-12 w-12' />
        <h3 className='mt-4 text-lg font-medium'>Database Not Found</h3>
        <p className='text-muted-foreground mt-2 text-sm'>
          The database you're looking for doesn't exist or you don't have
          permission to access it.
        </p>
        <Button
          className='mt-4'
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
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='relative'>
            <Input
              placeholder='Filter records...'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='h-9 w-[200px] lg:w-[300px]'
              onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
            />
            <Button
              variant='ghost'
              size='sm'
              className='absolute top-0 right-0 h-full px-3'
              onClick={applyFilter}
            >
              <Icons.search className='h-4 w-4' />
            </Button>
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowAdvancedFilter(true)}
            className='h-9'
          >
            <Icons.filter className='mr-2 h-3.5 w-3.5' />
            Advanced Filter
          </Button>

          <Select
            value={String(request.pageSize)}
            onValueChange={(value) =>
              setRequest((prev) => ({
                ...prev,
                pageSize: Number(value),
                pageIndex: 0
              }))
            }
          >
            <SelectTrigger className='h-9 w-[110px]'>
              <SelectValue placeholder='Rows' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10 rows</SelectItem>
              <SelectItem value='20'>20 rows</SelectItem>
              <SelectItem value='50'>50 rows</SelectItem>
              <SelectItem value='100'>100 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' onClick={handleImport}>
                  <Icons.upload className='mr-2 h-4 w-4' />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import data from CSV, JSON, or Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            type='file'
            ref={fileInputRef}
            onChange={processImport}
            className='hidden'
            accept='.csv,.json,.xlsx'
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Icons.download className='mr-2 h-4 w-4' />
                    Export
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => exportData('csv')}>
                <Icons.fileText className='mr-2 h-4 w-4' />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('json')}>
                <Icons.code className='mr-2 h-4 w-4' />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('excel')}>
                <Icons.fileText className='mr-2 h-4 w-4' />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'table' | 'json')}
          >
            <TabsList className='h-9'>
              <TabsTrigger value='table' className='px-3'>
                <Icons.table className='h-4 w-4' />
              </TabsTrigger>
              <TabsTrigger value='json' className='px-3'>
                <Icons.code className='h-4 w-4' />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={handleAddItem}>
            <Icons.plus className='mr-2 h-4 w-4' />
            Add Record
          </Button>
        </div>
      </div>

      {/* Advanced Filter Dialog */}
      <Dialog open={showAdvancedFilter} onOpenChange={setShowAdvancedFilter}>
        <DialogContent className='sm:max-w-[650px]'>
          <DialogHeader>
            <DialogTitle>Advanced Filter</DialogTitle>
            <DialogDescription>
              Build a complex query to filter records in the {database?.name}{' '}
              database.
            </DialogDescription>
          </DialogHeader>
          <div className='max-h-[60vh] overflow-y-auto py-4'>
            {filterConditions.map((condition, index) => (
              <div key={index} className='mb-4 rounded-md border p-4'>
                {index > 0 && (
                  <div className='mb-4 flex items-center'>
                    <Select
                      value={condition.conjunction}
                      onValueChange={(value) =>
                        updateFilterCondition(index, 'conjunction', value)
                      }
                    >
                      <SelectTrigger className='w-[100px]'>
                        <SelectValue placeholder='AND' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='and'>AND</SelectItem>
                        <SelectItem value='or'>OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className='flex flex-col gap-4 md:flex-row md:items-center'>
                  <Select
                    value={condition.field}
                    onValueChange={(value) =>
                      updateFilterCondition(index, 'field', value)
                    }
                  >
                    <SelectTrigger className='w-full md:w-[180px]'>
                      <SelectValue placeholder='Select field' />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <SelectItem key={column.id} value={column.name}>
                          {column.displayName || column.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(value) =>
                      updateFilterCondition(index, 'operator', value)
                    }
                  >
                    <SelectTrigger className='w-full md:w-[150px]'>
                      <SelectValue placeholder='Select operator' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='contains'>Contains</SelectItem>
                      <SelectItem value='equals'>Equals</SelectItem>
                      <SelectItem value='startsWith'>Starts with</SelectItem>
                      <SelectItem value='endsWith'>Ends with</SelectItem>
                      <SelectItem value='greaterThan'>Greater than</SelectItem>
                      <SelectItem value='lessThan'>Less than</SelectItem>
                      <SelectItem value='empty'>Is empty</SelectItem>
                      <SelectItem value='notEmpty'>Is not empty</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className='relative flex-1'>
                    <Input
                      placeholder='Value'
                      value={condition.value}
                      onChange={(e) =>
                        updateFilterCondition(index, 'value', e.target.value)
                      }
                      disabled={
                        condition.operator === 'empty' ||
                        condition.operator === 'notEmpty'
                      }
                    />
                    {index > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='absolute top-0 -right-9 h-full text-red-500'
                        onClick={() => removeFilterCondition(index)}
                      >
                        <Icons.trash className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant='outline'
              size='sm'
              onClick={addFilterCondition}
              className='w-full'
            >
              <Icons.plus className='mr-2 h-4 w-4' />
              Add Condition
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowAdvancedFilter(false)}
            >
              Cancel
            </Button>
            <Button onClick={applyAdvancedFilter}>Apply Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <PageLoadingSection />
      ) : data.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-md border py-8 text-center'>
          <Icons.database className='text-muted-foreground/50 h-12 w-12' />
          <h3 className='mt-4 text-lg font-medium'>No Records Found</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            This database doesn't have any records yet.
          </p>
          <Button className='mt-4' onClick={handleAddItem}>
            <Icons.plus className='mr-2 h-4 w-4' />
            Add Record
          </Button>
        </div>
      ) : (
        <>
          <div className='overflow-hidden rounded-md border'>
            <TabsContent value='table' className='m-0'>
              <div
                className='overflow-x-auto'
                ref={tableContainerRef}
                style={{ height: 'calc(100vh - 340px)', minHeight: '400px' }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={column.id}
                          className='cursor-pointer'
                          onClick={() => handleSort(column.name)}
                        >
                          <div className='flex items-center gap-1'>
                            {column.displayName || column.name}
                            {request.orderBy === column.name &&
                              (request.direction === 'asc' ? (
                                <Icons.arrowUp className='h-3 w-3' />
                              ) : (
                                <Icons.arrowDown className='h-3 w-3' />
                              ))}
                          </div>
                          <div className='text-muted-foreground text-[10px] font-normal'>
                            {column.dataType}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className='w-[80px]'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const item = data[virtualRow.index];
                      return (
                        <TableRow
                          key={item.id}
                          style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`
                          }}
                          className='absolute w-full'
                          onDoubleClick={() => setSelectedItem(item)}
                        >
                          {columns.map((column) => {
                            const dataValue = item.data.find(
                              (d) => d.mixDatabaseColumnName === column.name
                            );
                            return (
                              <TableCell key={`${item.id}-${column.id}`}>
                                {dataValue ? (
                                  formatValue(
                                    dataValue.value,
                                    dataValue.dataType
                                  )
                                ) : (
                                  <span className='text-muted-foreground italic'>
                                    null
                                  </span>
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                >
                                  <span className='sr-only'>Open menu</span>
                                  <Icons.ellipsisVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <Icons.view className='mr-2 h-4 w-4' />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Icons.pencil className='mr-2 h-4 w-4' />
                                  Edit Record
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className='text-red-600'
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsDeleting(true);
                                  }}
                                >
                                  <Icons.trash className='mr-2 h-4 w-4' />
                                  Delete Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value='json' className='m-0 p-0'>
              <div className='bg-muted max-h-[500px] overflow-auto p-4 font-mono text-sm'>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </TabsContent>
          </div>

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-1'>
              <div className='text-muted-foreground text-sm'>
                Showing {data.length} of {paging.totalItems} records
              </div>
              <div className='text-muted-foreground text-xs'>
                <kbd className='bg-muted rounded-md px-1.5 py-0.5 text-[10px]'>
                  Ctrl/⌘+F
                </kbd>{' '}
                Search &nbsp;
                <kbd className='bg-muted rounded-md px-1.5 py-0.5 text-[10px]'>
                  Ctrl/⌘+N
                </kbd>{' '}
                New record &nbsp;
                <kbd className='bg-muted rounded-md px-1.5 py-0.5 text-[10px]'>
                  Ctrl/⌘+H
                </kbd>{' '}
                Advanced filter
              </div>
            </div>

            <Pagination>
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

                {Array.from(
                  { length: Math.min(5, paging.totalPage) },
                  (_, i) => {
                    // Calculate the page numbers to show
                    let pageNumber = i;
                    if (paging.totalPage > 5) {
                      if (request.pageIndex && request.pageIndex > 2) {
                        pageNumber = request.pageIndex + i - 2;
                      }
                      if (
                        request.pageIndex &&
                        request.pageIndex > paging.totalPage - 3
                      ) {
                        pageNumber = paging.totalPage - 5 + i;
                      }
                    }

                    // Ensure page number is within valid range
                    if (pageNumber >= 0 && pageNumber < paging.totalPage) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={request.pageIndex === pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                )}

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
          </div>
        </>
      )}

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Add New Record</DialogTitle>
            <DialogDescription>
              Create a new record for the {database.name} database.
            </DialogDescription>
          </DialogHeader>
          <div className='grid max-h-[60vh] gap-4 overflow-y-auto py-4'>
            {columns.map((column) => (
              <div
                key={column.id}
                className='grid grid-cols-4 items-center gap-4'
              >
                <Label htmlFor={column.name} className='text-right'>
                  {column.displayName || column.name}
                  {column.isRequire && (
                    <span className='ml-1 text-red-500'>*</span>
                  )}
                </Label>
                <div className='col-span-3'>
                  {column.dataType === 'Boolean' ? (
                    <Switch
                      id={column.name}
                      checked={Boolean(newItem[column.name])}
                      onCheckedChange={(checked) =>
                        handleNewItemChange(column.name, checked)
                      }
                    />
                  ) : column.dataType === 'Text' ||
                    column.dataType === 'MultilineText' ? (
                    <Input
                      id={column.name}
                      value={newItem[column.name] || ''}
                      onChange={(e) =>
                        handleNewItemChange(column.name, e.target.value)
                      }
                      placeholder={`Enter ${column.displayName || column.name}`}
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'Integer' ||
                    column.dataType === 'Double' ? (
                    <Input
                      id={column.name}
                      type='number'
                      value={newItem[column.name] || 0}
                      onChange={(e) =>
                        handleNewItemChange(column.name, e.target.value)
                      }
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'DateTime' ||
                    column.dataType === 'Date' ? (
                    <Input
                      id={column.name}
                      type='datetime-local'
                      value={
                        newItem[column.name]
                          ? new Date(newItem[column.name])
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        handleNewItemChange(column.name, e.target.value)
                      }
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'Reference' ? (
                    <Select
                      value={newItem[column.name] || ''}
                      onValueChange={(value) =>
                        handleNewItemChange(column.name, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select reference' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='placeholder'>
                          Placeholder Reference
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={column.name}
                      value={newItem[column.name] || ''}
                      onChange={(e) =>
                        handleNewItemChange(column.name, e.target.value)
                      }
                      placeholder={`Enter ${column.displayName || column.name}`}
                      required={column.isRequire}
                    />
                  )}
                  {column.regexPattern && (
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {column.regexErrorMessage ||
                        `Must match pattern: ${column.regexPattern}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button type='submit' onClick={saveNewItem}>
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Record Dialog */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem && !isDeleting}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        >
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Record Details</DialogTitle>
              <DialogDescription>
                Viewing record #{selectedItem.id} from {database.name} database.
              </DialogDescription>
            </DialogHeader>
            <div className='grid max-h-[60vh] gap-4 overflow-y-auto py-4'>
              {columns.map((column) => {
                const dataValue = selectedItem.data.find(
                  (d) => d.mixDatabaseColumnName === column.name
                );
                return (
                  <div
                    key={column.id}
                    className='grid grid-cols-4 items-center gap-4'
                  >
                    <Label className='text-right font-medium'>
                      {column.displayName || column.name}
                    </Label>
                    <div className='col-span-3'>
                      {dataValue ? (
                        dataValue.dataType === 'Json' ? (
                          <pre className='bg-muted max-h-[120px] overflow-auto rounded-md p-2 text-xs'>
                            {JSON.stringify(
                              JSON.parse(dataValue.value || '{}'),
                              null,
                              2
                            )}
                          </pre>
                        ) : dataValue.dataType === 'Boolean' ? (
                          <Checkbox
                            checked={dataValue.value === 'true'}
                            disabled
                          />
                        ) : dataValue.dataType === 'ImageUrl' ? (
                          <div className='flex flex-col gap-2'>
                            <img
                              src={dataValue.value || ''}
                              alt='Image'
                              className='max-h-[150px] rounded-md object-contain'
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://via.placeholder.com/200';
                              }}
                            />
                            <Input value={dataValue.value || ''} readOnly />
                          </div>
                        ) : (
                          <Input value={dataValue.value || ''} readOnly />
                        )
                      ) : (
                        <span className='text-muted-foreground italic'>
                          null
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <Alert>
                <AlertDescription>
                  <div className='flex flex-col gap-2 text-xs'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Created:</span>
                      <span>
                        {new Date(
                          selectedItem.createdDateTime
                        ).toLocaleString()}
                      </span>
                    </div>
                    {selectedItem.modifiedDateTime && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Modified:</span>
                        <span>
                          {new Date(
                            selectedItem.modifiedDateTime
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Status:</span>
                      <Badge
                        variant={
                          selectedItem.status === 'Published'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className='flex justify-between sm:justify-between'>
              <Button
                variant='destructive'
                size='sm'
                className='mr-auto'
                onClick={() => {
                  setIsDeleting(true);
                  setSelectedItem(null);
                }}
              >
                <Icons.trash className='mr-2 h-4 w-4' />
                Delete
              </Button>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                <Button onClick={() => handleEditItem(selectedItem)}>
                  <Icons.pencil className='mr-2 h-4 w-4' />
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Record Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => !open && setIsEditing(false)}
      >
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Edit record #{editingItem?.id} from {database?.name} database.
            </DialogDescription>
          </DialogHeader>
          <div className='grid max-h-[60vh] gap-4 overflow-y-auto py-4'>
            {columns.map((column) => (
              <div
                key={column.id}
                className='grid grid-cols-4 items-center gap-4'
              >
                <Label htmlFor={`edit-${column.name}`} className='text-right'>
                  {column.displayName || column.name}
                  {column.isRequire && (
                    <span className='ml-1 text-red-500'>*</span>
                  )}
                </Label>
                <div className='col-span-3'>
                  {column.dataType === 'Boolean' ? (
                    <Switch
                      id={`edit-${column.name}`}
                      checked={Boolean(editValues[column.name] === 'true')}
                      onCheckedChange={(checked) =>
                        handleEditValueChange(column.name, checked.toString())
                      }
                    />
                  ) : column.dataType === 'Text' ||
                    column.dataType === 'MultilineText' ? (
                    <Input
                      id={`edit-${column.name}`}
                      value={editValues[column.name] || ''}
                      onChange={(e) =>
                        handleEditValueChange(column.name, e.target.value)
                      }
                      placeholder={`Enter ${column.displayName || column.name}`}
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'Integer' ||
                    column.dataType === 'Double' ? (
                    <Input
                      id={`edit-${column.name}`}
                      type='number'
                      value={editValues[column.name] || 0}
                      onChange={(e) =>
                        handleEditValueChange(column.name, e.target.value)
                      }
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'DateTime' ||
                    column.dataType === 'Date' ? (
                    <Input
                      id={`edit-${column.name}`}
                      type='datetime-local'
                      value={
                        editValues[column.name]
                          ? new Date(editValues[column.name])
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        handleEditValueChange(column.name, e.target.value)
                      }
                      required={column.isRequire}
                    />
                  ) : column.dataType === 'Json' ? (
                    <div className='flex flex-col gap-2'>
                      <textarea
                        id={`edit-${column.name}`}
                        className='h-[100px] w-full rounded-md border p-2 font-mono text-sm'
                        value={editValues[column.name] || '{}'}
                        onChange={(e) =>
                          handleEditValueChange(column.name, e.target.value)
                        }
                      />
                      {(() => {
                        try {
                          JSON.parse(editValues[column.name] || '{}');
                          return null;
                        } catch (e) {
                          return (
                            <p className='text-xs text-red-500'>
                              Invalid JSON format
                            </p>
                          );
                        }
                      })()}
                    </div>
                  ) : column.dataType === 'Reference' ? (
                    <Select
                      value={editValues[column.name] || ''}
                      onValueChange={(value) =>
                        handleEditValueChange(column.name, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select reference' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='placeholder'>
                          Placeholder Reference
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`edit-${column.name}`}
                      value={editValues[column.name] || ''}
                      onChange={(e) =>
                        handleEditValueChange(column.name, e.target.value)
                      }
                      placeholder={`Enter ${column.displayName || column.name}`}
                      required={column.isRequire}
                    />
                  )}
                  {column.regexPattern && (
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {column.regexErrorMessage ||
                        `Must match pattern: ${column.regexPattern}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type='submit' onClick={saveEditedItem} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleting}
        onOpenChange={(open) => !open && setIsDeleting(false)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Alert variant='destructive'>
              <AlertDescription>
                Deleting this record will permanently remove it from the
                database.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (selectedItem) {
                  deleteRecord(selectedItem.id);
                }
                setIsDeleting(false);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete Record'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

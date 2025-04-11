'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { schema: 'demo-1' },
    { schema: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase, MixDatabaseColumn } from '@/types/mixdb';
import { Icons } from '@/components/icons';
import { LoadingSection } from '@/components/loading-section';

// Available data types for columns
const DATA_TYPES = [
  { value: 'Text', label: 'Text', icon: 'fileText' },
  { value: 'Html', label: 'HTML', icon: 'code' },
  { value: 'MultilineText', label: 'Multiline Text', icon: 'fileText' },
  { value: 'EmailAddress', label: 'Email', icon: 'mail' },
  { value: 'Password', label: 'Password', icon: 'lock' },
  { value: 'PhoneNumber', label: 'Phone', icon: 'phone' },
  { value: 'Url', label: 'URL', icon: 'link' },
  { value: 'ImageUrl', label: 'Image URL', icon: 'image' },
  { value: 'Color', label: 'Color', icon: 'palette' },
  { value: 'Boolean', label: 'Boolean', icon: 'check' },
  { value: 'Integer', label: 'Integer', icon: 'number' },
  { value: 'Double', label: 'Double', icon: 'number' },
  { value: 'DateTime', label: 'Date/Time', icon: 'calendar' },
  { value: 'Date', label: 'Date', icon: 'calendar' },
  { value: 'Time', label: 'Time', icon: 'clock' },
  { value: 'Reference', label: 'Reference', icon: 'link' },
  { value: 'Upload', label: 'Upload', icon: 'upload' },
  { value: 'Json', label: 'JSON', icon: 'code' },
  { value: 'Custom', label: 'Custom', icon: 'settings' }
];

function getIconForDataType(dataType: string) {
  const type = DATA_TYPES.find((t) => t.value === dataType);
  return type?.icon || 'fileText';
}

export default function DatabaseSchemaPage() {
  const params = useParams();
  const router = useRouter();
  const databaseId = Number(params.id);

  const [database, setDatabase] = useState<MixDatabase | null>(null);
  const [columns, setColumns] = useState<MixDatabaseColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingColumn, setSavingColumn] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('columns');

  // Add new column state
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [newColumn, setNewColumn] = useState<Partial<MixDatabaseColumn>>({
    name: '',
    displayName: '',
    dataType: 'Text',
    isRequire: false,
    priority: 0,
    status: 'Published'
  });

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
      setColumns(data.columns || []);
    } catch (error) {
      console.error('Error fetching database schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnChange = (id: number, field: string, value: any) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, [field]: value } : col))
    );
  };

  const handleNewColumnChange = (field: string, value: any) => {
    setNewColumn((prev) => ({ ...prev, [field]: value }));
  };

  const addColumn = async () => {
    if (!newColumn.name || !newColumn.dataType) return;

    try {
      setSavingColumn(-1); // -1 indicates we're saving a new column

      // Add mixDatabaseId to the new column
      const columnToAdd: Partial<MixDatabaseColumn> = {
        ...newColumn,
        mixDatabaseId: databaseId
      };

      // Call API to add the column (this would be the actual implementation)
      // For now we'll just simulate it by adding to our local state
      const addedColumn = {
        ...columnToAdd,
        id: Math.floor(Math.random() * -1000), // Temporary negative ID
        createdDateTime: new Date().toISOString()
      } as MixDatabaseColumn;

      setColumns((prev) => [...prev, addedColumn]);
      setShowNewColumn(false);
      setNewColumn({
        name: '',
        displayName: '',
        dataType: 'Text',
        isRequire: false,
        priority: 0,
        status: 'Published'
      });
    } catch (error) {
      console.error('Error adding column:', error);
    } finally {
      setSavingColumn(null);
    }
  };

  const saveColumn = async (column: MixDatabaseColumn) => {
    try {
      setSavingColumn(column.id);

      // Call API to save the column (this would be the actual implementation)
      // For now we'll just update our local state
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      // Update the column in database.columns
      const updatedColumns = columns.map((col) =>
        col.id === column.id ? column : col
      );

      setColumns(updatedColumns);
    } catch (error) {
      console.error('Error saving column:', error);
    } finally {
      setSavingColumn(null);
    }
  };

  const deleteColumn = async (columnId: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this column? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setSavingColumn(columnId);

      // Call API to delete the column (this would be the actual implementation)
      // For now we'll just update our local state
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (error) {
      console.error('Error deleting column:', error);
    } finally {
      setSavingColumn(null);
    }
  };

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='columns'>
              <Icons.database className='mr-2 h-4 w-4' />
              Columns
            </TabsTrigger>
            <TabsTrigger value='indexes'>
              <Icons.search className='mr-2 h-4 w-4' />
              Indexes
            </TabsTrigger>
            <TabsTrigger value='constraints'>
              <Icons.link className='mr-2 h-4 w-4' />
              Constraints
            </TabsTrigger>
            <TabsTrigger value='relationships'>
              <Icons.gitBranch className='mr-2 h-4 w-4' />
              Relationships
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => setShowNewColumn(!showNewColumn)}
          >
            {showNewColumn ? (
              <>
                <Icons.close className='mr-2 h-4 w-4' />
                Cancel
              </>
            ) : (
              <>
                <Icons.plus className='mr-2 h-4 w-4' />
                Add Column
              </>
            )}
          </Button>

          <Button>
            <Icons.save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
        </div>
      </div>

      {activeTab === 'columns' && (
        <>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[180px]'>Name</TableHead>
                  <TableHead className='w-[180px]'>Display Name</TableHead>
                  <TableHead className='w-[140px]'>Type</TableHead>
                  <TableHead className='w-[80px]'>Required</TableHead>
                  <TableHead className='w-[100px]'>Status</TableHead>
                  <TableHead className='w-[50px]'>Order</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showNewColumn && (
                  <TableRow className='bg-primary/5'>
                    <TableCell>
                      <Input
                        value={newColumn.name || ''}
                        onChange={(e) =>
                          handleNewColumnChange('name', e.target.value)
                        }
                        placeholder='Column name'
                        className='h-8'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={newColumn.displayName || ''}
                        onChange={(e) =>
                          handleNewColumnChange('displayName', e.target.value)
                        }
                        placeholder='Display name'
                        className='h-8'
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newColumn.dataType}
                        onValueChange={(value) =>
                          handleNewColumnChange('dataType', value)
                        }
                      >
                        <SelectTrigger className='h-8'>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          {DATA_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={newColumn.isRequire || false}
                        onCheckedChange={(checked) =>
                          handleNewColumnChange('isRequire', checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          newColumn.status === 'Published'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {newColumn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        value={newColumn.priority || 0}
                        onChange={(e) =>
                          handleNewColumnChange(
                            'priority',
                            parseInt(e.target.value)
                          )
                        }
                        className='h-8 w-12'
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => setShowNewColumn(false)}
                        >
                          <Icons.close className='h-4 w-4' />
                          <span className='sr-only'>Cancel</span>
                        </Button>
                        <Button
                          size='sm'
                          variant='default'
                          onClick={addColumn}
                          disabled={
                            !newColumn.name ||
                            !newColumn.dataType ||
                            savingColumn === -1
                          }
                        >
                          {savingColumn === -1 ? (
                            <Icons.spinner className='h-4 w-4 animate-spin' />
                          ) : (
                            <Icons.check className='h-4 w-4' />
                          )}
                          <span className='sr-only'>Save</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {columns.map((column) => (
                  <TableRow key={column.id}>
                    <TableCell className='font-medium'>{column.name}</TableCell>
                    <TableCell>{column.displayName || '-'}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Badge variant='outline' className='font-mono'>
                          {column.dataType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={column.isRequire || false}
                        onCheckedChange={(checked) =>
                          handleColumnChange(column.id, 'isRequire', checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          column.status === 'Published' ? 'default' : 'outline'
                        }
                      >
                        {column.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type='number'
                        value={column.priority || 0}
                        onChange={(e) =>
                          handleColumnChange(
                            column.id,
                            'priority',
                            parseInt(e.target.value)
                          )
                        }
                        className='h-8 w-12'
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end'>
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
                              onClick={() => saveColumn(column)}
                            >
                              <Icons.save className='mr-2 h-4 w-4' />
                              Save Changes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icons.pencil className='mr-2 h-4 w-4' />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() => deleteColumn(column.id)}
                            >
                              <Icons.trash className='mr-2 h-4 w-4' />
                              Delete Column
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='text-muted-foreground text-sm'>
            {columns.length} column{columns.length !== 1 ? 's' : ''} total
          </div>
        </>
      )}

      {activeTab === 'indexes' && (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Icons.search className='text-muted-foreground/50 h-12 w-12' />
          <h3 className='mt-4 text-lg font-medium'>No Indexes Defined</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            Define indexes to speed up queries and enforce unique constraints.
          </p>
          <Button className='mt-4'>
            <Icons.plus className='mr-2 h-4 w-4' />
            Add Index
          </Button>
        </div>
      )}

      {activeTab === 'constraints' && (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Icons.link className='text-muted-foreground/50 h-12 w-12' />
          <h3 className='mt-4 text-lg font-medium'>No Constraints Defined</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            Define constraints to enforce data integrity rules.
          </p>
          <Button className='mt-4'>
            <Icons.plus className='mr-2 h-4 w-4' />
            Add Constraint
          </Button>
        </div>
      )}

      {activeTab === 'relationships' && (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Icons.gitBranch className='text-muted-foreground/50 h-12 w-12' />
          <h3 className='mt-4 text-lg font-medium'>No Relationships Defined</h3>
          <p className='text-muted-foreground mt-2 text-sm'>
            Define relationships to connect data between tables.
          </p>
          <Button className='mt-4'>
            <Icons.plus className='mr-2 h-4 w-4' />
            Add Relationship
          </Button>
        </div>
      )}
    </div>
  );
}

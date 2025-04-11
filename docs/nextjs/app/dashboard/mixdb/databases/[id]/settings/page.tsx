'use client';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // This is a placeholder - in production you'd want to specify actual IDs
  return [
    { settings: 'demo-1' },
    { settings: 'demo-2' }
  ];
}


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { MixDbService } from '@/lib/services/mixdb-service';
import { MixDatabase } from '@/types/mixdb';
import { LoadingSection } from '@/components/loading-section';
import { toast } from '@/components/ui/use-toast';

export default function DatabaseSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const databaseId = Number(params.id);

  const [database, setDatabase] = useState<MixDatabase | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<MixDatabase>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setFormState(data);
    } catch (error) {
      console.error('Error fetching database:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    if (!database || !formState) return;

    try {
      setSaving(true);
      // In a real implementation, we would call the API here
      // For now, we'll just simulate a save
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setDatabase({
        ...database,
        ...formState
      });

      setIsEditing(false);
      toast({
        title: 'Settings updated',
        description: 'Your database settings have been saved successfully.'
      });
    } catch (error) {
      console.error('Error saving database settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save database settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setFormState(database || {});
    setIsEditing(false);
  };

  const deleteDatabase = async () => {
    try {
      setSaving(true);
      // In a real implementation, we would call the API here
      // For now, we'll just simulate a delete
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: 'Database deleted',
        description: 'Your database has been deleted successfully.'
      });

      // Redirect to databases list
      router.push('/dashboard/mixdb/databases');
    } catch (error) {
      console.error('Error deleting database:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete database. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSection />;
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
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>
            Database Settings
          </h2>
          <p className='text-muted-foreground mt-1'>
            Configure and manage your database settings
          </p>
        </div>

        {isEditing ? (
          <div className='flex gap-2'>
            <Button variant='outline' onClick={cancelEditing} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveChanges} disabled={saving}>
              {saving ? (
                <>
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.save className='mr-2 h-4 w-4' />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Icons.pencil className='mr-2 h-4 w-4' />
            Edit Settings
          </Button>
        )}
      </div>

      <Tabs defaultValue='general'>
        <TabsList>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='security'>Security & Access</TabsTrigger>
          <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic database settings and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Database Name</Label>
                  <Input
                    id='name'
                    value={formState.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    placeholder='Enter database name'
                  />
                  <p className='text-muted-foreground text-xs'>
                    The database name must be unique and cannot be changed once
                    created.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='displayName'>Display Name</Label>
                  <Input
                    id='displayName'
                    value={formState.displayName || ''}
                    onChange={(e) =>
                      handleInputChange('displayName', e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder='Enter display name'
                  />
                  <p className='text-muted-foreground text-xs'>
                    A friendly name to display in the UI.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={formState.status || ''}
                    onValueChange={(value) =>
                      handleInputChange('status', value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger id='status'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Published'>Published</SelectItem>
                      <SelectItem value='Draft'>Draft</SelectItem>
                      <SelectItem value='Archived'>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='priority'>Priority</Label>
                  <Input
                    id='priority'
                    type='number'
                    value={formState.priority?.toString() || '0'}
                    onChange={(e) =>
                      handleInputChange('priority', parseInt(e.target.value))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={formState.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder='Enter a description for this database'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Information</CardTitle>
              <CardDescription>
                Technical details about your database
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <dl className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Database ID
                  </dt>
                  <dd className='mt-1 text-sm'>{database.id}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Created
                  </dt>
                  <dd className='mt-1 text-sm'>
                    {new Date(database.createdDateTime).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Last Modified
                  </dt>
                  <dd className='mt-1 text-sm'>
                    {database.modifiedDateTime
                      ? new Date(database.modifiedDateTime).toLocaleString()
                      : 'Never'}
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Status
                  </dt>
                  <dd className='mt-1 text-sm'>
                    <Badge
                      variant={
                        database.status === 'Published'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {database.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Records Count
                  </dt>
                  <dd className='mt-1 text-sm'>{database.totalItems || 0}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground text-sm font-medium'>
                    Columns Count
                  </dt>
                  <dd className='mt-1 text-sm'>
                    {database.columns?.length || 0}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Manage who can access your database
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label className='text-base'>Public Access</Label>
                  <p className='text-muted-foreground text-sm'>
                    Allow unauthenticated users to read data from this database
                  </p>
                </div>
                <Switch
                  checked={formState.isPublic || false}
                  onCheckedChange={(checked) =>
                    handleInputChange('isPublic', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div>
                  <Label className='text-base'>API Access</Label>
                  <p className='text-muted-foreground text-sm'>
                    Allow access to this database via REST API
                  </p>
                </div>
                <Switch
                  checked={formState.enableApi || false}
                  onCheckedChange={(checked) =>
                    handleInputChange('enableApi', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <div>
                  <Label className='text-base'>Row-level Security</Label>
                  <p className='text-muted-foreground text-sm'>
                    Enable fine-grained access control at the row level
                  </p>
                </div>
                <Switch
                  checked={formState.enableRls || false}
                  onCheckedChange={(checked) =>
                    handleInputChange('enableRls', checked)
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Security</CardTitle>
              <CardDescription>
                Configure security settings for API access
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='apiKeyPrefix'>API Key Prefix</Label>
                <Input
                  id='apiKeyPrefix'
                  value={formState.apiKeyPrefix || 'mixdb_'}
                  onChange={(e) =>
                    handleInputChange('apiKeyPrefix', e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder='Enter API key prefix'
                />
                <p className='text-muted-foreground text-xs'>
                  This prefix will be added to all API keys generated for this
                  database.
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cors'>CORS Origins</Label>
                <Textarea
                  id='cors'
                  value={formState.corsOrigins || '*'}
                  onChange={(e) =>
                    handleInputChange('corsOrigins', e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder='Enter allowed origins (comma-separated or * for all)'
                  rows={2}
                />
                <p className='text-muted-foreground text-xs'>
                  Specify domains that are allowed to make requests to your API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced database settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Label className='text-base'>Cache Enabled</Label>
                  <p className='text-muted-foreground text-sm'>
                    Enable caching for faster query responses
                  </p>
                </div>
                <Switch
                  checked={formState.enableCache || false}
                  onCheckedChange={(checked) =>
                    handleInputChange('enableCache', checked)
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='cacheExpiration'>
                  Cache Expiration (seconds)
                </Label>
                <Input
                  id='cacheExpiration'
                  type='number'
                  value={formState.cacheExpiration?.toString() || '300'}
                  onChange={(e) =>
                    handleInputChange(
                      'cacheExpiration',
                      parseInt(e.target.value)
                    )
                  }
                  disabled={!isEditing || !formState.enableCache}
                />
                <p className='text-muted-foreground text-xs'>
                  How long to cache query results before refreshing.
                </p>
              </div>

              <Separator />

              <div className='space-y-2'>
                <Label htmlFor='maxRecords'>Maximum Records</Label>
                <Input
                  id='maxRecords'
                  type='number'
                  value={formState.maxRecords?.toString() || '100000'}
                  onChange={(e) =>
                    handleInputChange('maxRecords', parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                />
                <p className='text-muted-foreground text-xs'>
                  The maximum number of records allowed in this database (0 for
                  unlimited).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='border-red-200 dark:border-red-900'>
            <CardHeader>
              <CardTitle className='text-red-500'>Danger Zone</CardTitle>
              <CardDescription>Actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Alert variant='destructive'>
                <AlertDescription>
                  The following actions are irreversible and can lead to data
                  loss. Proceed with caution.
                </AlertDescription>
              </Alert>

              <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                <div>
                  <h4 className='text-base font-medium'>Clear All Records</h4>
                  <p className='text-muted-foreground text-sm'>
                    Delete all records from this database while keeping the
                    structure intact.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='outline' size='sm'>
                      Clear Records
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear all records?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete all records from the database. The database
                        structure will remain intact.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-red-500 hover:bg-red-600'
                        onClick={() => {
                          toast({
                            title: 'Records cleared',
                            description:
                              'All records have been deleted from this database.'
                          });
                        }}
                      >
                        Clear All Records
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Separator />

              <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                <div>
                  <h4 className='text-base font-medium'>Delete Database</h4>
                  <p className='text-muted-foreground text-sm'>
                    Permanently delete this database and all its records and
                    schema.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive' size='sm'>
                      Delete Database
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete database?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the database, its schema, and all records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-red-500 hover:bg-red-600'
                        onClick={deleteDatabase}
                      >
                        {saving ? (
                          <>
                            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                            Deleting...
                          </>
                        ) : (
                          <>Delete Database</>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

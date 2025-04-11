'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templateService } from '@/services/template-service';
import { Template, TemplateFolderType, Theme } from '@/types/template';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  PencilIcon,
  CopyIcon,
  FolderIcon,
  PaletteIcon
} from 'lucide-react';

interface TemplateListLayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function TemplateListLayout({
  title,
  description,
  children
}: TemplateListLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedFolderType, setSelectedFolderType] = useState<
    TemplateFolderType | ''
  >('');
  const [searchQuery, setSearchQuery] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Define folder types
  const folderTypes: TemplateFolderType[] = [
    'Pages',
    'Posts',
    'Masters',
    'Layouts',
    'Modules'
  ];

  // Set up columns for the data table
  const columns: ColumnDef<Template>[] = [
    {
      accessorKey: 'fileName',
      header: 'Template Name',
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.fileName}</div>
      )
    },
    {
      accessorKey: 'fileFolder',
      header: 'Folder Path',
      cell: ({ row }) => (
        <div className='text-muted-foreground text-sm'>
          {row.original.fileFolder}
        </div>
      )
    },
    {
      accessorKey: 'createdDateTime',
      header: 'Created Date',
      cell: ({ row }) => (
        <div className='text-sm'>
          {format(new Date(row.original.createdDateTime), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              router.push(`/dashboard/templates/${row.original.id}/edit`)
            }
          >
            <PencilIcon className='h-4 w-4' />
            <span className='sr-only'>Edit</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleCopyTemplate(row.original.id)}
          >
            <CopyIcon className='h-4 w-4' />
            <span className='sr-only'>Copy</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTemplateToDelete(row.original.id)}
          >
            <Trash2Icon className='text-destructive h-4 w-4' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      )
    }
  ];

  // Initialize state from URL parameters on component mount
  useEffect(() => {
    const themeId = searchParams.get('themeId') || '';
    const folderType = searchParams.get('folderType') || '';
    const query = searchParams.get('q') || '';

    setSelectedTheme(themeId);
    setSelectedFolderType((folderType as TemplateFolderType) || '');
    setSearchQuery(query);

    loadThemes();
    loadTemplates(themeId, folderType as TemplateFolderType, query);
  }, [searchParams]);

  // Load themes
  const loadThemes = async () => {
    try {
      const themeData = await templateService.getThemes();
      setThemes(themeData);

      // If no theme is selected, select the first one
      if (!selectedTheme && themeData.length > 0) {
        setSelectedTheme(themeData[0].id);
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  // Load templates
  const loadTemplates = async (
    themeId: string = selectedTheme,
    folderType: TemplateFolderType | '' = selectedFolderType,
    query: string = searchQuery
  ) => {
    setIsLoading(true);
    try {
      const response = await templateService.getTemplates({
        themeId: themeId || undefined,
        folderType: folderType || undefined,
        keyword: query || undefined,
        pageIndex: 0,
        pageSize: 20
      });
      setTemplates(response.items);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    updateUrl(themeId, selectedFolderType, searchQuery);
    loadTemplates(themeId, selectedFolderType, searchQuery);
  };

  // Handle folder type change
  const handleFolderTypeChange = (folderType: TemplateFolderType | '') => {
    setSelectedFolderType(folderType);
    updateUrl(selectedTheme, folderType, searchQuery);
    loadTemplates(selectedTheme, folderType, searchQuery);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateUrl(selectedTheme, selectedFolderType, query);
    loadTemplates(selectedTheme, selectedFolderType, query);
  };

  // Update URL with current filters
  const updateUrl = (
    themeId: string = selectedTheme,
    folderType: TemplateFolderType | '' = selectedFolderType,
    query: string = searchQuery
  ) => {
    const params = new URLSearchParams();
    if (themeId) params.set('themeId', themeId);
    if (folderType) params.set('folderType', folderType);
    if (query) params.set('q', query);

    const newUrl = `/dashboard/templates?${params.toString()}`;
    router.push(newUrl);
  };

  // Create new template
  const handleCreateTemplate = () => {
    if (!selectedTheme || !selectedFolderType) {
      // Show error or notification that theme and folder type must be selected
      return;
    }
    router.push(
      `/dashboard/templates/new?themeId=${selectedTheme}&folderType=${selectedFolderType}`
    );
  };

  // Copy template
  const handleCopyTemplate = async (id: string) => {
    try {
      // Get the template to copy
      const template = await templateService.getTemplate(id);

      // Create a new template with the same properties
      const newTemplate: Template = {
        ...template,
        id: '', // Clear ID to create a new one
        fileName: `${template.fileName.split('.')[0]}_copy.${template.fileName.split('.')[1]}`,
        createdDateTime: new Date(),
        lastModified: new Date()
      };

      // Save the new template
      const savedTemplate = await templateService.saveTemplate(newTemplate);

      // Reload templates
      loadTemplates();
    } catch (error) {
      console.error('Failed to copy template:', error);
    }
  };

  // Delete template
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await templateService.deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  return (
    <div className='container mx-auto space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          <p className='text-muted-foreground'>{description}</p>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard/themes')}
          >
            <PaletteIcon className='mr-2 h-4 w-4' />
            Browse Themes
          </Button>
          <Button
            onClick={handleCreateTemplate}
            disabled={!selectedTheme || !selectedFolderType}
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            New Template
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        {/* Left sidebar for themes and folder types */}
        <div className='space-y-4 md:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>Themes</CardTitle>
              <CardDescription>
                Select a theme to view its templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='space-y-2'>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className='h-8 w-full' />
                  ))}
                </div>
              ) : (
                <div className='space-y-2'>
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`hover:bg-muted flex cursor-pointer items-center rounded-md p-2 ${
                        selectedTheme === theme.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div>
                        <p className='font-medium'>{theme.name}</p>
                        <p className='text-muted-foreground text-xs'>
                          v{theme.version}
                        </p>
                      </div>
                      {theme.isActive && (
                        <div className='bg-primary text-primary-foreground ml-auto rounded-full px-2 py-1 text-xs'>
                          Active
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Types</CardTitle>
              <CardDescription>Filter templates by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div
                  className={`hover:bg-muted flex cursor-pointer items-center rounded-md p-2 ${
                    !selectedFolderType ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleFolderTypeChange('')}
                >
                  <FolderIcon className='mr-2 h-4 w-4' />
                  <p className='font-medium'>All Types</p>
                </div>

                {folderTypes.map((type) => (
                  <div
                    key={type}
                    className={`hover:bg-muted flex cursor-pointer items-center rounded-md p-2 ${
                      selectedFolderType === type ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleFolderTypeChange(type)}
                  >
                    <FolderIcon className='mr-2 h-4 w-4' />
                    <p className='font-medium'>{type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className='md:col-span-9'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Templates</CardTitle>
                <div className='relative'>
                  <SearchIcon className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
                  <Input
                    type='search'
                    placeholder='Search templates...'
                    className='w-64 pl-8'
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='space-y-2'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className='h-12 w-full' />
                  ))}
                </div>
              ) : templates.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12'>
                  <p className='text-muted-foreground mb-4'>
                    No templates found
                  </p>
                  <Button
                    onClick={handleCreateTemplate}
                    disabled={!selectedTheme || !selectedFolderType}
                  >
                    <PlusIcon className='mr-2 h-4 w-4' />
                    Create Template
                  </Button>
                </div>
              ) : (
                <DataTable columns={columns} data={templates} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!templateToDelete}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

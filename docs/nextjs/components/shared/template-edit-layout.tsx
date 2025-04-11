'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Template, TemplateFolderType } from '@/types/template';
import { templateService } from '@/services/template-service';
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
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  SaveIcon,
  EyeIcon,
  RefreshCwIcon,
  Trash2Icon,
  LayoutIcon,
  CodeIcon,
  SettingsIcon,
  HistoryIcon,
  CopyIcon,
  RocketIcon,
  FileTextIcon,
  GitBranchIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TemplateEditor } from './template-editor';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

interface TemplateEditLayoutProps {
  templateId?: string;
  themeId?: string;
  folderType?: TemplateFolderType;
  isNew?: boolean;
  backPath?: string;
  title: string;
}

export function TemplateEditLayout({
  templateId,
  themeId,
  folderType,
  isNew = false,
  backPath = '/dashboard/templates',
  title
}: TemplateEditLayoutProps) {
  const router = useRouter();

  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fileExtensions] = useState<string[]>([
    '.cshtml',
    '.html',
    '.css',
    '.js'
  ]);

  // Mock version history
  const [versions] = useState([
    { id: 'v3', date: new Date(), author: 'Current Version', isActive: true },
    {
      id: 'v2',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      author: "Yesterday's Edit",
      isActive: false
    },
    {
      id: 'v1',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: 'Initial Version',
      isActive: false
    }
  ]);

  // Load template on component mount
  useEffect(() => {
    if (isNew) {
      // Create a new template shell
      const newTemplate: Template = {
        id: '',
        fileName: 'new-template.cshtml',
        fileFolder: `/templates/${folderType?.toLowerCase() || 'pages'}`,
        folderType: folderType || 'Pages',
        themeId: themeId || '',
        content: '',
        scripts: '',
        styles: '',
        lastModified: new Date(),
        createdDateTime: new Date()
      };
      setTemplate(newTemplate);
      setIsLoading(false);
    } else if (templateId) {
      loadTemplate();
    }
  }, [templateId, isNew, themeId, folderType]);

  // Load template from API
  const loadTemplate = async () => {
    if (!templateId) return;

    setIsLoading(true);
    try {
      const loadedTemplate = await templateService.getTemplate(templateId);
      setTemplate(loadedTemplate);
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle content change
  const handleContentChange = (content: string) => {
    if (!template) return;
    setTemplate({ ...template, content });
  };

  // Handle scripts change
  const handleScriptsChange = (scripts: string) => {
    if (!template) return;
    setTemplate({ ...template, scripts });
  };

  // Handle styles change
  const handleStylesChange = (styles: string) => {
    if (!template) return;
    setTemplate({ ...template, styles });
  };

  // Handle file name change
  const handleFileNameChange = (fileName: string) => {
    if (!template) return;
    setTemplate({ ...template, fileName });
  };

  // Handle extension change
  const handleExtensionChange = (extension: string) => {
    if (!template) return;
    const baseName = template.fileName.split('.')[0];
    const newFileName = `${baseName}${extension}`;
    setTemplate({ ...template, fileName: newFileName });
  };

  // Handle folder type change
  const handleFolderTypeChange = (folderType: TemplateFolderType) => {
    if (!template) return;

    // Update file folder path based on new folder type
    const fileFolder = `/templates/${folderType.toLowerCase()}`;

    setTemplate({
      ...template,
      folderType,
      fileFolder
    });
  };

  // Save template
  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      const savedTemplate = await templateService.saveTemplate(template);
      setTemplate(savedTemplate);

      if (isNew) {
        // Redirect to edit page for the new template
        router.push(`/dashboard/templates/${savedTemplate.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete template
  const handleDelete = async () => {
    if (!template?.id) return;

    try {
      await templateService.deleteTemplate(template.id);
      setShowDeleteDialog(false);
      router.push(backPath);
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  // Preview template
  const handlePreview = () => {
    if (!template?.id) return;
    // Set preview URL to a temporary preview endpoint
    setPreviewUrl(`/api/preview/template/${template.id}`);
    window.open(`/api/preview/template/${template.id}`, '_blank');
  };

  // Duplicate template
  const handleDuplicate = async () => {
    if (!template) return;

    try {
      const duplicatedTemplate: Template = {
        ...template,
        id: '',
        fileName: `${template.fileName.split('.')[0]}_copy${template.fileName.includes('.') ? '.' + template.fileName.split('.').pop() : ''}`,
        createdDateTime: new Date(),
        lastModified: new Date()
      };

      const savedTemplate =
        await templateService.saveTemplate(duplicatedTemplate);
      router.push(`/dashboard/templates/${savedTemplate.id}/edit`);
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  // Navigate back
  const handleBack = () => {
    // Check if there are unsaved changes
    if (template?.id && template.content !== '') {
      setShowCancelDialog(true);
    } else {
      router.push(backPath);
    }
  };

  return (
    <div className='container mx-auto max-w-7xl space-y-6 pb-4'>
      {/* Header */}
      <div className='bg-background bg-background/90 sticky top-0 z-10 flex flex-col items-start justify-between gap-4 border-b py-4 backdrop-blur-sm md:flex-row md:items-center'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleBack}
            className='hover:bg-muted rounded-full'
          >
            <ArrowLeftIcon className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
            <p className='text-muted-foreground max-w-[300px] truncate text-sm md:max-w-md'>
              {template?.fileFolder}
            </p>
          </div>
        </div>

        <div className='flex w-full items-center justify-between gap-2 md:w-auto md:justify-end'>
          <div className='flex-1 md:hidden'>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Tab' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='editor'>Editor</SelectItem>
                <SelectItem value='preview'>Preview</SelectItem>
                <SelectItem value='history'>History</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='hidden md:flex'>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-[280px] grid-cols-3'>
                <TabsTrigger value='editor' className='flex items-center'>
                  <CodeIcon className='mr-2 h-4 w-4' />
                  Editor
                </TabsTrigger>
                <TabsTrigger value='preview' className='flex items-center'>
                  <LayoutIcon className='mr-2 h-4 w-4' />
                  Preview
                </TabsTrigger>
                <TabsTrigger value='history' className='flex items-center'>
                  <HistoryIcon className='mr-2 h-4 w-4' />
                  History
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setSettingsOpen(true)}
                    className='h-9 w-9 rounded-full'
                  >
                    <SettingsIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleDuplicate}
                    disabled={isLoading || !template?.id}
                    className='h-9 w-9 rounded-full'
                  >
                    <CopyIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Duplicate Template</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handlePreview}
                    disabled={isLoading || !template?.id}
                    className='h-9 w-9 rounded-full'
                  >
                    <EyeIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isNew && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading || !template?.id}
                      className='h-9 w-9 rounded-full'
                    >
                      <Trash2Icon className='text-destructive h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              size='sm'
              className='ml-2 h-9 gap-1.5'
            >
              {isSaving ? (
                <RefreshCwIcon className='h-4 w-4 animate-spin' />
              ) : (
                <SaveIcon className='h-4 w-4' />
              )}
              <span className='ml-1 hidden sm:inline'>Save</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} className='w-full'>
        <TabsContent value='editor' className='m-0 outline-none'>
          <div className='grid grid-cols-1 gap-4'>
            {/* Main Editor */}
            <div>
              {isLoading ? (
                <div className='bg-muted h-96 animate-pulse rounded-md' />
              ) : (
                <TemplateEditor
                  template={template}
                  onContentChange={handleContentChange}
                  onScriptsChange={handleScriptsChange}
                  onStylesChange={handleStylesChange}
                  onSave={handleSave}
                  isSaving={isSaving}
                  onPreview={handlePreview}
                  fileNameEditable={false}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='preview' className='m-0 outline-none'>
          <Card className='overflow-hidden rounded-lg border shadow-sm'>
            <CardContent className='p-0'>
              {template ? (
                <div className='relative'>
                  <div className='bg-muted flex items-center justify-between border-b p-3'>
                    <div className='flex items-center space-x-2'>
                      <LayoutIcon className='h-4 w-4' />
                      <span className='text-sm font-medium'>Preview</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Select defaultValue='desktop'>
                        <SelectTrigger className='h-8 w-32'>
                          <SelectValue placeholder='Viewport' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='mobile'>Mobile</SelectItem>
                          <SelectItem value='tablet'>Tablet</SelectItem>
                          <SelectItem value='desktop'>Desktop</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handlePreview}
                      >
                        <RocketIcon className='mr-2 h-4 w-4' />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                  <div className='h-[75vh] overflow-auto bg-white p-4 dark:bg-gray-900'>
                    <div className='flex h-full items-center justify-center'>
                      <div className='text-center'>
                        <FileTextIcon className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                        <p className='text-lg font-medium'>
                          Preview not available
                        </p>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          Click "Open in New Tab" to view the rendered template
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='bg-muted h-96 animate-pulse rounded-md' />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='history' className='m-0 outline-none'>
          <Card className='overflow-hidden rounded-lg border shadow-sm'>
            <CardContent className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <div className='space-y-1'>
                  <h3 className='text-lg font-medium'>Version History</h3>
                  <p className='text-muted-foreground text-sm'>
                    Track and restore previous versions
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  <GitBranchIcon className='mr-2 h-4 w-4' />
                  Compare Versions
                </Button>
              </div>
              <div className='space-y-3'>
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      version.isActive ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>{version.author}</span>
                        {version.isActive && (
                          <Badge variant='outline'>Current</Badge>
                        )}
                      </div>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {version.date.toLocaleString()}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={version.isActive}
                      >
                        Restore
                      </Button>
                      <Button variant='ghost' size='sm'>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Drawer */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Template Settings</DrawerTitle>
            <DrawerDescription>
              Configure the template properties
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className='h-[50vh] p-4'>
            <div className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='fileName'>File Name</Label>
                  <div className='flex space-x-2'>
                    <Input
                      id='fileName'
                      value={template?.fileName.split('.')[0] || ''}
                      onChange={(e) => {
                        if (!template) return;
                        const extension = template.fileName.includes('.')
                          ? '.' + template.fileName.split('.').pop()
                          : '';
                        handleFileNameChange(e.target.value + extension);
                      }}
                      disabled={isLoading}
                      className='flex-1'
                    />
                    <Select
                      value={
                        template?.fileName.includes('.')
                          ? '.' + template.fileName.split('.').pop()
                          : ''
                      }
                      onValueChange={handleExtensionChange}
                    >
                      <SelectTrigger className='w-28'>
                        <SelectValue placeholder='Extension' />
                      </SelectTrigger>
                      <SelectContent>
                        {fileExtensions.map((ext) => (
                          <SelectItem key={ext} value={ext}>
                            {ext}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='folderType'>Template Type</Label>
                  <Select
                    value={template?.folderType || ''}
                    onValueChange={(value) =>
                      handleFolderTypeChange(value as TemplateFolderType)
                    }
                    disabled={isLoading || !isNew}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select template type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Pages'>Pages</SelectItem>
                      <SelectItem value='Posts'>Posts</SelectItem>
                      <SelectItem value='Masters'>Masters</SelectItem>
                      <SelectItem value='Layouts'>Layouts</SelectItem>
                      <SelectItem value='Modules'>Modules</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-muted-foreground text-xs'>
                    {isNew
                      ? 'Select the type of template to create'
                      : 'Template type cannot be changed after creation'}
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label>Template Path</Label>
                  <div className='bg-muted text-muted-foreground rounded-md p-2 text-sm break-all'>
                    {template?.fileFolder || ''}
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                {template?.id && (
                  <>
                    <div className='space-y-2'>
                      <Label>Created</Label>
                      <div className='text-muted-foreground text-sm'>
                        {template.createdDateTime
                          ? new Date(template.createdDateTime).toLocaleString()
                          : 'New'}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Last Modified</Label>
                      <div className='text-muted-foreground text-sm'>
                        {template.lastModified
                          ? new Date(template.lastModified).toLocaleString()
                          : 'Never'}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Template ID</Label>
                      <div className='text-muted-foreground text-sm break-all'>
                        {template.id}
                      </div>
                    </div>
                  </>
                )}

                <div className='space-y-2'>
                  <Label>Editor Configuration</Label>
                  <div className='flex flex-col space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <input type='checkbox' id='wordWrap' defaultChecked />
                      <Label
                        htmlFor='wordWrap'
                        className='cursor-pointer text-sm'
                      >
                        Enable word wrap
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input type='checkbox' id='lineNumbers' defaultChecked />
                      <Label
                        htmlFor='lineNumbers'
                        className='cursor-pointer text-sm'
                      >
                        Show line numbers
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input type='checkbox' id='darkMode' defaultChecked />
                      <Label
                        htmlFor='darkMode'
                        className='cursor-pointer text-sm'
                      >
                        Use dark theme
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <Button onClick={() => setSettingsOpen(false)}>
              Apply Changes
            </Button>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this template?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              template and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? All unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(backPath)}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

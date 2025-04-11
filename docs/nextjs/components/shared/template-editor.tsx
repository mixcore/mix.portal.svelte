'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Template } from '@/types/template';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SaveIcon,
  EyeIcon,
  RefreshCwIcon,
  CodeIcon,
  FileIcon,
  FileTextIcon,
  Info,
  GitCommitIcon
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Dynamically import Monaco Editor with no SSR to avoid server/client mismatch
const MonacoEditor = dynamic(
  () =>
    import('@monaco-editor/react').then((mod) => {
      // Make monaco available globally for shortcuts
      return mod.default;
    }),
  { ssr: false }
);

interface TemplateEditorProps {
  template: Template | null;
  isReadOnly?: boolean;
  onContentChange?: (content: string) => void;
  onScriptsChange?: (scripts: string) => void;
  onStylesChange?: (styles: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  onPreview?: () => void;
  fileNameEditable?: boolean;
  onFileNameChange?: (fileName: string) => void;
}

export function TemplateEditor({
  template,
  isReadOnly = false,
  onContentChange,
  onScriptsChange,
  onStylesChange,
  onSave,
  isSaving = false,
  onPreview,
  fileNameEditable = false,
  onFileNameChange
}: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [scripts, setScripts] = useState('');
  const [styles, setStyles] = useState('');
  const [editorHeight, setEditorHeight] = useState('70vh');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [editorMode, setEditorMode] = useState('normal');

  // Set up editor options
  const editorOptions = {
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    wordWrap: 'on' as const,
    lineNumbers: 'on' as const,
    readOnly: isReadOnly,
    automaticLayout: true,
    scrollbar: {
      vertical: 'visible' as const,
      horizontal: 'visible' as const,
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    },
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    tabSize: 2
  };

  // Update local state when template changes
  useEffect(() => {
    if (template) {
      setFileName(template.fileName);
      setContent(template.content || '');
      setScripts(template.scripts || '');
      setStyles(template.styles || '');
    }
  }, [template]);

  // Handle content change
  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onContentChange?.(value);
    }
  };

  // Handle scripts change
  const handleScriptsChange = (value: string | undefined) => {
    if (value !== undefined) {
      setScripts(value);
      onScriptsChange?.(value);
    }
  };

  // Handle styles change
  const handleStylesChange = (value: string | undefined) => {
    if (value !== undefined) {
      setStyles(value);
      onStylesChange?.(value);
    }
  };

  // Handle file name change
  const handleFileNameChange = (value: string) => {
    setFileName(value);
    onFileNameChange?.(value);
  };

  // Get language for the current tab based on file extension
  const getLanguage = (tab: string) => {
    if (tab === 'content') {
      if (fileName.endsWith('.cshtml')) return 'razor';
      if (fileName.endsWith('.html')) return 'html';
      if (fileName.endsWith('.json')) return 'json';
      if (fileName.endsWith('.js')) return 'javascript';
      if (fileName.endsWith('.css')) return 'css';
      return 'razor'; // Default to razor
    }

    if (tab === 'scripts') return 'javascript';
    if (tab === 'styles') return 'css';

    return 'plaintext';
  };

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    setIsEditorReady(true);

    // Add cursor position change listener
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });
  };

  // Get keyboard shortcut labels
  const getShortcutLabel = (tab: string) => {
    switch (tab) {
      case 'content':
        return 'Alt+1';
      case 'scripts':
        return 'Alt+2';
      case 'styles':
        return 'Alt+3';
      default:
        return '';
    }
  };

  // Get tab icon based on tab name
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'content':
        return <CodeIcon className='mr-2 h-4 w-4' />;
      case 'scripts':
        return <FileIcon className='mr-2 h-4 w-4' />;
      case 'styles':
        return <FileTextIcon className='mr-2 h-4 w-4' />;
      default:
        return null;
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {fileNameEditable ? (
            <Input
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              className='w-64'
              placeholder='Enter file name'
              disabled={isReadOnly}
            />
          ) : (
            <div className='flex items-center'>
              <GitCommitIcon className='text-muted-foreground mr-2 h-4 w-4' />
              <h2 className='text-xl font-medium'>{fileName}</h2>
            </div>
          )}
          {template?.id && (
            <Badge variant='outline' className='ml-2'>
              {getLanguage(activeTab)}
            </Badge>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={onPreview}
                  disabled={!template}
                >
                  <EyeIcon className='mr-1 h-4 w-4' />
                  Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-xs'>Preview Template (Ctrl+P)</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  disabled={isSaving || !template}
                  size='sm'
                >
                  {isSaving ? (
                    <RefreshCwIcon className='mr-1 h-4 w-4 animate-spin' />
                  ) : (
                    <SaveIcon className='mr-1 h-4 w-4' />
                  )}
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-xs'>Save Changes (Ctrl+S)</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card className='overflow-hidden border'>
        <CardHeader className='border-b px-4 py-2'>
          <Tabs
            defaultValue='content'
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='bg-card'>
              <TabsTrigger
                value='content'
                className='data-[state=active]:bg-muted'
              >
                {getTabIcon('content')}
                Template
                <kbd className='text-muted-foreground bg-muted ml-2 rounded px-1.5 py-0.5 text-[10px]'>
                  {getShortcutLabel('content')}
                </kbd>
              </TabsTrigger>
              <TabsTrigger
                value='scripts'
                className='data-[state=active]:bg-muted'
              >
                {getTabIcon('scripts')}
                Scripts
                <kbd className='text-muted-foreground bg-muted ml-2 rounded px-1.5 py-0.5 text-[10px]'>
                  {getShortcutLabel('scripts')}
                </kbd>
              </TabsTrigger>
              <TabsTrigger
                value='styles'
                className='data-[state=active]:bg-muted'
              >
                {getTabIcon('styles')}
                Styles
                <kbd className='text-muted-foreground bg-muted ml-2 rounded px-1.5 py-0.5 text-[10px]'>
                  {getShortcutLabel('styles')}
                </kbd>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className='h-full p-0'>
          <Tabs value={activeTab} className='h-full w-full'>
            <div className='relative p-0' style={{ height: editorHeight }}>
              <TabsContent
                value='content'
                className='absolute inset-0 m-0 h-full'
              >
                {!isEditorReady && <Skeleton className='h-full w-full' />}
                <MonacoEditor
                  height='100%'
                  language={getLanguage('content')}
                  value={content}
                  options={editorOptions}
                  onChange={handleContentChange}
                  onMount={handleEditorDidMount}
                  theme='vs-dark'
                />
              </TabsContent>
              <TabsContent
                value='scripts'
                className='absolute inset-0 m-0 h-full'
              >
                {!isEditorReady && <Skeleton className='h-full w-full' />}
                <MonacoEditor
                  height='100%'
                  language='javascript'
                  value={scripts}
                  options={editorOptions}
                  onChange={handleScriptsChange}
                  onMount={handleEditorDidMount}
                  theme='vs-dark'
                />
              </TabsContent>
              <TabsContent
                value='styles'
                className='absolute inset-0 m-0 h-full'
              >
                {!isEditorReady && <Skeleton className='h-full w-full' />}
                <MonacoEditor
                  height='100%'
                  language='css'
                  value={styles}
                  options={editorOptions}
                  onChange={handleStylesChange}
                  onMount={handleEditorDidMount}
                  theme='vs-dark'
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Status bar */}
          <div className='bg-muted text-muted-foreground flex items-center justify-between border-t px-3 py-1 text-xs'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center'>
                <span className='text-primary font-medium'>
                  {getLanguage(activeTab)}
                </span>
              </div>
              <div>
                {template?.lastModified && (
                  <span>
                    Last modified:{' '}
                    {new Date(template.lastModified).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <div>
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </div>
              <div className='flex items-center'>
                <Info className='mr-1 h-3 w-3' />
                <span>Ctrl+Space: Suggestions</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

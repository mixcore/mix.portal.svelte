'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Code,
  Undo,
  Redo
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Log that the component has been loaded
console.log('RichTextEditor component loaded');

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
  readOnly = false
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline'
        }
      })
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[150px] focus:outline-none',
        placeholder
      }
    }
  });

  // Handle hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync content with prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn('rounded-md border', className)}>
      {editor && !readOnly && (
        <div className='bg-muted/50 flex flex-wrap gap-0.5 border-b p-1'>
          <TooltipProvider delayDuration={100}>
            <div className='flex items-center space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('bold') && 'bg-muted'
                    )}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    <Bold className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('italic') && 'bg-muted'
                    )}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    <Italic className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
              </Tooltip>

              <Separator orientation='vertical' className='mx-1 h-6' />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('heading', { level: 1 }) && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                  >
                    <Heading1 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('heading', { level: 2 }) && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                  >
                    <Heading2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('heading', { level: 3 }) && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                  >
                    <Heading3 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 3</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation='vertical' className='mx-1 h-6' />

            <div className='flex items-center space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('bulletList') && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    <List className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('orderedList') && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <ListOrdered className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation='vertical' className='mx-1 h-6' />

            <div className='flex items-center space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('blockquote') && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                  >
                    <Quote className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('code') && 'bg-muted'
                    )}
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                  >
                    <Code className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Code Block</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => {
                      const url = window.prompt('Enter the URL of the image:');
                      if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                      }
                    }}
                  >
                    <ImageIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-8 w-8 p-0',
                      editor.isActive('link') && 'bg-muted'
                    )}
                    onClick={() => {
                      const url = window.prompt('Enter the URL:');
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      } else {
                        editor.chain().focus().unsetLink().run();
                      }
                    }}
                  >
                    <LinkIcon className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Link</TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation='vertical' className='mx-1 h-6' />

            <div className='flex items-center space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <Undo className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <Redo className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}

      <div className='p-3'>
        <EditorContent editor={editor} className='prose prose-sm max-w-none' />
      </div>

      {editor && !readOnly && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className='bg-background flex items-center space-x-1 rounded-md border p-1 shadow-md'>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('bold') && 'bg-muted'
              )}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('italic') && 'bg-muted'
              )}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('link') && 'bg-muted'
              )}
              onClick={() => {
                const url = window.prompt('Enter the URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                } else {
                  editor.chain().focus().unsetLink().run();
                }
              }}
            >
              <LinkIcon className='h-4 w-4' />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}

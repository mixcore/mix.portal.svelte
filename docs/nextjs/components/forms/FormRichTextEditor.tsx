'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RichTextEditor } from '../RichTextEditor';

interface FormRichTextEditorProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  readOnly?: boolean;
}

export function FormRichTextEditor({
  name,
  label,
  description,
  placeholder,
  defaultValue = '',
  required = false,
  readOnly = false
}: FormRichTextEditorProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className='col-span-full'>
          {label && (
            <FormLabel>
              {label} {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <RichTextEditor
              content={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

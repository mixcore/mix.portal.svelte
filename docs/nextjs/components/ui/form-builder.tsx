'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { RadioGroup } from '@/components/ui/radio-group';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'multiselect';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  validation?: z.ZodTypeAny;
}

export interface FormBuilderProps {
  fields: FormFieldConfig[];
  onSubmit: (values: any) => void;
  defaultValues?: any;
  className?: string;
}

export function FormBuilder({
  fields,
  onSubmit,
  defaultValues,
  className
}: FormBuilderProps) {
  const schema = z.object(
    fields.reduce(
      (acc, field) => {
        if (field.validation) {
          acc[field.name] = field.validation;
        }
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.type === 'text' && (
                    <Input placeholder={field.placeholder} {...formField} />
                  )}
                  {field.type === 'textarea' && (
                    <Textarea placeholder={field.placeholder} {...formField} />
                  )}
                  {field.type === 'select' && (
                    <Select
                      options={field.options || []}
                      value={formField.value}
                      onChange={formField.onChange}
                      placeholder={field.placeholder}
                    />
                  )}
                  {field.type === 'radio' && (
                    <RadioGroup
                      options={field.options || []}
                      value={formField.value}
                      onValueChange={formField.onChange}
                    />
                  )}
                  {field.type === 'multiselect' && (
                    <MultiSelect
                      options={field.options || []}
                      value={formField.value}
                      onChange={formField.onChange}
                      placeholder={field.placeholder}
                    />
                  )}
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}

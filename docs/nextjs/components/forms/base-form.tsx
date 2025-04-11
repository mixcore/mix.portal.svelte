'use client';

import * as React from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup } from '@/components/ui/radio-group';
import { MultiSelect } from '@/components/ui/multi-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'multiselect'
  | 'file';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: Yup.Schema<any>;
  defaultValue?: any;
  disabled?: boolean;
  className?: string;
}

export interface BaseFormProps {
  fields: FormField[];
  onSubmit: (values: any) => void | Promise<void>;
  initialValues?: Record<string, any>;
  validationSchema?: Yup.ObjectSchema<any>;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function BaseForm({
  fields,
  onSubmit,
  initialValues = {},
  validationSchema,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  onCancel,
  className,
  isLoading = false,
  error = null
}: BaseFormProps) {
  // Generate initial values from fields if not provided
  const defaultInitialValues = React.useMemo(() => {
    return fields.reduce(
      (acc, field) => {
        if (field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        } else if (field.type === 'multiselect') {
          acc[field.name] = [];
        } else {
          acc[field.name] = '';
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }, [fields]);

  // Generate validation schema from fields if not provided
  const defaultValidationSchema = React.useMemo(() => {
    return Yup.object().shape(
      fields.reduce(
        (acc, field) => {
          if (field.validation) {
            acc[field.name] = field.validation;
          } else if (field.required) {
            acc[field.name] = Yup.string().required(
              `${field.label} is required`
            );
          }
          return acc;
        },
        {} as Record<string, Yup.Schema<any>>
      )
    );
  }, [fields]);

  return (
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      validationSchema={validationSchema || defaultValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <FormikForm className={cn('space-y-6', className)}>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fields.map((field) => (
            <div key={field.name} className={cn('space-y-2', field.className)}>
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && (
                  <span className='text-destructive ml-1'>*</span>
                )}
              </Label>

              {field.type === 'text' && (
                <Field
                  as={Input}
                  id={field.name}
                  name={field.name}
                  type='text'
                  placeholder={field.placeholder}
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'textarea' && (
                <Field
                  as={Textarea}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'select' && (
                <Select
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onChange={(value) => setFieldValue(field.name, value)}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'radio' && (
                <RadioGroup
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onValueChange={(value) => setFieldValue(field.name, value)}
                  options={field.options || []}
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'checkbox' && (
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={values[field.name]}
                  onCheckedChange={(checked) =>
                    setFieldValue(field.name, checked)
                  }
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'switch' && (
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={values[field.name]}
                  onCheckedChange={(checked) =>
                    setFieldValue(field.name, checked)
                  }
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.type === 'multiselect' && (
                <MultiSelect
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onChange={(value) => setFieldValue(field.name, value)}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  disabled={field.disabled || isLoading}
                />
              )}

              {field.description && (
                <p className='text-muted-foreground text-sm'>
                  {field.description}
                </p>
              )}

              <ErrorMessage
                name={field.name}
                component='div'
                className='text-destructive text-sm'
              />
            </div>
          ))}

          <div className='flex justify-end space-x-4'>
            {onCancel && (
              <Button
                type='button'
                variant='outline'
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelButtonText}
              </Button>
            )}
            <Button type='submit' disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? 'Submitting...' : submitButtonText}
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}

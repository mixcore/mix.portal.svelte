'use client';

import * as React from 'react';
import { BaseForm, FormField, FormFieldType } from './base-form';
import * as Yup from 'yup';

export interface FormBuilderProps {
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

export function FormBuilder({
  fields,
  onSubmit,
  initialValues,
  validationSchema,
  submitButtonText,
  cancelButtonText,
  onCancel,
  className,
  isLoading,
  error
}: FormBuilderProps) {
  return (
    <BaseForm
      fields={fields}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      submitButtonText={submitButtonText}
      cancelButtonText={cancelButtonText}
      onCancel={onCancel}
      className={className}
      isLoading={isLoading}
      error={error}
    />
  );
}

// Helper functions for creating form fields
export const createTextField = (
  name: string,
  label: string,
  options: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'text',
  ...options
});

export const createTextareaField = (
  name: string,
  label: string,
  options: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'textarea',
  ...options
});

export const createSelectField = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  fieldOptions: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'select',
  options,
  ...fieldOptions
});

export const createRadioField = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  fieldOptions: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'radio',
  options,
  ...fieldOptions
});

export const createCheckboxField = (
  name: string,
  label: string,
  options: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'checkbox',
  ...options
});

export const createSwitchField = (
  name: string,
  label: string,
  options: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'switch',
  ...options
});

export const createMultiSelectField = (
  name: string,
  label: string,
  options: { label: string; value: string }[],
  fieldOptions: Partial<FormField> = {}
): FormField => ({
  name,
  label,
  type: 'multiselect',
  options,
  ...fieldOptions
});

// Helper functions for creating validation schemas
export const createRequiredValidation = (
  message: string = 'This field is required'
) => {
  return Yup.string().required(message);
};

export const createEmailValidation = (
  message: string = 'Invalid email format'
) => {
  return Yup.string().email(message).required('Email is required');
};

export const createPasswordValidation = (
  minLength: number = 8,
  message: string = 'Password must be at least 8 characters'
) => {
  return Yup.string().min(minLength, message).required('Password is required');
};

export const createNumberValidation = (
  min: number = 0,
  max?: number,
  message: string = 'Invalid number'
) => {
  let schema = Yup.number().min(min, message);
  if (max !== undefined) {
    schema = schema.max(max, `Must be less than or equal to ${max}`);
  }
  return schema;
};

export const createUrlValidation = (message: string = 'Invalid URL format') => {
  return Yup.string().url(message);
};

export const createDateValidation = (
  message: string = 'Invalid date format'
) => {
  return Yup.date().typeError(message);
};

// Helper function for creating a form with common fields
export const createFormWithFields = (
  fields: FormField[],
  onSubmit: (values: any) => void | Promise<void>,
  options: Partial<FormBuilderProps> = {}
) => {
  return <FormBuilder fields={fields} onSubmit={onSubmit} {...options} />;
};

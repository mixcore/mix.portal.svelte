# Form Components

This directory contains a set of reusable form components built on top of Formik and shadcn/ui. These components provide a consistent way to create forms across the application.

## Components

### BaseForm

The `BaseForm` component is the foundation for all forms in the application. It provides:

- Form state management with Formik
- Field validation with Yup
- Error handling
- Loading states
- Consistent styling with shadcn/ui

### FormBuilder

The `FormBuilder` component provides a higher-level API for creating forms. It includes helper functions for creating different types of form fields and validation schemas.

## Usage

### Basic Form

```tsx
import { FormBuilder, createTextField } from '@/components/forms/form-builder';

export function MyForm() {
  const fields = [
    createTextField('name', 'Name', {
      required: true,
      placeholder: 'Enter your name'
    })
  ];

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <FormBuilder
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
```

### Form with Validation

```tsx
import { FormBuilder, createTextField, createEmailValidation } from '@/components/forms/form-builder';
import * as Yup from 'yup';

export function MyForm() {
  const fields = [
    createTextField('name', 'Name', {
      required: true,
      placeholder: 'Enter your name',
      validation: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
    }),
    createTextField('email', 'Email', {
      required: true,
      placeholder: 'Enter your email',
      validation: createEmailValidation()
    })
  ];

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <FormBuilder
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
```

### Form with Different Field Types

```tsx
import {
  FormBuilder,
  createTextField,
  createTextareaField,
  createSelectField,
  createRadioField,
  createCheckboxField,
  createSwitchField,
  createMultiSelectField
} from '@/components/forms/form-builder';

export function MyForm() {
  const fields = [
    createTextField('name', 'Name'),
    createTextareaField('bio', 'Bio'),
    createSelectField('role', 'Role', [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]),
    createRadioField('gender', 'Gender', [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' }
    ]),
    createCheckboxField('terms', 'I agree to the terms'),
    createSwitchField('notifications', 'Enable notifications'),
    createMultiSelectField('interests', 'Interests', [
      { label: 'Tech', value: 'tech' },
      { label: 'Sports', value: 'sports' }
    ])
  ];

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <FormBuilder
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
}
```

## Field Types

The form components support the following field types:

- `text`: Single-line text input
- `textarea`: Multi-line text input
- `select`: Dropdown select
- `radio`: Radio button group
- `checkbox`: Checkbox
- `switch`: Toggle switch
- `multiselect`: Multi-select dropdown

## Validation

The form components support validation using Yup schemas. You can use the built-in validation helpers or create custom validation schemas.

### Built-in Validation Helpers

- `createRequiredValidation`: Required field validation
- `createEmailValidation`: Email format validation
- `createPasswordValidation`: Password validation with minimum length
- `createNumberValidation`: Number validation with min/max values
- `createUrlValidation`: URL format validation
- `createDateValidation`: Date format validation

### Custom Validation

```tsx
import * as Yup from 'yup';

const customValidation = Yup.string()
  .required('This field is required')
  .min(5, 'Must be at least 5 characters')
  .matches(/[A-Z]/, 'Must contain at least one uppercase letter');
```

## Styling

The form components use shadcn/ui for styling and are fully customizable using Tailwind CSS classes.

### Customizing Form Layout

```tsx
<FormBuilder
  fields={fields}
  onSubmit={handleSubmit}
  className="space-y-8"
/>
```

### Customizing Field Layout

```tsx
createTextField('name', 'Name', {
  className: 'col-span-2'
})
```

## Best Practices

1. Use the `FormBuilder` component for consistency across forms
2. Use the built-in validation helpers when possible
3. Keep forms focused and simple
4. Use appropriate field types for different data types
5. Provide clear labels and descriptions
6. Handle loading and error states
7. Use proper TypeScript types for form values 
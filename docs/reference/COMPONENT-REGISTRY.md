# Mixcore Component Registry

This document serves as a registry of all components developed for the Mixcore application during the migration. Use this to ensure code reuse and maintain consistency.

## UI Components

These are the core UI components from shadcn/ui and custom components built for the application.

| Component | Path | Status | Dependencies | Last Updated |
|-----------|------|--------|--------------|-------------|
| Button | `src/components/ui/button.tsx` | ✅ Complete | @radix-ui/react-slot | 2023-04-10 |
| Input | `src/components/ui/input.tsx` | ✅ Complete | - | 2023-04-10 |
| Label | `src/components/ui/label.tsx` | ✅ Complete | @radix-ui/react-label | 2023-04-10 |
| Textarea | `src/components/ui/textarea.tsx` | ✅ Complete | - | 2023-04-10 |
| Select | `src/components/ui/select.tsx` | ✅ Complete | @radix-ui/react-select | 2023-04-10 |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` | ✅ Complete | @radix-ui/react-dropdown-menu | 2023-04-10 |
| Card | `src/components/ui/card.tsx` | ✅ Complete | - | 2023-04-10 |
| Alert | `src/components/ui/alert.tsx` | ✅ Complete | - | 2023-04-10 |
| Toast | `src/components/ui/toast.tsx` | ✅ Complete | @radix-ui/react-toast | 2023-04-12 |
| Dialog | `src/components/ui/dialog.tsx` | ❌ Not Started | @radix-ui/react-dialog | - |
| Sheet | `src/components/ui/sheet.tsx` | ✅ Complete | @radix-ui/react-dialog | 2023-04-15 |
| Tabs | `src/components/ui/tabs.tsx` | ❌ Not Started | @radix-ui/react-tabs | - |
| Checkbox | `src/components/ui/checkbox.tsx` | ❌ Not Started | @radix-ui/react-checkbox | - |
| Radio Group | `src/components/ui/radio-group.tsx` | ❌ Not Started | @radix-ui/react-radio-group | - |
| Avatar | `src/components/ui/avatar.tsx` | ❌ Not Started | @radix-ui/react-avatar | - |
| Badge | `src/components/ui/badge.tsx` | ✅ Complete | - | 2023-04-15 |
| Tooltip | `src/components/ui/tooltip.tsx` | ✅ Complete | @radix-ui/react-tooltip | 2023-04-15 |

## Layout Components

These components handle the layout and structure of the application.

| Component | Path | Status | Purpose | Last Updated |
|-----------|------|--------|---------|-------------|
| Root Layout | `src/app/layout.tsx` | ✅ Complete | Base application layout | 2023-04-10 |
| Dashboard Layout | `src/app/dashboard/layout.tsx` | ✅ Complete | Admin dashboard layout | 2023-04-15 |
| Auth Layout | `src/app/(auth)/layout.tsx` | ✅ Complete | Authentication pages layout | 2023-04-10 |
| Main Navigation | `src/components/layout/MainNav.tsx` | ✅ Complete | Primary navigation | 2023-04-15 |
| Mobile Menu | `src/components/layout/MobileNav.tsx` | ✅ Complete | Mobile navigation | 2023-04-15 |
| Page Header | `src/components/layout/PageHeader.tsx` | ✅ Complete | Standard page headers | 2023-04-15 |
| Footer | `src/components/layout/Footer.tsx` | ✅ Complete | Application footer | 2023-04-10 |
| Breadcrumbs | `src/components/layout/Breadcrumbs.tsx` | ❌ Not Started | Navigation hierarchy | - |
| Sidebar | `src/components/layout/Sidebar.tsx` | ✅ Complete | Dashboard sidebar | 2023-04-15 |

## Feature Components

These are more complex components used for specific features.

| Component | Path | Status | Dependencies | Last Updated |
|-----------|------|--------|--------------|-------------|
| DataTable | `src/components/DataTable/index.tsx` | ✅ Complete | @tanstack/react-table, pagination | 2023-04-15 |
| TablePagination | `src/components/DataTable/Pagination.tsx` | ✅ Complete | Button | 2023-04-15 |
| TableFilter | `src/components/DataTable/Filter.tsx` | ✅ Complete | Input | 2023-04-15 |
| TableColumnHeader | `src/components/DataTable/ColumnHeader.tsx` | ✅ Complete | Button, Icons | 2023-04-15 |
| PostCard | `src/components/PostCard.tsx` | ❌ Not Started | Card, Badge | - |
| PageCard | `src/components/PageCard.tsx` | ❌ Not Started | Card, Badge | - |
| StatusBadge | `src/components/StatusBadge.tsx` | ✅ Complete | Badge | 2023-04-15 |
| DateDisplay | `src/components/DateDisplay.tsx` | ✅ Complete | - | 2023-04-15 |
| UserAvatar | `src/components/UserAvatar.tsx` | ❌ Not Started | Avatar | - |
| RichTextEditor | `src/components/RichTextEditor/index.tsx` | ✅ Complete | @tiptap/react, @tiptap/starter-kit | 2023-04-27 |
| FileUploader | `src/components/FileUploader.tsx` | ❌ Not Started | TBD | - |
| FormBuilder | `src/components/FormBuilder/index.tsx` | ❌ Not Started | React Hook Form, Zod | - |
| StatsCard | `src/components/StatsCard.tsx` | ✅ Complete | Card, Icons | 2023-04-15 |
| ActivityFeed | `src/components/ActivityFeed.tsx` | ✅ Complete | - | 2023-04-15 |
| QuickActions | `src/components/QuickActions.tsx` | ✅ Complete | Button | 2023-04-15 |
| ConfirmDialog | `src/components/ConfirmDialog.tsx` | ❌ Not Started | Dialog | - |
| LoadingSpinner | `src/components/LoadingSpinner.tsx` | ✅ Complete | - | 2023-04-10 |
| ErrorDisplay | `src/components/ErrorDisplay.tsx` | ✅ Complete | Alert | 2023-04-10 |

## Form Components

These components are specifically designed for forms.

| Component | Path | Status | Dependencies | Last Updated |
|-----------|------|--------|--------------|-------------|
| FormContainer | `src/components/forms/FormContainer.tsx` | ✅ Complete | React Hook Form | 2023-04-15 |
| FormInput | `src/components/forms/FormInput.tsx` | ✅ Complete | Input, Label | 2023-04-15 |
| FormTextarea | `src/components/forms/FormTextarea.tsx` | ✅ Complete | Textarea, Label | 2023-04-15 |
| FormSelect | `src/components/forms/FormSelect.tsx` | ✅ Complete | Select, Label | 2023-04-15 |
| FormCheckbox | `src/components/forms/FormCheckbox.tsx` | ❌ Not Started | Checkbox, Label | - |
| FormRadioGroup | `src/components/forms/FormRadioGroup.tsx` | ❌ Not Started | RadioGroup, Label | - |
| FormSubmitButton | `src/components/forms/FormSubmitButton.tsx` | ✅ Complete | Button | 2023-04-15 |
| FormError | `src/components/forms/FormError.tsx` | ✅ Complete | - | 2023-04-15 |
| FormRichTextEditor | `src/components/forms/FormRichTextEditor.tsx` | ✅ Complete | RichTextEditor, React Hook Form | 2023-04-27 |

## Component Relationships

The following diagram illustrates key component relationships:

```
Dashboard Layout
├── Sidebar
├── Header
│   ├── MainNav
│   ├── MobileNav
│   └── UserDropdown
└── Content Area
    ├── PageHeader
    ├── DataTable (for list views)
    │   ├── TableFilter
    │   ├── TableColumnHeader
    │   └── TablePagination
    ├── Forms (for create/edit views)
    │   ├── FormContainer
    │   ├── FormInput/FormTextarea/etc.
    │   └── FormSubmitButton
    └── Detail Views
        ├── StatusBadge
        ├── DateDisplay
        └── Content sections
```

## Usage Guidelines

### DataTable Component

The DataTable component is a flexible, reusable component for displaying tabular data with sorting, filtering, and pagination.

#### Basic Usage

```tsx
import { DataTable } from '@/components/DataTable';
import { columns } from './columns'; // Define your columns configuration

export default function PostsList() {
  // Fetch data from API
  const { data, loading, error } = usePosts();
  
  return (
    <div>
      <h1>Posts</h1>
      <DataTable 
        columns={columns} 
        data={data?.items || []} 
        pagination={{
          pageCount: Math.ceil(data?.totalItems / data?.pageSize) || 0,
          pageSize: data?.pageSize || 10,
          pageIndex: data?.pageIndex || 0,
        }}
        onPaginationChange={(pagination) => {
          // Handle pagination change
        }}
      />
    </div>
  );
}
```

### Form Components

Form components are designed to work with React Hook Form and Zod for validation.

#### Basic Usage

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormContainer, FormInput, FormTextarea, FormSubmitButton } from '@/components/forms';

// Define validation schema
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export default function CreatePostForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  
  const onSubmit = async (data) => {
    // Handle form submission
  };
  
  return (
    <FormContainer form={form} onSubmit={onSubmit}>
      <FormInput name="title" label="Title" />
      <FormTextarea name="content" label="Content" />
      <FormSubmitButton>Create Post</FormSubmitButton>
    </FormContainer>
  );
}
```

## How to Add a New Component

1. Check this registry first to see if a similar component already exists
2. If it doesn't exist, create the component in the appropriate directory
3. Follow the project's coding standards and component patterns
4. Add the component to this registry with its path, status, and dependencies
5. Update the Last Updated column with today's date

## Component Standards

- All components should be typed with TypeScript interfaces
- UI components should use Tailwind CSS for styling
- Form components should work with React Hook Form
- Complex components should have clear documentation
- Components should handle loading and error states appropriately
- Components should be responsive and accessible 
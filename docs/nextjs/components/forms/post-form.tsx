'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { FormBuilder, FormFieldConfig } from '@/components/ui/form-builder';
import { Card } from '@/components/ui/card';
import { categoryService } from '@/services/categoryService';
import { tagService } from '@/services/tagService';
import { MultiSelect } from '@/components/ui/multi-select';

interface PostFormProps {
  onSubmit: (values: any) => void | Promise<void>;
  initialValues?: Record<string, any>;
}

export function PostForm({ onSubmit, initialValues }: PostFormProps) {
  const [categories, setCategories] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [tags, setTags] = React.useState<{ label: string; value: string }[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, tagsResponse] = await Promise.all([
        categoryService.getList(),
        tagService.getList()
      ]);
      setCategories(
        categoriesResponse.data.map((category) => ({
          label: category.name,
          value: category.id
        }))
      );
      setTags(
        tagsResponse.data.map((tag) => ({
          label: tag.name,
          value: tag.id
        }))
      );
    } catch (error) {
      console.error('Failed to load categories and tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const fields: FormFieldConfig[] = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter post title',
      required: true,
      validation: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      placeholder: 'Enter post content',
      required: true,
      validation: Yup.string()
        .required('Content is required')
        .min(10, 'Content must be at least 10 characters')
    },
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      placeholder: 'Enter post excerpt',
      description: 'A short summary of the post'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
      ],
      defaultValue: 'draft'
    },
    {
      name: 'isFeatured',
      label: 'Featured Post',
      type: 'switch',
      description: 'Mark this post as featured'
    },
    {
      name: 'allowComments',
      label: 'Allow Comments',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'categoryIds',
      label: 'Categories',
      type: 'multiselect',
      options: categories,
      description: 'Select post categories'
    },
    {
      name: 'tagIds',
      label: 'Tags',
      type: 'multiselect',
      options: tags,
      description: 'Select post tags'
    }
  ];

  if (loading) {
    return (
      <Card className='p-6'>
        <div>Loading categories and tags...</div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <FormBuilder
        fields={fields}
        onSubmit={onSubmit}
        initialValues={initialValues}
        submitButtonText='Save Post'
      />
    </Card>
  );
}

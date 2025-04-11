'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createTextField,
  createTextareaField,
  createSelectField,
  createRadioField,
  createCheckboxField,
  createSwitchField,
  createMultiSelectField,
  createEmailValidation,
  createPasswordValidation,
  createNumberValidation,
  createUrlValidation,
  createDateValidation,
  FormBuilder
} from './form-builder';

export function ExampleForm() {
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
    }),
    createTextField('password', 'Password', {
      required: true,
      placeholder: 'Enter your password',
      validation: createPasswordValidation()
    }),
    createTextareaField('bio', 'Bio', {
      placeholder: 'Tell us about yourself',
      description: 'This will be displayed on your profile'
    }),
    createSelectField(
      'role',
      'Role',
      [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' }
      ],
      {
        required: true,
        placeholder: 'Select your role'
      }
    ),
    createRadioField(
      'gender',
      'Gender',
      [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
      ],
      {
        required: true
      }
    ),
    createCheckboxField('terms', 'I agree to the terms and conditions', {
      required: true,
      validation: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions'
      )
    }),
    createSwitchField('notifications', 'Enable notifications', {
      defaultValue: true
    }),
    createMultiSelectField(
      'interests',
      'Interests',
      [
        { label: 'Technology', value: 'tech' },
        { label: 'Sports', value: 'sports' },
        { label: 'Music', value: 'music' },
        { label: 'Travel', value: 'travel' },
        { label: 'Food', value: 'food' }
      ],
      {
        placeholder: 'Select your interests'
      }
    )
  ];

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
    // Add your form submission logic here
  };

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder
          fields={fields}
          onSubmit={handleSubmit}
          submitButtonText='Submit Form'
          cancelButtonText='Cancel'
          onCancel={() => console.log('Form cancelled')}
        />
      </CardContent>
    </Card>
  );
}

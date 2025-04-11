'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const initialValues: LoginFormValues = {
  username: '',
  password: '',
  rememberMe: false
};

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean()
});

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [externalProviders, setExternalProviders] = useState<string[]>([]);

  useEffect(() => {
    // Get external login providers
    AuthService.getExternalLoginProviders().then((providers) => {
      setExternalProviders(providers);
    });
  }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.login(
        values.username,
        values.password,
        values.rememberMe
      );

      if (result.success) {
        const returnUrl = searchParams.get('ReturnUrl');
        if (returnUrl) {
          router.push(returnUrl);
        } else if (document.referrer && !document.referrer.includes('init')) {
          router.push(document.referrer);
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setError(result.errors?.[0] || 'Login failed. Please try again.');
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Open external login popup
      const width = 600;
      const height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        `/authcomplete.html?provider=${provider}`,
        'Authenticate Account',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return;

        const { userID, email, accessToken } = event.data;
        if (userID && email && accessToken) {
          const result = await AuthService.externalLogin({
            provider,
            username: userID,
            email,
            accessToken
          });

          if (result.success) {
            const returnUrl = searchParams.get('ReturnUrl');
            if (returnUrl) {
              router.push(returnUrl);
            } else if (
              document.referrer &&
              !document.referrer.includes('init')
            ) {
              router.push(document.referrer);
            } else {
              router.push('/admin/dashboard');
            }
          } else {
            setError(
              result.errors?.[0] || 'External login failed. Please try again.'
            );
          }
        }
      });
    } catch {
      setError('An error occurred during external login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container flex min-h-screen items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex justify-center'>
          <h1 className='text-3xl font-bold'>Mixcore</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Login</CardTitle>
            <CardDescription className='text-center'>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <FormikForm className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Field
                      as={Input}
                      id='username'
                      name='username'
                      type='text'
                      placeholder='Enter your username'
                    />
                    <ErrorMessage
                      name='username'
                      component='div'
                      className='text-sm text-red-500'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Field
                      as={Input}
                      id='password'
                      name='password'
                      type='password'
                      placeholder='Enter your password'
                    />
                    <ErrorMessage
                      name='password'
                      component='div'
                      className='text-sm text-red-500'
                    />
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='rememberMe'
                      checked={values.rememberMe}
                      onCheckedChange={(checked) =>
                        setFieldValue('rememberMe', checked)
                      }
                    />
                    <Label htmlFor='rememberMe'>Remember me</Label>
                  </div>

                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </FormikForm>
              )}
            </Formik>

            {externalProviders.length > 0 && (
              <div className='mt-6'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='bg-white px-2 text-gray-500'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-3'>
                  {externalProviders.map((provider) => (
                    <Button
                      key={provider}
                      variant='outline'
                      className='w-full'
                      onClick={() => handleExternalLogin(provider)}
                      disabled={isLoading}
                    >
                      {provider}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

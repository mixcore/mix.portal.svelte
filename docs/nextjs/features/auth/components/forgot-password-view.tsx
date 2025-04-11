'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await AuthService.forgotPassword(email);

      if (result.success) {
        setSuccess(true);
        toast.success('Password reset instructions sent to your email!');
      } else {
        setError(result.errors?.[0] || 'Failed to process request. Please try again.');
        toast.error(result.errors?.[0] || 'Failed to process request. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0'>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='w-full'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>Forgot Password</h1>
              <p className='text-muted-foreground text-sm'>
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {error && (
              <div className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500'>
                {error}
              </div>
            )}

            {success ? (
              <div className='mt-6 text-center'>
                <div className='mb-4 rounded-md bg-green-50 p-3 text-sm text-green-500'>
                  Check your email for a password reset link.
                </div>
                <Link href='/auth/sign-in' className='text-sm underline'>
                  Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='example@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className='mt-4 text-center text-sm'>
                  Remember your password?{' '}
                  <Link href='/auth/sign-in' className='underline'>
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
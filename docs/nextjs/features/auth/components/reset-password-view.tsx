'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FormEvent, useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, [token, email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token || !email) {
      setError('Invalid or expired password reset link. Please request a new one.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await AuthService.resetPassword(token, email, password);

      if (result.success) {
        setSuccess(true);
        toast.success('Password has been reset successfully!');
      } else {
        setError(result.errors?.[0] || 'Failed to reset password. Please try again.');
        toast.error(result.errors?.[0] || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/auth/sign-in');
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0'>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='w-full'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>Reset Password</h1>
              <p className='text-muted-foreground text-sm'>
                Create a new password for your account
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
                  Your password has been reset successfully.
                </div>
                <Button 
                  onClick={handleLoginClick} 
                  className='w-full'
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='password'>New Password</Label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || !token || !email}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirm-password'>Confirm Password</Label>
                  <Input
                    id='confirm-password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading || !token || !email}
                  />
                </div>
                <Button 
                  type='submit' 
                  className='w-full' 
                  disabled={isLoading || !token || !email}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
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
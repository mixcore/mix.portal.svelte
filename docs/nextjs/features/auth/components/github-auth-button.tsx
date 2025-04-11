'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';

export default function GithubSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      // Open popup for GitHub OAuth
      const width = 600;
      const height = 750;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        `/authcomplete.html?provider=GitHub`,
        'Authenticate with GitHub',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return;

        const { userID, email, accessToken } = event.data;
        if (userID && email && accessToken) {
          const result = await AuthService.externalLogin({
            provider: 'GitHub',
            username: userID,
            email,
            accessToken
          });

          if (result.success) {
            toast.success('Signed in with GitHub successfully!');
            router.push(callbackUrl || '/dashboard/overview');
          } else {
            toast.error(result.errors?.[0] || 'GitHub login failed. Please try again.');
          }
        }
      });
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('An error occurred during GitHub login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={handleGithubLogin}
      disabled={isLoading}
    >
      <Icons.github className='mr-2 h-4 w-4' />
      {isLoading ? 'Signing in...' : 'Continue with Github'}
    </Button>
  );
}

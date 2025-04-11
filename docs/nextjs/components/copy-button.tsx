'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function CopyButton({
  text,
  className,
  variant = 'ghost',
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      size='sm'
      variant={variant}
      className={cn('h-8 w-8 p-0', className)}
      onClick={copyToClipboard}
      {...props}
    >
      {isCopied ? (
        <Icons.check className='h-4 w-4' />
      ) : (
        <Icons.copy className='h-4 w-4' />
      )}
      <span className='sr-only'>Copy</span>
    </Button>
  );
}

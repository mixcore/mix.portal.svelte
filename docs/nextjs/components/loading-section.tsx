import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSectionProps {
  className?: string;
}

export const LoadingSection: React.FC<LoadingSectionProps> = ({
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <Loader2 className='text-primary h-10 w-10 animate-spin' />
      <p className='text-muted-foreground mt-4 text-sm'>Loading...</p>
    </div>
  );
};

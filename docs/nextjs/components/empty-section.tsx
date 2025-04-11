import React from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { LucideIcon } from 'lucide-react';

interface EmptySectionProps {
  title: string;
  description?: string;
  icon?: keyof typeof Icons;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptySection: React.FC<EmptySectionProps> = ({
  title,
  description,
  icon = 'fileText',
  action
}) => {
  const Icon = Icons[icon] || Icons.fileText;

  return (
    <div className='flex flex-col items-center justify-center px-4 py-12 text-center'>
      <Icon className='text-muted-foreground mb-4 h-12 w-12' />
      <h3 className='text-lg font-medium'>{title}</h3>
      {description && (
        <p className='text-muted-foreground mt-2 max-w-md text-sm'>
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className='mt-4'>
          {action.label}
        </Button>
      )}
    </div>
  );
};

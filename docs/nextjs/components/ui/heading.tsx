import React from 'react';

interface HeadingProps {
  title: string;
  description?: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div className='flex flex-col gap-1.5'>
      <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      {description && (
        <p className='text-muted-foreground text-sm'>{description}</p>
      )}
    </div>
  );
}

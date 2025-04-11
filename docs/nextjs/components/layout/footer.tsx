import React from 'react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t px-6 py-3'>
      <div className='text-muted-foreground flex flex-col items-center justify-between gap-3 text-sm md:flex-row'>
        <div>
          <p>© {currentYear} Mixcore CMS. Version 1.0.0</p>
        </div>
        <div className='flex items-center gap-4'>
          <a href='#' className='hover:text-foreground transition-colors'>
            Documentation
          </a>
          <Separator orientation='vertical' className='h-4' />
          <a href='#' className='hover:text-foreground transition-colors'>
            Support
          </a>
          <Separator orientation='vertical' className='h-4' />
          <a
            href='https://github.com/mixcore/mix.portal.react'
            className='hover:text-foreground transition-colors'
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Tags } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TagsLayoutProps {
  children: ReactNode;
}

export default function TagsLayout({ children }: TagsLayoutProps) {
  const pathname = usePathname();

  const isTagsList = pathname === '/dashboard/tags';
  const isNewTag = pathname === '/dashboard/tags/new';
  const isEditTag =
    pathname.includes('/dashboard/tags/') && pathname.includes('/edit');

  return <div className='container mx-auto py-4'>{children}</div>;
}

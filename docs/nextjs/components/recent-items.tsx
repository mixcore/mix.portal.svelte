'use client';

import Link from 'next/link';
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface RecentItem {
  id: number;
  title: string;
  type: string;
  url: string;
}

export function RecentItems({ items }: { items: RecentItem[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <div className='text-muted-foreground px-2 pb-2 text-xs'>
        Recently viewed content
      </div>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              tooltip={`${item.title} (${item.type})`}
            >
              <Link href={item.url} className='group'>
                <div className='bg-primary/10 text-primary flex h-4 w-4 items-center justify-center rounded text-[10px] uppercase'>
                  {item.type === 'post' ? 'P' : item.type === 'page' ? 'G' : 'D'}
                </div>
                <span className='truncate'>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
} 
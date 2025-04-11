'use client';

import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { LayoutWidthToggle } from './layout-width-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, BellIcon, HelpCircleIcon, SearchIcon, AppWindowIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationContext } from '@/providers/navigation-context-provider';

export default function Header() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);
  const pathname = usePathname();
  const { 
    activeContextId, 
    setActiveContextId, 
    availableContexts 
  } = useNavigationContext();

  // Determine if we're in a posts section
  const isPostsSection = pathname?.includes('/posts');
  const isPagesSection = pathname?.includes('/pages');

  // Determine Create button context
  const getCreateButton = () => {
    if (isPostsSection) {
      return (
        <Button size='sm' asChild className='hidden md:flex'>
          <Link href='/dashboard/posts/new'>
            <PlusIcon className='mr-1 h-4 w-4' />
            New Post
          </Link>
        </Button>
      );
    } else if (isPagesSection) {
      return (
        <Button size='sm' asChild className='hidden md:flex'>
          <Link href='/dashboard/pages/new'>
            <PlusIcon className='mr-1 h-4 w-4' />
            New Page
          </Link>
        </Button>
      );
    } else {
      return (
        <Button size='sm' asChild className='hidden md:flex'>
          <Link href='/dashboard/posts/new'>
            <PlusIcon className='mr-1 h-4 w-4' />
            Create
          </Link>
        </Button>
      );
    }
  };

  return (
    <header className='bg-background sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm transition-all ease-in-out'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='text-muted-foreground hover:text-foreground' />
        <Separator orientation='vertical' className='mr-2 h-6' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2'>
        {searchOpen ? (
          <div className='animate-in fade-in slide-in-from-top-4 relative w-full max-w-sm duration-200'>
            <SearchIcon className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
            <Input
              placeholder='Search...'
              className='w-full rounded-full pr-4 pl-8'
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='mr-2 gap-1.5'
                >
                  <AppWindowIcon className='h-4 w-4' />
                  <span>Apps</span>
                  {activeContextId && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {availableContexts.find(c => c.id === activeContextId)?.name || 'Unknown'}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-64 p-0'>
                <div className='border-b p-3 font-medium'>Select App Context</div>
                <div className='max-h-80 overflow-auto'>
                  {availableContexts.map((context) => (
                    <button
                      key={context.id}
                      onClick={() => setActiveContextId(context.id)}
                      className={`hover:bg-muted/50 flex w-full items-start gap-3 border-b p-3 last:border-0 ${
                        activeContextId === context.id ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className={`bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full`}>
                        {context.name.charAt(0)}
                      </div>
                      <div className='flex-1 space-y-1 text-left'>
                        <p className='text-sm font-medium'>{context.name}</p>
                        <p className='text-muted-foreground text-xs'>{context.description}</p>
                      </div>
                      {activeContextId === context.id && (
                        <Badge className='ml-auto' variant='outline'>Active</Badge>
                      )}
                    </button>
                  ))}
                </div>
                <div className='border-t p-2 text-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-primary w-full'
                    asChild
                  >
                    <Link href='/dashboard/settings/app-contexts'>
                      Manage app contexts
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {getCreateButton()}

            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSearchOpen(true)}
              className='text-muted-foreground hover:text-foreground'
            >
              <SearchIcon className='h-5 w-5' />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground hover:text-foreground relative'
                >
                  <BellIcon className='h-5 w-5' />
                  {notifications > 0 && (
                    <Badge className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0'>
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-80 p-0'>
                <div className='border-b p-3 font-medium'>Notifications</div>
                <div className='max-h-80 overflow-auto'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='hover:bg-muted/50 flex items-start gap-3 border-b p-3 last:border-0'
                    >
                      <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full'>
                        {i === 0 ? 'U' : i === 1 ? 'S' : 'P'}
                      </div>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium'>
                          {i === 0
                            ? 'User update'
                            : i === 1
                              ? 'System notification'
                              : 'Post published'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {i === 0
                            ? 'A new user registered'
                            : i === 1
                              ? 'System update available'
                              : 'Your post has been published'}
                        </p>
                        <p className='text-muted-foreground text-xs'>2h ago</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='border-t p-2 text-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-primary w-full'
                  >
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground hover:text-foreground'
                >
                  <HelpCircleIcon className='h-5 w-5' />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-80'>
                <div className='space-y-2'>
                  <h4 className='font-medium'>Need help?</h4>
                  <p className='text-muted-foreground text-sm'>
                    Check our documentation or contact support for assistance.
                  </p>
                  <div className='flex gap-2 pt-2'>
                    <Button variant='outline' size='sm' className='flex-1'>
                      Documentation
                    </Button>
                    <Button size='sm' className='flex-1'>
                      Support
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <UserNav />
            <LayoutWidthToggle />
            <ModeToggle />
          </>
        )}
      </div>
    </header>
  );
}

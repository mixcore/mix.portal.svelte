'use client';

import Header from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AuthService } from '@/services/auth';

interface EnhancedShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarDefaultOpen?: boolean;
  pageTitle?: string;
}

export function EnhancedShell({
  children,
  showSidebar = true,
  sidebarDefaultOpen = true,
  pageTitle
}: EnhancedShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Update title from pathname if not provided
  const [title, setTitle] = useState<string | undefined>(pageTitle);
  useEffect(() => {
    if (!pageTitle) {
      const path = pathname.split('/');
      const segment = path[path.length - 1];
      if (segment) {
        setTitle(segment.charAt(0).toUpperCase() + segment.slice(1));
      }
    } else {
      setTitle(pageTitle);
    }
  }, [pathname, pageTitle]);

  // Check authentication on mount
  useEffect(() => {
    const auth = AuthService.isAuthenticated();
    setIsAuthenticated(auth);

    if (auth) {
      AuthService.getCurrentUser().then(setUser);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  // Sidebar navigation items
  const contentItems = [
    {
      title: 'Pages',
      href: '/admin/pages',
      icon: <Icons.file className='h-4 w-4' />
    },
    {
      title: 'Posts',
      href: '/admin/posts',
      icon: <Icons.post className='h-4 w-4' />
    },
    {
      title: 'Media',
      href: '/admin/media',
      icon: <Icons.media className='h-4 w-4' />
    }
  ];

  const userItems = [
    {
      title: 'Users',
      href: '/admin/users',
      icon: <Icons.user className='h-4 w-4' />
    },
    {
      title: 'Roles',
      href: '/admin/roles',
      icon: <Icons.settings className='h-4 w-4' />
    }
  ];

  const systemItems = [
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Icons.settings className='h-4 w-4' />
    },
    {
      title: 'Plugins',
      href: '/admin/plugins',
      icon: <Icons.folder className='h-4 w-4' />
    }
  ];

  return (
    <div className='relative flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        {showSidebar && (
          <>
            <aside
              className={cn(
                'bg-background fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 lg:static lg:transition-none',
                sidebarOpen
                  ? 'translate-x-0'
                  : '-translate-x-full lg:translate-x-0',
                sidebarOpen ? 'lg:w-64' : 'lg:w-20'
              )}
              data-state={sidebarOpen ? 'open' : 'collapsed'}
            >
              {/* Sidebar Header */}
              <div className='flex h-14 items-center border-b px-4'>
                <Link
                  href='/admin/dashboard'
                  className='flex items-center gap-2'
                >
                  <Icons.logo className='h-6 w-6' />
                  <span
                    className={cn('font-semibold', !sidebarOpen && 'lg:hidden')}
                  >
                    Mixcore CMS
                  </span>
                </Link>
              </div>

              {/* Sidebar Content */}
              <div className='flex-1 overflow-auto py-2'>
                {/* Content Section */}
                <div className='px-3 py-2'>
                  <h3
                    className={cn(
                      'text-muted-foreground mb-2 px-2 text-xs font-semibold',
                      !sidebarOpen && 'lg:hidden'
                    )}
                  >
                    Content
                  </h3>
                  <ul className='space-y-1'>
                    <li>
                      <Link
                        href='/admin/dashboard'
                        className={cn(
                          'flex items-center rounded-md px-2 py-1.5 text-sm font-medium',
                          pathname === '/admin/dashboard'
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          !sidebarOpen && 'lg:justify-center'
                        )}
                      >
                        <Icons.dashboard className='h-5 w-5 min-w-5' />
                        <span
                          className={cn('ml-2', !sidebarOpen && 'lg:hidden')}
                        >
                          Dashboard
                        </span>
                      </Link>
                    </li>
                    {contentItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center rounded-md px-2 py-1.5 text-sm font-medium',
                            pathname === item.href ||
                              pathname?.startsWith(`${item.href}/`)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            !sidebarOpen && 'lg:justify-center'
                          )}
                        >
                          {item.icon}
                          <span
                            className={cn('ml-2', !sidebarOpen && 'lg:hidden')}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Users Section */}
                <div className='px-3 py-2'>
                  <h3
                    className={cn(
                      'text-muted-foreground mb-2 px-2 text-xs font-semibold',
                      !sidebarOpen && 'lg:hidden'
                    )}
                  >
                    Users
                  </h3>
                  <ul className='space-y-1'>
                    {userItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center rounded-md px-2 py-1.5 text-sm font-medium',
                            pathname === item.href ||
                              pathname?.startsWith(`${item.href}/`)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            !sidebarOpen && 'lg:justify-center'
                          )}
                        >
                          {item.icon}
                          <span
                            className={cn('ml-2', !sidebarOpen && 'lg:hidden')}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* System Section */}
                <div className='px-3 py-2'>
                  <h3
                    className={cn(
                      'text-muted-foreground mb-2 px-2 text-xs font-semibold',
                      !sidebarOpen && 'lg:hidden'
                    )}
                  >
                    System
                  </h3>
                  <ul className='space-y-1'>
                    {systemItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center rounded-md px-2 py-1.5 text-sm font-medium',
                            pathname === item.href ||
                              pathname?.startsWith(`${item.href}/`)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            !sidebarOpen && 'lg:justify-center'
                          )}
                        >
                          {item.icon}
                          <span
                            className={cn('ml-2', !sidebarOpen && 'lg:hidden')}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className='border-t p-3'>
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='flex w-full items-center gap-2 px-2'
                      >
                        <Avatar className='h-8 w-8'>
                          {user.avatarUrl ? (
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.username}
                            />
                          ) : (
                            <AvatarFallback>
                              {user.firstName
                                ? user.firstName.charAt(0)
                                : user.username.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div
                          className={cn(
                            'flex flex-col items-start text-left',
                            !sidebarOpen && 'lg:hidden'
                          )}
                        >
                          <span className='text-sm font-medium'>
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user.username}
                          </span>
                          <span className='text-muted-foreground text-xs'>
                            {user.email}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56'>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href='/admin/profile'>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/admin/settings'>Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <Icons.logout className='h-4 w-4' />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </aside>
            <div
              className={cn(
                'bg-background/80 fixed inset-0 z-40 backdrop-blur-sm transition-all duration-100 lg:hidden',
                sidebarOpen ? 'block' : 'hidden'
              )}
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
        <div className='flex-1'>
          <div className='flex h-16 items-center gap-4 border-b px-6'>
            {showSidebar && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='h-9 w-9'
                title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <Icons.chevronLeft
                  className={cn(
                    'h-5 w-5 transition-all',
                    sidebarOpen ? 'rotate-0' : 'rotate-180'
                  )}
                />
                <span className='sr-only'>
                  {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                </span>
              </Button>
            )}
            <Header title={title} />
          </div>
          <main className='flex-1 p-6'>{children}</main>
        </div>
      </div>
    </div>
  );
}

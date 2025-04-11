'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AuthService } from '@/services/auth';
import { User } from '@/types';
import { ThemeToggle } from '@/components/theme-toggle';

interface MainNavigationProps {
  className?: string;
}

export function MainNavigation({ className }: MainNavigationProps) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = AuthService.isAuthenticated();
      setIsAuthenticated(auth);

      if (auth) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <Icons.dashboard className='mr-2 h-4 w-4' />
    },
    {
      label: 'Posts',
      href: '/admin/post',
      icon: <Icons.post className='mr-2 h-4 w-4' />
    },
    {
      label: 'Pages',
      href: '/admin/page',
      icon: <Icons.page className='mr-2 h-4 w-4' />
    },
    {
      label: 'Media',
      href: '/admin/media',
      icon: <Icons.media className='mr-2 h-4 w-4' />
    },
    {
      label: 'Users',
      href: '/admin/user',
      icon: <Icons.user className='mr-2 h-4 w-4' />
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: <Icons.settings className='mr-2 h-4 w-4' />
    }
  ];

  return (
    <nav className={`flex items-center justify-between p-4 ${className}`}>
      {/* Desktop Navigation */}
      <div className='flex items-center'>
        <Link href='/admin/dashboard' className='mr-6 flex items-center'>
          <Icons.logo className='mr-2 h-8 w-8' />
          <span className='hidden text-xl font-bold md:inline'>
            Mixcore CMS
          </span>
        </Link>

        <div className='hidden space-x-1 md:flex'>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <ThemeToggle />

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className='h-8 w-8 rounded-full'
                  />
                ) : (
                  <Icons.user className='h-5 w-5' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/admin/profile'>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/admin/settings'>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant='default' size='sm'>
            <Link href='/security/login'>Login</Link>
          </Button>
        )}

        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='md:hidden'
              aria-label='Open menu'
            >
              <Icons.menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent
            side='left'
            className='w-[240px] p-0 sm:w-[300px]'
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <div className='flex h-full flex-col'>
              <SheetHeader className='border-b px-4 py-4'>
                <SheetTitle className='flex items-center'>
                  <Icons.logo className='mr-2 h-6 w-6' />
                  <span>Mixcore CMS</span>
                </SheetTitle>
              </SheetHeader>

              <div className='flex-1 overflow-y-auto py-4'>
                <nav className='flex flex-col space-y-1 px-2'>
                  {navItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname?.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className='ml-2'>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {isAuthenticated && user && (
                <div className='border-t px-4 py-4'>
                  <div className='flex items-center space-x-2'>
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className='h-8 w-8 rounded-full'
                      />
                    ) : (
                      <Icons.user className='bg-muted h-8 w-8 rounded-full p-1.5' />
                    )}
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium'>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <div className='mt-4 flex flex-col space-y-1'>
                    <Button variant='ghost' className='justify-start' asChild>
                      <Link href='/admin/profile'>Profile</Link>
                    </Button>
                    <Button variant='ghost' className='justify-start' asChild>
                      <Link href='/admin/settings'>Settings</Link>
                    </Button>
                    <Button
                      variant='ghost'
                      className='text-destructive hover:text-destructive justify-start'
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

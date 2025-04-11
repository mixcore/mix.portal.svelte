'use client';

import { useState, useEffect } from 'react';
import { MainNavigation } from './main-navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ShellLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
}

export function ShellLayout({ 
  children, 
  className, 
  showSidebar = true 
}: ShellLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  // Sidebar navigation items
  const sidebarItems = [
    {
      title: 'Content',
      items: [
        { 
          title: 'Posts', 
          href: '/admin/post', 
          icon: <Icons.post className="w-4 h-4 mr-2" /> 
        },
        { 
          title: 'Pages', 
          href: '/admin/page', 
          icon: <Icons.page className="w-4 h-4 mr-2" /> 
        },
        { 
          title: 'Media', 
          href: '/admin/media', 
          icon: <Icons.media className="w-4 h-4 mr-2" /> 
        },
      ],
    },
    {
      title: 'Users',
      items: [
        { 
          title: 'All Users', 
          href: '/admin/user', 
          icon: <Icons.users className="w-4 h-4 mr-2" /> 
        },
        { 
          title: 'Roles', 
          href: '/admin/user/roles', 
          icon: <Icons.settings className="w-4 h-4 mr-2" /> 
        },
      ],
    },
    {
      title: 'System',
      items: [
        { 
          title: 'Settings', 
          href: '/admin/settings', 
          icon: <Icons.settings className="w-4 h-4 mr-2" /> 
        },
        { 
          title: 'Database', 
          href: '/admin/database', 
          icon: <Icons.database className="w-4 h-4 mr-2" /> 
        },
      ],
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't render sidebar for non-authenticated users or when explicitly disabled
  const shouldShowSidebar = isAuthenticated && showSidebar;

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <div className="flex flex-1">
        {shouldShowSidebar && (
          <aside 
            className={cn(
              "border-r bg-background transition-all duration-300 ease-in-out",
              sidebarOpen ? "w-64" : "w-16"
            )}
          >
            <div className="sticky top-0 z-10 p-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full flex justify-center"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <Icons.chevronLeft /> : <Icons.chevronRight />}
              </Button>
            </div>
            
            <div className="px-3 py-2">
              {sidebarItems.map((section, i) => (
                <div key={i} className="mb-6">
                  {sidebarOpen && (
                    <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
                      {section.title}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {section.items.map((item, j) => {
                      const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                      return (
                        <li key={j}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                              isActive 
                                ? "bg-accent text-accent-foreground" 
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              !sidebarOpen && "justify-center"
                            )}
                          >
                            {item.icon}
                            {sidebarOpen && <span>{item.title}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}
        
        <main className={cn(
          "flex-1 overflow-auto p-6",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
} 
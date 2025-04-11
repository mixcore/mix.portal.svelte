'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Mini-app breadcrumb format
type MiniAppBreadcrumb = {
  label: string;
  href: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[] | null>(null);

  // Listen for custom breadcrumb events from mini-apps
  useEffect(() => {
    const handleBreadcrumbUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.breadcrumbs) {
        // Convert the mini-app format to our format
        const miniAppBreadcrumbs = event.detail.breadcrumbs as MiniAppBreadcrumb[];
        const mappedBreadcrumbs = miniAppBreadcrumbs.map(item => ({
          title: item.label,
          link: item.href
        }));
        
        setCustomBreadcrumbs(mappedBreadcrumbs);
      }
    };

    const handleBreadcrumbReset = () => {
      setCustomBreadcrumbs(null);
    };

    // Listen for custom events from mini-apps
    window.addEventListener('mixcore:breadcrumbs:update', handleBreadcrumbUpdate as EventListener);
    window.addEventListener('mixcore:breadcrumbs:reset', handleBreadcrumbReset);

    return () => {
      window.removeEventListener('mixcore:breadcrumbs:update', handleBreadcrumbUpdate as EventListener);
      window.removeEventListener('mixcore:breadcrumbs:reset', handleBreadcrumbReset);
    };
  }, []);

  const defaultBreadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  // Use custom breadcrumbs if available, otherwise fall back to default
  return customBreadcrumbs || defaultBreadcrumbs;
}

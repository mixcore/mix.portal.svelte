import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the breadcrumb item interface
export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Custom hook for managing breadcrumbs in the dashboard
 * 
 * This hook integrates with the dashboard's header breadcrumb system
 * by dispatching custom events that can be listened to by the header component
 */
export const useBreadcrumb = () => {
  const router = useRouter();

  // This function will update breadcrumbs in the dashboard header
  const setBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    try {
      // Dispatch event to notify dashboard of breadcrumb change
      const event = new CustomEvent('mixcore:breadcrumbs:update', { 
        detail: { breadcrumbs } 
      });
      window.dispatchEvent(event);
      
      // For development purposes, update the page title to reflect current location
      if (breadcrumbs.length > 0) {
        const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
        document.title = `${lastBreadcrumb.label} | Mixcore CMS`;
      }
      
      // Store breadcrumbs in sessionStorage for persistence
      sessionStorage.setItem('mixcore_breadcrumbs', JSON.stringify(breadcrumbs));
    } catch (error) {
      console.error('Error setting breadcrumbs:', error);
    }
  };

  // Navigate to a breadcrumb item
  const navigateToBreadcrumb = (href: string) => {
    router.push(href);
  };

  // Reset breadcrumbs when component unmounts
  useEffect(() => {
    // Try to load breadcrumbs from sessionStorage on mount
    try {
      const storedBreadcrumbs = sessionStorage.getItem('mixcore_breadcrumbs');
      if (storedBreadcrumbs) {
        const breadcrumbs = JSON.parse(storedBreadcrumbs);
        // Dispatch event to restore breadcrumbs
        const event = new CustomEvent('mixcore:breadcrumbs:update', { 
          detail: { breadcrumbs } 
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error loading stored breadcrumbs:', error);
    }

    return () => {
      // Reset breadcrumbs when component unmounts
      try {
        const event = new CustomEvent('mixcore:breadcrumbs:reset');
        window.dispatchEvent(event);
        sessionStorage.removeItem('mixcore_breadcrumbs');
      } catch (error) {
        console.error('Error resetting breadcrumbs:', error);
      }
    };
  }, []);

  return { 
    setBreadcrumbs,
    navigateToBreadcrumb 
  };
};

export default useBreadcrumb; 
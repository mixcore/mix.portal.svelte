import { toast } from '@/components/ui/use-toast';

/**
 * Generate a deep link for the projects app with the specified view and projectId
 * 
 * @param view The view to link to (projects, tasks, gantt, board, calendar)
 * @param projectId Optional project ID when view is 'tasks'
 * @returns A URL string for deep linking
 */
export const getDeepLink = (view?: string, projectId?: string): string => {
  // Get the base URL (excluding any search params)
  const baseUrl = window.location.pathname;
  const params = new URLSearchParams();
  
  // Add view parameter if provided
  if (view) {
    params.set('view', view);
  }
  
  // Add projectId parameter if provided and view is tasks
  if (projectId && view === 'tasks') {
    params.set('projectId', projectId);
  }
  
  // Construct the full URL
  const queryString = params.toString();
  const fullUrl = `${window.location.origin}${baseUrl}${queryString ? `?${queryString}` : ''}`;
  
  return fullUrl;
};

/**
 * Update the URL with the specified view and projectId without navigation
 * 
 * @param view The current view
 * @param projectId Optional project ID when view is 'tasks'
 */
export const updateUrlParams = (view: string, projectId?: string): void => {
  const url = getDeepLink(view, projectId);
  
  // Update the URL without reloading the page
  window.history.replaceState({}, '', url);
};

/**
 * Copy the current URL or a specified deep link to the clipboard
 * 
 * @param url Optional URL to copy; if not provided, uses current URL
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (url?: string): Promise<boolean> => {
  try {
    const textToCopy = url || window.location.href;
    
    await navigator.clipboard.writeText(textToCopy);
    
    toast({
      title: "Link copied!",
      description: "URL has been copied to clipboard",
      duration: 3000,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    toast({
      title: "Copy failed",
      description: "Could not copy URL to clipboard",
      variant: "destructive",
      duration: 3000,
    });
    
    return false;
  }
};

/**
 * Extract view and projectId from URL search parameters
 * 
 * @param searchParams URLSearchParams object
 * @returns Object containing view and projectId
 */
export const getParamsFromUrl = (searchParams: URLSearchParams): { 
  view: string | null; 
  projectId: string | null;
} => {
  return {
    view: searchParams.get('view'),
    projectId: searchParams.get('projectId'),
  };
}; 
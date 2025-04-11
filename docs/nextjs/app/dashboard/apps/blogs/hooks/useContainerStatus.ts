'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook to detect and control the container status of the app
 * 
 * This hook detects whether the app is running in fluid layout mode
 * or contained within the dashboard's content area. It plays an important
 * role in supporting the dashboard's breadcrumb system by adjusting the
 * app's layout to match the dashboard's context.
 * 
 * @returns {boolean} True if the app is in fluid layout mode, false otherwise
 */
export default function useContainerStatus(): boolean {
  const [isFluidLayout, setIsFluidLayout] = useState<boolean>(() => {
    // Check if the dashboard-content element has container class
    if (typeof window !== 'undefined') {
      const dashboardContent = document.querySelector('.dashboard-content');
      // If the container class is missing, we're in fluid layout mode
      return dashboardContent ? 
        !dashboardContent.classList.contains('container') : 
        false;
    }
    return false;
  });

  // Update state when layout changes
  const updateContainerStatus = useCallback(() => {
    const dashboardContent = document.querySelector('.dashboard-content');
    setIsFluidLayout(dashboardContent ? 
      !dashboardContent.classList.contains('container') : 
      false);
  }, []);
  
  // Listen for layout change events from the dashboard
  useEffect(() => {
    // Custom event from dashboard for layout changes
    window.addEventListener('mixcore:layout:change', updateContainerStatus);
    
    // Observe DOM changes as fallback
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.nodeName === 'DIV' && 
            (mutation.target as Element).classList.contains('dashboard-content')) {
          updateContainerStatus();
        }
      });
    });
    
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
      observer.observe(dashboardContent, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
    
    return () => {
      window.removeEventListener('mixcore:layout:change', updateContainerStatus);
      observer.disconnect();
    };
  }, [updateContainerStatus]);
  
  return isFluidLayout;
} 
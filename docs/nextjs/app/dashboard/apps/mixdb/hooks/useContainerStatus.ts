'use client';

import { useState, useEffect } from 'react';

interface ContainerStatus {
  isFluid: boolean;
  containerWidth: number;
  containerHeight: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

export function useContainerStatus(): ContainerStatus {
  const [status, setStatus] = useState<ContainerStatus>({
    isFluid: false,
    containerWidth: 0,
    containerHeight: 0,
    isSmallScreen: false,
    isMediumScreen: false,
    isLargeScreen: false
  });

  useEffect(() => {
    // Find the container element
    const container = document.querySelector('.mixdb-app-shell') as HTMLElement;
    
    const updateStatus = () => {
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setStatus({
          isFluid: width > 1200,
          containerWidth: width,
          containerHeight: height,
          isSmallScreen: width < 640,
          isMediumScreen: width >= 640 && width < 1024,
          isLargeScreen: width >= 1024
        });
      }
    };

    // Initial update
    updateStatus();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateStatus);
    if (container) {
      resizeObserver.observe(container);
    }

    // Clean up
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return status;
} 
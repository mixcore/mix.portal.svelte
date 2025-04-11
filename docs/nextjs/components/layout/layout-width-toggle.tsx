'use client';

import React from 'react';
import { useLayoutContext } from '@/providers/layout-context-provider';
import { Button } from '@/components/ui/button';
import { IconLayout, IconMaximize } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function LayoutWidthToggle() {
  const { width, setWidth } = useLayoutContext();
  
  const toggleWidth = () => {
    setWidth(width === 'normal' ? 'fluid' : 'normal');
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleWidth}
            className="h-9 w-9"
          >
            {width === 'normal' ? (
              <IconMaximize className="h-5 w-5" />
            ) : (
              <IconLayout className="h-5 w-5" />
            )}
            <span className="sr-only">
              Toggle layout width
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{width === 'normal' ? 'Switch to fluid width' : 'Switch to normal width'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 
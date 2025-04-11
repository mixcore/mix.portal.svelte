'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LayoutWidth = 'normal' | 'fluid';

interface LayoutContextType {
  width: LayoutWidth;
  setWidth: (width: LayoutWidth) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Try to get from localStorage first, default to 'normal'
  const [width, setWidth] = useState<LayoutWidth>('normal');

  // Load from localStorage on client side
  useEffect(() => {
    const storedWidth = localStorage.getItem('mixcore-layout-width');
    if (storedWidth === 'fluid' || storedWidth === 'normal') {
      setWidth(storedWidth);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('mixcore-layout-width', width);
  }, [width]);

  return (
    <LayoutContext.Provider value={{ width, setWidth }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayoutContext must be used within a LayoutContextProvider');
  }
  return context;
} 
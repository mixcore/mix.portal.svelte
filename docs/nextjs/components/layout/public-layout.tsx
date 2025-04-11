'use client';

import { MainNavigation } from './main-navigation';
import { cn } from '@/lib/utils';
import { Footer } from './footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideFooter?: boolean;
}

export function PublicLayout({
  children,
  className,
  hideFooter = false,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      
      <main className={cn(
        "flex-1 container mx-auto px-4 py-6",
        className
      )}>
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
} 
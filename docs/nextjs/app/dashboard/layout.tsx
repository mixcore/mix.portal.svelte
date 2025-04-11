import KBar from '@/components/kbar';
import Header from '@/components/layout/header';
import AppSidebar from '@/components/layout/app-sidebar';
import Footer from '@/components/layout/footer';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { NavigationContextProvider } from '@/providers/navigation-context-provider';
import { LayoutContextProvider } from '@/providers/layout-context-provider';
import LayoutContainer from '@/components/layout/layout-container';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Mixcore Portal',
  description: 'Modern content management system with Next.js and Shadcn UI'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Always set defaultOpen to true to prevent sidebar from collapsing by default
  return (
    <KBar>
      <NavigationContextProvider>
        <SidebarProvider defaultOpen={true}>
          <LayoutContextProvider>
            <AppSidebar />
            <SidebarInset className='flex h-screen flex-col'>
              <Header />

              {/* Main content container */}
              <main className='flex-1 overflow-auto' data-app-view="default">
                <LayoutContainer>
                  {children}
                </LayoutContainer>
              </main>

            </SidebarInset>
          </LayoutContextProvider>
        </SidebarProvider>
      </NavigationContextProvider>
    </KBar>
  );
}

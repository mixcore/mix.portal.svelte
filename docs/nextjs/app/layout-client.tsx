'use client';

import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';
import 'material-icons/iconfont/material-icons.css';
import { useEffect, useState } from 'react';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [activeThemeValue, setActiveThemeValue] = useState<string | null>(null);
  const [isScaled, setIsScaled] = useState(false);
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('active_theme');
    setActiveThemeValue(storedTheme || '');
    setIsScaled(!!storedTheme?.endsWith('-scaled'));
  }, []);

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <title>Next Shadcn</title>
        <meta name="description" content="Basic dashboard with Next.js and Shadcn" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={activeThemeValue || ''}>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}

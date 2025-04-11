import type { Metadata } from 'next';
import { EnhancedShell } from '@/components/layout/enhanced-shell';

export const metadata: Metadata = {
  title: 'Mixcore Security - Next.js',
  description: 'Mixcore authentication and security pages',
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnhancedShell showSidebar={false}>
      <div className="container mx-auto max-w-md py-10">
        {children}
      </div>
    </EnhancedShell>
  );
} 
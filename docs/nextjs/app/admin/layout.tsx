import type { Metadata } from 'next';
import { EnhancedShell } from '@/components/layout/enhanced-shell';

export const metadata: Metadata = {
  title: 'Mixcore Admin - Next.js',
  description: 'Mixcore Admin Dashboard with Tailwind CSS and shadcn/ui',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EnhancedShell>{children}</EnhancedShell>;
} 
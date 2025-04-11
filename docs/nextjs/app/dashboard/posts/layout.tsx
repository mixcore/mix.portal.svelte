import { ReactNode } from 'react';

interface PostsLayoutProps {
  children: ReactNode;
}

export default function PostsLayout({ children }: PostsLayoutProps) {
  return <div className='container mx-auto space-y-8 py-6'>{children}</div>;
}

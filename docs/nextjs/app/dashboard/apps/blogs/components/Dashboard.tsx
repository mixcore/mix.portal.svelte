'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, ChevronRight } from 'lucide-react';
import { getAppConfig } from '../app-loader';

interface DashboardProps {
  onItemClick: (itemId: string) => void;
}

export function Dashboard({ onItemClick }: DashboardProps) {
  const appConfig = getAppConfig();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={() => onItemClick('new')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Post
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:bg-accent/5" onClick={() => onItemClick('list')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Posts</div>
            <p className="text-xs text-muted-foreground">
              View, edit, and create blog posts
            </p>
            <Button variant="ghost" className="mt-4 gap-1 p-0 text-xs text-primary" onClick={() => onItemClick('list')}>
              View all posts
              <ChevronRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              No recent activity to display
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Statistics will appear here
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to {appConfig.displayName}</CardTitle>
            <CardDescription>
              A modern blogging platform powered by Mixcore CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This dashboard provides you with tools to manage your blog posts, categories, tags, 
              and more. Use the navigation tabs above to access different sections.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard; 
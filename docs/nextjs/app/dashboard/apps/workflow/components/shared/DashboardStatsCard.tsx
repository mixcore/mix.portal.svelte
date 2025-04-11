import { Button } from '@/components/ui/button';
import { Clock, Layout, Activity } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  actionText: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export function DashboardStatsCard({ 
  title, 
  icon, 
  description, 
  actionText, 
  onAction,
  children 
}: DashboardStatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          {icon}
          {title}
        </h3>
        <Button variant="ghost" size="sm" onClick={onAction}>
          View All
        </Button>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
      {children}
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={onAction} className="w-full">
          {actionText}
        </Button>
      </div>
    </div>
  );
} 
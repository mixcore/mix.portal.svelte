'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  statsCards?: DashboardStatCardProps[];
  activityFeed?: React.ReactNode;
  contentArea?: React.ReactNode;
  quickActions?: DashboardQuickActionProps[];
}

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  href?: string;
  footer?: React.ReactNode;
}

interface DashboardQuickActionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href: string;
  variant?: ButtonProps['variant'];
}

export function DashboardLayout({
  children,
  statsCards,
  activityFeed,
  contentArea,
  quickActions,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards?.map((card, i) => (
          <Card key={i} className={cn("overflow-hidden", card.href && "transition-all hover:shadow-md")}>
            {card.href ? (
              <Link href={card.href} className="block h-full">
                <StatCard {...card} />
              </Link>
            ) : (
              <StatCard {...card} />
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Main content area - takes up 5/7 on larger screens */}
        <div className="md:col-span-5 space-y-4">
          {contentArea}
          {children}
        </div>

        {/* Sidebar - takes up 2/7 on larger screens */}
        <div className="md:col-span-2 space-y-4">
          {quickActions && quickActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center p-3 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    {action.icon}
                    <div className="ml-3">
                      <div className="font-medium">{action.title}</div>
                      {action.description && (
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {activityFeed && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>{activityFeed}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  change,
  footer,
}: DashboardStatCardProps) {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {change && (
          <div className="flex items-center mt-1">
            {change.positive ? (
              <Icons.chevronUp className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <Icons.chevronDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                change.positive ? "text-green-500" : "text-red-500"
              )}
            >
              {change.value}
            </span>
          </div>
        )}
        {footer && <div className="mt-2 pt-2 border-t">{footer}</div>}
      </CardContent>
    </>
  );
} 
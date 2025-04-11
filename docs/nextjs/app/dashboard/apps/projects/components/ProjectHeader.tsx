import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import ShareProjectLink from './ShareProjectLink';

interface ProjectHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  projectId?: string;
  currentView: string;
  actions?: React.ReactNode;
}

/**
 * Header component for project pages with navigation and sharing capabilities
 */
export function ProjectHeader({
  title,
  showBackButton = false,
  onBack,
  projectId,
  currentView,
  actions,
}: ProjectHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard/apps/projects');
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
            <ArrowLeft size={18} />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {actions}
        
        <ShareProjectLink 
          view={currentView} 
          projectId={projectId} 
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Refresh</DropdownMenuItem>
            {projectId && (
              <>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ProjectHeader; 
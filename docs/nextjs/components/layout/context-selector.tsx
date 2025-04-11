'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useNavigationContext } from '@/providers/navigation-context-provider';
import { cn } from '@/lib/utils';
import { HelpCircle, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';
import { usePathname, useRouter } from 'next/navigation';

export function ContextSelector({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    activeContextId,
    setActiveContextId,
    activePersonaId,
    setActivePersonaId,
    availableContexts,
    availablePersonas
  } = useNavigationContext();

  const activeContext = availableContexts.find((c) => c.id === activeContextId);
  const activePersona = availablePersonas.find((p) => p.id === activePersonaId);

  const handleContextChange = (value: string) => {
    setActiveContextId(value);
  };

  const handlePersonaChange = (value: string) => {
    setActivePersonaId(value);
  };

  const handleAppSettings = () => {
    router.push('/dashboard/settings/app-contexts');
  };

  // If there are no enabled contexts or only one, don't show the selector
  if (!availableContexts.length || availableContexts.length === 1) {
    const singleContext = availableContexts[0];
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {singleContext ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">
              Context:
            </span>
            <Badge variant="outline">{singleContext.name}</Badge>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">
              No app contexts available
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Context:
          </span>
          <Select value={activeContextId || ''} onValueChange={handleContextChange}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Select Context" />
            </SelectTrigger>
            <SelectContent>
              {availableContexts.map((context) => (
                <SelectItem key={context.id} value={context.id}>
                  {context.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeContext?.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{activeContext.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {pathname.includes('/dashboard/settings') && !pathname.includes('/app-contexts') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground"
              onClick={handleAppSettings}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Persona:
          </span>
          <Select
            value={activePersonaId || ''}
            onValueChange={handlePersonaChange}
          >
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Select Persona" />
            </SelectTrigger>
            <SelectContent>
              {availablePersonas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    avatarUrl?: string;
    fullName?: string;
    email?: string;
  };
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  const avatarElement = (
    <Avatar className={className}>
      <AvatarImage src={user?.avatarUrl || ''} alt={user?.fullName || ''} />
      <AvatarFallback className={className ? undefined : 'rounded-lg'}>
        {user?.fullName?.slice(0, 2)?.toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  );

  const userInfoElement = (
    <div className='grid flex-1 text-left text-sm leading-tight'>
      <span className='truncate font-semibold'>{user?.fullName || ''}</span>
      <span className='truncate text-xs'>
        {user?.email || 'email@example.com'}
      </span>
    </div>
  );

  // If showInfo is true, display the avatar and user info
  if (showInfo) {
    return (
      <div className='flex items-center gap-2'>
        {avatarElement}
        {userInfoElement}
      </div>
    );
  }

  // If showInfo is false, display just the avatar with a tooltip showing user info
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-center gap-2'>{avatarElement}</div>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex flex-col gap-1'>
          <span className='font-medium'>{user?.fullName || ''}</span>
          <span className='text-muted-foreground text-xs'>
            {user?.email || 'email@example.com'}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

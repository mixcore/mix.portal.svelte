import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share } from 'lucide-react';
import { copyToClipboard, getDeepLink } from '../lib/utils';

interface ShareProjectLinkProps {
  view: string;
  projectId?: string;
  className?: string;
}

/**
 * Component for sharing deep links to projects or specific views
 */
export function ShareProjectLink({ view, projectId, className = '' }: ShareProjectLinkProps) {
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  
  // Generate the deep link for the current view
  const deepLink = getDeepLink(view, projectId);
  
  // Toggle the link input visibility
  const toggleLinkInput = () => {
    setShowLinkInput(prev => !prev);
  };
  
  // Handle the share button click
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mixcore Projects',
          text: 'Check out this project',
          url: deepLink,
        });
      } catch (error) {
        // Fallback to copy if share API fails or is canceled
        await copyToClipboard(deepLink);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      await copyToClipboard(deepLink);
      toggleLinkInput();
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={handleShare}
      >
        <Share size={16} />
        <span>Share Link</span>
      </Button>
      
      {showLinkInput && (
        <div className="flex items-center mt-2 gap-2">
          <Input 
            value={deepLink}
            readOnly
            className="text-xs"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => copyToClipboard(deepLink)}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
}

export default ShareProjectLink; 
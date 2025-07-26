import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { trackSEOInteraction } from '@/lib/analytics';
import { useToast } from '@/components/ui/use-toast';

interface SocialSharingProps {
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string;
  className?: string;
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  title,
  excerpt,
  url,
  imageUrl,
  className = ''
}) => {
  const { toast } = useToast();

  const handleShare = async (platform: string, shareUrl?: string) => {
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url
        });
        trackSEOInteraction('Article_Share', 'Native', title);
        return;
      } catch (error) {
        // Fall back to copy link
        platform = 'copy';
      }
    }

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
          duration: 3000,
        });
        trackSEOInteraction('Article_Share', 'Copy_Link', title);
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      trackSEOInteraction('Article_Share', platform, title);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=BndBox`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      
      {/* Native Share API (mobile) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('native')}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      )}

      {/* Individual platform buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className="flex items-center gap-2 text-sky-500 hover:bg-sky-50"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        className="flex items-center gap-2 text-blue-700 hover:bg-blue-50"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('copy')}
        className="flex items-center gap-2"
      >
        <LinkIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Copy Link</span>
      </Button>
    </div>
  );
};

export default SocialSharing;
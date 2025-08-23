import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Clock, Send } from 'lucide-react';
import { useFollowUp } from '@/hooks/use-follow-up';

interface Application {
  id: string;
  created_at: string;
  last_follow_up_at?: string | null;
  follow_up_count: number;
  status: string;
}

interface Brand {
  id: string;
  displayName: string;
  response_time?: number;
}

interface FollowUpDialogProps {
  brand: Brand;
  application: Application;
  children: React.ReactNode;
}

const FollowUpDialog = ({ brand, application, children }: FollowUpDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const { 
    sendFollowUp, 
    isSendingFollowUp, 
    getFollowUpType, 
    getDaysSinceApplication,
    getDaysSinceLastActivity
  } = useFollowUp();

  const daysSinceApplication = getDaysSinceApplication(application.created_at);
  const daysSinceLastActivity = getDaysSinceLastActivity(application.created_at, application.last_follow_up_at);
  const followUpType = getFollowUpType(application.follow_up_count);

  const handleSendFollowUp = async () => {
    try {
      await sendFollowUp({
        applicationId: application.id,
        followUpType,
        customMessage: followUpType === 'custom' ? customMessage : undefined,
      });
      setIsOpen(false);
      setCustomMessage('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getFollowUpTypeLabel = (type: string) => {
    switch (type) {
      case 'gentle_reminder': return 'Gentle Reminder';
      case 'second_followup': return 'Second Follow-up';
      case 'final_followup': return 'Final Follow-up';
      case 'custom': return 'Custom Message';
      default: return 'Follow-up';
    }
  };

  const getFollowUpDescription = (type: string) => {
    switch (type) {
      case 'gentle_reminder':
        return 'A polite reminder about your application with professional tone.';
      case 'second_followup':
        return 'A second follow-up showing continued interest while remaining respectful.';
      case 'final_followup':
        return 'A final follow-up message that gives the brand a graceful out.';
      case 'custom':
        return 'Write your own custom follow-up message.';
      default:
        return 'Send a follow-up message to the brand.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Follow-up with {brand.displayName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Timeline */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Application Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Application submitted</span>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {daysSinceApplication} days ago
                </Badge>
              </div>
              {application.last_follow_up_at && (
                <div className="flex items-center justify-between">
                  <span>Last follow-up</span>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {daysSinceLastActivity} days ago
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Follow-ups sent</span>
                <Badge variant="secondary">{application.follow_up_count}/3</Badge>
              </div>
              {brand.response_time && (
                <div className="flex items-center justify-between">
                  <span>Expected response time</span>
                  <Badge variant="outline">{brand.response_time}h</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Follow-up Type */}
          <div>
            <Label className="text-base font-medium">Follow-up Type</Label>
            <div className="mt-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{getFollowUpTypeLabel(followUpType)}</span>
                <Badge variant={followUpType === 'final_followup' ? 'destructive' : 'secondary'}>
                  {followUpType === 'final_followup' ? 'Final' : `${application.follow_up_count + 1} of 3`}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getFollowUpDescription(followUpType)}
              </p>
            </div>
          </div>

          {/* Custom Message for custom type */}
          {followUpType === 'custom' && (
            <div>
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea
                id="customMessage"
                placeholder="Write your custom follow-up message..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="mt-2"
                rows={6}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendFollowUp}
              disabled={isSendingFollowUp || (followUpType === 'custom' && !customMessage.trim())}
            >
              {isSendingFollowUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Follow-up
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowUpDialog;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  type: string;
  status: string;
  unread: boolean;
  full_content?: string;
  sender_id?: string;
  recipient_id?: string;
  brand_application_id?: string;
  email_thread_id?: string;
}

interface MessageDetailDialogProps {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageSent?: () => void;
}

export function MessageDetailDialog({ 
  message, 
  open, 
  onOpenChange,
  onMessageSent 
}: MessageDetailDialogProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!message) return null;

  const handleSendReply = async () => {
    if (!replyContent.trim() || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: message.sender_id,
          content: replyContent,
          brand_application_id: message.brand_application_id,
          email_thread_id: message.email_thread_id,
          message_source: 'internal'
        });

      if (error) throw error;

      toast({
        title: "Reply sent",
        description: "Your message has been sent successfully.",
      });

      setReplyContent("");
      onMessageSent?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Failed to send reply",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{message.subject}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            From: {message.sender} • {message.timestamp}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="whitespace-pre-wrap text-sm">
            {message.full_content || message.preview}
          </div>
        </ScrollArea>

        <div className="space-y-3 pt-4 border-t">
          <label className="text-sm font-medium">Reply</label>
          <Textarea
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              onClick={handleSendReply} 
              disabled={!replyContent.trim() || isSending}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

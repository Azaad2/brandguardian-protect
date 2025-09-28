import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, CheckCircle, X, List, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackSEOInteraction } from '@/lib/analytics';

// Simplified schema - only email required
const leadMagnetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SimpleLeadMagnetForm = {
  email: string;
};

interface LeadMagnetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotInterested: () => void;
  onConverted: () => void;
}

const LeadMagnetDialog = ({ open, onOpenChange, onNotInterested, onConverted }: LeadMagnetDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<SimpleLeadMagnetForm>({
    resolver: zodResolver(leadMagnetSchema),
  });

  const handleSubmit = async (data: SimpleLeadMagnetForm) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Store lead in database with email only
      const { error: dbError } = await supabase
        .from('lead_magnets')
        .insert({
          name: 'Lead Magnet Subscriber', // Default name
          email: data.email,
          magnet_type: 'amazon_ungated_brands'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save lead information');
      }

      // Call edge function to send download link
      const { data: downloadData, error: functionError } = await supabase.functions
        .invoke('send-lead-magnet', {
          body: {
            email: data.email,
            magnetType: 'amazon_ungated_brands'
          }
        });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error('Failed to send download link');
      }

      setIsSuccess(true);
      onConverted(); // Mark user as converted to prevent popup from showing again
      trackSEOInteraction('LeadMagnet_Popup', 'Submit', 'Success');
      
      toast({
        title: "Success! Check your email",
        description: "We've sent you the download link for the Amazon Auto-Ungated Brands list.",
      });

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);

    } catch (error) {
      console.error('Lead magnet submission error:', error);
      trackSEOInteraction('LeadMagnet_Popup', 'Submit', 'Error');
      
      toast({
        title: "Submission failed",
        description: "There was a problem processing your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    trackSEOInteraction('LeadMagnet_Popup', 'Close', 'X_Button');
    onOpenChange(false);
  };

  const handleNotInterested = () => {
    trackSEOInteraction('LeadMagnet_Popup', 'Dismiss', 'Not_Interested');
    onNotInterested();
    onOpenChange(false);
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <div className="text-center p-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Check Your Email!
            </h3>
            <p className="text-gray-600 mb-4">
              We've sent you the <strong>Amazon Auto-Ungated Brands List</strong>. 
              Check your inbox and spam folder.
            </p>
            <p className="text-sm text-gray-500">
              This dialog will close automatically in a few seconds...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
            <List className="w-8 h-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              FREE Auto-Ungated Brands List
            </span>
          </DialogTitle>
          <DialogDescription className="text-base mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-green-600" />
                Skip weeks of research - Get 100+ verified brands instantly
              </div>
              <div className="text-sm text-muted-foreground">
                Ready-to-use brand list that don't require ungating applications
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border">
          <div className="text-center space-y-2">
            <div className="text-sm font-medium text-foreground">What you'll get:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>✓ 100+ Auto-approved brands</div>
              <div>✓ Contact information</div>
              <div>✓ Product categories</div>
              <div>✓ Instant download</div>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              {...form.register('email')}
              className="h-12 text-base border-2 border-border focus:border-primary transition-colors"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1 text-center">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all" 
              disabled={isSubmitting}
            >
              <Download className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Sending to your email...' : 'Get My Free List Now'}
            </Button>
            
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNotInterested}
              className="w-full text-muted-foreground hover:text-foreground text-xs"
            >
              No thanks, I'll research myself
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadMagnetDialog;
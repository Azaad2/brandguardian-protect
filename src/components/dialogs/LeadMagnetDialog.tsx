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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, CheckCircle, X, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { LeadMagnetFormValues } from '@/types/leadMagnet';
import { trackSEOInteraction } from '@/lib/analytics';

const leadMagnetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  businessType: z.string().optional(),
});

interface LeadMagnetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotInterested: () => void;
}

const LeadMagnetDialog = ({ open, onOpenChange, onNotInterested }: LeadMagnetDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadMagnetFormValues>({
    resolver: zodResolver(leadMagnetSchema),
  });

  const handleSubmit = async (data: LeadMagnetFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Store lead in database
      const { error: dbError } = await supabase
        .from('lead_magnets')
        .insert({
          name: data.name,
          email: data.email,
          business_type: data.businessType,
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
            name: data.name,
            magnetType: 'amazon_ungated_brands'
          }
        });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error('Failed to send download link');
      }

      setIsSuccess(true);
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

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-primary" />
            FREE Amazon Auto-Ungated Brands List
          </DialogTitle>
          <DialogDescription>
            Save hours of research! Get 100+ brands that don't require ungating applications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="popup-name">Full Name*</Label>
            <Input
              id="popup-name"
              placeholder="Your full name"
              {...form.register('name')}
              className="mt-1"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="popup-email">Email Address*</Label>
            <Input
              id="popup-email"
              type="email"
              placeholder="your@email.com"
              {...form.register('email')}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="popup-business">Business Type</Label>
            <Select onValueChange={(value) => form.setValue('businessType', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_seller">New Amazon Seller</SelectItem>
                <SelectItem value="experienced_seller">Experienced Seller</SelectItem>
                <SelectItem value="agency">Agency/Service Provider</SelectItem>
                <SelectItem value="brand_owner">Brand Owner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Sending...' : 'Get FREE List Now'}
            </Button>
            
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNotInterested}
              className="text-muted-foreground hover:text-foreground"
            >
              Not interested
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadMagnetDialog;
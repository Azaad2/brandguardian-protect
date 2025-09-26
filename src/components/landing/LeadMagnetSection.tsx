import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, Users, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { LeadMagnetFormValues } from '@/types/leadMagnet';

const leadMagnetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  businessType: z.string().optional(),
});

const LeadMagnetSection = () => {
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
      toast({
        title: "Success! Check your email",
        description: "We've sent you the download link for the Amazon Auto-Ungated Brands list.",
      });

    } catch (error) {
      console.error('Lead magnet submission error:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem processing your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-20 gradient-bg px-4" id="lead-magnet">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Success! Check Your Email
                </h3>
                <p className="text-gray-600 mb-6">
                  We've sent you the download link for the <strong>Amazon Auto-Ungated Brands List</strong>. 
                  Check your inbox (and spam folder) for the email with your free resource.
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive it? Contact us at help@bndbox.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 gradient-bg px-4" id="lead-magnet">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Your FREE List of Amazon Auto-Ungated Brands
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Save hours of research with our exclusive list of 100+ Amazon brands that are automatically ungated for wholesale sellers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Save Time & Research</h3>
                  <p className="text-white/80">Skip hours of manual research. Get instant access to brands that don't require ungating applications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Selling Faster</h3>
                  <p className="text-white/80">Begin wholesaling immediately with brands that welcome new sellers without barriers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Trusted by 500+ Sellers</h3>
                  <p className="text-white/80">Join hundreds of successful Amazon wholesalers who use this list to find profitable opportunities.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="bg-white shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-gray-900">
                  <Download className="w-6 h-6" />
                  <span>Download FREE List</span>
                </CardTitle>
                <CardDescription>
                  Enter your details below to get instant access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name*</Label>
                    <Input
                      id="name"
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
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="businessType">Business Type (Optional)</Label>
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

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Get FREE List Now'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
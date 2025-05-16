import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formSchema, FormValues } from './ResellerFormSchema';
import BusinessInformationSection from './BusinessInformationSection';
import MarketplaceProfilesSection from './MarketplaceProfilesSection';
import SalesPerformanceSection from './SalesPerformanceSection';
import ContactInformationSection from './ContactInformationSection';
import TermsAgreementSection from './TermsAgreementSection';
import VerificationProcessSection from './VerificationProcessSection';
import { useAuth } from '@/hooks/use-auth';

interface ResellerApplicationFormProps {
  onSubmissionSuccess: (email: string) => void;
}

declare global {
  interface Window {
    rdt?: (event: string, type?: string, ...args: any[]) => void;
  }
}

const ResellerApplicationForm = ({ onSubmissionSuccess }: ResellerApplicationFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      businessType: 'individual',
      einNumber: '',
      amazonSellerId: '',
      walmartSellerId: '',
      ebaySellerId: '',
      productCategories: ['other'], // Default value for product categories
      salesVolume: 'under_10k',
      wholesaleBudget: 'under_5k',
      feedbackScore: '',
      email: '',
      phone: '',
      linkedIn: '',
      termsAgreement: false,
    },
  });

  const trackRedditPixelConversion = () => {
    // Track form submission with Reddit Pixel - Updated implementation
    if (typeof window !== 'undefined' && window.rdt) {
      try {
        window.rdt('track', 'Lead');
        console.log('Reddit Pixel: Lead event tracked in form submission');
      } catch (error) {
        console.error('Reddit Pixel tracking error in form:', error);
      }
    } else {
      console.warn('Reddit Pixel not available in form submission');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(false);
    
    try {
      console.log('Form submission values:', values);
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('reseller_applications')
        .insert({
          user_id: user?.id, // Link to user if authenticated
          company_name: values.companyName,
          business_type: values.businessType,
          ein_number: values.einNumber,
          amazon_seller_id: values.amazonSellerId,
          walmart_seller_id: values.walmartSellerId,
          ebay_seller_id: values.ebaySellerId,
          product_categories: values.productCategories, // Using the default value
          sales_volume: values.salesVolume,
          wholesale_budget: values.wholesaleBudget,
          feedback_score: values.feedbackScore || '',
          email: values.email,
          phone: values.phone,
          linkedin: values.linkedIn || '',
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Application submitted successfully:', data);
      
      // Upload reseller document if provided
      if (documentFile && user) {
        const fileExt = documentFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `reseller_documents/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, documentFile);
          
        if (uploadError) {
          console.error('Document upload error:', uploadError);
          // Continue with form submission even if document upload fails
        }
      }
      
      // Track successful form submission with Reddit Pixel
      trackRedditPixelConversion();
      
      toast({
        title: "Application submitted!",
        description: "We'll review your information and contact you soon.",
      });
      
      onSubmissionSuccess(values.email);
      form.reset();
      setDocumentFile(null);
    } catch (error) {
      console.error('Error in form submission:', error);
      setSubmissionError(true);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem with your submission. Please try again or contact us directly at help@bndbox.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Verified Reseller with BndBox</h2>
      <p className="text-gray-600 mb-8">
        Partner with top brands and expand your sales channels on Amazon, Walmart, and eBay.
      </p>
      
      {submissionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Submission failed</AlertTitle>
          <AlertDescription>
            There was a problem with your submission. Please try again or contact us directly at help@bndbox.com.
          </AlertDescription>
        </Alert>
      )}
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <BusinessInformationSection 
              documentFile={documentFile} 
              setDocumentFile={setDocumentFile} 
            />
            
            <MarketplaceProfilesSection />
            
            <SalesPerformanceSection />
            
            <ContactInformationSection />
            
            <TermsAgreementSection />
            
            <VerificationProcessSection />
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Your Application Now"}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Join our network today and start growing your sales with trusted brands.
              </p>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default ResellerApplicationForm;


import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResellerFormSubmission } from './hooks/useResellerFormSubmission';
import { formSchema, FormValues } from './ResellerFormSchema';
import BusinessInformationSection from './BusinessInformationSection';
import MarketplaceProfilesSection from './MarketplaceProfilesSection';
import SalesPerformanceSection from './SalesPerformanceSection';
import ContactInformationSection from './ContactInformationSection';
import TermsAgreementSection from './TermsAgreementSection';
import VerificationProcessSection from './VerificationProcessSection';

interface ResellerApplicationFormProps {
  onSubmissionSuccess: (email: string) => void;
}

declare global {
  interface Window {
    rdt?: (event: string, type?: string, ...args: any[]) => void;
  }
}

const ResellerApplicationForm = ({ onSubmissionSuccess }: ResellerApplicationFormProps) => {
  const { 
    isSubmitting, 
    submissionError, 
    documentFile,
    documentError, 
    setDocumentFile,
    handleSubmit: submitForm,
    handleDocumentUploadComplete
  } = useResellerFormSubmission({ 
    documentFile: null,
    documentPath: null,
    onSubmissionSuccess 
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      businessType: 'individual',
      einNumber: '',
      amazonStoreLink: '',
      walmartStoreLink: '',
      ebayStoreLink: '',
      productCategories: ['other'],
      salesVolume: 'under_10k',
      wholesaleBudget: 'under_5k',
      feedbackScore: '',
      email: '',
      phone: '',
      linkedIn: '',
      termsAgreement: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    
    // Additional validation for document
    if (!documentFile) {
      form.setError('root', {
        message: 'Please upload a verification document before submitting.'
      });
      return;
    }

    const success = await submitForm(values);
    if (success) {
      form.reset();
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
            {submissionError}
          </AlertDescription>
        </Alert>
      )}

      {documentError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Document Required</AlertTitle>
          <AlertDescription>
            {documentError}
          </AlertDescription>
        </Alert>
      )}

      {form.formState.errors.root && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      )}
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BusinessInformationSection 
              documentFile={documentFile} 
              setDocumentFile={setDocumentFile}
              documentError={documentError}
              onDocumentUploadComplete={handleDocumentUploadComplete}
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

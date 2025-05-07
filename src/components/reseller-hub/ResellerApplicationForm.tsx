import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductCategory } from '@/types/reseller';
import { ResellerSubmission } from '@/types/resellerSubmission';
import { sendEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { formSchema, FormValues } from './ResellerFormSchema';
import BusinessInformationSection from './BusinessInformationSection';
import MarketplaceProfilesSection from './MarketplaceProfilesSection';
import ProductCategoriesSection from './ProductCategoriesSection';
import SalesPerformanceSection from './SalesPerformanceSection';
import ContactInformationSection from './ContactInformationSection';
import TermsAgreementSection from './TermsAgreementSection';
import VerificationProcessSection from './VerificationProcessSection';

interface ResellerApplicationFormProps {
  onSubmissionSuccess: (email: string) => void;
}

const ResellerApplicationForm = ({ onSubmissionSuccess }: ResellerApplicationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
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
      productCategories: [],
      salesVolume: 'under_10k',
      wholesaleBudget: 'under_5k',
      feedbackScore: '',
      email: '',
      phone: '',
      linkedIn: '',
      termsAgreement: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(false);
    
    try {
      console.log('Form submission values:', values);
      console.log('Document file:', documentFile);
      
      const submission: ResellerSubmission = {
        companyName: values.companyName,
        businessType: values.businessType,
        einNumber: values.einNumber,
        productCategories: values.productCategories,
        salesVolume: values.salesVolume,
        wholesaleBudget: values.wholesaleBudget,
        email: values.email,
        phone: values.phone,
        termsAgreement: values.termsAgreement,
        
        amazonSellerId: values.amazonSellerId || '',
        walmartSellerId: values.walmartSellerId || '',
        ebaySellerId: values.ebaySellerId || '',
        feedbackScore: values.feedbackScore || '',
        linkedIn: values.linkedIn || '',
        
        id: `RESELLER-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      console.log('Sending email with submission data:', submission);
      
      // Add delay to ensure form data is properly processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const emailSent = await sendEmail(submission);
      
      if (!emailSent) {
        console.error('Email failed to send');
        setSubmissionError(true);
        throw new Error("Failed to send email");
      }
      
      console.log('Email sent successfully');
      toast({
        title: "Application submitted!",
        description: "We'll review your information and contact you soon.",
      });
      
      onSubmissionSuccess(values.email);
      form.reset();
      setSelectedCategories([]);
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

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      form.setValue('productCategories', newSelection);
      return newSelection;
    });
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
            
            <ProductCategoriesSection 
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
            
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

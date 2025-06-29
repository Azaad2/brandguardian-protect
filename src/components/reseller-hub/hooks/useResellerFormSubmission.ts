
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FormValues } from '../ResellerFormSchema';

interface UseResellerFormSubmissionProps {
  onSubmissionSuccess: (email: string) => void;
}

export const useResellerFormSubmission = ({ onSubmissionSuccess }: UseResellerFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentPath, setDocumentPath] = useState<string | null>(null);

  const handleDocumentUploadComplete = (filePath: string) => {
    setDocumentPath(filePath);
    setDocumentError(null);
  };

  const handleSubmit = async (values: FormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      setDocumentError(null);

      // Validate document upload
      if (!documentFile || !documentPath) {
        setDocumentError('Please upload a verification document before submitting.');
        return false;
      }

      console.log('🎯 Submitting reseller application with document path:', documentPath);

      const applicationData = {
        company_name: values.companyName,
        business_type: values.businessType,
        ein_number: values.einNumber,
        amazon_seller_id: values.amazonStoreLink || null,
        walmart_seller_id: values.walmartStoreLink || null,
        ebay_seller_id: values.ebayStoreLink || null,
        product_categories: values.productCategories,
        sales_volume: values.salesVolume,
        wholesale_budget: values.wholesaleBudget,
        feedback_score: values.feedbackScore || null,
        email: values.email,
        phone: values.phone,
        linkedin: values.linkedIn || null,
        document_path: documentPath, // Include the uploaded document path
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('reseller_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error submitting application:', error);
        throw error;
      }

      console.log('✅ Application submitted successfully:', data);

      toast({
        title: "Application Submitted Successfully! 🎉",
        description: "Thank you for your application. Our team will review it and get back to you within 1-2 business days.",
        duration: 8000,
      });

      // Reset form state
      setDocumentFile(null);
      setDocumentPath(null);
      
      // Call success callback
      onSubmissionSuccess(values.email);
      
      return true;

    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      setSubmissionError(error.message || 'Failed to submit application');
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        duration: 5000,
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submissionError,
    documentFile,
    documentError,
    setDocumentFile,
    handleSubmit,
    handleDocumentUploadComplete
  };
};

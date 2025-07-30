import { useState } from 'react';
import { FormValues } from '../ResellerFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { trackRedditPixelConversion } from '../utils/formSubmissionHandlers';

export interface UseResellerFormSubmissionProps {
  documentFile: File | null;
  documentPath: string | null;
  onSubmissionSuccess: (email: string) => void;
}

export const useResellerFormSubmission = ({ 
  documentFile, 
  documentPath, 
  onSubmissionSuccess 
}: UseResellerFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [documentFileState, setDocumentFile] = useState<File | null>(documentFile);
  const [documentPathState, setDocumentPath] = useState<string | null>(documentPath);

  const resetErrors = () => {
    setSubmissionError(null);
    setDocumentError(null);
  };

  const handleSubmit = async (values: FormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      setDocumentError(null);

      // Validate document upload
      if (!documentFileState || !documentPathState) {
        setDocumentError('Please upload a verification document before submitting.');
        return false;
      }

      // Get current user (might be null for anonymous users)
      const { data: { user } } = await supabase.auth.getUser();

      // Prepare application data with proper types and null handling
      const applicationData = {
        company_name: values.companyName,
        business_type: values.businessType,
        ein_number: values.einNumber,
        amazon_seller_id: values.amazonStoreLink,
        walmart_seller_id: values.walmartStoreLink || null,
        ebay_seller_id: values.ebayStoreLink || null,
        product_categories: values.productCategories,
        sales_volume: values.salesVolume,
        wholesale_budget: values.wholesaleBudget,
        feedback_score: values.feedbackScore || null,
        email: values.email,
        phone: values.phone,
        linkedin: values.linkedIn || null,
        document_path: documentPathState,
        status: 'pending' as const,
        user_id: user?.id || null
      };

      // Insert the application
      const { data, error } = await supabase
        .from('reseller_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        if (error.code === '42501') {
          throw new Error('Permission denied. Please try again or contact support.');
        }
        throw error;
      }

      // Track conversion
      trackRedditPixelConversion();

      toast({
        title: 'Application Submitted!',
        description: 'Thank you for your application. We will review it and get back to you within 24 hours.',
      });

      onSubmissionSuccess(values.email);
      return true;

    } catch (error: any) {
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      setSubmissionError(errorMessage);
      
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUploadComplete = (path: string) => {
    setDocumentPath(path);
  };

  return {
    handleSubmit,
    isSubmitting,
    submissionError,
    documentError,
    resetErrors,
    documentFile: documentFileState,
    setDocumentFile,
    handleDocumentUploadComplete,
  };
};
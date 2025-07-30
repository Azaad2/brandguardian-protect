
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

      console.log('Starting form submission with values:', values);
      console.log('Document file:', documentFile);
      console.log('Document path:', documentPath);

      // Validate document upload
      if (!documentFile || !documentPath) {
        setDocumentError('Please upload a verification document before submitting.');
        console.error('Document validation failed - missing file or path');
        return false;
      }

      // Get current user (might be null for anonymous users)
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id || 'anonymous');

      // Prepare application data with proper types and null handling
      const applicationData = {
        company_name: values.companyName,
        business_type: values.businessType,
        ein_number: values.einNumber,
        amazon_seller_id: values.amazonStoreLink,
        walmart_seller_id: values.walmartStoreLink || null,
        ebay_seller_id: values.ebayStoreLink || null,
        product_categories: values.productCategories || ['other'],
        sales_volume: values.salesVolume,
        wholesale_budget: values.wholesaleBudget,
        feedback_score: values.feedbackScore || null,
        email: values.email,
        phone: values.phone,
        linkedin: values.linkedIn || null,
        document_path: documentPath,
        status: 'pending',
        user_id: user?.id || null // Allow null for anonymous users
      };

      console.log('Prepared application data:', applicationData);

      const { data, error } = await supabase
        .from('reseller_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Database insertion error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
          throw new Error('A reseller application with this email already exists. Please use a different email address.');
        }
        
        if (error.message?.includes('violates row-level security')) {
          throw new Error('Permission denied. Please try again or contact support.');
        }

        if (error.message?.includes('violates not-null constraint')) {
          throw new Error('Missing required information. Please check all fields are filled correctly.');
        }
        
        throw new Error(`Database error: ${error.message} (${error.code})`);
      }

      console.log('Application submitted successfully:', data);

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
      console.error('Form submission error:', error);
      setSubmissionError(error.message || 'Failed to submit application');
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
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

import { useState } from 'react';
import { FormValues } from '../ResellerFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { trackRedditPixelConversion } from '../utils/formSubmissionHandlers';
import { sendEmail } from '@/utils/email';
import type { ResellerSubmission } from '@/types/resellerSubmission';

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
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const resetErrors = () => {
    setSubmissionError(null);
    setDocumentError(null);
  };

  const handleSubmit = async (values: FormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      setDocumentError(null);

      console.log('Form submission started', { 
        hasDocumentFile: !!documentFileState, 
        documentPath: documentPathState,
        formValues: values 
      });

      // Validate document upload - check for both file and upload completion
      if (!documentFileState) {
        setDocumentError('Please upload a verification document before submitting.');
        return false;
      }

      // Check if upload is still in progress
      if (uploadInProgress) {
        setDocumentError('Document upload is still in progress. Please wait for the upload to complete.');
        return false;
      }

      // If we have a file but no path, the upload failed or hasn't completed
      if (!documentPathState) {
        setDocumentError('Document upload failed or is incomplete. Please try uploading your document again.');
        return false;
      }

      // Get current user (might be null for anonymous users)
      const { data: { user } } = await supabase.auth.getUser();

      console.log('Form submission - raw auth response:', { 
        user: user, 
        userId: user?.id, 
        userIdType: typeof user?.id 
      });

      // Force clear any corrupted auth state and ensure user_id is always null for anonymous users
      let validUserId: string | null = null;
      
      // Only accept valid UUIDs, reject everything else including "anonymous", undefined, etc.
      if (user?.id && typeof user.id === 'string') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(user.id)) {
          validUserId = user.id;
        } else {
          console.warn('Invalid user ID detected, forcing to null:', user.id);
          // Clear any corrupted session
          await supabase.auth.signOut();
        }
      }

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
        user_id: validUserId
      };

      console.log('Application data prepared:', { 
        user_id: applicationData.user_id, 
        user_id_type: typeof applicationData.user_id 
      });

      // Insert the application
      const { error } = await supabase
        .from('reseller_applications')
        .insert([applicationData]);

      if (error) {
        console.error('Database submission error:', error);
        
        // Handle specific database errors with helpful messages
        if (error.code === '42501') {
          throw new Error('Permission denied. Please contact us at help@bndbox.com with your application details.');
        }
        
        if (error.message?.includes('invalid input syntax for type uuid')) {
          throw new Error('Technical error occurred. Please contact help@bndbox.com with your application details and we will process it manually.');
        }
        
        if (error.message?.includes('violates row-level security')) {
          throw new Error('Authentication error. Please contact help@bndbox.com with your application details and we will process it manually.');
        }
        
        // Generic database error
        throw new Error(`Submission failed. Please contact help@bndbox.com with your application details. Error: ${error.message}`);
      }

      // Track conversion
      trackRedditPixelConversion();

      // Send email notification (non-blocking)
      try {
        const resellerSubmission: ResellerSubmission = {
          id: crypto.randomUUID(), // Generate a temporary ID for email
          createdAt: new Date().toISOString(),
          status: 'pending' as const,
          companyName: values.companyName,
          businessType: values.businessType,
          einNumber: values.einNumber,
          amazonStoreLink: values.amazonStoreLink,
          walmartStoreLink: values.walmartStoreLink,
          ebayStoreLink: values.ebayStoreLink,
          productCategories: values.productCategories,
          salesVolume: values.salesVolume,
          wholesaleBudget: values.wholesaleBudget,
          feedbackScore: values.feedbackScore,
          email: values.email,
          phone: values.phone,
          linkedIn: values.linkedIn,
          termsAgreement: values.termsAgreement
        };

        const emailSent = await sendEmail(resellerSubmission);
        if (emailSent) {
          console.log('Email notification sent successfully to help@bndbox.com');
        } else {
          console.warn('Email delivery may have failed - check Formspree configuration');
          // Still show success to user since database submission worked
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't block the form submission if email fails, but log it clearly
        console.warn('Email service error - form was saved but notification may not have been sent');
      }

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
    console.log('Document upload completed', { path });
    setDocumentPath(path);
    setDocumentError(null); // Clear any previous document errors
    setUploadInProgress(false); // Mark upload as complete
  };

  const handleDocumentUploadStart = () => {
    console.log('Document upload started');
    setUploadInProgress(true);
    setDocumentError(null);
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
    handleDocumentUploadStart,
    uploadInProgress,
  };
};
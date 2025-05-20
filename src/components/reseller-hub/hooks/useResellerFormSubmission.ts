
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { FormValues } from '../ResellerFormSchema';
import { 
  trackRedditPixelConversion,
  sendFormWithoutDocument,
  submitApplication,
  uploadDocument,
  sendApplicationEmail
} from '../utils/formSubmissionHandlers';

type FormSubmissionProps = {
  onSubmissionSuccess: (email: string) => void;
};

export const useResellerFormSubmission = ({ onSubmissionSuccess }: FormSubmissionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(false);
    
    try {
      // Submit application to Supabase
      const data = await submitApplication(values, user);
      
      // Upload reseller document if provided
      if (documentFile && user) {
        try {
          await uploadDocument(documentFile, user.id);
          console.log('Document uploaded successfully');
          // Do not attempt to send file via Formspree as it's not supported
        } catch (uploadError) {
          console.error('Document handling error:', uploadError);
          // Continue with form submission even if document upload fails
          toast({
            variant: "default", // Changed from "warning" to "default" to fix the type error
            title: "Document upload issue",
            description: "Your application was submitted, but there was an issue with the document upload. You can contact support to provide your documents later.",
          });
        }
      }
      
      // Always send application through Formspree without document
      await sendFormWithoutDocument(values);
      
      // Also send via standard email utility
      try {
        await sendApplicationEmail(data, values);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Email sending is non-critical, continue with success path
      }
      
      // Track successful form submission with Reddit Pixel
      trackRedditPixelConversion();
      
      toast({
        title: "Application submitted!",
        description: "We'll review your information and contact you soon.",
      });
      
      onSubmissionSuccess(values.email);
      setDocumentFile(null);
      return true;
    } catch (error) {
      console.error('Error in form submission:', error);
      setSubmissionError(true);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem with your submission. Please try again or contact us directly at help@bndbox.com.",
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
    setDocumentFile,
    handleSubmit
  };
};

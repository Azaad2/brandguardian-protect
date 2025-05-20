
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { FormValues } from '../ResellerFormSchema';
import { 
  trackRedditPixelConversion,
  sendFormWithDocument,
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
          
          // Also send document through Formspree
          const formspreeSubmission = await sendFormWithDocument(values, documentFile);
          if (!formspreeSubmission) {
            console.warn('Formspree submission may have issues with the document');
          }
        } catch (uploadError) {
          console.error('Document handling error:', uploadError);
          // Continue with form submission even if document upload fails
        }
      } else {
        // Send form without document through regular email utility
        await sendApplicationEmail(data, values);
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

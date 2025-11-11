import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';
import { sendEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ContactSubmission): Promise<boolean> => {
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      // Ensure we have a timestamp
      if (!data.createdAt) {
        data.createdAt = new Date().toISOString();
      }
      
      // Attempt to send the email
      const success = await sendEmail(data);
      
      if (success) {
        toast({
          title: "Message sent successfully!",
          description: "We'll be in touch with you shortly.",
        });
        return true;
      } else {
        toast({
          title: "Submission error",
          description: "There was a problem sending your message. Please try again or contact us directly at help@bndbox.com",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Submission error",
        description: "There was a problem sending your message. Please contact us directly at help@bndbox.com",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-20 bg-gray-50 px-4" id="contact">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ready to connect brands with authorized resellers? Let's discuss how BndBox can help your business grow.
          </p>
        </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <InfoPanel />
              <div className="p-8 md:p-12">
                <ContactForm onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default ContactSection;
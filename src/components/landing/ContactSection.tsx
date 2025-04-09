
import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';
import { sendEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();

  const handleSubmission = async (submission: ContactSubmission): Promise<boolean> => {
    try {
      console.log('Starting form submission:', submission);
      
      // Send email to help@bndbox.com
      const emailSent = await sendEmail(submission);
      
      if (!emailSent) {
        console.error('Email failed to send');
        throw new Error("Failed to send email");
      }
      
      console.log('Form submitted successfully:', submission.id);
      toast({
        title: "Form Submitted Successfully",
        description: "We've received your information and will be in touch shortly.",
      });
      return true;
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Email Delivery Failed",
        description: "We couldn't send your information. Please try again or contact us directly at help@bndbox.com.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <section className="py-20 gradient-bg px-4" id="contact">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <InfoPanel />
            <div className="p-8 md:p-12">
              <ContactForm onSubmit={handleSubmission} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

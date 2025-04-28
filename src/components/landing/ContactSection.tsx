
import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';
import { sendEmail } from '@/utils/email';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();

  const handleSubmit = async (data: ContactSubmission): Promise<boolean> => {
    try {
      console.log('ContactSection: sending email with data:', data);
      
      // Attempt to send the email
      const success = await sendEmail(data);
      console.log('ContactSection: email send result:', success);
      
      if (success) {
        toast({
          title: "Message sent successfully!",
          description: "We'll be in touch with you shortly.",
        });
      } else {
        toast({
          title: "Submission error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error sending contact form:', error);
      
      toast({
        title: "Submission error",
        description: "There was a problem sending your message. Please contact us directly at help@bndbox.com",
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
              <ContactForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';
import { sendEmail } from '@/utils/email';

const ContactSection = () => {
  const handleSubmit = async (data: ContactSubmission): Promise<boolean> => {
    try {
      const success = await sendEmail(data);
      return success;
    } catch (error) {
      console.error('Error sending contact form:', error);
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

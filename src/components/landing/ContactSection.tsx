
import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';

const ContactSection = () => {
  const handleSubmission = (submission: ContactSubmission) => {
    // This is a hook for any additional processing needed when a form is submitted
    // Currently, the form component handles all the necessary logic
    console.log('Form submitted:', submission.id);
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

export type { ContactSubmission };
export default ContactSection;

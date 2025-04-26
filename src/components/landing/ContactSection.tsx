
import { ContactForm } from './contact/ContactForm';
import { InfoPanel } from './contact/InfoPanel';
import type { ContactSubmission } from '@/types/contact';

const ContactSection = () => {
  return (
    <section className="py-20 gradient-bg px-4" id="contact">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <InfoPanel />
            <div className="p-8 md:p-12">
              {/* The ContactForm now handles email sending directly */}
              <ContactForm onSubmit={async () => true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

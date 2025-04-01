
import { ContactSectionFeatures } from './ContactSectionFeatures';
import { ContactSectionTestimonial } from './ContactSectionTestimonial';

export const InfoPanel = () => {
  return (
    <div className="p-8 md:p-12 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Protect Your Brand?</h2>
      <p className="text-gray-600 mb-8">
        Join our exclusive beta program and be among the first to experience comprehensive brand protection on Amazon.
      </p>
      
      <ContactSectionFeatures />
      <ContactSectionTestimonial />
    </div>
  );
};

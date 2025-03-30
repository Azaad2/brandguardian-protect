
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestimonialCard = ({ quote, author, company }: { quote: string, author: string, company: string }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="inline-block w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        <p className="text-gray-700 italic mb-6 flex-grow">&quot;{quote}&quot;</p>
        
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const CompanyLogo = ({ name }: { name: string }) => {
  return (
    <div className="py-3 px-6 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-14">
      <span className="text-gray-400 font-medium">{name}</span>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "After implementing BrandGuardian, unauthorized listings dropped by 80% and our authentic reseller sales increased by 35%. We finally have control over our brand on Amazon.",
      author: "Sarah Johnson",
      company: "Brand Protection Manager, BeautyTech Inc."
    },
    {
      quote: "BrandGuardian's automated monitoring saved us countless hours and significantly reduced counterfeit versions of our products. Customer satisfaction has never been higher.",
      author: "Mark Reynolds",
      company: "Director of E-commerce, GadgetWorld"
    },
    {
      quote: "The reseller vetting process has been a game-changer. We now work with trusted partners who maintain our pricing standards and brand image.",
      author: "Jennifer Chen",
      company: "VP of Sales, NatureCare Products"
    }
  ];
  
  const companies = [
    "NatureCare", "TechNova", "FitLife", "HomeEssentials", 
    "PetJoy", "UrbanStyle", "GourmetBasics", "OutdoorPro"
  ];

  return (
    <section className="py-20 bg-white px-4" id="testimonials">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Trusted by Leading Brands
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of brands who have regained control of their Amazon presence
            and increased authentic sales.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              company={testimonial.company}
            />
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {companies.map((company, index) => (
              <CompanyLogo key={index} name={company} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

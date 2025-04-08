
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

const CompanyLogo = ({ name, platform }: { name: string, platform?: string }) => {
  const getBgColor = () => {
    switch (platform) {
      case 'amazon':
        return 'border-blue-200 bg-blue-50';
      case 'walmart':
        return 'border-blue-200 bg-blue-50';
      case 'ebay':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-100 bg-white';
    }
  };
  
  return (
    <div className={`py-3 px-6 rounded-lg shadow-sm flex items-center justify-center h-14 border ${getBgColor()}`}>
      <span className="text-gray-600 font-medium">{name}</span>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "We expanded to Walmart and eBay without worrying about unauthorized sellers. BndBox gave us control and peace of mind.",
      author: "Sarah Johnson",
      company: "E-commerce Director, Home & Kitchen Brand"
    },
    {
      quote: "The reseller vetting process saved us from countless compliance headaches. Our sales are up 42% across all marketplaces.",
      author: "Mark Reynolds",
      company: "VP of Sales, Consumer Electronics"
    },
    {
      quote: "Finding quality resellers used to take months. Now we can expand to new platforms with confidence in just weeks.",
      author: "Jennifer Chen",
      company: "Brand Manager, Fitness Equipment"
    }
  ];
  
  const companies = [
    { name: "HomeEssentials", platform: "amazon" },
    { name: "TechWorld", platform: "walmart" },
    { name: "FitGear", platform: "ebay" },
    { name: "PetJoy", platform: "amazon" },
    { name: "KitchenPro", platform: "walmart" },
    { name: "OutdoorLiving", platform: "ebay" },
    { name: "BeautyBrand", platform: "amazon" },
    { name: "GardenTools", platform: "walmart" }
  ];

  return (
    <section className="py-20 bg-white px-4" id="testimonials">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Brands Growing Safely with BndBox
          </h2>
          <p className="text-lg text-gray-600">
            See how brands are expanding their presence across multiple marketplaces
            while protecting their reputation.
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
              <CompanyLogo key={index} name={company.name} platform={company.platform} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

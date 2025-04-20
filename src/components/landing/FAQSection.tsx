
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "What is the brand wholesale approval process?",
      answer: "The brand wholesale approval process is a vetting procedure that brands use to authorize resellers to sell their products on marketplaces like Amazon, Walmart, and eBay. BndBox streamlines this process by connecting brands with pre-vetted resellers who meet their standards for representation and pricing policies."
    },
    {
      question: "How does BndBox help with reseller application process?",
      answer: "BndBox simplifies the reseller application process by providing a centralized platform where resellers can apply to multiple brands and brands can efficiently review applications. We validate reseller credentials, performance history, and marketplace metrics to ensure only qualified resellers reach your approval queue."
    },
    {
      question: "How do I get approved by brands as a reseller?",
      answer: "To get approved by brands as a reseller on BndBox, create a reseller account, complete your profile with store performance metrics, marketplace accounts, and business credentials. Browse available brand opportunities and submit applications. Brands review your profile and may require additional documentation before granting wholesale approval."
    },
    {
      question: "What are MAP policies and how does BndBox enforce them?",
      answer: "Minimum Advertised Price (MAP) policies are rules set by brands that establish the lowest price at which their products can be advertised. BndBox helps enforce these policies by only connecting brands with resellers who commit to honoring pricing policies, and by providing monitoring tools that alert brands to potential violations."
    },
    {
      question: "Can BndBox help with Amazon Brand Registry issues?",
      answer: "Yes, BndBox helps brands with Amazon Brand Registry by ensuring all connected resellers are properly authorized, which reduces potential listing conflicts. Our platform helps maintain brand control by providing documentation of authorized relationships that can be referenced if marketplace disputes arise."
    },
    {
      question: "How long does the wholesale approval process take?",
      answer: "The wholesale approval process through BndBox typically takes 3-7 business days, significantly faster than traditional methods. This timeline includes initial application, brand review, documentation exchange, and final approval. Some premium brands may require additional verification steps that can extend the process."
    },
  ];

  // Generate structured data for FAQs
  const generateFAQSchema = () => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    return JSON.stringify(faqSchema);
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions About Brand Wholesale Approval</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about how our platform connects brands with trusted resellers through a streamlined approval process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Inject FAQ structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateFAQSchema() }}
        />
      </div>
    </section>
  );
};

export default FAQSection;

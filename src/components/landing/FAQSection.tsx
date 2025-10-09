
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackSEOInteraction } from "@/lib/analytics";

const FAQSection = () => {
  const faqItems = [
    {
      question: "What makes BndBox different from other B2B marketplaces?",
      answer: "BndBox combines AI-powered matchmaking with compliance automation to connect brands, distributors, and retailers more efficiently. Our proprietary AI engine analyzes 1M+ product and partner data points to ensure best-fit partnerships. We provide built-in MAP policy enforcement, verification layers, and performance dashboards that traditional B2B platforms lack."
    },
    {
      question: "Can offline retailers join BndBox?",
      answer: "Yes! BndBox serves both online resellers and traditional brick-and-mortar retailers. Whether you operate physical retail stores, sell on marketplaces like Amazon and Walmart, or both, you can connect with verified wholesale suppliers and brand partners through our platform."
    },
    {
      question: "How are partners verified on BndBox?",
      answer: "BndBox uses a multi-layer verification process for all partners. We validate business credentials, review performance history, verify marketplace accounts, and check compliance records. Our AI system continuously monitors partner behavior to ensure ongoing adherence to MAP policies and brand standards."
    },
    {
      question: "How does BndBox use AI?",
      answer: "Our AI engine analyzes over 1 million product and partner data points to match brands with the best-fit distributors, retailers, and resellers. The AI evaluates factors like sales performance, category expertise, geographic reach, compliance history, and marketplace presence to recommend optimal partnerships. It also monitors ongoing compliance and flags potential policy violations."
    },
    {
      question: "What are the pricing options for BndBox?",
      answer: "BndBox offers flexible pricing plans for brands, distributors, and retailers. Resellers can join and browse opportunities for free, with premium features available on paid plans. Brands pay a subscription fee based on the number of active partnerships and features needed. Contact our team for custom enterprise pricing."
    }
  ];

  // Track FAQ interactions for SEO analytics
  const handleFAQClick = (question: string) => {
    trackSEOInteraction('FAQ_Click', 'Accordion', question);
  };

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
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions About BndBox</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about how our AI-powered platform connects brands, distributors, retailers, and online resellers through intelligent matchmaking.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left text-lg font-semibold"
                  onClick={() => handleFAQClick(item.question)}
                >
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

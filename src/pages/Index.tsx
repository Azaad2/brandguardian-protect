
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import SolutionSection from "@/components/landing/SolutionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";
import VisitorTypeDialog from "@/components/dialogs/VisitorTypeDialog";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const Index = () => {
  const [showDialog, setShowDialog] = useState(false);
  
  useEffect(() => {
    // Show the dialog after a short delay when the page loads
    const timer = setTimeout(() => {
      setShowDialog(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Generate WebPage schema
  const generateWebPageSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "BndBox - Brand Wholesale Approval Platform for Amazon Resellers",
      "description": "Connect brands with trusted resellers across Amazon, Walmart, and eBay. Streamline your brand wholesale approval process with BndBox.",
      "url": "https://bndbox.com/",
      "lastReviewed": "2025-05-12",
      "mainEntity": {
        "@type": "Organization",
        "name": "BndBox",
        "url": "https://bndbox.com",
        "logo": "https://bndbox.com/logo.png"
      }
    };
    
    return JSON.stringify(schema);
  };
  
  // Generate BreadcrumbList schema
  const generateBreadcrumbSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://bndbox.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Brand Wholesale Approval",
          "item": "https://bndbox.com/brand"
        }
      ]
    };
    
    return JSON.stringify(schema);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Brand Wholesale Approval | Connect with Amazon Resellers | BndBox</title>
        <meta name="description" content="BndBox helps brands find and approve trusted wholesale resellers for Amazon, Walmart, and eBay marketplaces. Get your brand wholesale approval process streamlined." />
        <link rel="canonical" href="https://bndbox.com/" />
        <meta name="robots" content="index, follow" />
        
        {/* Schema.org JSON-LD structured data */}
        <script type="application/ld+json">
          {generateWebPageSchema()}
        </script>
        
        <script type="application/ld+json">
          {generateBreadcrumbSchema()}
        </script>
      </Helmet>
      
      <Header />
      <main>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Brand Wholesale Approval</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <HeroSection />
        <PainPointsSection />
        <SolutionSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <VisitorTypeDialog open={showDialog} setOpen={setShowDialog} />
    </div>
  );
};

export default Index;

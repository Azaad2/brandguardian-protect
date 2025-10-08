import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/reseller-hub/ResellerFormSchema';
import ResellerHubHeader from '@/components/reseller-hub/ResellerHubHeader';
import ResellerHubIntro from '@/components/reseller-hub/ResellerHubIntro';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import { SchemaGenerator } from '@/components/seo/SchemaGenerator';

import ResellerBenefitCards from '@/components/reseller-hub/ResellerBenefitCards';
import ResellerApplicationForm from '@/components/reseller-hub/ResellerApplicationForm';
import SuccessMessage from '@/components/reseller-hub/SuccessMessage';
import LeadMagnetDialog from '@/components/dialogs/LeadMagnetDialog';
import { useLeadMagnetPopup } from '@/hooks/useLeadMagnetPopup';
import { trackPageView, trackSEOInteraction } from '@/lib/analytics';

const ResellerHub = () => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  // Lead magnet popup for reseller hub
  const leadMagnetPopup = useLeadMagnetPopup({
    delayMs: 40000, // Show after 40 seconds on reseller hub
    scrollThreshold: 70, // Show after 70% scroll
    sessionStorageKey: 'leadMagnetPopup_resellerHub'
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      businessType: 'individual',
      einNumber: '',
      amazonStoreLink: '',
      walmartStoreLink: '',
      ebayStoreLink: '',
      productCategories: [],
      salesVolume: 'under_10k',
      wholesaleBudget: 'under_5k',
      feedbackScore: '',
      email: '',
      phone: '',
      linkedIn: '',
      termsAgreement: false,
    },
  });

  // Track page view with enhanced analytics
  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
    
    // Track user engagement for SEO metrics
    let startTime = Date.now();
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Make sure window and rdt are defined for Reddit Pixel
    if (typeof window !== 'undefined' && window.rdt) {
      try {
        // Explicitly call the track method for PageVisit event
        window.rdt('track', 'PageVisit');
        console.log('Reddit Pixel: PageVisit event tracked in ResellerHub component');
      } catch (error) {
        console.error('Reddit Pixel tracking error in ResellerHub:', error);
      }
    } else {
      console.warn('Reddit Pixel not available in ResellerHub component');
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
      trackSEOInteraction('Page_Exit', 'ResellerHub', `Time: ${timeSpent}s, Scroll: ${maxScrollDepth}%`);
    };
  }, []);
  
  // Generate structured data for the reseller application page
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Amazon Reseller Application & Brand Wholesale Approval",
    "description": "Apply to become an approved reseller for premium brands. Get wholesale access across Amazon, Walmart, and eBay marketplaces through verified reseller application.",
    "provider": SchemaGenerator.generateOrganizationSchema(),
    "areaServed": "Worldwide",
    "serviceType": "B2B Marketplace Platform",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema([
    { name: 'Home', url: 'https://bndbox.com' },
    { name: 'Reseller Hub', url: 'https://bndbox.com/reseller-hub' }
  ]);

  const howToSchema = SchemaGenerator.generateHowToSchema(
    "How to Apply as an Amazon Reseller",
    "Complete guide to becoming an approved brand reseller on BndBox",
    [
      { name: "Create Profile", text: "Complete your reseller profile with business information and marketplace links" },
      { name: "Verify Identity", text: "Upload required verification documents (EIN, business license)" },
      { name: "Submit Application", text: "Submit your application for brand review and approval" },
      { name: "Get Approved", text: "Receive wholesale access and pricing from approved brands" }
    ]
  );

  const handleSubmissionSuccess = (email: string) => {
    setSubmittedEmail(email);
    setSubmissionSuccess(true);
    
    // Track successful submission with enhanced analytics
    trackSEOInteraction('Form_Submit', 'ResellerApplication', 'Success');
    
    // Track with Reddit Pixel
    if (typeof window !== 'undefined' && window.rdt) {
      try {
        window.rdt('track', 'Lead');
        console.log('Reddit Pixel: Lead event tracked on submission success');
      } catch (error) {
        console.error('Reddit Pixel tracking error on submission:', error);
      }
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdvancedSEO
        title="Amazon Reseller Application | Brand Wholesale Approval & Verification"
        description="Apply to become an approved Amazon reseller for premium brands. Join 500+ verified resellers getting wholesale access to top brands across Amazon, Walmart, and eBay. Complete our free reseller application today and start selling authorized products with MAP compliance."
        keywords="amazon reseller application, brand wholesale approval, marketplace seller approval, reseller verification, amazon wholesale, walmart reseller, ebay seller application, wholesale distribution, B2B marketplace, authorized reseller program"
        canonicalUrl="https://bndbox.com/reseller-hub"
        ogImage="https://bndbox.com/og-images/reseller-hub.jpg"
        ogType="website"
        schema={[serviceSchema, breadcrumbSchema, howToSchema]}
      />
      
      <div className="container mx-auto px-4 pt-8 pb-16">
        <ResellerHubHeader />
        
        {submissionSuccess ? (
          <SuccessMessage 
            email={submittedEmail} 
            onReset={handleReset} 
          />
        ) : (
          <>
            <ResellerHubIntro />
            <ResellerBenefitCards />
            <ResellerApplicationForm 
              onSubmissionSuccess={handleSubmissionSuccess} 
            />
          </>
        )}
      </div>
      <Footer />
      
      {/* Lead Magnet Popup for reseller hub visitors */}
      <LeadMagnetDialog
        open={leadMagnetPopup.showPopup}
        onOpenChange={leadMagnetPopup.handleClose}
        onNotInterested={leadMagnetPopup.handleNotInterested}
        onConverted={leadMagnetPopup.handleConverted}
      />
    </div>
  );
};

export default ResellerHub;

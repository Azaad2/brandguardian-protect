
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Footer from '@/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/reseller-hub/ResellerFormSchema';
import ResellerHubHeader from '@/components/reseller-hub/ResellerHubHeader';
import ResellerHubIntro from '@/components/reseller-hub/ResellerHubIntro';
import ResellerBenefitCards from '@/components/reseller-hub/ResellerBenefitCards';
import ResellerApplicationForm from '@/components/reseller-hub/ResellerApplicationForm';
import SuccessMessage from '@/components/reseller-hub/SuccessMessage';
import { trackPageView, trackSEOInteraction } from '@/lib/analytics';

const ResellerHub = () => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      businessType: 'individual',
      einNumber: '',
      amazonSellerId: '',
      walmartSellerId: '',
      ebaySellerId: '',
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
  const generateResellerHubSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Amazon Reseller Application - Brand Wholesale Approval",
      "description": "Apply to become an approved Amazon reseller for premium brands. Complete our reseller application for wholesale access.",
      "url": "https://bndbox.com/reseller-hub",
      "mainEntityOfPage": {
        "@type": "Service",
        "name": "Amazon Reseller Application Process",
        "description": "Apply to sell premium brand products with wholesale approval across Amazon, Walmart, and eBay marketplaces.",
        "provider": {
          "@type": "Organization",
          "name": "BndBox",
          "logo": "https://bndbox.com/logo.png"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    };
    
    return JSON.stringify(schema);
  };

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
      <Helmet>
        <title>Amazon Reseller Application | Brand Wholesale Approval | BndBox</title>
        <meta name="description" content="Apply to become an approved Amazon reseller for premium brands. Complete our reseller application for wholesale access to brands on multiple marketplaces." />
        <meta name="keywords" content="amazon reseller application, brand wholesale approval, marketplace seller approval, reseller application process, amazon wholesale" />
        <link rel="canonical" href="https://bndbox.com/reseller-hub" />
        
        {/* Schema.org structured data for this page */}
        <script type="application/ld+json">
          {generateResellerHubSchema()}
        </script>
      </Helmet>
      
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
    </div>
  );
};

export default ResellerHub;

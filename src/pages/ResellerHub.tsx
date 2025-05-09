
import React, { useState, useEffect } from 'react';
import Footer from '@/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/reseller-hub/ResellerFormSchema';
import ResellerHubHeader from '@/components/reseller-hub/ResellerHubHeader';
import ResellerHubIntro from '@/components/reseller-hub/ResellerHubIntro';
import ResellerBenefitCards from '@/components/reseller-hub/ResellerBenefitCards';
import ResellerApplicationForm from '@/components/reseller-hub/ResellerApplicationForm';
import SuccessMessage from '@/components/reseller-hub/SuccessMessage';

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

  // Track page view with Reddit Pixel - Updated implementation
  useEffect(() => {
    // Make sure window and rdt are defined
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
  }, []);

  const handleSubmissionSuccess = (email: string) => {
    setSubmittedEmail(email);
    setSubmissionSuccess(true);
    
    // Track successful submission with Reddit Pixel
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

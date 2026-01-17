import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PartnerHubHeader } from '@/components/partner-hub/PartnerHubHeader';
import { PartnerTypeSelector } from '@/components/partner-hub/PartnerTypeSelector';
import { PartnerApplicationForm } from '@/components/partner-hub/PartnerApplicationForm';
import { PartnerSuccessMessage } from '@/components/partner-hub/PartnerSuccessMessage';
import { PartnerType } from '@/components/partner-hub/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SchemaGenerator } from '@/components/seo/SchemaGenerator';

const PartnerHub = () => {
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState<PartnerType | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  // Check for pre-selected type from URL params whenever URL changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['brand', 'retailer', 'distributor', 'wholesaler'].includes(typeParam)) {
      setSelectedType(typeParam as PartnerType);
    }
  }, [searchParams]);

  const handleSubmissionSuccess = (email: string) => {
    setSubmittedEmail(email);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  // Generate structured data
  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema([
    { name: 'Home', url: 'https://bndbox.com' },
    { name: 'Partner Hub', url: 'https://bndbox.com/partner-hub' },
  ]);

  const faqSchema = SchemaGenerator.generateFAQSchema([
    {
      question: 'Who can join the BndBox Partner Network?',
      answer: 'Brands, retailers, distributors, and wholesalers who want to grow their business through verified partnerships can apply to join our network.',
    },
    {
      question: 'How long does the application review take?',
      answer: 'Our team typically reviews applications within 2-3 business days. You will receive an email notification once your application has been reviewed.',
    },
    {
      question: 'Is there a fee to join the Partner Network?',
      answer: 'Creating a partner account and submitting an application is free. Some premium features may require a subscription.',
    },
  ]);

  return (
    <>
      <Helmet>
        <title>Partner Hub - Join BndBox Network | Brands, Retailers, Distributors</title>
        <meta 
          name="description" 
          content="Join BndBox's trusted partner network. Connect with verified brands, retailers, distributors, and wholesalers. Apply now to grow your business." 
        />
        <meta name="keywords" content="partner network, brand partnership, wholesale distribution, retail partnership, Amazon resellers" />
        <link rel="canonical" href="https://bndbox.com/partner-hub" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Partner Hub - Join BndBox Network" />
        <meta property="og:description" content="Connect with verified brands, retailers, distributors, and wholesalers. Apply to join our trusted partner network." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bndbox.com/partner-hub" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto space-y-8">
              <PartnerHubHeader />
              
              {submittedEmail ? (
                <PartnerSuccessMessage 
                  email={submittedEmail} 
                  partnerType={selectedType || 'partner'} 
                />
              ) : selectedType ? (
                <div className="space-y-6">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Change Partner Type
                  </Button>
                  <PartnerApplicationForm 
                    partnerType={selectedType}
                    onSubmissionSuccess={handleSubmissionSuccess}
                  />
                </div>
              ) : (
                <PartnerTypeSelector 
                  selectedType={selectedType}
                  onSelect={setSelectedType}
                />
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PartnerHub;


import { Helmet } from 'react-helmet';
import { trackPageView } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/landing/HeroSection';
import PainPointsSection from '@/components/landing/PainPointsSection';
import SolutionSection from '@/components/landing/SolutionSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/layout/Footer';
import PortalSwitcher from '@/components/PortalSwitcher';
import VisitorTypeDialog from '@/components/dialogs/VisitorTypeDialog';

const Index = () => {
  const [showVisitorDialog, setShowVisitorDialog] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname);
    
    // Show visitor type dialog on first visit
    const hasVisited = localStorage.getItem('bndbox-visitor-type-selected');
    if (!hasVisited) {
      setShowVisitorDialog(true);
    }
  }, []);

  const handleVisitorTypeSelected = () => {
    localStorage.setItem('bndbox-visitor-type-selected', 'true');
    setShowVisitorDialog(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>BndBox - Connect Brands with Authorized Resellers | Marketplace Brand Protection</title>
        <meta name="description" content="BndBox connects premium brands with verified resellers, ensuring authorized distribution, MAP compliance, and brand protection across Amazon, Walmart, and eBay marketplaces." />
        <meta name="keywords" content="brand protection, authorized resellers, MAP policy enforcement, marketplace compliance, wholesale distribution, Amazon brand registry" />
        <link rel="canonical" href="https://bndbox.com" />
      </Helmet>
      
      <Header />
      <HeroSection />
      <PainPointsSection />
      <SolutionSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <PortalSwitcher />
      
      <VisitorTypeDialog 
        open={showVisitorDialog} 
        setOpen={setShowVisitorDialog}
        onVisitorTypeSelected={handleVisitorTypeSelected}
      />
    </div>
  );
};

export default Index;

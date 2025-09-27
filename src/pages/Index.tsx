import { Helmet } from 'react-helmet';
import { trackPageView } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/landing/HeroSection';

import SolutionSection from '@/components/landing/SolutionSection';
import PortalPreviewSection from '@/components/landing/PortalPreviewSection';
import ConnectionNetworkSection from '@/components/landing/ConnectionNetworkSection';

import FAQSection from '@/components/landing/FAQSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/layout/Footer';
import VisitorTypeDialog from '@/components/dialogs/VisitorTypeDialog';
import LeadMagnetDialog from '@/components/dialogs/LeadMagnetDialog';
import { useLeadMagnetPopup } from '@/hooks/useLeadMagnetPopup';


const Index = () => {
  const [showVisitorDialog, setShowVisitorDialog] = useState(false);
  
  // Lead magnet popup logic - only show if visitor dialog is not shown
  const leadMagnetPopup = useLeadMagnetPopup({
    delayMs: 35000, // Show after 35 seconds
    scrollThreshold: 60, // Show after 60% scroll
  });

  useEffect(() => {
    trackPageView(window.location.pathname);
    
    // Show visitor type dialog on first visit
    const hasVisited = localStorage.getItem('bndbox-visitor-type-selected');
    console.log('Checking visitor type selection:', hasVisited);
    console.log('Current localStorage keys:', Object.keys(localStorage));
    
    // Check for URL parameter to reset dialog (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset-dialog') === 'true') {
      console.log('Reset dialog parameter detected - clearing localStorage');
      localStorage.removeItem('bndbox-visitor-type-selected');
    }
    
    const updatedHasVisited = localStorage.getItem('bndbox-visitor-type-selected');
    
    if (!updatedHasVisited || updatedHasVisited === 'false' || updatedHasVisited === null) {
      console.log('First time visitor detected - showing dialog');
      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        console.log('Setting showVisitorDialog to true');
        setShowVisitorDialog(true);
      }, 1000); // Increased delay to 1 second
    } else {
      console.log('Returning visitor - dialog will not show');
    }
  }, []);

  const handleVisitorTypeSelected = () => {
    console.log('Visitor type selected - setting localStorage and hiding dialog');
    localStorage.setItem('bndbox-visitor-type-selected', 'true');
    setShowVisitorDialog(false);
  };

  // Add this for debugging - log when state changes
  useEffect(() => {
    console.log('showVisitorDialog state changed to:', showVisitorDialog);
  }, [showVisitorDialog]);

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
      <SolutionSection />
      <PortalPreviewSection />
      <ConnectionNetworkSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      
      <VisitorTypeDialog 
        open={showVisitorDialog} 
        setOpen={setShowVisitorDialog}
        onVisitorTypeSelected={handleVisitorTypeSelected}
      />
      
      {/* Lead Magnet Popup - only show if visitor dialog is not open */}
      <LeadMagnetDialog
        open={leadMagnetPopup.showPopup && !showVisitorDialog}
        onOpenChange={leadMagnetPopup.handleClose}
        onNotInterested={leadMagnetPopup.handleNotInterested}
        onConverted={leadMagnetPopup.handleConverted}
      />
    </div>
  );
};

export default Index;

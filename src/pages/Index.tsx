
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import SolutionSection from "@/components/landing/SolutionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ContactSection from "@/components/landing/ContactSection";
import VisitorTypeDialog from "@/components/dialogs/VisitorTypeDialog";

const Index = () => {
  const [showDialog, setShowDialog] = useState(false);
  
  useEffect(() => {
    // Show the dialog after a short delay when the page loads
    const timer = setTimeout(() => {
      setShowDialog(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <PainPointsSection />
        <SolutionSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <VisitorTypeDialog open={showDialog} setOpen={setShowDialog} />
    </div>
  );
};

export default Index;

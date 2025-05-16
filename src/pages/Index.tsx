
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import SolutionSection from "@/components/landing/SolutionSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Admin Dashboard Link - Only visible in development */}
        <div className="bg-amber-100 py-2 px-4 text-center">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 font-medium text-amber-800 hover:text-amber-900 hover:underline"
          >
            🔒 Access Admin Dashboard
          </Link>
        </div>
        
        <HeroSection />
        <SolutionSection />
        <PainPointsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-brandguardian-600" />
          <span className="text-xl font-bold text-gray-900">BrandGuardian</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <a href="#features" className="text-gray-700 hover:text-brandguardian-600 transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-brandguardian-600 transition-colors font-medium">Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-brandguardian-600 transition-colors font-medium">Pricing</a>
          </nav>
          <Button asChild>
            <a href="#contact">Contact Us</a>
          </Button>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="h-6 w-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <a 
              href="#features" 
              className="text-gray-700 hover:text-brandguardian-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-700 hover:text-brandguardian-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-gray-700 hover:text-brandguardian-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <Button asChild>
              <a 
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

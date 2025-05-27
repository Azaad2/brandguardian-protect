
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BndBoxLogo from "@/components/branding/BndBoxLogo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <BndBoxLogo className="h-8" />
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <a href="#features" className="text-gray-700 hover:text-bndbox-600 transition-colors font-medium">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-bndbox-600 transition-colors font-medium">Testimonials</a>
            <Link to="/about" className="text-gray-700 hover:text-bndbox-600 transition-colors font-medium">About</Link>
            <Link to="/blog" className="text-gray-700 hover:text-bndbox-600 transition-colors font-medium">Blog</Link>
            <Link to="/reseller-hub" className="text-gray-700 hover:text-bndbox-600 transition-colors font-medium">Reseller Hub</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild>
              <a href="#contact">Contact Us</a>
            </Button>
          </div>
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
              className="text-gray-700 hover:text-bndbox-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-700 hover:text-bndbox-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-bndbox-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-bndbox-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/reseller-hub" 
              className="text-gray-700 hover:text-bndbox-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Reseller Hub
            </Link>
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

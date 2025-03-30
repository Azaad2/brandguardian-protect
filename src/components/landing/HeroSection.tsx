
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 md:pt-40 md:pb-32 relative overflow-hidden bg-grid">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full w-fit">
              <ShieldCheck className="h-4 w-4 text-brandguardian-600" />
              <span>AI-powered brand protection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Take Control of Your <span className="gradient-text">Brand</span> on Amazon
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              Stop unauthorized sellers. Authenticate resellers. Protect your reputation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group">
                Protect Your Brand Now
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
            
            <div className="pt-6">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9L8.25 11.25L12.75 6.75" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                No credit card required to start
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brandguardian-500/20 to-guardian-500/20 transform rotate-1"></div>
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Brand manager monitoring Amazon listings" 
                className="relative rounded-xl shadow-2xl transform -rotate-1 z-10"
              />
              <div className="absolute -right-4 -bottom-4 bg-white rounded-lg shadow-lg p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Unauthorized listing detected</p>
                    <p className="text-xs text-gray-500">Action taken automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none -z-10"></div>
    </section>
  );
};

export default HeroSection;


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
              <div className="relative rounded-xl shadow-2xl transform -rotate-1 z-10 border border-gray-200 bg-white p-2">
                {/* Amazon-like product listing interface */}
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Header with brand dashboard */}
                  <div className="bg-gray-100 p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-sm">BrandGuardian Dashboard</div>
                      <div className="text-xs text-green-600 font-medium">6 Unauthorized Sellers Detected</div>
                    </div>
                  </div>
                  
                  {/* Content with product listings */}
                  <div className="p-4">
                    {/* Product listing with authorized/unauthorized indicators */}
                    <div className="mb-4 border border-gray-200 rounded p-3 relative">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Premium Skincare Set</div>
                          <div className="text-xs text-gray-500">ASIN: B07X9ZCN78</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$49.99</div>
                            <div className="text-xs text-red-500">3 unauthorized sellers</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Unauthorized seller tag being removed animation */}
                      <div className="absolute -right-2 -top-2 bg-red-100 text-red-700 text-xs rounded-full px-2 py-1 border border-red-200 line-through opacity-70 transform translate-x-2 transition-all duration-300">
                        Hijacked
                      </div>
                      
                      <div className="absolute right-3 top-3 bg-green-500 text-white text-xs rounded-full px-2 py-1 animate-fade-in">
                        Protected
                      </div>
                    </div>
                    
                    {/* Second product listing */}
                    <div className="mb-4 border border-gray-200 rounded p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Organic Supplement</div>
                          <div className="text-xs text-gray-500">ASIN: B08D7KL9TZ</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$29.99</div>
                            <div className="text-xs text-green-500">Verified sellers only</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Third product listing with warning */}
                    <div className="border border-gray-200 rounded p-3 relative">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Luxury Hair Care</div>
                          <div className="text-xs text-gray-500">ASIN: B09F7YHQ2P</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$35.50</div>
                            <div className="text-xs text-orange-500">Price violation detected</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-3 top-3 bg-yellow-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                        Taking action
                      </div>
                    </div>
                  </div>
                  
                  {/* Action bar at bottom */}
                  <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-gray-600">BrandGuardian: Actively protecting 28 ASINs</div>
                    <div className="text-xs font-medium text-brandguardian-600">View detailed report →</div>
                  </div>
                </div>
              </div>
              
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

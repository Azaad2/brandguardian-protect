
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { trackSEOInteraction } from "@/lib/analytics";

const HeroSection = () => {
  const [currentMarketplace, setCurrentMarketplace] = useState("Amazon");
  const marketplaces = ["Amazon", "Walmart", "eBay"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMarketplace(prevMarketplace => {
        const currentIndex = marketplaces.indexOf(prevMarketplace);
        const nextIndex = (currentIndex + 1) % marketplaces.length;
        return marketplaces[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);
  
  const handleHeroCTA = () => {
    trackSEOInteraction('CTA_Click', 'HeroButton', 'Get Started');
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 md:pt-40 md:pb-32 relative overflow-hidden neural-pattern" aria-label="Brand Wholesale Approval Platform">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 glass-card rounded-full w-fit">
              <ShoppingBag className="h-4 w-4 text-ai-electric" aria-hidden="true" />
              <span className="crystal-text">Connecting Brands With Vetted Resellers & Retailers</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 crystal-text">
              Protect Your <span className="text-gradient">Brand Integrity</span> on Marketplaces
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Connect with pre-vetted resellers using <span className="font-medium text-ai-neural">AI-powered verification</span> while maintaining MAP pricing and amplifying sales across <span className="font-medium">Amazon</span>, <span className="font-medium">Walmart</span>, <span className="font-medium">eBay</span>, and <span className="font-medium">Shopify</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="xl" variant="premium" className="group animate-crystal-float" asChild onClick={handleHeroCTA}>
                <a href="#contact">
                  Start AI Protection
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="crystal" size="xl" className="animate-crystal-float" style={{ animationDelay: '0.5s' }} asChild>
                <a href="/reseller-hub">
                  Join Smart Network
                </a>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 text-sm">
              <a href="/blog" className="text-bndbox-600 hover:text-bndbox-700 underline">
                Latest Amazon Strategies →
              </a>
              <a href="/about" className="text-bndbox-600 hover:text-bndbox-700 underline">
                About BndBox →
              </a>
            </div>
            
            <div className="pt-6">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9L8.25 11.25L12.75 6.75" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trusted by 500+ brands for wholesale approval management
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <img 
                src="https://lovable.dev/amazon-logo.png" 
                alt="Amazon Marketplace" 
                className="h-6 opacity-80" 
                width="80"
                height="24" 
              />
              <img 
                src="https://lovable.dev/walmart-logo.png" 
                alt="Walmart Marketplace" 
                className="h-5 opacity-80" 
                width="80" 
                height="20"
              />
              <img 
                src="https://lovable.dev/ebay-logo.png" 
                alt="eBay Marketplace" 
                className="h-5 opacity-80" 
                width="60"
                height="20"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ai-cyan/20 to-ai-neural/20 transform rotate-1 animate-neural-pulse" aria-hidden="true"></div>
              <div className="relative rounded-xl shadow-2xl transform -rotate-1 z-10 glass-card p-2 animate-crystal-float">
                {/* Multi-marketplace product listing interface */}
                <div className="bg-crystal-clear/80 backdrop-blur-md rounded-lg overflow-hidden border border-crystal-frost">
                  {/* Header with platform tabs */}
                  <div className="bg-crystal-mist/60 p-3 border-b border-crystal-frost">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <div className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${currentMarketplace === "Amazon" ? "bg-ai-electric text-white animate-premium-glow" : "text-gray-600 glass-card"}`}>Amazon</div>
                        <div className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${currentMarketplace === "Walmart" ? "bg-ai-neural text-white animate-premium-glow" : "text-gray-600 glass-card"}`}>Walmart</div>
                        <div className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${currentMarketplace === "eBay" ? "bg-ai-pulse text-white animate-premium-glow" : "text-gray-600 glass-card"}`}>eBay</div>
                      </div>
                      <div className="text-xs text-ai-neural font-medium crystal-text">✨ 12 AI-Verified Resellers</div>
                    </div>
                  </div>
                  
                  {/* Content with product listings */}
                  <div className="p-4">
                    {/* Product listing with verified reseller badge */}
                    <div className="mb-4 border border-gray-200 rounded p-3 relative">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" aria-label="Product image"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Premium Product Set</div>
                          <div className="text-xs text-gray-500">ASIN: B07X9ZCN78</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$49.99</div>
                            <div className="text-xs text-blue-500">4 authorized resellers</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-3 top-3 marketplace-badge text-white text-xs rounded-full px-2 py-1">
                        Verified Reseller
                      </div>
                    </div>
                    
                    {/* Second product listing - Walmart */}
                    <div className="mb-4 border border-gray-200 rounded p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" aria-label="Product image"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">Kitchen Essentials</div>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Walmart</div>
                          </div>
                          <div className="text-xs text-gray-500">SKU: WM-55428-A</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$29.99</div>
                            <div className="text-xs text-green-500">New marketplace opportunity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Third product listing - eBay */}
                    <div className="border border-gray-200 rounded p-3 relative">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" aria-label="Product image"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">Home Collection</div>
                            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">eBay</div>
                          </div>
                          <div className="text-xs text-gray-500">ID: 394872664221</div>
                          <div className="flex justify-between mt-2">
                            <div className="text-sm">$35.50</div>
                            <div className="text-xs text-orange-500">Compliance score: 98%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-3 top-3 marketplace-badge text-white text-xs rounded-full px-2 py-1">
                        Verified Reseller
                      </div>
                    </div>
                  </div>
                  
                  {/* Action bar at bottom */}
                  <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-gray-600">BndBox: Managing 37 resellers across 3 marketplaces</div>
                    <div className="text-xs font-medium text-bndbox-600">View reseller performance →</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 -bottom-4 glass-card rounded-lg p-4 z-20 animate-crystal-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ai-cyan to-ai-electric flex items-center justify-center animate-neural-pulse" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium crystal-text">AI Approval Complete</p>
                    <p className="text-xs text-ai-neural">+18% smart growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none -z-10" aria-hidden="true"></div>
    </section>
  );
};

export default HeroSection;

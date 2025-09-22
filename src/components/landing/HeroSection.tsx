
import { motion } from 'framer-motion';
import { trackSEOInteraction } from '@/lib/analytics';
import { PremiumCard } from '@/components/ui/premium-card';
import { AnimatedText, AnimatedWords } from '@/components/ui/animated-text';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentMarketplace, setCurrentMarketplace] = useState(0);
  const marketplaces = ["Amazon", "Walmart", "eBay"];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMarketplace(prev => (prev + 1) % marketplaces.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);
  
  const handleHeroCTA = () => {
    trackSEOInteraction('CTA_Click', 'HeroButton', 'Get Started');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Brand Protection
              </motion.div>
              
              <div className="space-y-4">
                <AnimatedText
                  as="h1"
                  variant="gradient"
                  delay={0.4}
                  className="text-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  Wholesale Made Easy, Brands Meet Reseller/Retailers
                </AnimatedText>
                
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.button 
                onClick={() => window.location.href = '/reseller-hub'}
                className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-display font-semibold overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Find Brands
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-background/80 backdrop-blur-sm text-foreground border-2 border-border rounded-xl font-display font-semibold hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Find Resellers
                </div>
              </motion.button>
            </motion.div>
            
            {/* Trust indicators with enhanced design */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="flex -space-x-3">
                {[
                  "from-blue-500 to-purple-600",
                  "from-green-500 to-blue-600", 
                  "from-purple-500 to-pink-600",
                  "from-orange-500 to-red-600"
                ].map((gradient, index) => (
                  <motion.div
                    key={index}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} border-3 border-background shadow-lg`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8 + index * 0.1, type: "spring", stiffness: 200 }}
                  />
                ))}
              </div>
              <div className="text-body text-sm text-muted-foreground font-medium">
                <div className="font-semibold text-foreground">Join 500+ brands</div>
                <div>Try Free • No Credit Card Required</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Enhanced Right content - Interactive Dashboard */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Main dashboard with enhanced glass morphism */}
            <PremiumCard variant="glass" className="overflow-hidden">
              {/* Enhanced header */}
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm" />
                <div className="relative flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg">Brand Control Center</h3>
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm opacity-90">AI Active</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced content */}
              <div className="p-6 space-y-6">
                {/* Dynamic marketplace indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Monitoring</span>
                  <motion.div 
                    key={currentMarketplace}
                    className="px-4 py-2 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full border border-primary/20"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-primary font-medium text-sm">
                      {marketplaces[currentMarketplace]} Marketplace
                    </span>
                  </motion.div>
                </div>
                
                {/* Enhanced product listings */}
                <div className="space-y-3">
                  <div className="text-sm font-display font-semibold text-foreground flex items-center">
                    <span>Protected Products</span>
                    <motion.div
                      className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {[
                    { product: "Premium Headphones", price: "$199", status: "verified", sales: "+15%" },
                    { product: "Smart Watch Pro", price: "$299", status: "monitoring", sales: "+8%" },
                    { product: "Wireless Speaker", price: "$149", status: "verified", sales: "+22%" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-4 glass-morphism rounded-lg hover:border-primary/30 transition-all duration-300"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 + index * 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{item.product}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{item.price}</span>
                          <span className="text-green-600 font-medium">{item.sales}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'verified' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.status === 'verified' ? '✓ Protected' : '👁 Monitoring'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </PremiumCard>
            
            {/* Enhanced floating notifications */}
            <motion.div
              className="absolute -bottom-6 -right-6"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
            >
              <PremiumCard variant="gradient" className="max-w-xs shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                    <motion.span 
                      className="text-white font-bold text-sm"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      AI
                    </motion.span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground">Threat Blocked</div>
                    <div className="text-xs text-muted-foreground">Unauthorized seller removed</div>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
            
            {/* Additional floating stats */}
            <motion.div
              className="absolute -top-4 -left-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, type: "spring", stiffness: 200 }}
            >
              <PremiumCard variant="glass" className="px-4 py-3">
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">99.7%</div>
                  <div className="text-xs text-muted-foreground">Protection Rate</div>
                </div>
              </PremiumCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;

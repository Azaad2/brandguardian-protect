import React from 'react';
import { motion } from 'framer-motion';
import BndBoxLogo from '@/components/branding/BndBoxLogo';

const ConnectionNetworkSection = () => {
  const brands = [
    { name: "TechBrand", position: { top: "20%", left: "15%" } },
    { name: "HomeEssentials", position: { top: "35%", left: "10%" } },
    { name: "FitnessPro", position: { top: "60%", left: "20%" } },
    { name: "KitchenMaster", position: { top: "75%", left: "15%" } }
  ];

  const resellers = [
    { name: "Amazon US", location: "New York", position: { top: "15%", right: "15%" } },
    { name: "Walmart CA", location: "Toronto", position: { top: "25%", right: "10%" } },
    { name: "eBay UK", location: "London", position: { top: "40%", right: "8%" } },
    { name: "Shopify AU", location: "Sydney", position: { top: "55%", right: "12%" } },
    { name: "Target US", location: "Chicago", position: { top: "70%", right: "18%" } },
    { name: "Costco MX", location: "Mexico City", position: { top: "80%", right: "15%" } }
  ];

  const ConnectionLine = ({ from, to, delay = 0 }: { from: string, to: string, delay?: number }) => (
    <motion.div
      className="absolute w-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeInOut" }}
      style={{
        transformOrigin: "center",
        background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.6) 50%, transparent 100%)"
      }}
    />
  );

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How BndBox Connects Your Network
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            BndBox serves as your central hub, connecting premium brands with verified resellers 
            and retailers across multiple marketplaces and geographic locations.
          </motion.p>
        </div>

        <div className="relative max-w-6xl mx-auto h-[600px]">
          {/* Central BndBox Hub */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                <div className="scale-75">
                  <BndBoxLogo />
                </div>
              </div>
              
              {/* Pulsing rings around central hub */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border border-primary/10"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>
          </motion.div>

          {/* Brand Connections (Left Side) */}
          <div className="absolute left-0 top-0 w-1/2 h-full">
            <motion.div 
              className="absolute top-8 left-8 text-sm font-semibold text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              Premium Brands
            </motion.div>
            
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                className="absolute"
                style={brand.position}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.15 }}
              >
                <div className="relative">
                  <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-foreground">{brand.name}</div>
                    <div className="text-xs text-muted-foreground">Brand Partner</div>
                  </div>
                  
                  {/* Connection line to center */}
                  <motion.div
                    className="absolute top-1/2 left-full w-20 h-px bg-gradient-to-r from-primary/60 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.8 + index * 0.1 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reseller Network (Right Side) */}
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <motion.div 
              className="absolute top-8 right-8 text-sm font-semibold text-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              Verified Resellers & Retailers
            </motion.div>
            
            {resellers.map((reseller, index) => (
              <motion.div
                key={reseller.name}
                className="absolute"
                style={reseller.position}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.15 }}
              >
                <div className="relative">
                  {/* Connection line from center */}
                  <motion.div
                    className="absolute top-1/2 right-full w-20 h-px bg-gradient-to-l from-primary/60 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.8 + index * 0.1 }}
                    style={{ transformOrigin: "right" }}
                  />
                  
                  <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-foreground">{reseller.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-500"></div>
                      {reseller.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Data flow indicators */}
          <motion.div 
            className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary rounded-full"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full"
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
          />
        </div>

        {/* Stats section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Verified Resellers</div>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Premium Brands</div>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Global Markets</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConnectionNetworkSection;
import { motion } from 'framer-motion';
import { Search, Sparkles, TrendingUp, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const exampleQueries = [
    "Find cosmetics distributors in Germany with MAP enforcement",
    "Show verified wholesale brands in California",
    "Electronics retailers with fast shipping and high ratings",
    "Organic food distributors in Europe"
  ];

  const quickActions = [
    { icon: Shield, label: "Verified Brands", filter: "verified brands" },
    { icon: Globe, label: "Global Distributors", filter: "distributors worldwide" },
    { icon: TrendingUp, label: "Top Resellers", filter: "high-rated resellers" },
    { icon: Zap, label: "Fast Approval", filter: "quick approval brands" }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleExampleClick = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleQuickAction = (filter: string) => {
    setSearchQuery(filter);
    handleSearch(filter);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Distribution Network
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="text-foreground">
                Wholesale Partner
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with verified brands, distributors, and resellers through AI-powered search. 
              Ask anything — get matched in seconds.
            </p>
          </motion.div>

          {/* Search Bar - Perplexity Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className={`relative transition-all duration-300 ${
              isFocused ? 'transform scale-105' : ''
            }`}>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  placeholder="Ask anything... e.g., 'Find verified electronics distributors in the US'"
                  className="w-full px-16 py-6 text-lg bg-background/90 backdrop-blur-md border-2 border-border rounded-2xl shadow-2xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 outline-none placeholder:text-muted-foreground"
                />
                <motion.button
                  onClick={() => handleSearch(searchQuery)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Search
                </motion.button>
              </div>

              {/* Example Queries */}
              {!isFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex flex-wrap justify-center gap-2"
                >
                  <span className="text-sm text-muted-foreground mr-2">Try:</span>
                  {exampleQueries.slice(0, 2).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(query)}
                      className="text-sm text-primary hover:text-accent hover:underline transition-colors"
                    >
                      "{query.slice(0, 40)}..."
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick Action Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickAction(action.filter)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 bg-background/80 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 hover:bg-background transition-all duration-300 shadow-md"
              >
                <action.icon className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["from-blue-500 to-purple-600", "from-green-500 to-blue-600", "from-purple-500 to-pink-600", "from-orange-500 to-red-600"].map((gradient, i) => (
                  <motion.div
                    key={i}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} border-2 border-background shadow-lg`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">150+ Verified Partners</div>
                <div className="text-sm text-muted-foreground">40+ brands • 1000+ products</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-border" />

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.7%</div>
                <div className="text-xs text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">&lt;24h</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.button
              onClick={() => navigate('/reseller-hub')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Join as Brand
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-background border-2 border-border rounded-xl font-semibold hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Join as Distributor / Retailer
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;

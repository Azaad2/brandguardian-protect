import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Target, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PlatformChallengesSection = () => {
  const challenges = [
    {
      icon: AlertTriangle,
      title: "Unauthorized Resellers",
      description: "Sales channels struggle with reseller accountability, leading to pricing violations on Amazon, Walmart, and eBay."
    },
    {
      icon: AlertTriangle,
      title: "Inconsistent Branding", 
      description: "Different listings, inconsistent images, poor customer service that hurt your reputation."
    },
    {
      icon: AlertTriangle,
      title: "Missed Opportunities",
      description: "Limited time and resources prevent brands from partnering with retailers who could boost sales on new markets."
    }
  ];

  const solutions = [
    {
      icon: Users,
      title: "Reseller Marketplace",
      description: "Browse pre-vetted reseller opportunities and connect with high-performing sellers with proven track records."
    },
    {
      icon: Target,
      title: "AI-Powered Seller Removal", 
      description: "Remove unauthorized sellers with a single click through our advanced seller detection technology."
    },
    {
      icon: BarChart3,
      title: "Cross-Platform Monitoring",
      description: "Track your brand's presence on all major marketplaces with a comprehensive dashboard."
    },
    {
      icon: Shield,
      title: "Automated Compliance",
      description: "Enforce MAP policies and branding guidelines automatically across marketplaces."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Problems Section */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Selling Across Multiple Platforms? Here's<br />
            What Keeps Brands Up at Night:
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Managing resellers across Amazon, Walmart, and eBay brings unique challenges that 
            impact your brand's success.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <challenge.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {challenge.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {challenge.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Solutions Section */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            BndBox: Your Gateway to Trusted E-Commerce Partnerships
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Our comprehensive platform helps you expand your reach across multiple marketplaces 
            while maintaining control of your brand.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <solution.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformChallengesSection;
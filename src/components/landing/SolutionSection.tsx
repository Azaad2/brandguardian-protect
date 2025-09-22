
import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, FileCheck, Users, Zap, ArrowUpRight } from "lucide-react";
import { PremiumCard } from '@/components/ui/premium-card';
import { AnimatedText } from '@/components/ui/animated-text';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <PremiumCard variant="glass" className="group p-8 h-full">
        <motion.div
          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 5 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-heading text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-body text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>
        
        <motion.div
          className="inline-flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform"
          whileHover={{ x: 4 }}
        >
          Learn more
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </motion.div>
      </PremiumCard>
    </motion.div>
  );
};

const SolutionSection = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Reseller Marketplace",
      description: "Browse pre-vetted resellers specializing in Amazon, Walmart, or eBay with proven track records."
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "AI-Powered Seller Removal",
      description: "Remove unauthorized sellers with a single click using our advanced AI detection technology."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      title: "Cross-Platform Monitoring",
      description: "Track your brand's presence on all major marketplaces in one comprehensive dashboard."
    },
    {
      icon: <FileCheck className="h-6 w-6 text-white" />,
      title: "Automated Compliance",
      description: "Enforce MAP policies and branding guidelines automatically across all marketplaces."
    }
  ];

  return (
    <section className="py-24 gradient-mesh px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Complete Brand Protection Suite
          </motion.div>
          
          <AnimatedText
            as="h2"
            variant="gradient"
            delay={0.4}
            className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
          >
            Your Gateway to Trusted E-Commerce Partnerships
          </AnimatedText>
          
          <AnimatedText
            as="p"
            delay={0.8}
            className="text-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Our comprehensive AI-powered platform helps you expand your reach across multiple marketplaces while maintaining complete control of your brand identity and pricing.
          </AnimatedText>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.2}
            />
          ))}
        </div>
        
        {/* Additional trust elements */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { metric: "99.7%", label: "Brand Protection Rate" },
              { metric: "2.4x", label: "Average Sales Increase" },
              { metric: "24/7", label: "AI Monitoring" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              >
                <div className="text-4xl font-display font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;

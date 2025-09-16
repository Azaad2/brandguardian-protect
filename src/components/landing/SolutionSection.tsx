
import { ShieldCheck, BarChart3, FileCheck, Users, Zap } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="glass-card p-8 rounded-xl premium-hover transition-all duration-300 fade-in-up">
      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-ai-neural to-ai-electric flex items-center justify-center mb-6 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 crystal-text">{title}</h3>
      <p className="text-crystal-ice/70">{description}</p>
    </div>
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
    <section className="py-20 neural-pattern relative px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 crystal-text">
            BndBox: Your Gateway to Trusted E-Commerce Partnerships
          </h2>
          <p className="text-lg text-crystal-ice/80">
            Our comprehensive platform helps you expand your reach across multiple marketplaces
            while maintaining control of your brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

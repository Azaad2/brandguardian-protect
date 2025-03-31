
import { ShieldCheck, Search, FileCheck, Users } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const SolutionSection = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Reseller Vetting & Authentication",
      description: "Our proprietary algorithm thoroughly screens potential resellers, verifying business credentials, sales history, and compliance record."
    },
    {
      icon: <Search className="h-6 w-6 text-white" />,
      title: "Real-Time Monitoring",
      description: "24/7 surveillance of your Amazon listings detects unauthorized sellers and counterfeits instantly."
    },
    {
      icon: <FileCheck className="h-6 w-6 text-white" />,
      title: "Compliance Enforcement",
      description: "Automated tools enforce your MAP policies and brand guidelines across all authorized resellers."
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Authorized Reseller Network",
      description: "Connect with pre-vetted, high-performing resellers who respect your brand values."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Introducing BndBox: Your Complete Reseller Management Solution
          </h2>
          <p className="text-lg text-gray-600">
            Our comprehensive platform helps you maintain control of your brand on Amazon
            through advanced monitoring and protection tools.
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

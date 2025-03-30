
import { ShieldAlert, AlertTriangle, Gauge, FileWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PainPointsSection = () => {
  const painPoints = [
    {
      icon: <ShieldAlert className="h-8 w-8 text-brandguardian-600" />,
      title: "Counterfeit Products",
      description: "76% of brands report unauthorized sellers offering counterfeit versions of their products. BrandGuardian verifies authentic resellers to protect your customers and reputation."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-brandguardian-600" />,
      title: "Unauthorized Sellers",
      description: "Like CeraVe, are you forced to tell customers to only buy from Amazon.com? Our platform lets you expand sales channels while maintaining control."
    },
    {
      icon: <Gauge className="h-8 w-8 text-brandguardian-600" />,
      title: "Price Erosion",
      description: "Prevent unauthorized sellers from undercutting your prices and devaluing your brand. Our AI monitoring detects and addresses MAP violations in real-time."
    },
    {
      icon: <FileWarning className="h-8 w-8 text-brandguardian-600" />,
      title: "Brand Inconsistency",
      description: "Ensure all your product listings maintain your branding standards with our content syndication and automated listing monitoring."
    }
  ];

  return (
    <section className="py-20 bg-white px-4" id="features">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
            Is Your Brand Protected on Amazon?
          </h2>
          <p className="text-lg text-gray-600">
            Most brands face critical challenges that impact their revenue and reputation on Amazon.
            BrandGuardian provides the solutions you need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {painPoints.map((point, index) => (
            <Card key={index} className="transition-all duration-300 feature-card border-gray-200 hover:border-brandguardian-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-brandguardian-50 flex items-center justify-center mb-6">
                  {point.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;

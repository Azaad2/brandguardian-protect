
import { AlertTriangle, ShoppingBag, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PainPointsSection = () => {
  const painPoints = [
    {
      icon: <ShoppingBag className="h-8 w-8 text-bndbox-600" />,
      title: "Unauthorized Resellers",
      description: "62% of brands struggle with resellers violating pricing or branding rules on Amazon, Walmart, and eBay."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-bndbox-600" />,
      title: "Inconsistent Branding",
      description: "Different listings, outdated images, and incorrect specs confuse customers and hurt your reputation."
    },
    {
      icon: <Gauge className="h-8 w-8 text-bndbox-600" />,
      title: "Missed Opportunities",
      description: "Limited time and resources prevent brands from partnering with resellers who could boost sales on new platforms."
    }
  ];

  return (
    <section className="py-20 neural-pattern relative px-4" id="features">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 crystal-text">
            Selling Across Multiple Platforms? Here's What Keeps Brands Up at Night:
          </h2>
          <p className="text-lg text-crystal-ice/80">
            Managing resellers across Amazon, Walmart, and eBay brings unique challenges that impact your brand's success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <Card key={index} variant="glass" className="transition-all duration-300 feature-card premium-hover fade-in-up">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-ai-neural/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-ai-neural" />
                </div>
                <h3 className="text-xl font-semibold mb-3 crystal-text">{point.title}</h3>
                <p className="text-crystal-ice/70">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;

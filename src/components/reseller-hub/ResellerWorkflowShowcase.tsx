import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Building } from 'lucide-react';

const ResellerWorkflowShowcase = () => {
  const workflows = [
    {
      title: "For Resellers",
      subtitle: "Resellers Access Premium Brand Wholesale Opportunities", 
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      steps: [
        {
          title: "Apply & Get Verified",
          description: "Submit your reseller application with business details and marketplace links",
          icon: "📝"
        },
        {
          title: "Browse Brand Catalog", 
          description: "Access exclusive wholesale catalogs from verified premium brands",
          icon: "📋"
        },
        {
          title: "Place Orders",
          description: "Order inventory directly from brands at wholesale prices",
          icon: "🛒"
        },
        {
          title: "Sell & Grow",
          description: "List products on Amazon, Walmart, eBay and grow your business",
          icon: "📈"
        }
      ]
    },
    {
      title: "For Brands", 
      subtitle: "Brands Connect with Verified Resellers Efficiently",
      icon: Building,
      color: "from-emerald-600 to-teal-600",
      steps: [
        {
          title: "Create Brand Profile",
          description: "Set up your brand profile and define your reseller criteria",
          icon: "🏢"
        },
        {
          title: "Upload Product Catalog",
          description: "Add your products with wholesale pricing and inventory details", 
          icon: "📦"
        },
        {
          title: "Review Applications",
          description: "Approve qualified resellers who meet your business requirements",
          icon: "✅"
        },
        {
          title: "Manage Distribution",
          description: "Track orders, monitor compliance, and grow your distribution network",
          icon: "🚀"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How BndBox Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform streamlines the connection between brands and resellers, 
            making wholesale distribution efficient and profitable for both parties.
          </p>
        </div>

        {workflows.map((workflow, workflowIndex) => (
          <div key={workflowIndex} className="mb-20 last:mb-0">
            {/* Workflow Header */}
            <div className={`bg-gradient-to-r ${workflow.color} text-white rounded-2xl p-8 mb-12`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <workflow.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{workflow.title}</h3>
                  <p className="text-xl opacity-90">{workflow.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {workflow.steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-bndbox-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{step.icon}</div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow connector */}
                  {index < workflow.steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-bndbox-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-bndbox-600 hover:bg-bndbox-700 text-white">
                Start as a Brand
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-bndbox-600 text-bndbox-600 hover:bg-bndbox-50">
                Apply as Reseller
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResellerWorkflowShowcase;
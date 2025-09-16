import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  UserCheck, 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  Network,
  CheckCircle,
  ArrowRight,
  Users,
  BarChart3,
  Settings,
  MessageSquare
} from 'lucide-react';

const WorkflowShowcase = () => {
  const workflows = [
    {
      title: "For Brands",
      subtitle: "Expand Your Authorized Reseller Network",
      color: "from-blue-600 to-blue-700",
      icon: Store,
      steps: [
        {
          step: "1",
          title: "Create Brand Profile",
          description: "Set up your brand account and upload product catalogs",
          icon: Store,
          features: ["Product catalog management", "Brand asset uploads", "MAP policy settings"]
        },
        {
          step: "2", 
          title: "Review Applications",
          description: "Evaluate reseller applications and approve qualified partners",
          icon: UserCheck,
          features: ["Application screening", "Performance analytics", "Approval workflow"]
        },
        {
          step: "3",
          title: "Monitor & Manage", 
          description: "Track reseller performance and ensure compliance",
          icon: BarChart3,
          features: ["Sales monitoring", "Compliance tracking", "Performance reports"]
        }
      ],
      portalFeatures: [
        "Reseller Application Management",
        "Product Catalog Control", 
        "MAP Policy Enforcement",
        "Sales Analytics & Reports",
        "Direct Messaging System",
        "Compliance Monitoring"
      ]
    },
    {
      title: "For Resellers", 
      subtitle: "Access Premium Brand Wholesale Opportunities",
      color: "from-green-600 to-green-700",
      icon: ShoppingCart,
      steps: [
        {
          step: "1",
          title: "Apply to Brands",
          description: "Submit applications to brands you want to resell",
          icon: UserCheck,
          features: ["Easy application process", "Portfolio showcase", "Performance metrics"]
        },
        {
          step: "2",
          title: "Get Approved",
          description: "Receive approval and access to wholesale catalogs", 
          icon: CheckCircle,
          features: ["Instant notifications", "Catalog access", "Pricing information"]
        },
        {
          step: "3",
          title: "Start Selling",
          description: "Begin selling authorized products across marketplaces",
          icon: TrendingUp,
          features: ["Multi-marketplace support", "Order management", "Performance tracking"]
        }
      ],
      portalFeatures: [
        "Brand Discovery & Applications",
        "Wholesale Catalog Access",
        "Order Management System", 
        "Performance Analytics",
        "Multi-Marketplace Integration",
        "Direct Brand Communication"
      ]
    }
  ];

  const systemBenefits = [
    {
      icon: Shield,
      title: "Brand Protection",
      description: "Ensure only authorized resellers sell your products"
    },
    {
      icon: Network,
      title: "Streamlined Connection",
      description: "Direct connection between brands and qualified resellers"
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Track performance and optimize your distribution strategy"
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Built-in messaging system for seamless collaboration"
    }
  ];

  return (
    <section className="py-20 neural-pattern relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="glass-button mb-4 border-crystal-frost bg-crystal-mist/50 text-ai-neural">How It Works</Badge>
          <h2 className="text-4xl font-bold crystal-text mb-4">
            Complete Ecosystem for Brand-Reseller Success
          </h2>
          <p className="text-xl text-crystal-ice/80 max-w-3xl mx-auto">
            BndBox connects premium brands with verified resellers through our comprehensive portal system, ensuring authorized distribution and brand protection.
          </p>
        </div>

        {/* Workflow for Each User Type */}
        <div className="space-y-20">
          {workflows.map((workflow, workflowIndex) => (
            <div key={workflowIndex} className="relative">
              {/* Workflow Header */}
              <div className="glass-card bg-gradient-to-r from-ai-neural to-ai-electric text-white rounded-2xl p-8 mb-12 premium-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <workflow.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">{workflow.title}</h3>
                    <p className="text-xl opacity-90">{workflow.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Steps Flow */}
              <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
                {/* Connection Line */}
                <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200"></div>
                
                {workflow.steps.map((step, stepIndex) => (
                  <Card key={stepIndex} variant="crystal" className="relative glass-card premium-hover transition-all duration-300 fade-in-up">
                    <CardContent className="p-8 text-center">
                      {/* Step Number */}
                      <div className="bg-gradient-to-r from-ai-neural to-ai-electric text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 relative z-10 shadow-lg">
                        {step.step}
                      </div>
                      
                      {/* Step Icon */}
                      <div className="bg-crystal-mist/30 p-4 rounded-lg w-fit mx-auto mb-4 backdrop-blur-sm">
                        <step.icon className="h-8 w-8 text-ai-neural" />
                      </div>
                      
                      {/* Step Content */}
                      <h4 className="text-xl font-semibold crystal-text mb-2">{step.title}</h4>
                      <p className="text-crystal-ice/70 mb-4">{step.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-crystal-ice/60">
                            <CheckCircle className="h-4 w-4 text-ai-neural flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Portal Features */}
              <Card variant="premium" className="glass-card premium-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold crystal-text mb-2">
                      {workflow.title === "For Brands" ? "Brands Gets" : "Resellers Gets"}
                    </h4>
                    <p className="text-crystal-ice/70">
                      Comprehensive tools designed for your success
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflow.portalFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 p-4 bg-crystal-clear/20 backdrop-blur-sm rounded-lg border border-crystal-frost/30 hover:bg-crystal-mist/30 transition-all duration-300">
                        <CheckCircle className="h-5 w-5 text-ai-neural flex-shrink-0" />
                        <span className="font-medium text-crystal-ice">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* System Benefits */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold crystal-text mb-4">
              Why Choose BndBox?
            </h3>
            <p className="text-xl text-crystal-ice/70">
              The complete solution for authorized reseller management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemBenefits.map((benefit, index) => (
              <Card key={index} variant="glass" className="text-center premium-hover transition-all duration-300 fade-in-up">
                <CardContent className="p-8">
                  <div className="bg-ai-neural/20 p-4 rounded-lg w-fit mx-auto mb-4 backdrop-blur-sm">
                    <benefit.icon className="h-8 w-8 text-ai-neural" />
                  </div>
                  <h4 className="text-lg font-semibold crystal-text mb-2">{benefit.title}</h4>
                  <p className="text-crystal-ice/70">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card bg-gradient-to-r from-ai-neural to-ai-electric text-white rounded-2xl p-12 premium-hover">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of brands and resellers already using BndBox to grow their business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="premium" className="bg-white text-ai-neural hover:bg-crystal-mist shadow-lg">
                Start as a Brand
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="crystal" className="border-white text-ai-neural bg-crystal-clear hover:bg-crystal-mist shadow-lg">
                Apply as Reseller
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowShowcase;
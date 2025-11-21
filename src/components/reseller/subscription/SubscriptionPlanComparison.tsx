import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionPlanComparisonProps {
  onUpgrade: () => void;
}

const SubscriptionPlanComparison = ({ onUpgrade }: SubscriptionPlanComparisonProps) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      current: true,
      features: [
        { text: 'Basic brand access', included: true },
        { text: 'Standard support (48hr response)', included: true },
        { text: 'Limited applications (3/month)', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority brand introductions', included: false },
        { text: 'Custom payment terms', included: false },
        { text: 'Dedicated account manager', included: false },
      ]
    },
    {
      name: 'Basic',
      price: '$35',
      period: '/month',
      popular: false,
      features: [
        { text: 'Full brand access', included: true },
        { text: 'Priority support (24hr response)', included: true },
        { text: 'Unlimited applications', included: true },
        { text: 'Advanced analytics & insights', included: true },
        { text: 'Faster brand approvals', included: true },
        { text: 'Custom payment terms', included: false },
        { text: 'Dedicated account manager', included: false },
      ]
    },
    {
      name: 'Premium',
      price: '$99',
      period: '/month',
      popular: true,
      features: [
        { text: 'Full brand access + exclusives', included: true },
        { text: 'VIP support (4hr response)', included: true },
        { text: 'Unlimited priority applications', included: true },
        { text: 'Advanced analytics & insights', included: true },
        { text: 'Priority brand introductions', included: true },
        { text: 'Custom payment terms negotiation', included: true },
        { text: 'Dedicated account manager', included: true },
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        { text: 'Everything in Premium +', included: true },
        { text: 'White-label solutions', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Bulk ordering automation', included: true },
        { text: 'Custom contracts & terms', included: true },
        { text: 'Dedicated success team', included: true },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">Upgrade to unlock exclusive brands, faster approvals, and premium support</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.current ? 'border-muted' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              {!plan.current && (
                <Button 
                  onClick={onUpgrade}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlanComparison;

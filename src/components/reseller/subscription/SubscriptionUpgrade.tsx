
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { useRazorpay } from '@/hooks/use-razorpay';

interface SubscriptionUpgradeProps {
  currentApplications: number;
  currentLimit: number;
}

const SubscriptionUpgrade = ({ currentApplications, currentLimit }: SubscriptionUpgradeProps) => {
  const { createCheckoutSession, isLoading } = useRazorpay();

  const subscriptionTiers = [
    {
      name: 'Basic',
      tier: 'basic',
      price: '$29',
      period: '/month',
      icon: Zap,
      limit: 99,
      features: [
        'Apply to up to 99 brands',
        'Priority customer support',
        'Advanced brand analytics',
        'Custom wholesale terms'
      ],
      popular: true
    },
    {
      name: 'Premium',
      tier: 'premium',
      price: '$79',
      period: '/month',
      icon: Crown,
      limit: 199,
      features: [
        'Apply to up to 199 brands',
        'Dedicated account manager',
        'Advanced reporting & insights',
        'Custom wholesale terms',
        'Early access to new brands'
      ],
      popular: false
    },
    {
      name: 'Enterprise',
      tier: 'enterprise',
      price: 'Custom',
      period: '',
      icon: Building,
      limit: 999,
      features: [
        'Unlimited brand applications',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated support team'
      ],
      popular: false
    }
  ];

  const handleUpgrade = async (tier: string) => {
    if (tier === 'enterprise') {
      // Handle enterprise tier differently - maybe show contact form
      window.open('mailto:sales@bndbox.com?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }
    
    await createCheckoutSession(tier);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Upgrade Your Plan</h2>
        <p className="text-gray-600 mb-2">
          You've used {currentApplications} of your {currentLimit} free brand applications
        </p>
        <p className="text-gray-600">
          Upgrade to continue applying to more brands and unlock premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card key={tier.tier} className={`relative ${tier.popular ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}>
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-gray-500 ml-1">{tier.period}</span>
                </div>
                <CardDescription>
                  Up to {tier.limit === 999 ? 'unlimited' : tier.limit} brand applications
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Upgrade to ${tier.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>All plans include a 30-day money-back guarantee</p>
        <p>Cancel anytime • No setup fees • Secure payment processing by Razorpay</p>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;

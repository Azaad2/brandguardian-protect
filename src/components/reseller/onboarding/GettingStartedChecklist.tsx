import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Circle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrandApplications } from '@/hooks/use-brand-applications';
import { useResellerMessages } from '@/hooks/use-reseller-messages';
import { useSubscription } from '@/hooks/use-subscription';

export const GettingStartedChecklist = () => {
  const navigate = useNavigate();
  const { applicationCount } = useBrandApplications();
  const { messages } = useResellerMessages();
  const { subscription } = useSubscription();

  const hasAppliedToBrand = applicationCount > 0;
  const hasMessages = messages && messages.length > 0;
  const hasUpgraded = subscription?.subscribed || false;

  const checklist = [
    {
      id: 'account-approved',
      title: 'Account Approved',
      description: 'Your reseller account has been verified',
      completed: true,
      action: null,
      actionLabel: null,
    },
    {
      id: 'browse-brands',
      title: 'Browse Available Brands',
      description: 'Explore our directory of wholesale suppliers',
      completed: hasAppliedToBrand,
      action: () => navigate('/reseller-portal/brands'),
      actionLabel: 'Browse Brands',
    },
    {
      id: 'apply-brand',
      title: 'Apply to Your First Brand',
      description: 'Submit an application to start a partnership',
      completed: hasAppliedToBrand,
      action: () => navigate('/reseller-portal/brands'),
      actionLabel: 'Apply Now',
    },
    {
      id: 'upgrade-optional',
      title: 'Upgrade to Premium (Optional)',
      description: 'Unlock advanced features and priority support',
      completed: hasUpgraded,
      action: () => navigate('/reseller-portal/subscription'),
      actionLabel: 'View Plans',
      icon: Crown,
    },
  ];

  const completedSteps = checklist.filter(item => item.completed).length;
  const totalSteps = checklist.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription>
          Complete these steps to start wholesaling ({completedSteps}/{totalSteps} completed)
        </CardDescription>
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {checklist.map((item) => (
          <div 
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              item.completed 
                ? 'bg-muted/50 border-muted' 
                : 'bg-background border-border hover:bg-muted/30'
            }`}
          >
            <div className="mt-0.5">
              {item.completed ? (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className={`font-medium text-sm ${item.completed ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {item.title}
                </p>
                {item.icon && <item.icon className="h-4 w-4 text-amber-500" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            {!item.completed && item.action && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={item.action}
              >
                {item.actionLabel}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

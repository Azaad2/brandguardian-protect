import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to BndBox!',
    description: 'Your account has been approved. Let\'s get you started with accessing wholesale brands.',
    icon: '🎉',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          You now have access to our curated network of wholesale brands. Here's what you can do:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Browse and apply to wholesale brands</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Track your applications and follow-ups</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Receive messages from brands directly</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Upgrade for premium features and support</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    title: 'Browse Available Brands',
    description: 'Find wholesale brands that match your business needs',
    icon: '🏢',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Navigate to the "Brands" section to explore our directory of verified wholesale suppliers.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="font-medium">Tips for finding the right brands:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Use filters to narrow down by category</li>
            <li>• Check approval rates and response times</li>
            <li>• Read brand descriptions carefully</li>
            <li>• Look for brands that match your niche</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Apply to Brands',
    description: 'Submit applications to start wholesale partnerships',
    icon: '📝',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          When you find a brand you want to work with, click "Apply" to send them your proposal.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="font-medium">What happens next:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Your application is sent to the brand via email</li>
            <li>• You can track the status in your dashboard</li>
            <li>• Send follow-ups if needed</li>
            <li>• Receive responses in your Messages inbox</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Upgrade for More Features',
    description: 'Unlock premium benefits and priority support',
    icon: '⭐',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Consider upgrading to get the most out of BndBox:
        </p>
        <div className="grid gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">Priority Support</p>
            <p className="text-xs text-muted-foreground">Get faster responses from our team</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">Advanced Analytics</p>
            <p className="text-xs text-muted-foreground">Track performance and conversions</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">Faster Approvals</p>
            <p className="text-xs text-muted-foreground">Priority processing for applications</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">Exclusive Brands</p>
            <p className="text-xs text-muted-foreground">Access premium wholesale partners</p>
          </div>
        </div>
      </div>
    )
  }
];

export const OnboardingModal = ({ open, onClose }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const step = onboardingSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={handleSkip}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="text-4xl mb-2">{step.icon}</div>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-2xl">{step.title}</DialogTitle>
          <DialogDescription className="text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step.content}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? 'w-8 bg-primary' 
                  : index < currentStep
                  ? 'w-2 bg-primary/50'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < onboardingSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

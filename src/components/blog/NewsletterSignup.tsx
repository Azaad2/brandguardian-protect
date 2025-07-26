import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { trackSEOInteraction } from '@/lib/analytics';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'sidebar';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Stay Updated",
  description = "Get the latest Amazon reseller guides and brand protection insights delivered to your inbox.",
  className = '',
  variant = 'default'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      trackSEOInteraction('Newsletter_Signup', 'Email', email);
      
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest articles and insights in your inbox.",
        duration: 5000,
      });
      
      // Reset form after success
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <Mail className="w-8 h-8 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={isSubmitting || isSubscribed}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || isSubscribed}
                className="whitespace-nowrap"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSubscribed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isSubscribed}
              className="w-full"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || isSubscribed}
              className="w-full"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Subscribing...
                </>
              ) : isSubscribed ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSubscribed}
            className="w-full"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || isSubscribed}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Subscribing...
              </>
            ) : isSubscribed ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Successfully Subscribed!
              </>
            ) : (
              'Subscribe to Newsletter'
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Join 10,000+ resellers and brands getting weekly insights. Unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
import { CheckCircle2, Mail, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PartnerSuccessMessageProps {
  email: string;
  partnerType: string;
}

export function PartnerSuccessMessage({ email, partnerType }: PartnerSuccessMessageProps) {
  const partnerTypeLabel = {
    brand: 'Brand',
    retailer: 'Retailer',
    distributor: 'Distributor',
    wholesaler: 'Wholesaler',
  }[partnerType] || 'Partner';

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Application Submitted Successfully!
            </h2>
            <p className="text-muted-foreground">
              Thank you for applying to join BndBox as a {partnerTypeLabel}.
            </p>
          </div>
          
          <div className="bg-background rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>Confirmation sent to <strong>{email}</strong></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Our team typically reviews applications within 2-3 business days</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
                <span>Our team will review your application and verify your business information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
                <span>You'll receive an email with your approval status and next steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</span>
                <span>Once approved, you'll get access to your {partnerTypeLabel} dashboard</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild variant="outline">
              <Link to="/">
                Return to Homepage
              </Link>
            </Button>
            <Button asChild>
              <Link to="/blog">
                Explore Our Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

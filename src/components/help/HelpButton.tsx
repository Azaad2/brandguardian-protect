import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail, MessageCircle, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const quickLinks = [
  {
    title: 'How do I apply to a brand?',
    description: 'Navigate to Brands, browse available suppliers, and click "Apply"',
  },
  {
    title: 'Why can\'t I complete payment?',
    description: 'Disable ad blockers, check your internet connection, or try a different browser',
  },
  {
    title: 'How do I track my applications?',
    description: 'View all applications in the Brands section with real-time status updates',
  },
  {
    title: 'What payment methods are accepted?',
    description: 'We accept credit cards, debit cards, and net banking via Razorpay',
  },
];

const contactOptions = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'support@bndbox.com',
    action: 'mailto:support@bndbox.com',
    label: 'Send Email',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available for premium users',
    action: null,
    label: 'Coming Soon',
    disabled: true,
  },
];

export const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Need Help?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Find answers or contact our support team
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Answers */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Answers</h3>
              <div className="grid gap-3">
                {quickLinks.map((link, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{link.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Contact Options */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
              <div className="grid gap-4">
                {contactOptions.map((option, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <option.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                        {option.action && !option.disabled && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = option.action}
                          >
                            {option.label}
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </Button>
                        )}
                        {option.disabled && (
                          <Button variant="outline" size="sm" disabled>
                            {option.label}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Resources */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Having payment issues?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Try disabling your ad blocker</li>
                <li>• Check your internet connection</li>
                <li>• Use a different browser (Chrome recommended)</li>
                <li>• Clear your browser cache</li>
                <li>• Contact us at support@bndbox.com for manual payment options</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

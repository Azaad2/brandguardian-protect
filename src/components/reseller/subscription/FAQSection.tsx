import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const faqs = [
  {
    question: 'Why isn\'t the payment window opening?',
    answer: 'This is usually caused by browser ad blockers or popup blockers. Try disabling your ad blocker temporarily, or whitelist bndbox.com. If the issue persists, try using a different browser (Chrome or Firefox recommended) or contact support@bndbox.com.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and net banking through our secure payment partner Razorpay. All transactions are encrypted and secure.',
  },
  {
    question: 'Can I try premium features before subscribing?',
    answer: 'Currently, we offer a free tier with basic features. Premium features become available immediately after subscription. If you\'re unsure, contact support@bndbox.com to discuss your needs.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime from this page when you\'re subscribed. Click the "Cancel Subscription" button, and your subscription will remain active until the end of your current billing period.',
  },
  {
    question: 'What happens if my payment fails?',
    answer: 'If your payment fails, you\'ll see a detailed error message. Common issues include insufficient funds, card restrictions, or network problems. Try again or contact your bank. For assistance, email support@bndbox.com.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, and at the next billing cycle for downgrades.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee for first-time subscribers. If you\'re not satisfied, contact support@bndbox.com within 7 days of your subscription for a full refund.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use Razorpay, a PCI DSS compliant payment gateway. We never store your card details on our servers. All payment data is encrypted and handled securely by Razorpay.',
  },
];

export const FAQSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Having trouble with payments? Contact us at <a href="mailto:support@bndbox.com" className="font-medium underline">support@bndbox.com</a> for immediate assistance.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <p className="font-medium mb-2">Still need help?</p>
          <p className="text-sm text-muted-foreground">
            Contact our support team at <a href="mailto:support@bndbox.com" className="font-medium underline">support@bndbox.com</a> or use the help button in the bottom right corner of your screen.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};


import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cancellation & Refund Policy - BndBox</title>
        <meta name="description" content="BndBox Cancellation and Refund Policy - Clear guidelines for subscription cancellations and refund procedures." />
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> January 1, 2024<br />
            <strong>Last Updated:</strong> January 1, 2024
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Overview</h2>
            <p className="text-gray-700 mb-4">
              At BndBox, we want you to be completely satisfied with our service. This policy outlines our cancellation and refund procedures to ensure transparency and fairness for all users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Subscription Cancellation</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">How to Cancel</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You will retain access to paid features until the end of the billing period</li>
              <li>No partial refunds for unused portions of billing periods</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Cancellation Timeline</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Monthly Subscriptions:</strong> Cancel at least 24 hours before renewal to avoid next billing cycle</li>
              <li><strong>Annual Subscriptions:</strong> Cancel at least 30 days before renewal</li>
              <li>You will receive renewal reminders via email before each billing cycle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Refund Policy</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Money-Back Guarantee</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">
                <strong>7-Day Money-Back Guarantee:</strong> New subscribers can request a full refund within 7 days of their first subscription purchase.
              </p>
            </div>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Refund Eligibility</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>New Subscriptions:</strong> 7-day money-back guarantee for first-time subscribers</li>
              <li><strong>Technical Issues:</strong> Refunds may be provided for service disruptions lasting more than 48 hours</li>
              <li><strong>Billing Errors:</strong> We will correct and refund any billing errors within 30 days</li>
              <li><strong>Account Suspension:</strong> No refunds for suspensions due to Terms of Service violations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Non-Refundable Situations</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Subscriptions cancelled after the 7-day guarantee period</li>
              <li>Partial refunds for unused portions of billing periods (except in exceptional circumstances)</li>
              <li>Account suspensions due to policy violations</li>
              <li>Services already rendered or features already accessed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Refund Process</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">How to Request a Refund</h3>
            <ol className="list-decimal pl-6 mb-4 text-gray-700">
              <li>Contact our support team at support@bndbox.com</li>
              <li>Include your account email and reason for the refund request</li>
              <li>Provide any relevant details about billing errors or technical issues</li>
              <li>Our team will review your request within 2 business days</li>
            </ol>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Processing Timeline</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Review Time:</strong> 1-2 business days for refund approval</li>
              <li><strong>Processing Time:</strong> 5-10 business days to process approved refunds</li>
              <li><strong>Refund Method:</strong> Refunds will be processed to your original payment method</li>
              <li><strong>Notification:</strong> You'll receive email confirmation once the refund is processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Pro-rated Refunds</h2>
            <p className="text-gray-700 mb-4">
              In exceptional circumstances, we may provide pro-rated refunds at our sole discretion. This typically applies to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Extended service disruptions caused by BndBox</li>
              <li>Billing system errors affecting multiple users</li>
              <li>Significant changes to service features that materially affect functionality</li>
              <li>Other issues caused directly by BndBox operations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Auto-renewal and Prevention</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Auto-renewal Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>All subscriptions automatically renew unless cancelled</li>
              <li>You can view your next billing date in your account settings</li>
              <li>Renewal reminders are sent 7 days before monthly renewals and 30 days before annual renewals</li>
              <li>You can turn off auto-renewal at any time without losing current access</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Managing Auto-renewal</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700">
                <strong>To prevent unwanted charges:</strong> Log into your account settings and turn off auto-renewal or cancel your subscription before the renewal date. This ensures you won't be charged for the next billing cycle.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Subscription Tiers and Policies</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Our Subscription Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Free Plan</h4>
                <p className="text-sm text-gray-600">Limited brand applications (3 per month)</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Basic Plan</h4>
                <p className="text-sm text-gray-600">Increased application limits and basic features</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Premium Plan</h4>
                <p className="text-sm text-gray-600">Advanced features and priority support</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              All paid plans are subject to the same cancellation and refund policies outlined above, regardless of tier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about cancellations, refunds, or billing issues, contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> support@bndbox.com<br />
                <strong>Billing Support:</strong> billing@bndbox.com<br />
                <strong>Response Time:</strong> Within 24 hours during business days<br />
                <strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Policy Updates</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cancellation & Refund Policy periodically. Material changes will be communicated via email or platform notification at least 30 days before taking effect. Continued use of our services after policy changes constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CancellationRefundPolicy;

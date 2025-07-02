
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Terms of Service - BndBox</title>
        <meta name="description" content="BndBox Terms of Service - Legal terms and conditions for using our marketplace platform." />
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> January 1, 2024<br />
            <strong>Last Updated:</strong> January 1, 2024
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using BndBox ("Platform," "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              BndBox is a marketplace platform that connects brands with authorized resellers. We facilitate business relationships, provide verification services, and enable communication between parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Account Requirements</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You must be at least 18 years old or of legal age in your jurisdiction</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One account per business entity</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Verification Process</h3>
            <p className="text-gray-700 mb-4">
              All users must complete our verification process, which may include providing business licenses, tax documents, and other credentials. We reserve the right to reject applications that do not meet our standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Subscription Plans and Payments</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Subscription Tiers</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Free Plan:</strong> Limited brand applications (3 per month)</li>
              <li><strong>Basic Plan:</strong> Increased application limits and basic features</li>
              <li><strong>Premium Plan:</strong> Advanced features and priority support</li>
              <li><strong>Enterprise Plan:</strong> Custom solutions for large organizations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Payment Terms</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Subscription fees are billed monthly or annually in advance</li>
              <li>All fees are non-refundable except as specified in our Refund Policy</li>
              <li>Prices may change with 30 days written notice</li>
              <li>Failure to pay may result in service suspension</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. User Conduct and Responsibilities</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Prohibited Activities</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Providing false or misleading information</li>
              <li>Engaging in fraudulent or illegal activities</li>
              <li>Violating intellectual property rights</li>
              <li>Harassing or abusing other users</li>
              <li>Attempting to circumvent platform security</li>
              <li>Selling counterfeit or unauthorized products</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Brand Guidelines</h3>
            <p className="text-gray-700 mb-4">
              Resellers must comply with all brand guidelines, MAP policies, and authorized distribution requirements. Violations may result in account suspension.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Platform and its content are protected by intellectual property laws. Users retain rights to their own content but grant us a license to use it for platform operations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Refund and Cancellation Policy</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Subscription Cancellation</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Cancellation takes effect at the end of your current billing period</li>
              <li>You will retain access to paid features until the end of the billing period</li>
              <li>No partial refunds for unused portions of billing periods</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Refund Policy</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>New Subscriptions:</strong> 7-day money-back guarantee for first-time subscribers</li>
              <li><strong>Technical Issues:</strong> Refunds may be provided for service disruptions lasting more than 48 hours</li>
              <li><strong>Billing Errors:</strong> We will correct and refund any billing errors within 30 days</li>
              <li><strong>Account Suspension:</strong> No refunds for suspensions due to Terms violations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Refund Process</h3>
            <p className="text-gray-700 mb-4">
              To request a refund, contact our support team at support@bndbox.com with your account details and reason for the refund request. Approved refunds will be processed within 5-10 business days to your original payment method.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Pro-rated Refunds</h3>
            <p className="text-gray-700 mb-4">
              In exceptional circumstances, we may provide pro-rated refunds at our sole discretion. This typically applies to service disruptions, billing errors, or other issues caused by BndBox.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Auto-renewal and Cancellation</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Cancel at least 24 hours before renewal to avoid next billing cycle</li>
              <li>Annual subscriptions must be cancelled 30 days before renewal</li>
              <li>You will receive renewal reminders via email</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Service Availability and Modifications</h2>
            <p className="text-gray-700 mb-4">
              We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue services with reasonable notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              BndBox acts as a facilitator between brands and resellers. We are not responsible for the performance, quality, or legality of transactions between users. Our liability is limited to the amount paid for our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              Users agree to indemnify and hold BndBox harmless from claims arising from their use of the Platform, violation of these Terms, or infringement of third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              Disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Class action lawsuits are waived.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">13. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend accounts for violations of these Terms, illegal activity, or other reasons at our discretion. Users may terminate their accounts at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">14. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of [Your State/Country]. Any legal actions must be brought in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">15. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms periodically. Material changes will be communicated via email or platform notification at least 30 days before taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">16. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@bndbox.com<br />
                <strong>Support:</strong> support@bndbox.com<br />
                <strong>Address:</strong> BndBox Legal Department<br />
                [Your Business Address]
              </p>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;

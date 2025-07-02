
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy - BndBox</title>
        <meta name="description" content="BndBox Privacy Policy - How we collect, use, and protect your personal information." />
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> January 1, 2024<br />
            <strong>Last Updated:</strong> January 1, 2024
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              BndBox ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform that connects brands with authorized resellers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Name, email address, phone number</li>
              <li>Company name and business information</li>
              <li>Payment and billing information</li>
              <li>Government-issued identification for verification</li>
              <li>Business licenses and tax documentation</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Business Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Marketplace seller IDs (Amazon, eBay, Walmart)</li>
              <li>Sales performance data</li>
              <li>Product categories and inventory</li>
              <li>Transaction history</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Technical Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>IP address, browser type, device information</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Facilitate connections between brands and resellers</li>
              <li>Verify business credentials and prevent fraud</li>
              <li>Process payments and manage subscriptions</li>
              <li>Provide customer support and communications</li>
              <li>Improve our platform and services</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Information Sharing</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">With Brands and Resellers</h3>
            <p className="text-gray-700 mb-4">
              We share relevant business information between brands and resellers to facilitate partnerships, including company details, performance metrics, and contact information.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">With Service Providers</h3>
            <p className="text-gray-700 mb-4">
              We share information with trusted third-party service providers who assist us in operating our platform, processing payments, and providing customer support.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Legal Requirements</h3>
            <p className="text-gray-700 mb-4">
              We may disclose information when required by law, court order, or to protect our rights and safety.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Access, update, or delete your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request data portability</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our services, comply with legal obligations, and resolve disputes. Business verification documents may be retained for regulatory compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. International Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically. We will notify you of material changes via email or platform notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@bndbox.com<br />
                <strong>Address:</strong> BndBox Privacy Team<br />
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

export default PrivacyPolicy;

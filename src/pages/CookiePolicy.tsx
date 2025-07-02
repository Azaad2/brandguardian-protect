
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cookie Policy - BndBox</title>
        <meta name="description" content="BndBox Cookie Policy - How we use cookies and tracking technologies." />
      </Helmet>
      
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> January 1, 2024<br />
            <strong>Last Updated:</strong> January 1, 2024
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. What Are Cookies</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium mb-3 text-gray-800">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, security, and access to secure areas.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Analytics Cookies</h3>
            <p className="text-gray-700 mb-4">
              We use analytics cookies to understand how visitors interact with our website, helping us improve functionality and user experience.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Functionality Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies remember your preferences and choices to provide a more personalized experience.
            </p>

            <h3 className="text-xl font-medium mb-3 text-gray-800">Marketing Cookies</h3>
            <p className="text-gray-700 mb-4">
              With your consent, we may use marketing cookies to show you relevant advertisements and measure campaign effectiveness.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing ones. However, disabling cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that set their own cookies, including analytics providers and payment processors. These cookies are governed by their respective privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our Cookie Policy, please contact us at privacy@bndbox.com.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;

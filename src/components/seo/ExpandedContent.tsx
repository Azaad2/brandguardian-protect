import React from 'react';
import { Link } from 'react-router-dom';

const ExpandedContent = () => {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            The Complete B2B Wholesale Marketplace for Brands and Resellers
          </h2>
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              BndBox is revolutionizing how brands connect with authorized resellers and retailers across multiple 
              e-commerce platforms. Whether you're a premium brand seeking verified wholesale partners or a 
              professional reseller looking for brand approvals, our AI-powered platform streamlines the entire 
              wholesale approval process.
            </p>
            
            <h3 className="text-2xl font-semibold text-foreground mt-8">For Brands: Protect Your Brand & Expand Distribution</h3>
            <p>
              Take control of your brand's marketplace presence with our comprehensive brand protection tools. 
              Our platform helps you identify and verify legitimate resellers while monitoring for unauthorized 
              sellers and MAP policy violations. Connect with pre-vetted resellers who meet your standards for 
              business legitimacy, sales volume, and marketplace performance.
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Automated Reseller Verification:</strong> Review complete business profiles including EIN verification, marketplace storefronts, and sales performance metrics</li>
              <li><strong>MAP Compliance Monitoring:</strong> AI-powered tools track pricing across Amazon, Walmart, and eBay to ensure authorized sellers maintain your brand standards</li>
              <li><strong>Streamlined Approval Workflow:</strong> Manage wholesale applications, approve resellers, and distribute catalogs through one centralized dashboard</li>
              <li><strong>Brand Protection Analytics:</strong> Real-time alerts for unauthorized sellers, counterfeit listings, and policy violations</li>
            </ul>
            
            <h3 className="text-2xl font-semibold text-foreground mt-8">For Resellers: Access Premium Brand Wholesale Opportunities</h3>
            <p>
              Stop sending endless cold emails to brands. BndBox connects you directly with brands actively 
              seeking authorized wholesale partners. Our platform showcases your business legitimacy and 
              marketplace track record, making it easier to get approved for the brands you want to sell.
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Direct Brand Access:</strong> Browse hundreds of brands looking for resellers across categories like electronics, home goods, beauty, and more</li>
              <li><strong>Verified Profile:</strong> Build a comprehensive reseller profile that demonstrates your business legitimacy and marketplace success</li>
              <li><strong>Simplified Applications:</strong> Apply to multiple brands with one profile instead of filling out separate wholesale applications</li>
              <li><strong>Wholesale Catalog Access:</strong> Get instant access to approved brand catalogs with wholesale pricing and product information</li>
              <li><strong>Multi-Marketplace Support:</strong> Whether you sell on Amazon, Walmart, eBay, or your own e-commerce store, connect with brands across all channels</li>
            </ul>
            
            <h3 className="text-2xl font-semibold text-foreground mt-8">Beyond Marketplaces: Traditional Retail & B2B Distribution</h3>
            <p>
              While BndBox specializes in connecting marketplace resellers with brands, we also serve traditional 
              retail buyers, wholesale distributors, and B2B purchasing managers. Brands can use our platform to 
              manage all types of wholesale relationships - from Amazon FBA sellers to brick-and-mortar retail 
              stores to e-commerce boutiques.
            </p>
            
            <p>
              Our verification process ensures all partners meet professional standards, whether they're selling 
              online or through traditional retail channels. This comprehensive approach gives brands complete 
              control over their entire distribution network while providing resellers and retailers with access 
              to premium wholesale opportunities.
            </p>
            
            <h3 className="text-2xl font-semibold text-foreground mt-8">How the BndBox Wholesale Approval Process Works</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li><strong>Reseller Registration:</strong> Complete your profile with business information, marketplace links, and verification documents</li>
              <li><strong>Brand Discovery:</strong> Browse brands in your category or get matched with brands seeking resellers</li>
              <li><strong>Application Submission:</strong> Apply to brands with your verified profile showcasing your business legitimacy</li>
              <li><strong>Brand Review:</strong> Brands review applications using standardized criteria and verification data</li>
              <li><strong>Approval & Access:</strong> Approved resellers receive immediate access to wholesale catalogs and pricing</li>
              <li><strong>Ongoing Compliance:</strong> Our platform monitors both parties to ensure continued compliance with agreements and policies</li>
            </ol>
            
            <div className="mt-12 p-8 bg-primary/5 rounded-xl border border-primary/20">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Started?</h3>
              <p className="mb-6">
                Join thousands of brands and resellers already using BndBox to streamline their wholesale partnerships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/reseller-hub" 
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors"
                >
                  Apply as a Reseller
                </Link>
                <Link 
                  to="/contact" 
                  className="px-6 py-3 bg-background border-2 border-primary text-primary rounded-lg font-semibold text-center hover:bg-primary/5 transition-colors"
                >
                  Register Your Brand
                </Link>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-foreground mt-8">Additional Resources</h3>
            <p>
              Learn more about wholesale distribution, brand protection, and marketplace selling through our 
              comprehensive blog resources:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><Link to="/blog/how-to-get-ungated-any-brand-amazon-2025" className="text-primary hover:underline">How to Get Ungated on Amazon in 2025</Link></li>
              <li><Link to="/blog/amazon-wholesale-vs-private-label" className="text-primary hover:underline">Amazon Wholesale vs Private Label: Which is Right for You?</Link></li>
              <li><Link to="/blog/prevent-unauthorized-sellers-amazon" className="text-primary hover:underline">How to Prevent Unauthorized Sellers on Amazon</Link></li>
              <li><Link to="/blog/enforce-map-policy-prevent-unauthorized-sellers" className="text-primary hover:underline">Enforce Your MAP Policy and Prevent Unauthorized Sellers</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpandedContent;


import React from 'react';
import { Link } from 'react-router-dom';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { Helmet } from 'react-helmet';

const ResellerHubHeader = () => {
  return (
    <>
      <Helmet>
        <title>Amazon Reseller Hub | Brand Wholesale Approval Process | BndBox</title>
        <meta name="description" content="Apply to become an approved Amazon reseller for premium brands. Complete our reseller application for wholesale access to top brands on Amazon, Walmart, and eBay marketplaces." />
        <link rel="canonical" href="https://bndbox.com/reseller-hub" />
        <meta name="keywords" content="amazon reseller application, brand wholesale approval, e-commerce resellers, marketplace seller approval, amazon wholesale application" />
        <meta property="og:title" content="Amazon Reseller Hub | Brand Wholesale Approval Process | BndBox" />
        <meta property="og:description" content="Apply to become an approved Amazon reseller for premium brands. Complete our reseller application for wholesale access to top brands on Amazon, Walmart, and eBay marketplaces." />
        <meta property="og:url" content="https://bndbox.com/reseller-hub" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-bndbox.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amazon Reseller Hub | Brand Wholesale Approval Process | BndBox" />
        <meta name="twitter:description" content="Apply to become an approved Amazon reseller for premium brands. Complete our reseller application for wholesale access to top brands." />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-bndbox.png" />
      </Helmet>
      <div className="mb-8 flex justify-between items-center">
        <Link to="/" className="inline-block">
          <BndBoxLogo className="h-10" />
        </Link>
        <Link 
          to="/" 
          className="text-bndbox-600 hover:text-bndbox-700 font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default ResellerHubHeader;

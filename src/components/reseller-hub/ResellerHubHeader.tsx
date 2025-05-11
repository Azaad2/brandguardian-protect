
import React from 'react';
import { Link } from 'react-router-dom';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { Helmet } from 'react-helmet';

const ResellerHubHeader = () => {
  return (
    <>
      <Helmet>
        <title>Reseller Hub | Brand Wholesale Approval | BndBox</title>
        <meta name="description" content="Apply to become an approved reseller for premium brands on Amazon, Walmart, and eBay marketplaces. Complete our reseller application for wholesale access." />
        <link rel="canonical" href="https://bndbox.com/reseller-hub" />
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

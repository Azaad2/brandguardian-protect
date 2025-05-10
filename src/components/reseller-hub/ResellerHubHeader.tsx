
import React from 'react';
import { Link } from 'react-router-dom';
import BndBoxLogo from '@/components/branding/BndBoxLogo';

const ResellerHubHeader = () => {
  return (
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
  );
};

export default ResellerHubHeader;

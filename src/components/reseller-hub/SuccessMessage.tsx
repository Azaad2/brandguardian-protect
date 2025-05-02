
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';

interface SuccessMessageProps {
  email: string;
  onReset: () => void;
}

const SuccessMessage = ({ email, onReset }: SuccessMessageProps) => {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center bg-white p-8 rounded-lg shadow-md">
      <CheckCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your interest in becoming a verified reseller with BndBox. We've received your application and will review it within 3-5 business days.
      </p>
      <p className="text-md text-gray-600 mb-8">
        We'll contact you at <strong>{email}</strong> with next steps.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="outline">
          Submit another application
        </Button>
        <Button asChild>
          <Link to="/">Return to homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;


import React from 'react';

interface PullQuoteProps {
  quote: string;
  description: string;
  variant?: 'blue' | 'red' | 'yellow' | 'green';
}

const PullQuote: React.FC<PullQuoteProps> = ({ quote, description, variant = 'blue' }) => {
  const colorClasses = {
    blue: {
      container: 'bg-blue-50 border-l-4 border-blue-500',
      quote: 'text-blue-900',
      description: 'text-blue-700'
    },
    red: {
      container: 'bg-red-50 border-l-4 border-red-500',
      quote: 'text-red-900',
      description: 'text-red-700'
    },
    yellow: {
      container: 'bg-yellow-50 border-l-4 border-yellow-500',
      quote: 'text-yellow-900',
      description: 'text-yellow-700'
    },
    green: {
      container: 'bg-green-50 border-l-4 border-green-500',
      quote: 'text-green-900',
      description: 'text-green-700'
    }
  };

  const colors = colorClasses[variant];

  return (
    <div className={`${colors.container} p-6 my-8 rounded-r-lg`}>
      <blockquote className={`text-2xl font-semibold ${colors.quote} mb-2`}>
        "{quote}"
      </blockquote>
      <p className={colors.description}>
        {description}
      </p>
    </div>
  );
};

export default PullQuote;

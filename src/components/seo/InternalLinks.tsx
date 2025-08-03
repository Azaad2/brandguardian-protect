import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface InternalLinksProps {
  currentPage?: string;
  category?: string;
  className?: string;
}

export const InternalLinks: React.FC<InternalLinksProps> = ({ 
  currentPage, 
  category, 
  className = "" 
}) => {
  const getRelevantLinks = () => {
    const allLinks = [
      { url: '/blog/amazon-wholesale-vs-private-label', title: 'Amazon Wholesale vs Private Label Guide', category: 'amazon' },
      { url: '/blog/amazon-brand-registry-benefits', title: 'Amazon Brand Registry Benefits', category: 'amazon' },
      { url: '/blog/how-to-get-ungated-any-brand-amazon-2025', title: 'Get Ungated on Amazon 2025', category: 'amazon' },
      { url: '/blog/master-amazon-reseller-business', title: 'Master Amazon Reseller Business', category: 'reseller' },
      { url: '/blog/unlock-amazon-wholesale-success', title: 'Unlock Amazon Wholesale Success', category: 'wholesale' },
      { url: '/blog/prevent-unauthorized-sellers-amazon', title: 'Prevent Unauthorized Sellers', category: 'brand-protection' },
      { url: '/blog/identify-remove-counterfeit-products', title: 'Remove Counterfeit Products', category: 'brand-protection' },
      { url: '/blog/enforce-map-policy-prevent-unauthorized-sellers-amazon', title: 'Enforce MAP Policy', category: 'brand-protection' },
      { url: '/reseller-hub', title: 'Reseller Hub - Apply Now', category: 'reseller' },
      { url: '/about', title: 'About BndBox', category: 'company' },
    ];

    // Filter based on current page and category
    let filteredLinks = allLinks.filter(link => link.url !== currentPage);
    
    if (category) {
      // Prioritize links in the same category
      const categoryLinks = filteredLinks.filter(link => link.category === category);
      const otherLinks = filteredLinks.filter(link => link.category !== category);
      filteredLinks = [...categoryLinks.slice(0, 3), ...otherLinks.slice(0, 2)];
    }
    
    return filteredLinks.slice(0, 5);
  };

  const relevantLinks = getRelevantLinks();

  if (relevantLinks.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Related Resources
      </h3>
      <div className="space-y-3">
        {relevantLinks.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className="flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-bndbox-600">
              {link.title}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-bndbox-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InternalLinks;
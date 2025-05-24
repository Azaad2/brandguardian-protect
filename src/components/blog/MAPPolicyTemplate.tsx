
import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { trackSEOInteraction } from '@/lib/analytics';

const MAPPolicyTemplate: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 my-12">
      <div className="flex items-start gap-4">
        <Download className="w-8 h-8 text-green-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Free MAP Policy Template Download</h3>
          <p className="text-gray-700 mb-4">
            Get our comprehensive MAP policy template that includes Amazon-specific clauses, enforcement procedures, and legal defensibility guidelines. This template has been refined through hundreds of successful implementations.
          </p>
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-600">✓ Amazon marketplace-specific provisions</p>
            <p className="text-sm text-gray-600">✓ Graduated enforcement procedures</p>
            <p className="text-sm text-gray-600">✓ Legal compliance guidelines</p>
            <p className="text-sm text-gray-600">✓ Implementation checklist</p>
          </div>
          <Link 
            to="/brand"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={() => trackSEOInteraction('Lead_Magnet', 'Article', 'MAP Policy Template')}
          >
            <Download className="w-4 h-4" />
            Download Free Template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MAPPolicyTemplate;

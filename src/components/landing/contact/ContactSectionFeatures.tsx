
import { CheckCircle2 } from "lucide-react";

export const ContactSectionFeatures = () => {
  return (
    <div className="space-y-6">
      <FeatureItem 
        title="Advanced AI Monitoring"
        description="24/7 automated surveillance of your listings"
      />
      
      <FeatureItem 
        title="Comprehensive Dashboard"
        description="Full visibility into your brand's Amazon presence"
      />
      
      <FeatureItem 
        title="Dedicated Support"
        description="Expert guidance from our brand protection specialists"
      />
    </div>
  );
};

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem = ({ title, description }: FeatureItemProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

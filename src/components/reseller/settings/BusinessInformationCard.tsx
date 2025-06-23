
import { Building } from "lucide-react";

interface BusinessInformationCardProps {
  profile: {
    company_name: string;
    business_type: string;
    ein_number: string;
  };
  formatBusinessType: (type: string) => string;
}

const BusinessInformationCard = ({ profile, formatBusinessType }: BusinessInformationCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building className="h-4 w-4" />
        Business Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Company Name</label>
          <p className="text-sm">{profile.company_name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Business Type</label>
          <p className="text-sm">{formatBusinessType(profile.business_type)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">EIN Number</label>
          <p className="text-sm">{profile.ein_number}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessInformationCard;

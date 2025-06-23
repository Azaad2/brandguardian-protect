
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ResellerProfile {
  company_name: string;
  status: string;
}

interface ResellerProfileHeaderProps {
  profile: ResellerProfile;
  getStatusBadge: (status: string) => JSX.Element;
}

const ResellerProfileHeader = ({ profile, getStatusBadge }: ResellerProfileHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        {profile.company_name}
      </CardTitle>
      {getStatusBadge(profile.status)}
    </div>
  );
};

export default ResellerProfileHeader;


import { Mail } from "lucide-react";

interface ContactInformationCardProps {
  profile: {
    email: string;
    phone: string;
    linkedin?: string;
  };
}

const ContactInformationCard = ({ profile }: ContactInformationCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="text-sm">{profile.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <p className="text-sm">{profile.phone}</p>
        </div>
        {profile.linkedin && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
            <p className="text-sm">{profile.linkedin}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformationCard;

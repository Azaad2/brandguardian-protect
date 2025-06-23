
import { Globe } from "lucide-react";

interface MarketplaceInformationCardProps {
  profile: {
    amazon_seller_id?: string;
    walmart_seller_id?: string;
    ebay_seller_id?: string;
  };
}

const MarketplaceInformationCard = ({ profile }: MarketplaceInformationCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Marketplace Profiles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profile.amazon_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Amazon Seller ID</label>
            <p className="text-sm">{profile.amazon_seller_id}</p>
          </div>
        )}
        {profile.walmart_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Walmart Seller ID</label>
            <p className="text-sm">{profile.walmart_seller_id}</p>
          </div>
        )}
        {profile.ebay_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">eBay Seller ID</label>
            <p className="text-sm">{profile.ebay_seller_id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceInformationCard;

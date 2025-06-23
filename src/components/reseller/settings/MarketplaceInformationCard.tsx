
import { Globe, ExternalLink } from "lucide-react";

interface MarketplaceInformationCardProps {
  profile: {
    amazon_seller_id?: string;
    walmart_seller_id?: string;
    ebay_seller_id?: string;
  };
}

const MarketplaceInformationCard = ({ profile }: MarketplaceInformationCardProps) => {
  const getMarketplaceUrl = (platform: string, sellerId: string) => {
    switch (platform) {
      case 'amazon':
        return `https://www.amazon.com/s?me=${sellerId}`;
      case 'walmart':
        return `https://www.walmart.com/seller/${sellerId}`;
      case 'ebay':
        return `https://www.ebay.com/usr/${sellerId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Marketplace Profiles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profile.amazon_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Amazon Store</label>
            <div className="flex items-center gap-2">
              <a 
                href={getMarketplaceUrl('amazon', profile.amazon_seller_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                View Store <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-1">ID: {profile.amazon_seller_id}</p>
          </div>
        )}
        {profile.walmart_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Walmart Store</label>
            <div className="flex items-center gap-2">
              <a 
                href={getMarketplaceUrl('walmart', profile.walmart_seller_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                View Store <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-1">ID: {profile.walmart_seller_id}</p>
          </div>
        )}
        {profile.ebay_seller_id && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">eBay Store</label>
            <div className="flex items-center gap-2">
              <a 
                href={getMarketplaceUrl('ebay', profile.ebay_seller_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
              >
                View Store <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-1">ID: {profile.ebay_seller_id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceInformationCard;

import { Badge } from '@/components/ui/badge';
import { Handshake } from 'lucide-react';

export function PartnerHubHeader() {
  return (
    <div className="text-center space-y-4">
      <Badge variant="outline" className="text-primary border-primary/30">
        Partner Network
      </Badge>
      <div className="flex items-center justify-center gap-3">
        <Handshake className="h-10 w-10 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Partner Hub
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Join BndBox's trusted network of brands, retailers, distributors, and wholesalers. 
        Connect with verified partners and grow your business.
      </p>
    </div>
  );
}

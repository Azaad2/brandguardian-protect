import { Building2, Store, Truck, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PartnerType, PartnerTypeOption } from './types';

const partnerTypes: PartnerTypeOption[] = [
  {
    type: 'brand',
    title: 'Brand',
    description: 'Product manufacturers and brand owners looking to expand distribution',
    icon: 'building',
    benefits: ['Access verified resellers', 'Protect your brand', 'Scale distribution'],
  },
  {
    type: 'retailer',
    title: 'Retailer',
    description: 'Online and physical retailers selling products across marketplaces',
    icon: 'store',
    benefits: ['Source authentic products', 'Get brand authorization', 'Access wholesale pricing'],
  },
  {
    type: 'distributor',
    title: 'Distributor',
    description: 'Regional or national distributors with warehouse capabilities',
    icon: 'truck',
    benefits: ['Connect with brands', 'Expand product lines', 'Grow your network'],
  },
  {
    type: 'wholesaler',
    title: 'Wholesaler',
    description: 'Bulk product suppliers serving retailers and resellers',
    icon: 'package',
    benefits: ['Find new customers', 'List your inventory', 'Streamline sales'],
  },
];

const iconMap = {
  building: Building2,
  store: Store,
  truck: Truck,
  package: Package,
};

interface PartnerTypeSelectorProps {
  selectedType: PartnerType | null;
  onSelect: (type: PartnerType) => void;
}

export function PartnerTypeSelector({ selectedType, onSelect }: PartnerTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">What type of partner are you?</h2>
        <p className="text-muted-foreground mt-2">
          Select your business type to get started with the right application
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerTypes.map((partner) => {
          const Icon = iconMap[partner.icon as keyof typeof iconMap];
          const isSelected = selectedType === partner.type;
          
          return (
            <Card
              key={partner.type}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50',
                isSelected && 'border-primary ring-2 ring-primary/20 bg-primary/5'
              )}
              onClick={() => onSelect(partner.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'p-3 rounded-lg',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="bg-primary">
                      Selected
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{partner.title}</CardTitle>
                <CardDescription className="text-sm">
                  {partner.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {partner.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

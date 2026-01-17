import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';
import { PartnerFormValues, shippingRegionLabels, certificationLabels } from '../PartnerFormSchema';

interface DistributorDetailsSectionProps {
  form: UseFormReturn<PartnerFormValues>;
  partnerType: 'distributor' | 'wholesaler';
}

export function DistributorDetailsSection({ form, partnerType }: DistributorDetailsSectionProps) {
  const title = partnerType === 'distributor' ? 'Distribution Details' : 'Wholesale Details';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Truck className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minOrderValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order Value ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="warehouseLocations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse Locations</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Los Angeles, CA; Dallas, TX" 
                    onChange={(e) => field.onChange(e.target.value.split(';').map(s => s.trim()).filter(Boolean))}
                    value={field.value?.join('; ') || ''}
                  />
                </FormControl>
                <FormDescription>Separate multiple locations with semicolons</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="brandsCarried"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brands Currently Carried</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Brand A; Brand B; Brand C" 
                  onChange={(e) => field.onChange(e.target.value.split(';').map(s => s.trim()).filter(Boolean))}
                  value={field.value?.join('; ') || ''}
                />
              </FormControl>
              <FormDescription>Separate multiple brands with semicolons</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="shippingRegions"
          render={() => (
            <FormItem>
              <FormLabel>Shipping Regions *</FormLabel>
              <FormDescription>Select all regions you can ship to</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {Object.entries(shippingRegionLabels).map(([value, label]) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="shippingRegions"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(value as any)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, value]);
                              } else {
                                field.onChange(current.filter((v) => v !== value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="certifications"
          render={() => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormDescription>Select any applicable certifications</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {Object.entries(certificationLabels).map(([value, label]) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(value as any)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, value]);
                              } else {
                                field.onChange(current.filter((v) => v !== value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

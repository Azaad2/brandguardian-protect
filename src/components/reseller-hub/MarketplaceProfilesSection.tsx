
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormValues } from './ResellerFormSchema';

const MarketplaceProfilesSection = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Marketplace Profiles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="amazonStoreLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Store Link *</FormLabel>
              <FormControl>
                <Input placeholder="https://www.amazon.com/shops/your-store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="walmartStoreLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Walmart Store Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.walmart.com/seller/your-store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ebayStoreLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>eBay Store Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.ebay.com/str/your-store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MarketplaceProfilesSection;

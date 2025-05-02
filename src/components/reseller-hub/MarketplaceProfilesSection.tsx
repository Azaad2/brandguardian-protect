
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
          name="amazonSellerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Seller ID</FormLabel>
              <FormControl>
                <Input placeholder="Your Amazon Seller ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="walmartSellerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Walmart Marketplace ID (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your Walmart ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ebaySellerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>eBay Seller ID (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your eBay ID" {...field} />
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

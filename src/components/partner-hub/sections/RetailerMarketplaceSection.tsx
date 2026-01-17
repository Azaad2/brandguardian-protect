import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { PartnerFormValues } from '../PartnerFormSchema';

interface RetailerMarketplaceSectionProps {
  form: UseFormReturn<PartnerFormValues>;
}

export function RetailerMarketplaceSection({ form }: RetailerMarketplaceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Store className="h-5 w-5 text-primary" />
          Marketplace Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amazonStoreLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amazon Storefront URL *</FormLabel>
                <FormControl>
                  <Input placeholder="https://amazon.com/shops/yourstore" {...field} />
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
                <FormLabel>Walmart Marketplace URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://walmart.com/seller/yourstore" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ebayStoreLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>eBay Store URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://ebay.com/str/yourstore" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="storeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Physical Store Locations</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="monthlySalesVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Sales Volume</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select monthly volume" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="under_10k">Under $10K/month</SelectItem>
                  <SelectItem value="10k_50k">$10K - $50K/month</SelectItem>
                  <SelectItem value="50k_100k">$50K - $100K/month</SelectItem>
                  <SelectItem value="100k_500k">$100K - $500K/month</SelectItem>
                  <SelectItem value="500k_1m">$500K - $1M/month</SelectItem>
                  <SelectItem value="over_1m">Over $1M/month</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { PartnerFormValues, distributionChannelLabels } from '../PartnerFormSchema';

interface BrandDetailsSectionProps {
  form: UseFormReturn<PartnerFormValues>;
}

const lookingForOptions = [
  { value: 'resellers', label: 'Amazon/Online Resellers' },
  { value: 'distributors', label: 'Regional Distributors' },
  { value: 'retailers', label: 'Retail Stores' },
  { value: 'wholesalers', label: 'Wholesalers' },
];

export function BrandDetailsSection({ form }: BrandDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" />
          Brand Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Brand Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="productCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Products *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product count" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under_50">Under 50 SKUs</SelectItem>
                    <SelectItem value="50_200">50 - 200 SKUs</SelectItem>
                    <SelectItem value="200_500">200 - 500 SKUs</SelectItem>
                    <SelectItem value="500_1000">500 - 1,000 SKUs</SelectItem>
                    <SelectItem value="over_1000">Over 1,000 SKUs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="annualRevenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Revenue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="under_100k">Under $100K</SelectItem>
                  <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                  <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                  <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                  <SelectItem value="over_10m">Over $10M</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="distributionChannels"
          render={() => (
            <FormItem>
              <FormLabel>Current Distribution Channels</FormLabel>
              <FormDescription>Select all platforms where you currently sell</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {Object.entries(distributionChannelLabels).map(([value, label]) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="distributionChannels"
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
          name="lookingFor"
          render={() => (
            <FormItem>
              <FormLabel>What are you looking for?</FormLabel>
              <FormDescription>Select all partner types you're interested in</FormDescription>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {lookingForOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="lookingFor"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value as any)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, option.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== option.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {option.label}
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


import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { FormValues } from './ResellerFormSchema';

const SalesPerformanceSection = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="salesVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Monthly Sales Volume</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales volume" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="under_10k">Under $10,000</SelectItem>
                  <SelectItem value="10k_50k">$10,000 - $50,000</SelectItem>
                  <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k_500k">$100,000 - $500,000</SelectItem>
                  <SelectItem value="500k_1m">$500,000 - $1 million</SelectItem>
                  <SelectItem value="over_1m">Over $1 million</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="wholesaleBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wholesale Purchasing Budget</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="under_5k">Under $5,000</SelectItem>
                  <SelectItem value="5k_10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k_25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k_50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="over_100k">Over $100,000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="feedbackScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Feedback Score (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 98% positive" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SalesPerformanceSection;


import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./FormValidationSchema";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ 
  form, 
  isSubmitting 
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Smith" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="you@company.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Brand, Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="marketplaces"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marketplace(s) You Sell On</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select marketplace(s)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="walmart">Walmart</SelectItem>
                <SelectItem value="ebay">eBay</SelectItem>
                <SelectItem value="amazon_walmart">Amazon & Walmart</SelectItem>
                <SelectItem value="amazon_ebay">Amazon & eBay</SelectItem>
                <SelectItem value="walmart_ebay">Walmart & eBay</SelectItem>
                <SelectItem value="all">All Marketplaces</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="amazonLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amazon Store Link (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://www.amazon.com/your-store" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Details (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us more about your reseller needs..."
                className="resize-none flex-1"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Get Started Free"}
      </Button>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        By submitting this form, you agree to our privacy policy and terms of service.
      </p>
    </>
  );
};

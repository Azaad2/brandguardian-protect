
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import DocumentUpload from './DocumentUpload';
import { FormValues } from './ResellerFormSchema';

interface BusinessInformationSectionProps {
  documentFile: File | null;
  setDocumentFile: (file: File | null) => void;
}

const BusinessInformationSection = ({ 
  documentFile, 
  setDocumentFile 
}: BusinessInformationSectionProps) => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="einNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EIN Number</FormLabel>
              <FormControl>
                <Input placeholder="XX-XXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <DocumentUpload 
        documentFile={documentFile} 
        setDocumentFile={setDocumentFile} 
      />
    </div>
  );
};

export default BusinessInformationSection;

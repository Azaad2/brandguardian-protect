
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CSVUploadResult {
  success: boolean;
  message: string;
  added: number;
  errors?: Array<{ row: number; message: string }>;
}

export const useBrandCSVUpload = () => {
  const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<CSVUploadResult> => {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const errors: Array<{ row: number; message: string }> = [];
      let added = 0;

      // Expected headers
      const expectedHeaders = ['name', 'website_url', 'description', 'contact_email', 'logo_url', 'categories', 'approval_rate', 'response_time', 'department'];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length !== headers.length) {
            errors.push({ row: i + 1, message: 'Column count mismatch' });
            continue;
          }

          const brandData: any = {};
          headers.forEach((header, index) => {
            brandData[header] = values[index] || null;
          });

          // Validate required fields
          if (!brandData.name || !brandData.contact_email) {
            errors.push({ row: i + 1, message: 'Missing required fields (name, contact_email)' });
            continue;
          }

          // Process categories
          const categories = brandData.categories 
            ? brandData.categories.split(';').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
            : [];

          // Process numeric fields
          const approval_rate = brandData.approval_rate ? parseFloat(brandData.approval_rate) : null;
          const response_time = brandData.response_time ? parseFloat(brandData.response_time) : null;

          // Insert brand using admin function
          const { error } = await supabase.rpc('admin_add_brand', {
            brand_data: {
              name: brandData.name,
              website_url: brandData.website_url || null,
              description: brandData.description || null,
              contact_email: brandData.contact_email,
              logo_url: brandData.logo_url || null,
              categories: categories.length > 0 ? categories : null,
              approval_rate: approval_rate,
              response_time: response_time,
              department: brandData.department || null, // Ensure department is included
              is_active: true
            }
          });

          if (error) {
            errors.push({ row: i + 1, message: error.message });
          } else {
            added++;
          }
        } catch (error) {
          errors.push({ row: i + 1, message: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      return {
        success: true,
        message: `Upload completed. Added ${added} brands${errors.length > 0 ? ` with ${errors.length} errors` : ''}.`,
        added,
        errors: errors.length > 0 ? errors : undefined
      };
    },
    onSuccess: (result) => {
      setUploadResult(result);
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Upload Complete',
        description: result.message,
      });
    },
    onError: (error) => {
      const result: CSVUploadResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
        added: 0
      };
      setUploadResult(result);
      toast({
        title: 'Upload Failed',
        description: result.message,
        variant: 'destructive',
      });
    },
  });

  const clearResult = () => setUploadResult(null);

  return {
    uploadCSV: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    uploadResult,
    clearResult,
  };
};

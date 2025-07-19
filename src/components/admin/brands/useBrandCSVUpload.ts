
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

      console.log(`Processing CSV with ${lines.length - 1} data rows`);

      // Better CSV parsing that handles quoted fields
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++; // Skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      const errors: Array<{ row: number; message: string }> = [];
      let added = 0;

      console.log('CSV Headers detected:', headers);

      // Process in batches to avoid timeouts
      const BATCH_SIZE = 50;
      const dataLines = lines.slice(1);
      
      for (let batchStart = 0; batchStart < dataLines.length; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, dataLines.length);
        console.log(`Processing batch ${Math.floor(batchStart / BATCH_SIZE) + 1}: rows ${batchStart + 2} to ${batchEnd + 1}`);
        
        const batchPromises = [];
        
        for (let i = batchStart; i < batchEnd; i++) {
          const rowIndex = i + 2; // +2 because we removed header and arrays are 0-indexed
          
          const processBrand = async () => {
            try {
              const values = parseCSVLine(dataLines[i]);
              
              if (values.length !== headers.length) {
                return { row: rowIndex, error: 'Column count mismatch' };
              }

              const brandData: any = {};
              headers.forEach((header, index) => {
                brandData[header.toLowerCase()] = values[index] || null;
              });

              // Validate required fields
              if (!brandData.name || !brandData.contact_email) {
                return { row: rowIndex, error: 'Missing required fields (name, contact_email)' };
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
                  department: brandData.department || null,
                  is_active: true
                }
              });

              if (error) {
                console.error(`Error inserting brand at row ${rowIndex}:`, error);
                return { row: rowIndex, error: error.message };
              } else {
                return { row: rowIndex, success: true };
              }
            } catch (error) {
              console.error(`Exception processing row ${rowIndex}:`, error);
              return { row: rowIndex, error: error instanceof Error ? error.message : 'Unknown error' };
            }
          };
          
          batchPromises.push(processBrand());
        }
        
        // Process batch in parallel
        const batchResults = await Promise.all(batchPromises);
        
        // Collect results
        batchResults.forEach(result => {
          if (result.success) {
            added++;
          } else {
            errors.push({ row: result.row, message: result.error });
          }
        });

        // Add small delay between batches to prevent overwhelming the database
        if (batchEnd < dataLines.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
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

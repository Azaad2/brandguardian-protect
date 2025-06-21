
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CSVError {
  row: number;
  message: string;
}

interface UploadResult {
  success: boolean;
  message: string;
  added?: number;
  errors?: CSVError[];
}

interface BrandCSVRow {
  name: string;
  website_url: string;
  description: string;
  contact_email: string;
  logo_url: string;
  categories: string;
  approval_rate: string;
  response_time: string;
}

export const useBrandCSVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const parseCSV = (csvText: string): BrandCSVRow[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        return row as BrandCSVRow;
      });
  };

  const validateBrand = (brand: BrandCSVRow, rowIndex: number): string | null => {
    if (!brand.name?.trim()) {
      return 'Brand name is required';
    }
    if (!brand.contact_email?.trim()) {
      return 'Contact email is required';
    }
    if (brand.contact_email && !/\S+@\S+\.\S+/.test(brand.contact_email)) {
      return 'Invalid email format';
    }
    if (brand.approval_rate && (isNaN(parseFloat(brand.approval_rate)) || parseFloat(brand.approval_rate) < 0 || parseFloat(brand.approval_rate) > 100)) {
      return 'Approval rate must be a number between 0 and 100';
    }
    if (brand.response_time && (isNaN(parseFloat(brand.response_time)) || parseFloat(brand.response_time) < 0)) {
      return 'Response time must be a positive number';
    }
    return null;
  };

  const uploadCSV = async (file: File): Promise<boolean> => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const csvText = await file.text();
      const brands = parseCSV(csvText);
      
      if (brands.length === 0) {
        setUploadResult({
          success: false,
          message: 'No valid brands found in CSV file'
        });
        return false;
      }

      const errors: CSVError[] = [];
      const validBrands = [];

      // Validate each brand
      for (let i = 0; i < brands.length; i++) {
        const brand = brands[i];
        const error = validateBrand(brand, i + 2); // +2 because of header and 0-indexing
        
        if (error) {
          errors.push({ row: i + 2, message: error });
        } else {
          validBrands.push({
            name: brand.name.trim(),
            website_url: brand.website_url?.trim() || null,
            description: brand.description?.trim() || null,
            contact_email: brand.contact_email.trim(),
            logo_url: brand.logo_url?.trim() || null,
            categories: brand.categories?.trim() ? 
              brand.categories.split(',').map(c => c.trim()).filter(c => c) : [],
            approval_rate: brand.approval_rate?.trim() ? parseFloat(brand.approval_rate) : null,
            response_time: brand.response_time?.trim() ? parseFloat(brand.response_time) : null,
            is_active: true
          });
        }
      }

      let addedCount = 0;

      // Insert valid brands
      for (const brandData of validBrands) {
        try {
          const { error } = await supabase.rpc('admin_add_brand', {
            brand_data: brandData
          });
          
          if (error) {
            console.error('Error adding brand:', error);
            errors.push({
              row: brands.findIndex(b => b.name === brandData.name) + 2,
              message: `Failed to add brand: ${error.message}`
            });
          } else {
            addedCount++;
          }
        } catch (err) {
          console.error('Exception adding brand:', err);
          errors.push({
            row: brands.findIndex(b => b.name === brandData.name) + 2,
            message: 'Unexpected error occurred'
          });
        }
      }

      setUploadResult({
        success: addedCount > 0,
        message: addedCount > 0 ? 
          `Successfully uploaded ${addedCount} brands` : 
          'No brands were added',
        added: addedCount,
        errors: errors.length > 0 ? errors : undefined
      });

      if (addedCount > 0) {
        toast({
          title: 'Bulk Upload Complete',
          description: `Successfully added ${addedCount} brands to the directory.`,
        });
      }

      return addedCount > 0;

    } catch (error) {
      console.error('CSV upload error:', error);
      setUploadResult({
        success: false,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      toast({
        title: 'Upload Failed',
        description: 'There was an error processing your CSV file.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const clearResult = () => {
    setUploadResult(null);
  };

  return {
    uploadCSV,
    isUploading,
    uploadResult,
    clearResult,
  };
};

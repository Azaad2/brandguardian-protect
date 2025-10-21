import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ColumnMapping {
  [key: string]: string;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
}

export const useDistributorCSVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileSize = selectedFile.size / 1024 / 1024; // MB
    if (fileSize > 20) {
      toast.error('File size must be less than 20MB');
      return;
    }

    setFile(selectedFile);
    
    try {
      const data = await parseFile(selectedFile);
      setCsvData(data);
      autoMapColumns(data[0]);
      toast.success(`Loaded ${data.length} rows from file`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse file. Please check the format.');
      setFile(null);
    }
  };

  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const autoMapColumns = (firstRow: any) => {
    if (!firstRow) return;
    
    const mapping: ColumnMapping = {};
    const headers = Object.keys(firstRow);
    
    // Auto-map common column names
    const commonMappings: Record<string, string[]> = {
      company_name: ['company_name', 'company', 'name', 'business_name', 'distributor_name'],
      contact_email: ['contact_email', 'email', 'e-mail', 'contact_mail'],
      contact_phone: ['contact_phone', 'phone', 'telephone', 'contact_number', 'mobile'],
      website_url: ['website_url', 'website', 'url', 'web'],
      country_code: ['country_code', 'country', 'country_iso'],
      state_province: ['state_province', 'state', 'province', 'region'],
      city: ['city', 'town'],
      description: ['description', 'desc', 'about', 'bio'],
      business_type: ['business_type', 'type', 'business_category'],
      categories: ['categories', 'category', 'product_categories', 'products'],
    };

    headers.forEach(header => {
      const normalized = header.toLowerCase().trim().replace(/\s+/g, '_');
      
      Object.entries(commonMappings).forEach(([field, variations]) => {
        if (variations.some(v => normalized.includes(v))) {
          mapping[field] = header;
        }
      });
    });

    setColumnMapping(mapping);
  };

  const handleColumnMapping = (field: string, column: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column === 'skip' ? '' : column
    }));
  };

  const validateData = (): string[] => {
    const errors: string[] = [];
    
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return '';
      return String(value).trim();
    };
    
    csvData.forEach((row, index) => {
      const rowNum = index + 2; // +2 because index starts at 0 and first row is header
      
      // Validate required fields
      const companyName = columnMapping.company_name ? safeString(row[columnMapping.company_name]) : '';
      if (!companyName) {
        errors.push(`Row ${rowNum}: Company name is required`);
      }
      
      // Validate email format if provided (optional field)
      const email = columnMapping.contact_email ? safeString(row[columnMapping.contact_email]) : '';
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push(`Row ${rowNum}: Invalid email format`);
        }
        
        // Validate email uniqueness in the dataset
        const duplicates = csvData.filter(r => {
          const otherEmail = columnMapping.contact_email ? safeString(r[columnMapping.contact_email]) : '';
          return otherEmail === email;
        });
        if (duplicates.length > 1) {
          errors.push(`Row ${rowNum}: Duplicate email ${email} found in file`);
        }
      }
    });

    setValidationErrors(errors);
    return errors;
  };

  const handleUpload = async () => {
    console.log('handleUpload called');
    const errors = validateData();
    console.log('Validation errors:', errors);
    
    if (errors.length > 0) {
      toast.error(`Cannot import: ${errors.length} validation error${errors.length > 1 ? 's' : ''} found. Please review and fix.`);
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const batchSize = 100;
      const totalBatches = Math.ceil(csvData.length / batchSize);
      console.log(`Starting upload: ${csvData.length} distributors in ${totalBatches} batches`);
      
      for (let i = 0; i < totalBatches; i++) {
        const batch = csvData.slice(i * batchSize, (i + 1) * batchSize);
        const distributors = batch.map(row => mapRowToDistributor(row));
        
        console.log(`Uploading batch ${i + 1}/${totalBatches}:`, distributors.slice(0, 2));
        
        const { data, error } = await supabase
          .from('distributors')
          .insert(distributors)
          .select();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        
        console.log(`Batch ${i + 1} uploaded successfully`);
        const progress = Math.round(((i + 1) / totalBatches) * 100);
        setUploadProgress(progress);
      }

      setUploadStatus('success');
      toast.success(`Successfully imported ${csvData.length} distributors!`);
      console.log('Upload completed successfully');
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        full: error
      });
      setUploadStatus('error');
      const errorMsg = error.message || 'Failed to import distributors';
      toast.error(`Import failed: ${errorMsg}`);
    }
  };

  const mapRowToDistributor = (row: any) => {
    const safeString = (value: any): string | null => {
      if (value === null || value === undefined) return null;
      return String(value).trim() || null;
    };

    const distributor: any = {
      company_name: columnMapping.company_name ? safeString(row[columnMapping.company_name]) : null,
      contact_email: columnMapping.contact_email ? safeString(row[columnMapping.contact_email]) : null,
    };

    // Map optional fields
    const optionalMappings = [
      'legal_name', 'contact_phone', 'website_url', 'country_code',
      'state_province', 'city', 'address', 'postal_code', 'description',
      'business_type', 'logo_url', 'payment_terms'
    ];

    optionalMappings.forEach(field => {
      if (columnMapping[field] && row[columnMapping[field]]) {
        distributor[field] = safeString(row[columnMapping[field]]);
      }
    });

    // Handle array fields
    if (columnMapping.categories && row[columnMapping.categories]) {
      distributor.categories = String(row[columnMapping.categories])
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (columnMapping.brands_carried && row[columnMapping.brands_carried]) {
      distributor.brands_carried = String(row[columnMapping.brands_carried])
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (columnMapping.shipping_regions && row[columnMapping.shipping_regions]) {
      distributor.shipping_regions = String(row[columnMapping.shipping_regions])
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (columnMapping.certifications && row[columnMapping.certifications]) {
      distributor.certifications = String(row[columnMapping.certifications])
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    // Handle numeric fields
    if (columnMapping.min_order_value && row[columnMapping.min_order_value]) {
      const value = parseFloat(row[columnMapping.min_order_value]);
      if (!isNaN(value)) {
        distributor.min_order_value = value;
      }
    }

    // Set default verification status
    distributor.verification_status = 'pending';

    return distributor;
  };

  const resetUpload = () => {
    setFile(null);
    setCsvData([]);
    setColumnMapping({});
    setUploadProgress(0);
    setUploadStatus('idle');
    setValidationErrors([]);
  };

  return {
    file,
    csvData,
    columnMapping,
    uploadProgress,
    uploadStatus,
    validationErrors,
    handleFileSelect,
    handleColumnMapping,
    handleUpload,
    resetUpload,
    validateData
  };
};

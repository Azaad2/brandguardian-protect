import { FormValues } from '../ResellerFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/email';

// Track Reddit Pixel conversion
export const trackRedditPixelConversion = () => {
  if (typeof window !== 'undefined' && window.rdt) {
    try {
      window.rdt('track', 'Lead');
    } catch (error) {
      // Silent error handling
    }
  }
};

// Send form data without document attachment via FormSpree
export const sendFormWithoutDocument = async (values: FormValues): Promise<boolean> => {
  try {
    // Create FormData object for standard form submission
    const formData = new FormData();
    
    // Add all form fields
    formData.append('companyName', values.companyName);
    formData.append('businessType', values.businessType);
    formData.append('einNumber', values.einNumber);
    formData.append('amazonStoreLink', values.amazonStoreLink);
    formData.append('walmartStoreLink', values.walmartStoreLink || '');
    formData.append('ebayStoreLink', values.ebayStoreLink || '');
    formData.append('productCategories', values.productCategories.join(', '));
    formData.append('salesVolume', values.salesVolume);
    formData.append('wholesaleBudget', values.wholesaleBudget);
    formData.append('feedbackScore', values.feedbackScore || '');
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('linkedIn', values.linkedIn || '');

    // Use environment variable for FormSpree endpoint
    const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xvgopylo';

    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Submit form values to database
export const submitFormToDatabase = async (values: FormValues, user: User | null): Promise<any> => {
  const applicationData = {
    company_name: values.companyName,
    business_type: values.businessType,
    ein_number: values.einNumber,
    amazon_seller_id: values.amazonStoreLink,
    walmart_seller_id: values.walmartStoreLink || null,
    ebay_seller_id: values.ebayStoreLink || null,
    product_categories: values.productCategories,
    sales_volume: values.salesVolume,
    wholesale_budget: values.wholesaleBudget,
    feedback_score: values.feedbackScore || null,
    email: values.email,
    phone: values.phone,
    linkedin: values.linkedIn || null,
    status: 'pending' as const,
    user_id: user?.id || null,
    document_path: null // Will be updated after file upload
  };

  try {
    const { data, error } = await supabase
      .from('reseller_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Upload document to Supabase Storage
export const uploadDocument = async (
  file: File, 
  applicationId: string,
  user: User | null
): Promise<string | null> => {
  try {
    // Check if bucket exists, create if not
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }

    const documentsBucketExists = buckets.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      return null;
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `reseller-applications/${applicationId}/${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return filePath;
  } catch (error) {
    return null;
  }
};

// Send application notification email
export const sendApplicationEmail = async (values: FormValues): Promise<boolean> => {
  return true; // Simplified for now
};

import { FormValues } from '../ResellerFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { sendEmail } from '@/utils/email';

// Track Reddit Pixel conversion
export const trackRedditPixelConversion = () => {
  if (typeof window !== 'undefined' && window.rdt) {
    try {
      window.rdt('track', 'Lead');
      console.log('Reddit Pixel: Lead event tracked in form submission');
    } catch (error) {
      console.error('Reddit Pixel tracking error in form:', error);
    }
  } else {
    console.warn('Reddit Pixel not available in form submission');
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
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('amazonStoreLink', values.amazonStoreLink || 'N/A');
    formData.append('walmartStoreLink', values.walmartStoreLink || 'N/A');
    formData.append('ebayStoreLink', values.ebayStoreLink || 'N/A');
    formData.append('productCategories', values.productCategories.join(', '));
    formData.append('salesVolume', values.salesVolume);
    formData.append('wholesaleBudget', values.wholesaleBudget);
    formData.append('feedbackScore', values.feedbackScore || 'N/A');
    formData.append('linkedIn', values.linkedIn || 'N/A');
    
    // Add email subject
    formData.append('_subject', `Reseller Application: ${values.companyName}`);
    
    // Set reply-to address
    formData.append('_replyto', values.email);
    
    // Using the Formspree endpoint
    const formspreeEndpoint = 'https://formspree.io/f/xblogykb';
    
    console.log('Sending form to Formspree:', formspreeEndpoint);
    
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Formspree error:', response.status, await response.text());
      return false;
    }
    
    console.log('Form sent through Formspree:', await response.json());
    return true;
  } catch (error) {
    console.error('Error sending form:', error);
    return false;
  }
};

// Submit application to Supabase
export const submitApplication = async (values: FormValues, user: User | null) => {
  console.log('Form submission values:', values);
  
  try {
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('reseller_applications')
      .insert({
        user_id: user?.id, // Link to user if authenticated
        company_name: values.companyName,
        business_type: values.businessType,
        ein_number: values.einNumber,
        // Using seller_id fields instead of store_link fields
        amazon_seller_id: values.amazonStoreLink || null,
        walmart_seller_id: values.walmartStoreLink || null,
        ebay_seller_id: values.ebayStoreLink || null,
        product_categories: values.productCategories,
        sales_volume: values.salesVolume,
        wholesale_budget: values.wholesaleBudget,
        feedback_score: values.feedbackScore || '',
        email: values.email,
        phone: values.phone,
        linkedin: values.linkedIn || '',
        status: 'pending'
      })
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Application submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error submitting application to Supabase:', error);
    throw error;
  }
};

// Upload document to Supabase storage
export const uploadDocument = async (file: File, userId: string) => {
  try {
    // Check if documents bucket exists, create if not
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      console.log('Documents bucket does not exist, this should be created in SQL');
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `reseller_documents/${fileName}`;
    
    // Upload the file
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (error) {
      console.error('Document upload error:', error);
      throw error;
    }
    
    return filePath;
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
};

// Send application data via email
export const sendApplicationEmail = async (data: any, values: FormValues) => {
  try {
    await sendEmail({
      id: data?.[0]?.id || 'unknown',
      createdAt: new Date().toISOString(),
      status: 'pending',
      companyName: values.companyName,
      businessType: values.businessType,
      einNumber: values.einNumber,
      amazonStoreLink: values.amazonStoreLink || '',
      walmartStoreLink: values.walmartStoreLink || '',
      ebayStoreLink: values.ebayStoreLink || '',
      productCategories: values.productCategories,
      salesVolume: values.salesVolume,
      wholesaleBudget: values.wholesaleBudget,
      feedbackScore: values.feedbackScore || '',
      email: values.email,
      phone: values.phone,
      linkedIn: values.linkedIn || '',
      termsAgreement: values.termsAgreement
    });
    return true;
  } catch (error) {
    console.error('Error sending application email:', error);
    return false;
  }
};

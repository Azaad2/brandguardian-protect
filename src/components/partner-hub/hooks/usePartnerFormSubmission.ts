import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PartnerFormValues } from '../PartnerFormSchema';
import { toast } from 'sonner';

interface UsePartnerFormSubmissionProps {
  onSubmissionSuccess: (email: string) => void;
}

export function usePartnerFormSubmission({ onSubmissionSuccess }: UsePartnerFormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const submitForm = async (values: PartnerFormValues): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      console.log('Submitting partner application:', values);
      
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare the data for insertion
      const applicationData = {
        user_id: user?.id || null,
        partner_type: values.partnerType,
        company_name: values.companyName,
        business_type: values.businessType,
        ein_number: values.einNumber || null,
        website_url: values.websiteUrl || null,
        email: values.email,
        phone: values.phone,
        contact_name: values.contactName,
        linkedin: values.linkedin || null,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        postal_code: values.postalCode || null,
        brand_name: values.brandName || null,
        product_count: values.productCount || null,
        annual_revenue: values.annualRevenue || null,
        distribution_channels: values.distributionChannels || [],
        looking_for: values.lookingFor || [],
        warehouse_locations: values.warehouseLocations || [],
        shipping_regions: values.shippingRegions || [],
        min_order_value: values.minOrderValue ? parseFloat(values.minOrderValue) : null,
        brands_carried: values.brandsCarried || [],
        certifications: values.certifications || [],
        store_count: values.storeCount ? parseInt(values.storeCount) : null,
        marketplace_links: {
          amazon: values.amazonStoreLink || null,
          walmart: values.walmartStoreLink || null,
          ebay: values.ebayStoreLink || null,
        },
        monthly_sales_volume: values.monthlySalesVolume || null,
        product_categories: values.productCategories,
        status: 'pending',
        application_status: 'submitted',
      };

      const { data, error } = await supabase
        .from('partner_applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to submit application');
      }

      console.log('Application submitted successfully:', data);
      toast.success('Application submitted successfully!');
      onSubmissionSuccess(values.email);
      return true;
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = error.message || 'Failed to submit application. Please try again.';
      setSubmissionError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submissionError,
    submitForm,
  };
}

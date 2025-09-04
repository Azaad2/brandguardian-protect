import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResellerApplicationData {
  email: string;
  companyName: string;
  businessType: string;
  einNumber: string;
  amazonStoreLink: string;
  walmartStoreLink?: string;
  ebayStoreLink?: string;
  productCategories: string[];
  salesVolume: string;
  wholesaleBudget: string;
  feedbackScore?: string;
  phone: string;
  linkedIn?: string;
  termsAgreement: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { applicationData, retryCount = 0 }: { 
      applicationData: ResellerApplicationData; 
      retryCount?: number;
    } = await req.json();

    console.log('🔄 Fallback handler - Processing application:', applicationData.email);

    // Attempt to insert into database with retry logic
    const { data, error } = await supabase
      .from('reseller_applications')
      .insert({
        email: applicationData.email,
        company_name: applicationData.companyName,
        business_type: applicationData.businessType,
        ein_number: applicationData.einNumber,
        amazon_seller_id: applicationData.amazonStoreLink,
        walmart_seller_id: applicationData.walmartStoreLink || null,
        ebay_seller_id: applicationData.ebayStoreLink || null,
        product_categories: applicationData.productCategories,
        sales_volume: applicationData.salesVolume,
        wholesale_budget: applicationData.wholesaleBudget,
        feedback_score: applicationData.feedbackScore || null,
        phone: applicationData.phone,
        linkedin: applicationData.linkedIn || null,
        status: 'submitted', // Use new status for fallback submissions
        application_status: 'document_pending', // Indicates document upload is needed
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database insertion failed:', error);
      
      // If this is not the final retry, schedule another attempt
      if (retryCount < 3) {
        console.log(`🔄 Scheduling retry ${retryCount + 1}/3`);
        
        // Schedule a retry with exponential backoff
        setTimeout(async () => {
          try {
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/reseller-application-fallback`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ 
                applicationData, 
                retryCount: retryCount + 1 
              }),
            });
          } catch (retryError) {
            console.error('❌ Retry failed:', retryError);
          }
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s
      }

      throw error;
    }

    console.log('✅ Application saved successfully via fallback:', data);

    // Send notification email to admins about the new application
    try {
      await supabase.functions.invoke('send-reseller-approval-email', {
        body: { 
          type: 'new_application_admin',
          applicationData: {
            ...applicationData,
            id: data.id,
            submissionMethod: 'fallback'
          }
        }
      });
    } catch (emailError) {
      console.warn('⚠️ Admin notification email failed:', emailError);
      // Don't fail the entire process for email issues
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        applicationId: data.id,
        message: 'Application processed via fallback system'
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Fallback handler error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process application', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        } 
      }
    );
  }
});
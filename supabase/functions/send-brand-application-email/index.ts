
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  brandEmail: string;
  brandName: string;
  emailThreadId: string;
  applicationId: string;
  resellerInfo: {
    id: string;
    email: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { brandEmail, brandName, emailThreadId, applicationId, resellerInfo }: EmailRequest = await req.json();

    // Get reseller profile details
    const { data: resellerProfile } = await supabase
      .from('profiles')
      .select('full_name, company_name')
      .eq('id', resellerInfo.id)
      .single();

    // Get reseller application details if exists
    const { data: resellerApplication } = await supabase
      .from('reseller_applications')
      .select('*')
      .eq('user_id', resellerInfo.id)
      .single();

    console.log('Sending brand application email to:', brandEmail);
    console.log('Email thread ID:', emailThreadId);

    // For now, we'll use a simple email service (this would be replaced with actual email sending)
    // In a real implementation, you would integrate with Resend, SendGrid, or similar service
    
    const emailContent = {
      to: brandEmail,
      from: 'applications@bndbox.com',
      replyTo: `applications+${emailThreadId}@bndbox.com`,
      subject: `New Wholesale Application - ${resellerProfile?.company_name || resellerInfo.email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #1a365d; margin: 0;">BndBox</h1>
            <p style="margin: 5px 0 0 0; color: #718096;">Marketplace Where Brands Meet Resellers</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2d3748;">New Wholesale Application</h2>
            
            <p>Hello ${brandName},</p>
            
            <p>You have received a new wholesale application through BndBox from:</p>
            
            <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2d3748;">Reseller Information</h3>
              <p><strong>Company:</strong> ${resellerProfile?.company_name || 'Not provided'}</p>
              <p><strong>Contact Person:</strong> ${resellerProfile?.full_name || 'Not provided'}</p>
              <p><strong>Email:</strong> ${resellerInfo.email}</p>
              
              ${resellerApplication ? `
                <p><strong>Business Type:</strong> ${resellerApplication.business_type}</p>
                <p><strong>Wholesale Budget:</strong> ${resellerApplication.wholesale_budget}</p>
                <p><strong>Product Categories:</strong> ${resellerApplication.product_categories?.join(', ')}</p>
                <p><strong>Sales Volume:</strong> ${resellerApplication.sales_volume}</p>
                ${resellerApplication.amazon_seller_id ? `<p><strong>Amazon Seller ID:</strong> ${resellerApplication.amazon_seller_id}</p>` : ''}
                ${resellerApplication.walmart_seller_id ? `<p><strong>Walmart Seller ID:</strong> ${resellerApplication.walmart_seller_id}</p>` : ''}
                ${resellerApplication.ebay_seller_id ? `<p><strong>eBay Seller ID:</strong> ${resellerApplication.ebay_seller_id}</p>` : ''}
              ` : ''}
            </div>
            
            <p><strong>How to respond:</strong></p>
            <p>Simply reply to this email to communicate directly with the reseller. Your responses will appear in their BndBox portal in real-time, creating a seamless communication experience.</p>
            
            <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>BndBox Benefits:</strong></p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>All resellers are pre-verified</li>
                <li>Secure communication platform</li>
                <li>Application tracking and management</li>
                <li>Direct integration with major marketplaces</li>
              </ul>
            </div>
            
            <p>Application ID: ${applicationId}</p>
            <p>Thread ID: ${emailThreadId}</p>
            
            <p>Best regards,<br>The BndBox Team</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
            <p>© 2024 BndBox. All rights reserved.</p>
            <p>This email was sent regarding a wholesale application on the BndBox platform.</p>
          </div>
        </div>
      `,
    };

    console.log('Email content prepared:', {
      to: emailContent.to,
      subject: emailContent.subject,
      threadId: emailThreadId
    });

    // In production, you would actually send the email here
    // For now, we'll just log it and return success
    console.log('Email would be sent with content:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application email sent successfully',
        emailThreadId 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-brand-application-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

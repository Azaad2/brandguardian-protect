
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

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
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { brandEmail, brandName, emailThreadId, applicationId, resellerInfo }: EmailRequest = await req.json();

    console.log('Processing brand application email for:', brandEmail);

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

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'BndBox Applications <applications@bndbox.com>',
      to: [brandEmail],
      replyTo: `applications+${emailThreadId}@replies.bndbox.com`,
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
            
            <div style="background: #fef5e7; border: 2px solid #f6ad55; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #c05621; margin-top: 0;">📧 IMPORTANT: How to Reply</h3>
              <p style="margin: 10px 0;"><strong>To ensure your response reaches the reseller in their BndBox portal:</strong></p>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Click the "Reply" button in your email client</strong> (don't compose a new email)</li>
                <li><strong>The reply-to address should be:</strong> <code style="background: #fff; padding: 2px 4px; border-radius: 3px;">applications+${emailThreadId}@replies.bndbox.com</code></li>
                <li><strong>Your response will automatically appear in the reseller's portal</strong></li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:applications+${emailThreadId}@replies.bndbox.com?subject=Application%20Approved&body=Congratulations!%20Your%20application%20has%20been%20approved.%20We%20look%20forward%20to%20working%20with%20you."
                style="background-color: #38a169; color: white; padding: 12px 24px; margin: 0 10px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                ✅ Approve Application
              </a>
              <a href="mailto:applications+${emailThreadId}@replies.bndbox.com?subject=Application%20Rejected&body=Thank%20you%20for%20your%20interest.%20Unfortunately,%20we%20cannot%20approve%20your%20application%20at%20this%20time."
                style="background-color: #e53e3e; color: white; padding: 12px 24px; margin: 0 10px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                ❌ Reject Application
              </a>
            </div>
            
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
            <p>© 2025 BndBox. All rights reserved.</p>
            <p>This email was sent regarding a wholesale application on the BndBox platform.</p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${emailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application email sent successfully',
        emailThreadId,
        emailId: emailResponse.data?.id
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-brand-application-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send brand application email'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

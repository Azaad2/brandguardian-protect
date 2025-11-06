import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const appUrl = Deno.env.get("APP_URL") || "https://bndbox.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  event_type: 'brand_reply' | 'brand_allocated' | 'application_approved' | 'application_rejected';
  reseller_id: string;
  brand_id?: string;
  message_id?: string;
  application_id?: string;
  brand_application_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { event_type, reseller_id, brand_id, message_id, application_id, brand_application_id } = await req.json() as NotificationRequest;

    console.log(`📧 Processing ${event_type} notification for reseller: ${reseller_id}`);

    // Fetch reseller profile
    const { data: resellerProfile, error: resellerError } = await supabase
      .from('profiles')
      .select('email, full_name, company_name')
      .eq('id', reseller_id)
      .single();

    if (resellerError || !resellerProfile) {
      throw new Error(`Failed to fetch reseller profile: ${resellerError?.message}`);
    }

    let emailHtml = '';
    let emailSubject = '';

    // Generate email based on event type
    switch (event_type) {
      case 'brand_reply': {
        // Fetch brand and message details
        const { data: message } = await supabase
          .from('messages')
          .select('content, created_at, brand_application_id')
          .eq('id', message_id)
          .single();

        const { data: application } = await supabase
          .from('brand_applications')
          .select('brand_id')
          .eq('id', message?.brand_application_id || brand_application_id)
          .single();

        const { data: brand } = await supabase
          .from('brands_directory')
          .select('name, logo_url')
          .eq('id', application?.brand_id)
          .single();

        const messagePreview = message?.content.substring(0, 200) + (message?.content.length > 200 ? '...' : '');

        emailSubject = `💬 New Message from ${brand?.name || 'Brand'} - BndBox`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">💬 New Message</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello ${resellerProfile.full_name || resellerProfile.company_name},</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  You received a new message from <strong>${brand?.name || 'a brand'}</strong>:
                </p>
                
                <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 0; font-style: italic; color: #6b7280;">"${messagePreview}"</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}/reseller/messages" 
                     style="background-color: #667eea; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                    📨 View Full Message
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  This is an automated notification from BndBox. You're receiving this because you have an active application with this brand.
                </p>
              </div>
            </body>
          </html>
        `;
        break;
      }

      case 'brand_allocated': {
        // Fetch brand details
        const { data: brand } = await supabase
          .from('brands_directory')
          .select('name, logo_url, description, categories, website_url')
          .eq('id', brand_id)
          .single();

        emailSubject = `🎉 New Brand Added to Your Portal - ${brand?.name}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Brand Available!</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello ${resellerProfile.full_name || resellerProfile.company_name},</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Great news! A new brand has been added to your portal:
                </p>
                
                <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                  ${brand?.logo_url ? `<img src="${brand.logo_url}" alt="${brand?.name}" style="max-width: 150px; height: auto; margin-bottom: 15px;">` : ''}
                  <h2 style="margin: 10px 0; color: #059669;">${brand?.name}</h2>
                  <p style="color: #6b7280; margin: 10px 0;">${brand?.description || ''}</p>
                  ${brand?.categories?.length ? `<p style="color: #059669; font-size: 14px;">Categories: ${brand.categories.join(', ')}</p>` : ''}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}/reseller/dashboard/brands" 
                     style="background-color: #10b981; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px; margin-right: 10px;">
                    👀 View Brand Details
                  </a>
                  <a href="${appUrl}/reseller/dashboard/brands" 
                     style="background-color: #667eea; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                    📝 Apply Now
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  This brand has been specially selected for your business. Apply now to start the partnership process!
                </p>
              </div>
            </body>
          </html>
        `;
        break;
      }

      case 'application_approved': {
        // Fetch brand details
        const { data: application } = await supabase
          .from('brand_applications')
          .select('brand_id')
          .eq('id', application_id)
          .single();

        const { data: brand } = await supabase
          .from('brands_directory')
          .select('name, logo_url, contact_email')
          .eq('id', application?.brand_id)
          .single();

        emailSubject = `🎊 ${brand?.name} Approved Your Application!`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎊 Application Approved!</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Congratulations ${resellerProfile.full_name || resellerProfile.company_name}!</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Your application to partner with <strong>${brand?.name}</strong> has been <span style="color: #10b981; font-weight: bold;">APPROVED</span>! 🎉
                </p>
                
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #d97706;">📋 Next Steps:</h3>
                  <ol style="margin: 15px 0; padding-left: 20px; color: #6b7280;">
                    <li>Review the brand's catalog and pricing</li>
                    <li>Set up your ordering preferences</li>
                    <li>Contact the brand for any questions: ${brand?.contact_email || 'via messages'}</li>
                    <li>Start placing orders!</li>
                  </ol>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}/reseller/brands" 
                     style="background-color: #f59e0b; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                    🚀 View Brand Portal
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Welcome to the partnership! We're excited to see your business grow with ${brand?.name}.
                </p>
              </div>
            </body>
          </html>
        `;
        break;
      }

      case 'application_rejected': {
        // Fetch brand details
        const { data: application } = await supabase
          .from('brand_applications')
          .select('brand_id')
          .eq('id', application_id)
          .single();

        const { data: brand } = await supabase
          .from('brands_directory')
          .select('name')
          .eq('id', application?.brand_id)
          .single();

        emailSubject = `Update on Your Application to ${brand?.name}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
              </div>
              
              <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hello ${resellerProfile.full_name || resellerProfile.company_name},</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Thank you for your interest in partnering with <strong>${brand?.name}</strong>.
                </p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Unfortunately, they are unable to move forward with your application at this time. This decision may be based on various factors including current distribution capacity, regional coverage, or business requirements.
                </p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #667eea;">🌟 Don't Give Up!</h3>
                  <p style="margin: 10px 0; color: #6b7280;">
                    We have hundreds of other brands available in your portal. Each brand has different requirements and opportunities - your perfect match is waiting!
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}/reseller/brands" 
                     style="background-color: #667eea; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                    🔍 Browse More Brands
                  </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Keep building your business with BndBox. Success is just around the corner!
                </p>
              </div>
            </body>
          </html>
        `;
        break;
      }
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "BndBox <notifications@bndbox.com>",
      to: [resellerProfile.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
    }

    console.log(`✅ Email sent successfully: ${data?.id}`);

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error in send-reseller-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);

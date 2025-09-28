import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadMagnetRequest {
  email: string;
  magnetType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, magnetType }: LeadMagnetRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate download URL
    const downloadUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/lead-magnets/amazon-ungated-brands-list.pdf`;
    
    // Check if file exists (basic validation)
    try {
      const fileResponse = await fetch(downloadUrl, { method: 'HEAD' });
      if (!fileResponse.ok) {
        console.error('Lead magnet file not found at:', downloadUrl);
        // Continue with email but log the issue
      }
    } catch (error) {
      console.error('Error checking file existence:', error);
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Amazon Auto-Ungated Brands List</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">BndBox</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Amazon Success Platform</p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Hey there! 👋</h2>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for downloading our <strong>Amazon Auto-Ungated Brands List</strong>! This exclusive resource contains 100+ brands that don't require ungating applications.
              </p>

              <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 18px;">What's Inside:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">✅ 100+ Auto-Ungated Brand Names</li>
                  <li style="margin-bottom: 8px;">✅ Product Categories for Each Brand</li>
                  <li style="margin-bottom: 8px;">✅ Contact Information Where Available</li>
                  <li style="margin-bottom: 8px;">✅ Tips for Successful Brand Outreach</li>
                </ul>
              </div>

              <!-- Download Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                  📥 Download Your Free List
                </a>
              </div>

              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">💡 Pro Tip:</h3>
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  Start with brands in categories you're already familiar with. This increases your chances of successful partnerships and faster approvals.
                </p>
              </div>

              <p style="font-size: 16px; margin: 20px 0;">
                Want to take your Amazon wholesale business to the next level? 
                <a href="https://bndbox.com/reseller-hub" style="color: #667eea; text-decoration: none; font-weight: bold;">Join our Reseller Hub</a> 
                to connect with even more brands and streamline your wholesale operations.
              </p>

              <hr style="border: none; height: 1px; background-color: #eee; margin: 30px 0;">

              <p style="font-size: 14px; color: #666; margin: 10px 0;">
                Questions? Just reply to this email or contact us at 
                <a href="mailto:help@bndbox.com" style="color: #667eea;">help@bndbox.com</a>
              </p>

              <p style="font-size: 14px; color: #666; margin: 10px 0;">
                Best regards,<br>
                The BndBox Team
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                BndBox - Your Amazon Success Platform
              </p>
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                You received this email because you downloaded our Amazon Auto-Ungated Brands List.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "BndBox <downloads@bndbox.com>",
      to: [email],
      subject: "🎉 Your Amazon Auto-Ungated Brands List is Ready!",
      html: emailHtml,
    });

    console.log("Lead magnet email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-lead-magnet function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
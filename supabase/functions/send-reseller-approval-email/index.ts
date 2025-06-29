
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  status: 'approved' | 'rejected';
  loginUrl?: string;
  temporaryPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const { email, status, loginUrl, temporaryPassword }: EmailRequest = await req.json();

    console.log(`Processing reseller ${status} email for:`, email);

    const isApproved = status === 'approved';
    const subject = isApproved 
      ? 'Your Reseller Application Has Been Approved! 🎉' 
      : 'Update on Your Reseller Application';

    const emailResponse = await resend.emails.send({
      from: 'BndBox Team <applications@bndbox.com>',
      to: [email],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${isApproved ? '#10b981' : '#f3f4f6'}; padding: 20px; text-align: center;">
            <h1 style="color: ${isApproved ? 'white' : '#1a365d'}; margin: 0;">BndBox</h1>
            <p style="margin: 5px 0 0 0; color: ${isApproved ? '#d1fae5' : '#718096'};">Marketplace Where Brands Meet Resellers</p>
          </div>
          
          <div style="padding: 30px 20px;">
            ${isApproved ? `
              <h2 style="color: #10b981; text-align: center;">🎉 Congratulations!</h2>
              <p>Your reseller application has been <strong>approved</strong>! Welcome to the BndBox marketplace.</p>
              
              ${temporaryPassword ? `
                <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #856404;">Your Login Credentials</h3>
                  <p style="margin: 0; color: #856404;">
                    <strong>Email:</strong> ${email}<br>
                    <strong>Temporary Password:</strong> <code style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${temporaryPassword}</code>
                  </p>
                  <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
                    <strong>Important:</strong> Please change this password after your first login for security.
                  </p>
                </div>
              ` : ''}
              
              <div style="background: #f0fdf4; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #065f46;">What's Next?</h3>
                <ol style="color: #065f46; margin: 0; padding-left: 20px;">
                  <li>Click the login button below to access your dashboard</li>
                  <li>Change your temporary password in Settings → Security</li>
                  <li>Complete your profile setup</li>
                  <li>Browse available brands and products</li>
                  <li>Start placing wholesale orders</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" 
                   style="background-color: #10b981; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                  🚀 Access Your Dashboard
                </a>
              </div>
              
              <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your BndBox Benefits:</strong></p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Access to verified wholesale brands</li>
                  <li>Competitive wholesale pricing</li>
                  <li>Direct communication with brand partners</li>
                  <li>Secure order management system</li>
                  <li>Real-time inventory updates</li>
                </ul>
              </div>
            ` : `
              <h2 style="color: #e53e3e; text-align: center;">Application Update</h2>
              <p>Thank you for your interest in becoming a BndBox reseller.</p>
              
              <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;">
                  After careful review, we are unable to approve your reseller application at this time. 
                  This decision may be based on various factors including current market capacity, 
                  application completeness, or specific business requirements.
                </p>
              </div>
              
              <p>We appreciate your understanding and encourage you to reapply in the future when circumstances change.</p>
            `}
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                If you have any questions, please don't hesitate to contact our support team.
              </p>
              <p style="margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>The BndBox Team</strong>
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
            <p>© 2025 BndBox. All rights reserved.</p>
            <p>This email was sent regarding your reseller application on the BndBox platform.</p>
          </div>
        </div>
      `,
    });

    console.log(`${status} email sent successfully:`, emailResponse);

    if (emailResponse.error) {
      throw new Error(`Resend API error: ${emailResponse.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${status} email sent successfully`,
        emailId: emailResponse.data?.id
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-reseller-approval-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: `Failed to send reseller ${status} email`
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  applicationId: string;
  userEmail: string;
  action: 'approve' | 'reject';
  temporaryPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { applicationId, userEmail, action, temporaryPassword }: ApprovalRequest = await req.json();

    console.log(`Processing ${action} for application:`, applicationId, userEmail);

    if (action === 'approve') {
      // Get the application to check if user exists
      const { data: application, error: appError } = await supabaseAdmin
        .from('reseller_applications')
        .select('user_id')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;

      // If no user_id exists, create the user account first
      if (!application.user_id) {
        console.log('Creating new user account for:', userEmail);
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            user_role: 'reseller'
          }
        });

        if (createError) {
          console.error('Error creating user account:', createError);
          throw createError;
        }

        console.log('User account created successfully:', newUser.user?.id);

        // Update application with new user_id
        const { error: updateUserIdError } = await supabaseAdmin
          .from('reseller_applications')
          .update({ user_id: newUser.user?.id })
          .eq('id', applicationId);

        if (updateUserIdError) {
          console.error('Error updating application with user_id:', updateUserIdError);
          throw updateUserIdError;
        }
      } else {
        console.log('Updating existing user password for:', userEmail);
        
        // Update existing user's password
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
          application.user_id,
          { password: temporaryPassword }
        );

        if (passwordError) {
          console.error('Error updating user password:', passwordError);
          throw passwordError;
        }

        console.log('User password updated successfully');
      }

      // Update application status to approved
      const { error: updateError } = await supabaseAdmin
        .from('reseller_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      console.log('Application status updated to approved');

      // Send approval email
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const { error: emailError } = await resend.emails.send({
        from: 'BndBox Team <applications@bndbox.com>',
        to: [userEmail],
        subject: 'Your Reseller Application Has Been Approved! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">BndBox</h1>
              <p style="margin: 5px 0 0 0; color: #d1fae5;">Marketplace Where Brands Meet Resellers</p>
            </div>
            
            <div style="padding: 30px 20px;">
              <h2 style="color: #10b981; text-align: center;">🎉 Congratulations!</h2>
              <p>Your reseller application has been <strong>approved</strong>! Welcome to the BndBox marketplace.</p>
              
              <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">Your Login Credentials</h3>
                <p style="margin: 0; color: #856404;">
                  <strong>Email:</strong> ${userEmail}<br>
                  <strong>Temporary Password:</strong> <code style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${temporaryPassword}</code>
                </p>
                <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
                  <strong>Important:</strong> Please change this password after your first login for security.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://flhqvkohslfxxfjzyzxy.supabase.co', window.location?.origin || 'http://localhost:3000')}/reseller/login" 
                   style="background-color: #10b981; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                  🚀 Access Your Dashboard
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0;">
                  Best regards,<br>
                  <strong>The BndBox Team</strong>
                </p>
              </div>
            </div>
          </div>
        `,
      });

      if (emailError) {
        console.error('Error sending approval email:', emailError);
      } else {
        console.log('Approval email sent successfully');
      }

    } else if (action === 'reject') {
      // Update application status to rejected
      const { error: updateError } = await supabaseAdmin
        .from('reseller_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Send rejection email
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const { error: emailError } = await resend.emails.send({
        from: 'BndBox Team <applications@bndbox.com>',
        to: [userEmail],
        subject: 'Update on Your Reseller Application',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f3f4f6; padding: 20px; text-align: center;">
              <h1 style="color: #1a365d; margin: 0;">BndBox</h1>
              <p style="margin: 5px 0 0 0; color: #718096;">Marketplace Where Brands Meet Resellers</p>
            </div>
            
            <div style="padding: 30px 20px;">
              <h2 style="color: #e53e3e; text-align: center;">Application Update</h2>
              <p>Thank you for your interest in becoming a BndBox reseller.</p>
              
              <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;">
                  After careful review, we are unable to approve your reseller application at this time.
                </p>
              </div>
              
              <p>We appreciate your understanding and encourage you to reapply in the future.</p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0;">
                  Best regards,<br>
                  <strong>The BndBox Team</strong>
                </p>
              </div>
            </div>
          </div>
        `,
      });

      if (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Application ${action}d successfully`
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in approve-reseller-application function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: `Failed to ${req.body ? 'process' : 'parse'} application`
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

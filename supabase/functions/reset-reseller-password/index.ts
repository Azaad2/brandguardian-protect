import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ResetRequest {
  applicationId: string;
  userEmail: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId, userEmail, newPassword }: ResetRequest = await req.json();

    console.log('Resetting password for:', userEmail);

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

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (profile?.user_role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Get application details
    const { data: application, error: appError } = await supabaseAdmin
      .from('reseller_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('Application not found');
    }

    if (!application.user_id) {
      throw new Error('No user account associated with this application');
    }

    // Update user password in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      application.user_id,
      { password: newPassword }
    );

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    // Update application with new password
    const { error: appUpdateError } = await supabaseAdmin
      .from('reseller_applications')
      .update({
        temporary_password: newPassword,
        password_sent_at: new Date().toISOString(),
        password_reset_count: (application.password_reset_count || 0) + 1
      })
      .eq('id', applicationId);

    if (appUpdateError) {
      throw new Error(`Failed to update application: ${appUpdateError.message}`);
    }

    // Send email with new password
    const emailResponse = await resend.emails.send({
      from: 'BndBox <noreply@yourdomain.com>',
      to: [userEmail],
      subject: 'Your BndBox Password Has Been Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset - BndBox Reseller Portal</h1>
          <p>Hello ${application.company_name},</p>
          <p>Your password has been reset by an administrator. Here are your new login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>New Password:</strong> ${newPassword}</p>
          </div>
          <p>Please login at: <a href="https://yourdomain.com/reseller/login">https://yourdomain.com/reseller/login</a></p>
          <p><strong>Important:</strong> We recommend changing your password after logging in.</p>
          <p>If you did not request this password reset, please contact support immediately.</p>
          <p>Best regards,<br>The BndBox Team</p>
        </div>
      `,
    });

    console.log('Password reset email sent:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Password reset successfully and email sent'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in reset-reseller-password function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  applicationId: string;
  userEmail: string;
  action: 'approve' | 'reject';
  temporaryPassword: string; // Now required for approvals
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

    console.log(`🎯 Processing ${action} for application:`, applicationId, userEmail);

    if (action === 'approve') {
      // Get the application to check if user exists and if already approved
      const { data: application, error: appError } = await supabaseAdmin
        .from('reseller_applications')
        .select('user_id, email, status, temporary_password')
        .eq('id', applicationId)
        .single();

      if (appError) {
        console.error('❌ Error fetching application:', appError);
        throw appError;
      }

      // Check if already approved to prevent password overwrites
      if (application.status === 'approved' && application.temporary_password) {
        return new Response(
          JSON.stringify({ 
            error: 'Application already approved. Use password reset to change credentials.',
            alreadyApproved: true
          }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }

      // Continue with existing application fetch
      const { data: fullApplication, error: fullAppError } = await supabaseAdmin
        .from('reseller_applications')
        .select('user_id, email')
        .eq('id', applicationId)
        .single();

      if (fullAppError) {
        console.error('❌ Error fetching full application:', fullAppError);
        throw fullAppError;
      }

      console.log('📋 Application data:', { 
        applicationId, 
        storedEmail: fullApplication.email, 
        providedEmail: userEmail,
        userId: fullApplication.user_id 
      });

      let userId = fullApplication.user_id;

      // First, check if a user already exists with this email
      const { data: existingUsers, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listUsersError) {
        console.error('❌ Error listing users:', listUsersError);
        throw listUsersError;
      }

      const existingUser = existingUsers.users?.find(user => user.email === userEmail);
      
      if (existingUser) {
        console.log('👤 User already exists:', { 
          id: existingUser.id, 
          email: existingUser.email,
          confirmed: existingUser.email_confirmed_at ? 'yes' : 'no'
        });

        userId = existingUser.id;
        
        // Update existing user's password and metadata
        const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { 
            password: temporaryPassword,
            email_confirm: true,
            user_metadata: {
              user_role: 'reseller'
            }
          }
        );

        if (updateError) {
          console.error('❌ Error updating existing user:', updateError);
          throw updateError;
        }

        console.log('✅ Existing user updated successfully:', {
          userId: updateResult.user?.id,
          email: updateResult.user?.email
        });

        // Update application with correct user_id if needed
        if (!fullApplication.user_id || fullApplication.user_id !== existingUser.id) {
          const { error: updateAppError } = await supabaseAdmin
            .from('reseller_applications')
            .update({ user_id: existingUser.id })
            .eq('id', applicationId);

          if (updateAppError) {
            console.error('❌ Error updating application user_id:', updateAppError);
            throw updateAppError;
          }
        }

      } else {
        console.log('👤 Creating new user account for:', userEmail);
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            user_role: 'reseller'
          }
        });

        if (createError) {
          console.error('❌ Error creating user account:', createError);
          throw createError;
        }

        console.log('✅ User account created successfully:', newUser.user?.id);
        userId = newUser.user?.id;

        // Update application with new user_id
        if (userId) {
          const { error: updateUserIdError } = await supabaseAdmin
            .from('reseller_applications')
            .update({ user_id: userId })
            .eq('id', applicationId);

          if (updateUserIdError) {
            console.error('❌ Error updating application with user_id:', updateUserIdError);
            throw updateUserIdError;
          }
        }
      }

      // Add a delay to ensure the password update is propagated
      console.log('⏳ Waiting for user update to propagate...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update application status to approved and store password
      const { error: updateError } = await supabaseAdmin
        .from('reseller_applications')
        .update({ 
          status: 'approved',
          temporary_password: temporaryPassword,
          password_sent_at: new Date().toISOString(),
          password_reset_count: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('❌ Error updating application status:', updateError);
        throw updateError;
      }

      console.log('✅ Application status updated to approved');

      // Send approval email
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const { data: emailResult, error: emailError } = await resend.emails.send({
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
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('/supabase', '') || 'https://your-app-domain.com'}/reseller/login" 
                   style="background-color: #10b981; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
                  🚀 Login to Your Dashboard
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
        console.error('❌ Error sending approval email:', emailError);
      } else {
        console.log('✅ Approval email sent successfully:', emailResult?.id);
      }

    } else if (action === 'reject') {
      // Update application status to rejected
      const { error: updateError } = await supabaseAdmin
        .from('reseller_applications')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('❌ Error updating application status to rejected:', updateError);
        throw updateError;
      }

      console.log('✅ Application status updated to rejected');

      // Send rejection email
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const { data: emailResult, error: emailError } = await resend.emails.send({
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
        console.error('❌ Error sending rejection email:', emailError);
      } else {
        console.log('✅ Rejection email sent successfully:', emailResult?.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Application ${action}d successfully`,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('❌ Error in approve-reseller-application function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: `Failed to process reseller application`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

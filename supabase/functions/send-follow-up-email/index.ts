import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowUpRequest {
  applicationId: string;
  followUpType: 'gentle_reminder' | 'second_followup' | 'final_followup' | 'custom';
  customMessage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("send-follow-up-email function invoked");

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { applicationId, followUpType, customMessage }: FollowUpRequest = await req.json();

    console.log("Processing follow-up request:", { applicationId, followUpType });

// Get application details (no implicit joins to avoid schema cache issues)
const { data: application, error: appError } = await supabaseClient
  .from('brand_applications')
  .select('id, brand_id, reseller_id, created_at, follow_up_count, email_thread_id')
  .eq('id', applicationId)
  .eq('reseller_id', user.id)
  .maybeSingle();

if (appError || !application) {
  console.error("Application not found:", appError);
  return new Response(JSON.stringify({ error: "Application not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// Fetch brand details
const { data: brand, error: brandError } = await supabaseClient
  .from('brands_directory')
  .select('id, name, contact_email, response_time')
  .eq('id', application.brand_id)
  .maybeSingle();

if (brandError) {
  console.error('Error fetching brand details:', brandError);
}

// Fetch reseller profile
const { data: reseller, error: resellerError } = await supabaseClient
  .from('profiles')
  .select('id, full_name, email, company_name')
  .eq('id', application.reseller_id)
  .maybeSingle();

if (resellerError) {
  console.error('Error fetching reseller profile:', resellerError);
}

if (!brand?.contact_email || !brand.contact_email.includes('@')) {
  console.error("Invalid brand email:", brand?.contact_email);
  return new Response(JSON.stringify({ 
    emailSent: false, 
    reason: "Brand has no valid email address" 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

    // Generate follow-up email content based on type
    const getFollowUpContent = (type: string, customMsg?: string) => {
      const daysSinceApplication = Math.floor(
        (Date.now() - new Date(application.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (type) {
        case 'gentle_reminder':
          return {
            subject: `Follow-up: Partnership Application from ${reseller.company_name || reseller.full_name}`,
            content: `
              <p>Hello,</p>
              <p>I hope this email finds you well. I wanted to follow up on the partnership application I submitted ${daysSinceApplication} days ago for wholesale opportunities with ${brand.name}.</p>
              <p>I understand you receive many applications and wanted to respectfully check on the status of my submission. I'm very interested in establishing a wholesale partnership and would appreciate any update you can provide.</p>
              <p>Company: ${reseller.company_name || reseller.full_name}</p>
              <p>Contact: ${reseller.email}</p>
              <p>Thank you for your time and consideration.</p>
              <p>Best regards,<br>${reseller.full_name}</p>
            `
          };
        case 'second_followup':
          return {
            subject: `Second Follow-up: Partnership Inquiry - ${reseller.company_name || reseller.full_name}`,
            content: `
              <p>Hello,</p>
              <p>I hope you're doing well. I'm writing to follow up on my wholesale partnership application submitted ${daysSinceApplication} days ago.</p>
              <p>I remain very interested in the opportunity to work with ${brand.name} and would greatly appreciate an update on my application status, even if it's to let me know the timeline for your review process.</p>
              <p>Company: ${reseller.company_name || reseller.full_name}</p>
              <p>Contact: ${reseller.email}</p>
              <p>I look forward to hearing from you.</p>
              <p>Best regards,<br>${reseller.full_name}</p>
            `
          };
        case 'final_followup':
          return {
            subject: `Final Follow-up: Partnership Application - ${reseller.company_name || reseller.full_name}`,
            content: `
              <p>Hello,</p>
              <p>I hope this message finds you well. This is my final follow-up regarding the wholesale partnership application I submitted ${daysSinceApplication} days ago.</p>
              <p>I understand that you may be busy or that my application may not be a fit at this time. If that's the case, I completely understand and would appreciate knowing so I can explore other opportunities.</p>
              <p>If there's still a possibility for partnership, I remain interested and would welcome the opportunity to discuss further.</p>
              <p>Company: ${reseller.company_name || reseller.full_name}</p>
              <p>Contact: ${reseller.email}</p>
              <p>Thank you for your time and consideration throughout this process.</p>
              <p>Best regards,<br>${reseller.full_name}</p>
            `
          };
        case 'custom':
          return {
            subject: `Follow-up: Partnership Application from ${reseller.company_name || reseller.full_name}`,
            content: customMsg || 'Custom follow-up message'
          };
        default:
          return {
            subject: `Follow-up: Partnership Application from ${reseller.company_name || reseller.full_name}`,
            content: 'Follow-up message'
          };
      }
    };

    const emailContent = getFollowUpContent(followUpType, customMessage);
    const threadId = application.email_thread_id || `app_${applicationId}`;
    const replyToEmail = `applications+${threadId}@replies.bndbox.com`;

    // Send follow-up email using Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    let emailSent = false;
    let emailError = null;

    try {
      const recipientEmail = brand.contact_email.split(',')[0].trim();
      
      const emailResponse = await resend.emails.send({
        from: "BndBox Partnership Team <partnerships@bndbox.com>",
        to: [recipientEmail],
        subject: emailContent.subject,
        html: emailContent.content,
        replyTo: replyToEmail,
        headers: {
          'X-BndBox-Thread-ID': threadId,
          'X-BndBox-Application-ID': applicationId,
        },
      });

      console.log("Follow-up email sent successfully:", emailResponse);
      emailSent = true;
    } catch (error) {
      console.error("Failed to send follow-up email:", error);
      emailError = error.message;
    }

    // Record the follow-up in the database
    const { error: followUpError } = await supabaseClient
      .from('follow_up_messages')
      .insert({
        brand_application_id: applicationId,
        sender_id: user.id,
        message_content: emailContent.content,
        follow_up_type: followUpType,
        email_sent: emailSent,
        email_delivery_status: emailSent ? 'sent' : 'failed'
      });

    if (followUpError) {
      console.error("Error recording follow-up:", followUpError);
    }

    // Update application follow-up count and timestamp
const { error: updateError } = await supabaseClient
  .from('brand_applications')
  .update({
    follow_up_count: (application.follow_up_count ?? 0) + 1,
    last_follow_up_at: new Date().toISOString(),
  })
  .eq('id', applicationId);

    if (updateError) {
      console.error("Error updating application:", updateError);
    }

    return new Response(JSON.stringify({ 
      emailSent,
      reason: emailError || undefined,
      followUpRecorded: !followUpError
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-follow-up-email function:", error);
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
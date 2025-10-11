import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature',
};

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    tags?: { name: string; value: string }[];
    opened_at?: string;
    clicked_at?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookEvent: ResendWebhookEvent = await req.json();
    console.log('Received Resend webhook event:', webhookEvent.type);

    // Only process email.opened and email.clicked events
    if (!['email.opened', 'email.clicked'].includes(webhookEvent.type)) {
      console.log('Ignoring event type:', webhookEvent.type);
      return new Response(JSON.stringify({ message: 'Event type not processed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { email_id, tags, to } = webhookEvent.data;
    
    // Check if this is a brand application email via tags
    const emailTypTag = tags?.find(tag => tag.name === 'email_type');
    const applicationIdTag = tags?.find(tag => tag.name === 'application_id');
    const threadIdTag = tags?.find(tag => tag.name === 'thread_id');

    if (emailTypTag?.value !== 'brand_application' || !applicationIdTag?.value) {
      console.log('Not a brand application email, skipping');
      return new Response(JSON.stringify({ message: 'Not a brand application email' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const applicationId = applicationIdTag.value;
    const brandEmail = to[0];

    console.log('Processing email open for application:', applicationId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get brand application details
    const { data: application, error: appError } = await supabase
      .from('brand_applications')
      .select(`
        *,
        brand:brands_directory(name),
        reseller:profiles!brand_applications_reseller_id_fkey(company_name)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      console.error('Failed to fetch application:', appError);
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Update application with email opened status (only if not already opened)
    if (!application.email_opened) {
      const { error: updateError } = await supabase
        .from('brand_applications')
        .update({ 
          email_opened: true,
          email_opened_at: new Date().toISOString(),
          email_id: email_id
        })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Failed to update application:', updateError);
      } else {
        console.log('Updated application email_opened status');
      }

      // Check if we should send engagement email
      // Only send if:
      // 1. Brand has not already received an engagement email in the last 30 days
      // 2. This is the first email open
      const { data: recentEngagement } = await supabase
        .from('brand_engagement_emails')
        .select('id, email_sent_at')
        .eq('brand_email', brandEmail.toLowerCase())
        .gte('email_sent_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('email_sent_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!recentEngagement) {
        console.log('Triggering engagement email for email open');
        
        // Call send-brand-engagement-email function
        const { error: engagementError } = await supabase.functions.invoke('send-brand-engagement-email', {
          body: {
            brandEmail: brandEmail,
            brandName: application.brand?.name || 'Brand',
            resellerCompany: application.reseller?.company_name || 'Reseller',
            interactionType: 'email_open',
            applicationId: applicationId
          }
        });

        if (engagementError) {
          console.error('Failed to send engagement email:', engagementError);
        } else {
          console.log('Engagement email sent successfully');
        }
      } else {
        console.log('Engagement email already sent recently, skipping');
      }
    } else {
      console.log('Email already marked as opened, skipping engagement email');
    }

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in resend-webhook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);

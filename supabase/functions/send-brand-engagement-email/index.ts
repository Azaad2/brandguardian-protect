import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from 'npm:resend@2.0.0';
import { generateBrandEngagementEmail } from '../_shared/email-templates/brand-engagement.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrandEngagementRequest {
  brandEmail: string;
  brandName: string;
  resellerCompany: string;
  interactionType: 'reply' | 'approval' | 'rejection' | 'email_open';
  applicationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandEmail, brandName, resellerCompany, interactionType, applicationId }: BrandEngagementRequest = await req.json();

    console.log('Processing brand engagement email for:', { brandEmail, brandName, interactionType });

    // Validate email
    if (!brandEmail || !brandEmail.includes('@')) {
      throw new Error('Invalid brand email address');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we've sent an engagement email to this brand recently (30-day cooldown)
    const { data: recentEmail } = await supabase
      .from('brand_engagement_emails')
      .select('id, email_sent_at')
      .eq('brand_email', brandEmail.toLowerCase())
      .gte('email_sent_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('email_sent_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentEmail) {
      console.log(`Already sent engagement email to ${brandEmail} on ${recentEmail.email_sent_at}. Skipping.`);
      return new Response(
        JSON.stringify({ success: true, message: 'Email already sent recently', skipped: true }), 
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate personalized email HTML
    const emailHtml = generateBrandEngagementEmail(brandName, resellerCompany, interactionType);

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'BndBox Partnerships <partnerships@updates.bndbox.com>',
      to: [brandEmail],
      subject: `Thank you for connecting with ${resellerCompany} on BndBox!`,
      html: emailHtml,
    });

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log('Email sent successfully to:', brandEmail, 'Message ID:', emailData?.id);

    // Track email in database
    const { error: trackingError } = await supabase
      .from('brand_engagement_emails')
      .insert({
        brand_email: brandEmail.toLowerCase(),
        brand_name: brandName,
        reseller_company: resellerCompany,
        interaction_type: interactionType,
        application_id: applicationId,
        email_sent_at: new Date().toISOString(),
      });

    if (trackingError) {
      console.error('Failed to track email in database:', trackingError);
      // Don't fail the request - email was sent successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Brand engagement email sent successfully',
        emailId: emailData?.id
      }), 
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in send-brand-engagement-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);

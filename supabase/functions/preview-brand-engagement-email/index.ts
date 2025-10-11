import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateBrandEngagementEmail } from '../_shared/email-templates/brand-engagement.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PreviewRequest {
  brandName?: string;
  resellerCompany?: string;
  interactionType?: 'reply' | 'approval' | 'rejection' | 'email_open';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      brandName = 'Your Brand', 
      resellerCompany = 'Sample Reseller Company',
      interactionType = 'reply'
    }: PreviewRequest = await req.json();

    console.log('Generating email preview for:', { brandName, resellerCompany, interactionType });

    // Generate email HTML using shared template
    const emailHtml = generateBrandEngagementEmail(brandName, resellerCompany, interactionType);

    // Generate preview text (first 100 chars without HTML tags)
    const previewText = emailHtml
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 100);

    return new Response(
      JSON.stringify({
        success: true,
        html: emailHtml,
        subject: `Thank you for connecting with ${resellerCompany} on BndBox!`,
        preview: previewText
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error('Error in preview-brand-engagement-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};

serve(handler);

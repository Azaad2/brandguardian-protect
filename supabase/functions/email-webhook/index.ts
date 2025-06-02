
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailWebhookPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  references?: string;
  inReplyTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const emailData: EmailWebhookPayload = await req.json();
    console.log('Received email webhook:', {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject
    });

    // Extract thread ID from the email address
    const emailMatch = emailData.to.match(/applications\+([^@]+)@bndbox\.com/);
    if (!emailMatch) {
      console.log('Email does not match expected format');
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailThreadId = emailMatch[1];
    console.log('Extracted thread ID:', emailThreadId);

    // Find the corresponding brand application
    const { data: application, error: appError } = await supabase
      .from('brand_applications')
      .select(`
        *,
        brand:brands_directory(name, contact_email)
      `)
      .eq('email_thread_id', emailThreadId)
      .single();

    if (appError || !application) {
      console.error('Application not found:', appError);
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Found application:', application.id);

    // Verify the sender is the brand's contact email
    if (emailData.from !== application.brand.contact_email) {
      console.log('Sender verification failed:', {
        sender: emailData.from,
        expected: application.brand.contact_email
      });
      return new Response(JSON.stringify({ error: 'Unauthorized sender' }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Create a message in the portal
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: application.brand_id, // Use brand_id as sender
        recipient_id: application.reseller_id,
        content: emailData.text || emailData.html,
        email_thread_id: emailThreadId,
        message_source: 'email_inbound',
        brand_application_id: application.id,
        is_read: false
      });

    if (messageError) {
      console.error('Failed to create message:', messageError);
      return new Response(JSON.stringify({ error: 'Failed to create message' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Message created successfully');

    // Update application status if the email indicates approval/rejection
    const emailContent = (emailData.text || emailData.html).toLowerCase();
    let newStatus = null;
    
    if (emailContent.includes('approved') || emailContent.includes('accept')) {
      newStatus = 'approved';
    } else if (emailContent.includes('rejected') || emailContent.includes('decline')) {
      newStatus = 'rejected';
    }

    if (newStatus) {
      await supabase
        .from('brand_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);
      
      console.log('Application status updated to:', newStatus);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email processed successfully',
        applicationId: application.id,
        threadId: emailThreadId
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in email-webhook function:', error);
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


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MailgunWebhookPayload {
  recipient: string;
  sender: string;
  subject: string;
  'body-plain': string;
  'body-html': string;
  'Message-Id': string;
  timestamp: string;
  token: string;
  signature: string;
  'In-Reply-To'?: string;
  References?: string;
}

// Verify Mailgun webhook signature
const verifyMailgunSignature = (timestamp: string, token: string, signature: string): boolean => {
  const signingKey = Deno.env.get('MAILGUN_SIGNING_KEY');
  if (!signingKey) {
    console.error('MAILGUN_SIGNING_KEY not configured');
    return false;
  }
  
  const payload = timestamp + token;
  const expectedSignature = hmac('sha256', signingKey, payload, 'utf8', 'hex');
  return expectedSignature === signature;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse form data (Mailgun sends form data, not JSON)
    const formData = await req.formData();
    const emailData: MailgunWebhookPayload = {
      recipient: formData.get('recipient') as string,
      sender: formData.get('sender') as string,
      subject: formData.get('subject') as string,
      'body-plain': formData.get('body-plain') as string,
      'body-html': formData.get('body-html') as string,
      'Message-Id': formData.get('Message-Id') as string,
      timestamp: formData.get('timestamp') as string,
      token: formData.get('token') as string,
      signature: formData.get('signature') as string,
      'In-Reply-To': formData.get('In-Reply-To') as string || undefined,
      References: formData.get('References') as string || undefined,
    };

    console.log('Received Mailgun webhook:', {
      recipient: emailData.recipient,
      sender: emailData.sender,
      subject: emailData.subject,
      timestamp: emailData.timestamp
    });

    // Verify Mailgun signature
    if (!verifyMailgunSignature(emailData.timestamp, emailData.token, emailData.signature)) {
      console.error('Invalid Mailgun signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Extract thread ID from the recipient email address (case-insensitive)
    const emailMatch = emailData.recipient.match(/applications\+([^@]+)@(bndbox\.com|replies\.bndbox\.com)/i);
    if (!emailMatch) {
      console.error('Email format validation failed:', {
        recipient: emailData.recipient,
        expectedPatterns: ['applications+{threadId}@bndbox.com', 'applications+{threadId}@replies.bndbox.com'],
        receivedFormat: 'Invalid format'
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        expected: 'applications+{threadId}@bndbox.com or applications+{threadId}@replies.bndbox.com',
        received: emailData.recipient
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailThreadId = emailMatch[1];
    console.log('Successfully extracted thread ID:', {
      threadId: emailThreadId,
      recipient: emailData.recipient,
      sender: emailData.sender
    });

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
      console.error('Application lookup failed:', {
        threadId: emailThreadId,
        error: appError,
        hasApplication: !!application,
        errorMessage: appError?.message,
        errorCode: appError?.code
      });
      return new Response(JSON.stringify({ 
        error: 'Application not found',
        threadId: emailThreadId,
        details: appError?.message || 'No application found with this thread ID'
      }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Found application:', {
      applicationId: application.id,
      brandName: application.brand?.name,
      brandEmail: application.brand?.contact_email,
      resellerId: application.reseller_id
    });

    // Verify the sender is the brand's contact email
    if (emailData.sender !== application.brand.contact_email) {
      console.error('Sender verification failed:', {
        sender: emailData.sender,
        expected: application.brand.contact_email,
        applicationId: application.id,
        brandName: application.brand?.name
      });
      return new Response(JSON.stringify({ 
        error: 'Unauthorized sender',
        sender: emailData.sender,
        expectedSender: application.brand.contact_email
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Process email content (prefer plain text over HTML)
    const emailContent = emailData['body-plain'] || emailData['body-html'] || '';
    
    console.log('Processing email content:', {
      hasPlainText: !!emailData['body-plain'],
      hasHtmlText: !!emailData['body-html'],
      contentLength: emailContent.length,
      subject: emailData.subject
    });
    
    // Create a message in the portal
    const messageData = {
      sender_id: application.brand_id, // Use brand_id as sender
      recipient_id: application.reseller_id,
      content: emailContent,
      email_thread_id: emailThreadId,
      message_source: 'email_inbound',
      brand_application_id: application.id,
      is_read: false
    };

    console.log('Creating message with data:', {
      sender_id: messageData.sender_id,
      recipient_id: messageData.recipient_id,
      contentLength: messageData.content.length,
      email_thread_id: messageData.email_thread_id,
      brand_application_id: messageData.brand_application_id
    });

    const { error: messageError } = await supabase
      .from('messages')
      .insert(messageData);

    if (messageError) {
      console.error('Failed to create message:', {
        error: messageError,
        messageData: messageData,
        errorMessage: messageError.message,
        errorCode: messageError.code
      });
      return new Response(JSON.stringify({ 
        error: 'Failed to create message',
        details: messageError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Message created successfully:', {
      threadId: emailThreadId,
      sender: emailData.sender,
      recipient: emailData.recipient,
      contentPreview: emailContent.substring(0, 100) + '...'
    });

    // Update application status if the email indicates approval/rejection
    const contentLower = emailContent.toLowerCase();
    let newStatus = null;
    
    if (contentLower.includes('approved') || contentLower.includes('accept')) {
      newStatus = 'approved';
    } else if (contentLower.includes('rejected') || contentLower.includes('decline')) {
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

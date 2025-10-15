
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
      timestamp: emailData.timestamp,
      hasPlainBody: !!emailData['body-plain'],
      hasHtmlBody: !!emailData['body-html'],
      messageId: emailData['Message-Id']
    });

    // Log to email routing logs for debugging
    const logEmailRouting = async (type: string, error?: string, fullContent?: string) => {
      const content = fullContent || emailData['body-plain'] || emailData['body-html'] || '';
      await supabase.from('email_routing_logs').insert({
        email_type: type,
        sender_email: emailData.sender,
        recipient_email: emailData.recipient,
        subject: emailData.subject,
        content_preview: content.substring(0, 500),
        full_content: content,
        error_message: error,
        status: error ? 'failed' : 'processed'
      });
    };

    // Verify Mailgun signature
    if (!verifyMailgunSignature(emailData.timestamp, emailData.token, emailData.signature)) {
      console.error('Invalid Mailgun signature');
      await logEmailRouting('webhook_failure', 'Invalid Mailgun signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Extract thread ID from the recipient email address (case-insensitive)
    let emailThreadId = null;
    const emailMatch = emailData.recipient.match(/applications\+([^@]+)@(bndbox\.com|replies\.bndbox\.com)/i);
    
    if (emailMatch) {
      emailThreadId = emailMatch[1];
    } else if (emailData.recipient.toLowerCase() === 'applications@bndbox.com') {
      // Safety net: If email is sent to applications@bndbox.com, try to extract thread ID from body
      const bodyContent = emailData['body-plain'] || emailData['body-html'] || '';
      const threadIdMatch = bodyContent.match(/Thread ID:\s*([^\s\n\r]+)/i);
      
      if (threadIdMatch) {
        emailThreadId = threadIdMatch[1];
        console.log('Thread ID extracted from email body (fallback):', {
          threadId: emailThreadId,
          recipient: emailData.recipient,
          sender: emailData.sender
        });
      } else {
        const errorMsg = `Email sent to fallback address but no Thread ID found in body. Recipient: ${emailData.recipient}`;
        console.error('Fallback thread ID extraction failed:', {
          recipient: emailData.recipient,
          sender: emailData.sender,
          bodyPreview: bodyContent.substring(0, 200),
          searchPattern: 'Thread ID: {id}'
        });
        await logEmailRouting('webhook_failure', errorMsg);
        return new Response(JSON.stringify({ 
          error: 'Thread ID not found',
          hint: 'Email sent to applications@bndbox.com but Thread ID not found in body',
          received: emailData.recipient
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      const errorMsg = `Invalid email format. Expected: applications+{threadId}@replies.bndbox.com or applications@bndbox.com, Received: ${emailData.recipient}`;
      console.error('Email format validation failed:', {
        recipient: emailData.recipient,
        expectedPatterns: ['applications+{threadId}@replies.bndbox.com', 'applications@bndbox.com'],
        receivedFormat: 'Invalid format',
        hint: 'Check Mailgun routing configuration'
      });
      await logEmailRouting('webhook_failure', errorMsg);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        expected: 'applications+{threadId}@replies.bndbox.com or applications@bndbox.com',
        received: emailData.recipient,
        hint: 'Ensure your email client uses Reply-To header or check Mailgun routing'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
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
      const errorMsg = `Application not found for thread ID: ${emailThreadId}. ${appError?.message || 'No application exists with this thread ID'}`;
      console.error('Application lookup failed:', {
        threadId: emailThreadId,
        error: appError,
        hasApplication: !!application,
        errorMessage: appError?.message,
        errorCode: appError?.code
      });
      await logEmailRouting('webhook_failure', errorMsg);
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

    // Verify the sender is from the brand's domain (domain-based validation)
    const extractDomain = (email: string) => {
      const match = email.match(/@(.+)$/);
      return match ? match[1].toLowerCase() : '';
    };
    
    const senderDomain = extractDomain(emailData.sender);
    const brandDomain = extractDomain(application.brand.contact_email);
    
    if (senderDomain !== brandDomain) {
      const errorMsg = `Unauthorized sender domain. Expected emails from @${brandDomain}, but got email from @${senderDomain}. Full sender: ${emailData.sender}`;
      console.error('Sender domain verification failed:', {
        sender: emailData.sender,
        senderDomain: senderDomain,
        expectedDomain: brandDomain,
        brandEmail: application.brand.contact_email,
        applicationId: application.id,
        brandName: application.brand?.name
      });
      await logEmailRouting('webhook_failure', errorMsg);
      return new Response(JSON.stringify({ 
        error: 'Unauthorized sender domain',
        sender: emailData.sender,
        expectedDomain: brandDomain,
        hint: `Please ensure emails are sent from @${brandDomain}`
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    console.log('Domain verification passed:', {
      sender: emailData.sender,
      senderDomain: senderDomain,
      brandDomain: brandDomain
    });

    // Get or create placeholder profile for brand
    console.log('Getting or creating brand profile for:', emailData.sender);
    const { data: brandProfileId, error: profileError } = await supabase
      .rpc('get_or_create_email_only_profile', {
        p_email: emailData.sender,
        p_full_name: application.brand?.name || null,
        p_company_name: application.brand?.name || null
      });

    if (profileError || !brandProfileId) {
      console.error('Error creating/fetching brand profile:', profileError);
      await logEmailRouting('error', `Failed to create brand profile: ${profileError?.message || 'Unknown error'}`);
      return new Response(
        JSON.stringify({ error: 'Failed to process sender profile' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Brand profile created/retrieved:', brandProfileId);

    // Process email content (prefer plain text over HTML)
    const emailContent = emailData['body-plain'] || emailData['body-html'] || '';
    
    console.log('Processing email content:', {
      hasPlainText: !!emailData['body-plain'],
      hasHtmlText: !!emailData['body-html'],
      contentLength: emailContent.length,
      subject: emailData.subject
    });
    
    // Create a message in the portal using the email-only profile
    const messageData = {
      sender_id: brandProfileId, // Use the email-only profile ID
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
      await logEmailRouting('webhook_failure', `Failed to create message: ${messageError.message}`);
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

    // Log successful processing
    await logEmailRouting('webhook_success');

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

    // Trigger brand engagement email on first or second interaction
    const { data: previousInteractions } = await supabase
      .from('email_routing_logs')
      .select('id')
      .eq('sender_email', emailData.sender)
      .eq('status', 'processed');

    const interactionCount = previousInteractions?.length || 0;

    // Only send engagement email on first or second interaction to prevent spam
    if (interactionCount <= 1) {
      console.log(`Triggering brand engagement email for: ${emailData.sender} (interaction #${interactionCount + 1})`);
      
      const { error: engagementError } = await supabase.functions.invoke('send-brand-engagement-email', {
        body: {
          brandEmail: emailData.sender,
          brandName: application.brand.name,
          resellerCompany: resellerProfile?.company_name || 'a BndBox reseller',
          interactionType: newStatus || 'reply',
          applicationId: application.id
        }
      });
      
      if (engagementError) {
        console.error('Failed to send brand engagement email:', engagementError);
        // Don't fail the main webhook - engagement email is non-critical
      } else {
        console.log('Brand engagement email triggered successfully');
      }
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

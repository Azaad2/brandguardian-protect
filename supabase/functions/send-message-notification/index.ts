import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MessageNotificationRequest {
  recipientEmail: string;
  senderName: string;
  messageContent: string;
  threadId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, senderName, messageContent, threadId }: MessageNotificationRequest = 
      await req.json();

    console.log('Sending message notification to:', recipientEmail);

    const { data, error } = await resend.emails.send({
      from: "BndBox Messages <noreply@bndbox.com>",
      to: [recipientEmail],
      replyTo: `applications+${threadId}@replies.bndbox.com`,
      subject: `New Message from ${senderName} on BndBox`,
      html: `
        <h2>You have a new message on BndBox</h2>
        <p><strong>From:</strong> ${senderName}</p>
        <hr>
        <p>${messageContent.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Reply to this email to continue the conversation.</p>
        <p style="color: #666; font-size: 12px;">
          Or visit <a href="https://bndbox.com">BndBox.com</a> to view all your messages.
        </p>
      `,
    });

    if (error) {
      console.error("Error sending notification email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log('Message notification sent successfully:', data?.id);

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-message-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

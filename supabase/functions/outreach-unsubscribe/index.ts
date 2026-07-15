import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").toLowerCase().trim();

  if (!email || !email.includes("@")) {
    return new Response("Invalid email", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  await supabase
    .from("daily_outreach_log")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email)
    .is("unsubscribed_at", null);

  // Also insert a marker row so future sends check this email out
  await supabase.from("daily_outreach_log").insert({
    email,
    audience_type: "brand",
    subject: "[unsubscribe marker]",
    unsubscribed_at: new Date().toISOString(),
  });

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;background:#f5f7fa;">
    <div style="max-width:480px;margin:0 auto;background:#fff;padding:40px;border-radius:12px;">
      <h1 style="color:#111827;">You're unsubscribed</h1>
      <p style="color:#4b5563;">We won't send you any more outreach emails from BndBox.</p>
      <p style="color:#6b7280;font-size:14px;">${email}</p>
      <a href="https://bndbox.com" style="color:#4f46e5;">Return to BndBox</a>
    </div>
  </body></html>`;

  return new Response(html, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/html" },
  });
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, user_id, path } = await req.json();
    const normEmail = (email || "").toLowerCase().trim();
    if (!normEmail && !user_id) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find last activity
    const { data: last } = await supabase
      .from("user_activity")
      .select("occurred_at")
      .or(normEmail ? `email.eq.${normEmail}` : `user_id.eq.${user_id}`)
      .order("occurred_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = Date.now();
    const isReturn = last?.occurred_at
      ? now - new Date(last.occurred_at).getTime() > 3 * 24 * 60 * 60 * 1000
      : false;

    await supabase.from("user_activity").insert({
      email: normEmail || null,
      user_id: user_id || null,
      event_type: "page_view",
      metadata: { path: path || null },
    });

    if (isReturn) {
      await supabase.from("user_activity").insert({
        email: normEmail || null,
        user_id: user_id || null,
        event_type: "return_visit",
        metadata: { path: path || null, gap_ms: now - new Date(last!.occurred_at).getTime() },
      });
    }

    return new Response(JSON.stringify({ ok: true, return_visit: isReturn }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[track-visit]", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

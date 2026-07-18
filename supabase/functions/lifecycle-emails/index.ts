import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import {
  resellerActivationEmail,
  resellerWinbackEmail,
  partnerActivationEmail,
  returnVisitEmail,
} from "../_shared/email-templates/lifecycle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PER_RUN = 100;
const COOLDOWN_DAYS = 3;
const UNSUB_BASE = "https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/outreach-unsubscribe";

type Journey = "reseller_activation" | "reseller_winback" | "partner_activation" | "return_visit";

interface Dispatch {
  email: string;
  name: string;
  journey: Journey;
  stage: string;
  subject: string;
  html: string;
  partnerType?: string;
}

async function generateInsight(audience: string, brandNames: string[]): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return fallbackInsight(audience);
  const brands = brandNames.slice(0, 6).join(", ") || "leading brands";
  const prompt = `Write a short 2-sentence industry insight for a ${audience} on BndBox (a B2B network connecting brands, distributors, retailers, and marketplace resellers). Mention the growing distribution opportunity. Reference that brands like ${brands} are already in the network. Return only HTML wrapped in a single <p style="background:#f1f5f9;padding:12px 16px;border-radius:8px;font-size:14px;"> tag. No markdown, no other text.`;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You write short, warm lifecycle email snippets in clean HTML." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return fallbackInsight(audience);
    const data = await res.json();
    const html = data?.choices?.[0]?.message?.content?.trim();
    return (html || fallbackInsight(audience)).replace(/^```html\s*/i, "").replace(/```\s*$/i, "");
  } catch {
    return fallbackInsight(audience);
  }
}

function fallbackInsight(audience: string): string {
  return `<p style="background:#f1f5f9;padding:12px 16px;border-radius:8px;font-size:14px;">Wholesale and marketplace distribution is fragmenting fast — ${audience}s that connect to verified partners early are the ones winning shelf space and marketplace approvals.</p>`;
}

function newBrandsBlock(brands: { name: string }[]): string {
  if (!brands.length) return "";
  const items = brands.slice(0, 6).map((b) => `<li>${b.name}</li>`).join("");
  return `<p style="margin-top:16px;"><strong>New brands recently added to BndBox:</strong></p><ul style="margin:8px 0 16px 20px;padding:0;">${items}</ul>`;
}

async function fetchNewBrands(supabase: ReturnType<typeof createClient>) {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("brands_directory")
    .select("name")
    .eq("is_active", true)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data || []) as { name: string }[];
}

async function isBlocked(supabase: ReturnType<typeof createClient>, email: string): Promise<boolean> {
  // Blocked if unsubscribed via outreach or lifecycle, or lifecycle email sent within cooldown
  const [{ data: unsub1 }, { data: unsub2 }, { data: recent }] = await Promise.all([
    supabase.from("daily_outreach_log").select("id").eq("email", email).not("unsubscribed_at", "is", null).limit(1),
    supabase.from("lifecycle_email_log").select("id").eq("email", email).not("unsubscribed_at", "is", null).limit(1),
    supabase.from("lifecycle_email_log").select("sent_at").eq("email", email).gte("sent_at", new Date(Date.now() - COOLDOWN_DAYS * 86400000).toISOString()).limit(1),
  ]);
  return !!(unsub1?.length || unsub2?.length || recent?.length);
}

async function hasStageBeenSent(supabase: ReturnType<typeof createClient>, email: string, journey: Journey, stage: string): Promise<boolean> {
  const { data } = await supabase.from("lifecycle_email_log").select("id").eq("email", email).eq("journey", journey).eq("stage", stage).limit(1);
  return !!(data && data.length);
}

async function daysSinceLastActivity(supabase: ReturnType<typeof createClient>, email: string): Promise<number | null> {
  const { data } = await supabase.from("user_activity").select("occurred_at").eq("email", email).order("occurred_at", { ascending: false }).limit(1).maybeSingle();
  if (!data?.occurred_at) return null;
  return (Date.now() - new Date(data.occurred_at).getTime()) / 86400000;
}

function stageForDays(days: number): string | null {
  if (days >= 30) return "day30";
  if (days >= 14) return "day14";
  if (days >= 7) return "day7";
  return null;
}

async function collectResellerActivation(supabase: ReturnType<typeof createClient>, insight: string, brandsBlock: string): Promise<Dispatch[]> {
  // Resellers who signed up 7+ days ago but never subscribed
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, created_at")
    .eq("user_role", "reseller")
    .lte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .limit(300);

  if (!profiles?.length) return [];
  const emails = profiles.map((p: any) => p.email).filter(Boolean);
  const { data: subs } = await supabase.from("subscribers").select("email, subscribed").in("email", emails);
  const subscribed = new Set((subs || []).filter((s: any) => s.subscribed).map((s: any) => s.email));

  const dispatches: Dispatch[] = [];
  for (const p of profiles as any[]) {
    if (subscribed.has(p.email)) continue;
    const email = (p.email || "").toLowerCase();
    if (!email) continue;
    const days = (Date.now() - new Date(p.created_at).getTime()) / 86400000;
    const stage = stageForDays(days);
    if (!stage) continue;
    if (await hasStageBeenSent(supabase, email, "reseller_activation", stage)) continue;
    if (await isBlocked(supabase, email)) continue;
    const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(email)}`;
    dispatches.push({
      email, name: p.full_name || "",
      journey: "reseller_activation", stage,
      subject: stage === "day30" ? "Last call: activate your BndBox reseller access" : "Unlock brand approvals on BndBox",
      html: resellerActivationEmail(p.full_name || "", stage, insight, brandsBlock, unsub),
    });
  }
  return dispatches;
}

async function collectResellerWinback(supabase: ReturnType<typeof createClient>, insight: string, brandsBlock: string): Promise<Dispatch[]> {
  // Subscribed resellers with no activity in 7+ days
  const { data: subs } = await supabase.from("subscribers").select("email, user_id").eq("subscribed", true).limit(500);
  if (!subs?.length) return [];
  const dispatches: Dispatch[] = [];
  for (const s of subs as any[]) {
    const email = (s.email || "").toLowerCase();
    if (!email) continue;
    const days = await daysSinceLastActivity(supabase, email);
    const stage = days == null ? "day7" : stageForDays(days);
    if (!stage) continue;
    if (await hasStageBeenSent(supabase, email, "reseller_winback", stage)) continue;
    if (await isBlocked(supabase, email)) continue;
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", s.user_id).maybeSingle();
    const { data: pending } = await supabase.from("brand_applications").select("id").eq("reseller_id", s.user_id).eq("status", "pending").limit(5);
    const pendingHtml = pending?.length
      ? `<p style="background:#fef3c7;padding:12px 16px;border-radius:8px;font-size:14px;"><strong>${pending.length} application${pending.length > 1 ? "s" : ""}</strong> awaiting your follow-up.</p>`
      : "";
    const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(email)}`;
    dispatches.push({
      email, name: profile?.full_name || "",
      journey: "reseller_winback", stage,
      subject: "New brands and updates waiting for you on BndBox",
      html: resellerWinbackEmail(profile?.full_name || "", stage, insight, brandsBlock, pendingHtml, unsub),
    });
  }
  return dispatches;
}

async function collectPartnerActivation(supabase: ReturnType<typeof createClient>, insight: string): Promise<Dispatch[]> {
  const { data: apps } = await supabase
    .from("partner_applications")
    .select("email, contact_name, company_name, partner_type, created_at")
    .lte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .limit(300);
  if (!apps?.length) return [];
  const dispatches: Dispatch[] = [];
  for (const a of apps as any[]) {
    const email = (a.email || "").toLowerCase();
    if (!email) continue;
    const days = (Date.now() - new Date(a.created_at).getTime()) / 86400000;
    const stage = stageForDays(days);
    if (!stage) continue;
    if (await hasStageBeenSent(supabase, email, "partner_activation", stage)) continue;
    if (await isBlocked(supabase, email)) continue;
    const partnerType = a.partner_type || "brand";
    const name = a.contact_name || a.company_name || "";
    const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(email)}`;
    dispatches.push({
      email, name, partnerType,
      journey: "partner_activation", stage,
      subject: `Next step for your BndBox ${partnerType} application`,
      html: partnerActivationEmail(name, partnerType, stage, insight, unsub),
    });
  }
  return dispatches;
}

async function collectReturnVisits(supabase: ReturnType<typeof createClient>, insight: string, brandsBlock: string): Promise<Dispatch[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: visits } = await supabase
    .from("user_activity")
    .select("email, user_id, occurred_at")
    .eq("event_type", "return_visit")
    .gte("occurred_at", since)
    .not("email", "is", null)
    .limit(200);
  if (!visits?.length) return [];
  const dispatches: Dispatch[] = [];
  const seen = new Set<string>();
  for (const v of visits as any[]) {
    const email = (v.email || "").toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    const stage = new Date(v.occurred_at).toISOString().slice(0, 10);
    if (await hasStageBeenSent(supabase, email, "return_visit", stage)) continue;
    if (await isBlocked(supabase, email)) continue;
    const { data: profile } = v.user_id
      ? await supabase.from("profiles").select("full_name").eq("id", v.user_id).maybeSingle()
      : { data: null };
    const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(email)}`;
    dispatches.push({
      email, name: profile?.full_name || "",
      journey: "return_visit", stage,
      subject: "You just visited BndBox — here's what's new",
      html: returnVisitEmail(profile?.full_name || "", insight, brandsBlock, unsub),
    });
  }
  return dispatches;
}

async function sendResend(to: string, subject: string, html: string): Promise<string | null> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: "BndBox <noreply@bndbox.com>", to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error(`[resend] ${res.status} to ${to}: ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  return data?.id || null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let mode = "all";
    try {
      if (req.method === "POST") {
        const b = await req.json();
        if (b?.mode) mode = b.mode;
      }
    } catch { /* ignore */ }

    const newBrands = await fetchNewBrands(supabase);
    const brandsBlock = newBrandsBlock(newBrands);
    const brandNames = newBrands.map((b) => b.name);

    const [insightReseller, insightPartner, insightGeneric] = await Promise.all([
      generateInsight("reseller", brandNames),
      generateInsight("brand or distributor", brandNames),
      generateInsight("wholesale partner", brandNames),
    ]);

    const buckets: Dispatch[] = [];
    if (mode === "all" || mode === "hourly" || mode === "return_visit") {
      buckets.push(...(await collectReturnVisits(supabase, insightGeneric, brandsBlock)));
    }
    if (mode === "all" || mode === "daily") {
      buckets.push(...(await collectResellerActivation(supabase, insightReseller, brandsBlock)));
      buckets.push(...(await collectResellerWinback(supabase, insightReseller, brandsBlock)));
      buckets.push(...(await collectPartnerActivation(supabase, insightPartner)));
    }

    let sent = 0;
    const failures: string[] = [];
    for (const d of buckets.slice(0, MAX_PER_RUN)) {
      try {
        const resendId = await sendResend(d.email, d.subject, d.html);
        if (resendId) {
          sent++;
          await supabase.from("lifecycle_email_log").insert({
            email: d.email, journey: d.journey, stage: d.stage,
            subject: d.subject, resend_id: resendId,
          });
        } else {
          failures.push(d.email);
        }
        await new Promise((r) => setTimeout(r, 250));
      } catch (err) {
        console.error(`[send] ${d.email}`, err);
        failures.push(d.email);
      }
    }

    return new Response(JSON.stringify({
      success: true, mode, eligible: buckets.length, sent, failed: failures.length,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("[lifecycle-emails] fatal", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

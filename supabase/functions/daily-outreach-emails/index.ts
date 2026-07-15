import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import {
  brandOutreachEmail,
  distributorOutreachEmail,
  resellerOutreachEmail,
} from "../_shared/email-templates/daily-outreach.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DAILY_TOTAL = 50;
const COOLDOWN_DAYS = 30;
const UNSUB_BASE = "https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/outreach-unsubscribe";

type Audience = "brand" | "distributor" | "reseller";

interface Recipient {
  email: string;
  name: string;
  audience: Audience;
}

async function generateAiBody(
  audience: Audience,
  notableBrands: string[],
): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    return fallbackBody(audience, notableBrands);
  }

  const brandList = notableBrands.slice(0, 8).join(", ") || "leading consumer brands";
  const audienceContext = {
    brand:
      "the recipient is a BRAND / manufacturer. Explain how BndBox connects them to verified retailers, wholesalers, distributors, and marketplace resellers. Emphasize expanding distribution channels and revenue.",
    distributor:
      "the recipient is a DISTRIBUTOR / wholesaler. Explain how BndBox helps them discover new brands to carry and connect with qualified retail and reseller buyers. Emphasize sourcing efficiency and network reach.",
    reseller:
      "the recipient is a RESELLER (Amazon/Walmart/eBay/Shopify). Explain how BndBox helps them get ungated, source directly from verified brands, and diversify SKUs. Emphasize approval speed and access.",
  }[audience];

  const prompt = `Write a short, warm email BODY (no subject, no greeting, no signature, no CTA button — those are added by the template).
Return ONLY well-formed HTML using <p>, <ul>, <li>, <strong>. No markdown. Around 140-180 words.

Context: ${audienceContext}

Include:
1. A one-sentence "what's happening in the industry this week" hook (retail/wholesale/marketplace distribution). Use plausible, evergreen framing — no fake statistics or dated news.
2. A short explainer of the BndBox ecosystem: how it connects brands ↔ distributors ↔ retailers ↔ resellers in one verified network.
3. Who BndBox helps most.
4. Mention that brands such as ${brandList} are already listed in the BndBox network.

Tone: professional, direct, growth-oriented. Do NOT include any link, button, or "click here" — the surrounding template handles the CTA.`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          { role: "system", content: "You write concise, high-converting B2B outreach email bodies in clean HTML." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error(`[ai] ${res.status}: ${await res.text()}`);
      return fallbackBody(audience, notableBrands);
    }

    const data = await res.json();
    const html = data?.choices?.[0]?.message?.content?.trim();
    if (!html) return fallbackBody(audience, notableBrands);
    // Strip accidental code fences
    return html.replace(/^```html\s*/i, "").replace(/```\s*$/i, "");
  } catch (err) {
    console.error("[ai] error", err);
    return fallbackBody(audience, notableBrands);
  }
}

function fallbackBody(audience: Audience, notableBrands: string[]): string {
  const brands = notableBrands.slice(0, 6).join(", ") || "hundreds of consumer brands";
  const byAudience = {
    brand:
      "<p>Retail and wholesale distribution keeps fragmenting across marketplaces, big-box, boutique retail, and DTC — reaching every channel from scratch is expensive.</p><p>BndBox is a verified network where brands connect directly with retailers, distributors, and marketplace resellers in one place. No cold outreach, no unvetted buyers.</p>",
    distributor:
      "<p>Buyer expectations are shifting fast — retailers and resellers want faster onboarding, cleaner catalogs, and verified brand relationships.</p><p>BndBox gives distributors one hub to discover new brands to carry and connect with pre-qualified retail and reseller demand.</p>",
    reseller:
      "<p>Getting ungated and building direct brand relationships is still the biggest bottleneck for growing resellers on Amazon, Walmart, and eBay.</p><p>BndBox connects verified resellers to brands actively looking for distribution — with faster approvals and cleaner sourcing.</p>",
  }[audience];

  return `${byAudience}<p>Brands already in the BndBox network include <strong>${brands}</strong> and many more.</p>`;
}

async function fetchNotableBrands(supabase: ReturnType<typeof createClient>): Promise<string[]> {
  const { data } = await supabase
    .from("brands_directory")
    .select("name")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data || []).map((b: any) => b.name).filter(Boolean);
}

async function eligibleEmails(
  supabase: ReturnType<typeof createClient>,
  candidates: { email: string; name: string }[],
  audience: Audience,
  limit: number,
): Promise<Recipient[]> {
  const cutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const results: Recipient[] = [];
  const seen = new Set<string>();

  // Fetch all recent sends + unsubscribes in one query for these emails
  const emails = candidates.map((c) => c.email.toLowerCase()).filter(Boolean);
  if (!emails.length) return results;

  const { data: recent } = await supabase
    .from("daily_outreach_log")
    .select("email, sent_at, unsubscribed_at, audience_type")
    .in("email", emails);

  const blocked = new Set<string>();
  for (const row of recent || []) {
    if (row.unsubscribed_at) blocked.add(row.email);
    if (row.audience_type === audience && row.sent_at >= cutoff) blocked.add(row.email);
  }

  for (const c of candidates) {
    const e = c.email.toLowerCase().trim();
    if (!e || !e.includes("@") || seen.has(e) || blocked.has(e)) continue;
    seen.add(e);
    results.push({ email: e, name: c.name || "", audience });
    if (results.length >= limit) break;
  }
  return results;
}

async function collectBrands(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase
    .from("brands_directory")
    .select("name, contact_email")
    .eq("is_active", true)
    .not("contact_email", "is", null)
    .limit(500);
  return (data || []).map((r: any) => ({ email: r.contact_email, name: r.name }));
}

async function collectDistributors(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase
    .from("distributors")
    .select("company_name, contact_email")
    .not("contact_email", "is", null)
    .limit(500);
  return (data || []).map((r: any) => ({ email: r.contact_email, name: r.company_name }));
}

async function collectResellers(supabase: ReturnType<typeof createClient>) {
  const { data: partners } = await supabase
    .from("partner_applications")
    .select("email, company_name, partner_type")
    .eq("partner_type", "reseller")
    .not("email", "is", null)
    .limit(500);

  const { data: apps } = await supabase
    .from("reseller_applications")
    .select("email, company_name")
    .not("email", "is", null)
    .limit(500);

  const map = new Map<string, { email: string; name: string }>();
  for (const r of partners || []) {
    if (r.email) map.set(r.email.toLowerCase(), { email: r.email, name: r.company_name || "" });
  }
  for (const r of apps || []) {
    if (r.email && !map.has(r.email.toLowerCase())) {
      map.set(r.email.toLowerCase(), { email: r.email, name: r.company_name || "" });
    }
  }
  return Array.from(map.values());
}

async function sendResend(to: string, subject: string, html: string): Promise<string | null> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY missing");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: "BndBox <noreply@bndbox.com>",
      to: [to],
      subject,
      html,
    }),
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

    // Split ~evenly across 3 audiences
    const perAudience = Math.ceil(DAILY_TOTAL / 3);

    const [brands, distributors, resellers, notableBrands] = await Promise.all([
      collectBrands(supabase),
      collectDistributors(supabase),
      collectResellers(supabase),
      fetchNotableBrands(supabase),
    ]);

    const [brandRecipients, distRecipients, resellerRecipients] = await Promise.all([
      eligibleEmails(supabase, brands, "brand", perAudience),
      eligibleEmails(supabase, distributors, "distributor", perAudience),
      eligibleEmails(supabase, resellers, "reseller", perAudience),
    ]);

    // Generate one AI body per audience per day
    const [brandBody, distBody, resellerBody] = await Promise.all([
      brandRecipients.length ? generateAiBody("brand", notableBrands) : Promise.resolve(""),
      distRecipients.length ? generateAiBody("distributor", notableBrands) : Promise.resolve(""),
      resellerRecipients.length ? generateAiBody("reseller", notableBrands) : Promise.resolve(""),
    ]);

    const dispatches: {
      recipient: Recipient;
      subject: string;
      html: string;
    }[] = [];

    for (const r of brandRecipients) {
      const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(r.email)}`;
      dispatches.push({
        recipient: r,
        subject: "Grow your brand's distribution with BndBox",
        html: brandOutreachEmail(r.name, brandBody, unsub),
      });
    }
    for (const r of distRecipients) {
      const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(r.email)}`;
      dispatches.push({
        recipient: r,
        subject: "New brands & retailer demand on BndBox",
        html: distributorOutreachEmail(r.name, distBody, unsub),
      });
    }
    for (const r of resellerRecipients) {
      const unsub = `${UNSUB_BASE}?email=${encodeURIComponent(r.email)}`;
      dispatches.push({
        recipient: r,
        subject: "More brands to source directly — via BndBox",
        html: resellerOutreachEmail(r.name, resellerBody, unsub),
      });
    }

    let sent = 0;
    const failures: string[] = [];

    for (const d of dispatches.slice(0, DAILY_TOTAL)) {
      try {
        const resendId = await sendResend(d.recipient.email, d.subject, d.html);
        if (resendId !== null) {
          sent++;
          await supabase.from("daily_outreach_log").insert({
            email: d.recipient.email,
            audience_type: d.recipient.audience,
            subject: d.subject,
            resend_id: resendId,
          });
        } else {
          failures.push(d.recipient.email);
        }
        // Small pacing delay to avoid Resend burst limits
        await new Promise((r) => setTimeout(r, 250));
      } catch (err) {
        console.error(`[send] ${d.recipient.email}`, err);
        failures.push(d.recipient.email);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        eligible: {
          brand: brandRecipients.length,
          distributor: distRecipients.length,
          reseller: resellerRecipients.length,
        },
        sent,
        failed: failures.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("[daily-outreach-emails] fatal", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

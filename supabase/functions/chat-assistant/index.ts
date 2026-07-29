import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createOpenAI } from "npm:@ai-sdk/openai@4.0.23";
import {
  convertToModelMessages,
  streamText,
  stepCountIs,
  tool,
  type UIMessage,
} from "npm:ai@7.0.41";
import { z } from "npm:zod@3.25.76";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "../_shared/ai-gateway.ts";
import { CHAT_SYSTEM_PROMPT } from "../_shared/bndbox-knowledge.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const BodySchema = z.object({
  visitorId: z.string().min(8).max(100),
  path: z.string().max(300).nullish(),
  messages: z.array(z.any()).min(1).max(200),
});

function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .map((p: { type: string; text?: string }) => (p.type === "text" ? p.text ?? "" : ""))
    .join("")
    .slice(0, 8000);
}

async function getOrCreateConversation(visitorId: string, path?: string | null) {
  const { data: existing } = await supabase
    .from("chat_conversations")
    .select("id")
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existing) return existing.id as string;

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({ visitor_id: visitorId, started_path: path ?? null })
    .select("id")
    .single();

  if (error) {
    console.error("[chat-assistant] failed to create conversation", error);
    return null;
  }
  return data.id as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured. Please try again later." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { visitorId, path } = parsed.data;
    const messages = parsed.data.messages as UIMessage[];
    const conversationId = await getOrCreateConversation(visitorId, path);

    // Persist the newest user message
    const lastMessage = messages[messages.length - 1];
    if (conversationId && lastMessage?.role === "user") {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        parts: lastMessage.parts ?? [],
        text_content: textOf(lastMessage),
      });
      if (error) console.error("[chat-assistant] user message insert failed", error);
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    const initialRunId = getLovableAiGatewayRunId(req);
    const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      fetch: runIdFetch.fetch,
    });

    const tools = {
      search_brands: tool({
        description:
          "Search the live BndBox brand directory by name, category or department. Use for any question about which brands are on BndBox or whether a specific brand is available.",
        inputSchema: z.object({
          query: z.string().nullable().describe("Brand name or keyword to search for, or null to list brands"),
          category: z.string().nullable().describe("Product category or department filter, or null"),
          limit: z.number().nullable().describe("How many brands to return, max 15, or null for 8"),
        }),
        execute: async ({ query, category, limit }) => {
          const take = Math.min(Math.max(limit ?? 8, 1), 15);
          let q = supabase
            .from("brands_directory")
            .select("name, description, categories, department, approval_rate, response_time")
            .eq("is_active", true)
            .limit(take);

          if (query) q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
          if (category) q = q.or(`department.ilike.%${category}%,categories.cs.{${category}}`);

          const { data, error } = await q;
          if (error) return { error: "Could not reach the brand directory right now." };
          return {
            count: data?.length ?? 0,
            brands: (data ?? []).map((b) => ({
              name: b.name,
              department: b.department,
              categories: b.categories,
              approval_rate: b.approval_rate,
              avg_response_hours: b.response_time,
              summary: (b.description ?? "").slice(0, 180),
            })),
          };
        },
      }),

      count_brands: tool({
        description:
          "Get the total number of active brands in the BndBox directory, optionally filtered by category or department.",
        inputSchema: z.object({
          category: z.string().nullable().describe("Category or department to count, or null for all brands"),
        }),
        execute: async ({ category }) => {
          let q = supabase
            .from("brands_directory")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true);
          if (category) q = q.or(`department.ilike.%${category}%,categories.cs.{${category}}`);
          const { count, error } = await q;
          if (error) return { error: "Could not count brands right now." };
          return { category: category ?? "all", total_active_brands: count ?? 0 };
        },
      }),

      search_distributors: tool({
        description:
          "Search verified distributors and wholesalers on BndBox by keyword, category or region.",
        inputSchema: z.object({
          query: z.string().nullable().describe("Company keyword, or null"),
          region: z.string().nullable().describe("Country, state or city, or null"),
          limit: z.number().nullable().describe("How many to return, max 10, or null for 6"),
        }),
        execute: async ({ query, region, limit }) => {
          const take = Math.min(Math.max(limit ?? 6, 1), 10);
          let q = supabase
            .from("distributors")
            .select("company_name, description, categories, city, state_province, country_code, shipping_regions, verification_status")
            .eq("verification_status", "verified")
            .limit(take);
          if (query) q = q.or(`company_name.ilike.%${query}%,description.ilike.%${query}%`);
          if (region) q = q.or(`city.ilike.%${region}%,state_province.ilike.%${region}%,country_code.ilike.%${region}%`);
          const { data, error } = await q;
          if (error) return { error: "Could not reach the distributor directory right now." };
          return {
            count: data?.length ?? 0,
            distributors: (data ?? []).map((d) => ({
              company_name: d.company_name,
              categories: d.categories,
              location: [d.city, d.state_province, d.country_code].filter(Boolean).join(", "),
              shipping_regions: d.shipping_regions,
              summary: (d.description ?? "").slice(0, 160),
            })),
          };
        },
      }),

      capture_lead: tool({
        description:
          "Save the visitor's contact details when they share an email and want BndBox to follow up. Only call this when the visitor has actually given an email address.",
        inputSchema: z.object({
          email: z.string().describe("The visitor's email address"),
          name: z.string().nullable().describe("Their name, or null"),
          interest: z.string().nullable().describe("What they are interested in (brand, distributor, reseller, other), or null"),
        }),
        execute: async ({ email, name, interest }) => {
          const clean = email.toLowerCase().trim();
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
            return { saved: false, reason: "That email address doesn't look valid." };
          }
          if (conversationId) {
            await supabase
              .from("chat_conversations")
              .update({ visitor_email: clean, visitor_name: name ?? null })
              .eq("id", conversationId);
          }
          const { error } = await supabase.from("lead_magnets").insert({
            email: clean,
            name: name ?? null,
            business_type: interest ?? null,
            magnet_type: "chat_assistant",
          });
          if (error) console.error("[chat-assistant] lead insert failed", error);
          return { saved: true, email: clean };
        },
      }),
    };

    const result = streamText({
      model: lovable.responses("openai/gpt-5.6-sol"),
      system: CHAT_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(50),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
      onError: ({ error }) => console.error("[chat-assistant] stream error", error),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      sendReasoning: false,
      headers: corsHeaders,
      onFinish: async ({ responseMessage }) => {
        if (!conversationId || !responseMessage) return;
        const { error } = await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          parts: responseMessage.parts ?? [],
          text_content: textOf(responseMessage as UIMessage),
        });
        if (error) console.error("[chat-assistant] assistant message insert failed", error);
        await supabase
          .from("chat_conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("[chat-assistant]", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

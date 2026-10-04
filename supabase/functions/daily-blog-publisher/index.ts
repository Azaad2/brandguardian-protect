import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { createOpenAI } from "npm:@ai-sdk/openai@4.0.23";
import { Output, streamText } from "npm:ai@7.0.41";
import { z } from "npm:zod@3.25.76";
import { createLovableAiGatewayRunIdFetch } from "../_shared/ai-gateway.ts";
import {
  estimateReadTime,
  sanitizeGeneratedHtml,
  validateGeneratedArticle,
  type GeneratedBlogArticle,
} from "../_shared/blog-content.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AUDIENCES = ["reseller", "brand", "distributor", "wholesaler", "retailer"] as const;

const ArticleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  contentHtml: z.string(),
  category: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  imageAlt: z.string(),
  sourceNotes: z.array(z.string()),
});

type Topic = {
  id: string;
  keyword: string;
  proposed_title: string;
  audience: typeof AUDIENCES[number];
  category: string;
  search_intent: string;
  source: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorDetails(error: unknown) {
  const candidate = error as { status?: number; statusCode?: number; message?: string };
  const status = candidate?.status ?? candidate?.statusCode ?? 500;
  const message = candidate?.message ?? "Article generation failed";
  return { status, message: message.slice(0, 800) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!supabaseUrl || !serviceRoleKey || !apiKey) {
    return json({ error: "Daily publishing is not configured." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  let lockToken: string | null = null;
  let runId: string | null = null;
  let topic: Topic | null = null;

  try {
    const { data: claimed, error: claimError } = await supabase.rpc("claim_daily_blog_publisher");
    if (claimError) throw claimError;
    lockToken = claimed;
    if (!lockToken) return json({ status: "skipped", reason: "Job is paused, disabled, or already running." });

    const today = new Date().toISOString().slice(0, 10);
    const { data: existingPost } = await supabase
      .from("blog_posts")
      .select("id, slug")
      .eq("status", "published")
      .eq("published_on", today)
      .maybeSingle();

    if (existingPost) {
      await supabase.from("blog_generation_runs").insert({
        run_date: today,
        status: "skipped",
        post_id: existingPost.id,
        error_message: "A daily article is already published.",
        completed_at: new Date().toISOString(),
      });
      await supabase.rpc("release_daily_blog_publisher", { _lock_token: lockToken, _advance_audience: false });
      return json({ status: "skipped", slug: existingPost.slug });
    }

    const { data: state, error: stateError } = await supabase
      .from("blog_automation_state")
      .select("audience_cursor")
      .eq("job_name", "daily-blog-publisher")
      .single();
    if (stateError) throw stateError;
    const audience = AUDIENCES[state.audience_cursor % AUDIENCES.length];

    const { data: audienceTopic } = await supabase
      .from("blog_topic_queue")
      .select("id, keyword, proposed_title, audience, category, search_intent, source")
      .eq("status", "queued")
      .eq("audience", audience)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (audienceTopic) topic = audienceTopic as Topic;
    if (!topic) {
      const { data: fallbackTopic } = await supabase
        .from("blog_topic_queue")
        .select("id, keyword, proposed_title, audience, category, search_intent, source")
        .eq("status", "queued")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (fallbackTopic) topic = fallbackTopic as Topic;
    }

    if (!topic) {
      await supabase.from("blog_generation_runs").insert({
        run_date: today,
        status: "skipped",
        audience,
        error_message: "No researched topic is queued.",
        completed_at: new Date().toISOString(),
      });
      await supabase.rpc("release_daily_blog_publisher", { _lock_token: lockToken, _advance_audience: false });
      return json({ status: "skipped", reason: "No researched topic is queued." });
    }

    await supabase.from("blog_topic_queue").update({ status: "selected", selected_at: new Date().toISOString() }).eq("id", topic.id);
    const { data: run, error: runError } = await supabase
      .from("blog_generation_runs")
      .insert({ run_date: today, status: "running", topic_id: topic.id, audience: topic.audience })
      .select("id")
      .single();
    if (runError) throw runError;

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      output: Output.object({ schema: ArticleSchema, name: "bndbox_blog_article" }),
      maxRetries: 0,
      system: `You are the senior editor for BndBox, a B2B marketplace connecting brands, distributors, wholesalers, retailers, and resellers. Write practical, accurate, human-sounding articles in plain English. Never invent statistics, quotes, laws, platform policies, or BndBox capabilities. Avoid hype, filler, and robotic phrases. Explain unfamiliar terms. Use short paragraphs and useful examples. The article must be evergreen unless the topic explicitly requires a year.`,
      prompt: `Write one complete article for a ${topic.audience} reader.

Primary keyword: ${topic.keyword}
Working title: ${topic.proposed_title}
Category: ${topic.category}
Search intent: ${topic.search_intent}
Research source: ${topic.source}

Requirements:
- 900 to 1,800 words.
- A clear title between 30 and 90 characters and a lowercase hyphenated slug.
- An excerpt between 110 and 190 characters.
- HTML body only: use h2, h3, p, ul, ol, li, strong, em, and a tags. Do not include h1, html, body, scripts, styles, forms, or images.
- At least four useful h2 sections and at least eight paragraphs.
- Add descriptive id attributes to headings.
- Include concrete steps, realistic cautions, and a concise conclusion.
- Link naturally to either /partner-hub or /reseller-hub as the next BndBox step.
- Use two to six relevant secondary keywords.
- sourceNotes must briefly identify claims that should be checked by an editor; use an empty array when there are none.
- Do not include citations or external links unless you are certain the destination is authoritative.`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "medium",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const generated = await result.output;
    runId = runIdFetch.getRunId() ?? null;
    const article: GeneratedBlogArticle = {
      title: generated.title.trim(),
      slug: generated.slug.trim().toLowerCase(),
      excerpt: generated.excerpt.trim(),
      contentHtml: sanitizeGeneratedHtml(generated.contentHtml),
      category: generated.category.trim() || topic.category,
      secondaryKeywords: generated.secondaryKeywords.map((value) => value.trim()).filter(Boolean),
      imageAlt: generated.imageAlt.trim(),
      sourceNotes: generated.sourceNotes.map((value) => value.trim()).filter(Boolean),
    };
    const validation = validateGeneratedArticle(article);

    if (!validation.valid) {
      const reason = `Quality checks failed: ${validation.problems.join(", ")}`;
      await supabase.from("blog_topic_queue").update({ status: "rejected" }).eq("id", topic.id);
      await supabase.from("blog_generation_runs").update({
        status: "failed",
        error_message: reason,
        gateway_run_id: runId,
        completed_at: new Date().toISOString(),
      }).eq("id", run.id);
      await supabase.rpc("release_daily_blog_publisher", { _lock_token: lockToken, _advance_audience: false });
      return json({ status: "rejected", reason }, 422);
    }

    const publishedAt = new Date().toISOString();
    const { data: post, error: postError } = await supabase.from("blog_posts").insert({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content_html: article.contentHtml,
      audience: topic.audience,
      category: article.category,
      primary_keyword: generated.primaryKeyword.trim() || topic.keyword,
      secondary_keywords: article.secondaryKeywords,
      search_intent: topic.search_intent,
      image_url: "/og-images/homepage.jpg",
      image_alt: article.imageAlt,
      read_time: estimateReadTime(validation.wordCount),
      source_notes: article.sourceNotes,
      quality_score: validation.score,
      status: "published",
      published_on: today,
      published_at: publishedAt,
    }).select("id, slug").single();
    if (postError) throw postError;

    await supabase.from("blog_topic_queue").update({ status: "published", published_post_id: post.id }).eq("id", topic.id);
    await supabase.from("blog_generation_runs").update({
      status: "published",
      post_id: post.id,
      gateway_run_id: runId,
      completed_at: new Date().toISOString(),
    }).eq("id", run.id);
    await supabase.rpc("release_daily_blog_publisher", { _lock_token: lockToken, _advance_audience: true });
    return json({ status: "published", slug: post.slug, qualityScore: validation.score });
  } catch (error) {
    const details = errorDetails(error);
    console.error("[daily-blog-publisher]", details.status, details.message);
    const today = new Date().toISOString().slice(0, 10);
    const terminal = details.status === 402 || details.status === 403;
    const rateLimited = details.status === 429;
    const status = terminal ? "denied" : rateLimited ? "paused" : "failed";

    if (topic) await supabase.from("blog_topic_queue").update({ status: "queued", selected_at: null }).eq("id", topic.id);
    await supabase.from("blog_generation_runs").insert({
      run_date: today,
      status,
      topic_id: topic?.id ?? null,
      audience: topic?.audience ?? null,
      error_message: details.message,
      gateway_run_id: runId,
      completed_at: new Date().toISOString(),
    });
    if (terminal || rateLimited) {
      await supabase.from("blog_automation_state").update({ paused_reason: details.message }).eq("job_name", "daily-blog-publisher");
    }
    if (lockToken) await supabase.rpc("release_daily_blog_publisher", { _lock_token: lockToken, _advance_audience: false });
    return json({ status, error: details.message }, details.status >= 400 && details.status < 600 ? details.status : 500);
  }
});
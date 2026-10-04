import { supabase } from "@/integrations/supabase/client";
import type { DynamicBlogPost, DynamicBlogSummary } from "@/types/blog";

const PUBLIC_COLUMNS = "id, slug, title, excerpt, author, audience, category, primary_keyword, secondary_keywords, image_url, image_alt, read_time, published_at, updated_at";

export async function getPublishedBlogPosts(limit = 30): Promise<DynamicBlogSummary[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_COLUMNS)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as DynamicBlogSummary[];
}

export async function getPublishedBlogPost(slug: string): Promise<DynamicBlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content_html, author, audience, category, primary_keyword, secondary_keywords, image_url, image_alt, read_time, published_at, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) throw error;
  return data as DynamicBlogPost | null;
}
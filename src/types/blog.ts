export interface DynamicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  author: string;
  audience: "reseller" | "brand" | "distributor" | "wholesaler" | "retailer";
  category: string;
  primary_keyword: string;
  secondary_keywords: string[];
  image_url: string;
  image_alt: string;
  read_time: string;
  published_at: string;
  updated_at: string;
}

export type DynamicBlogSummary = Omit<DynamicBlogPost, "content_html">;
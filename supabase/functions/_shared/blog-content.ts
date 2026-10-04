export interface GeneratedBlogArticle {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  secondaryKeywords: string[];
  imageAlt: string;
  sourceNotes: string[];
}

const BLOCKED_HTML = /<(script|style|iframe|object|embed|form)\b|\son\w+\s*=|javascript:/i;
const ALLOWED_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateGeneratedArticle(article: GeneratedBlogArticle) {
  const plainText = article.contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const headingCount = (article.contentHtml.match(/<h2\b/gi) ?? []).length;
  const paragraphCount = (article.contentHtml.match(/<p\b/gi) ?? []).length;
  const problems: string[] = [];

  if (article.title.length < 30 || article.title.length > 90) problems.push("title length");
  if (!ALLOWED_SLUG.test(article.slug) || article.slug.length > 90) problems.push("slug format");
  if (article.excerpt.length < 110 || article.excerpt.length > 190) problems.push("excerpt length");
  if (wordCount < 900 || wordCount > 1800) problems.push("word count");
  if (headingCount < 4) problems.push("heading count");
  if (paragraphCount < 8) problems.push("paragraph count");
  if (BLOCKED_HTML.test(article.contentHtml)) problems.push("unsafe HTML");
  if (!article.contentHtml.includes("/partner-hub") && !article.contentHtml.includes("/reseller-hub")) problems.push("missing BndBox next step");
  if (article.secondaryKeywords.length < 2 || article.secondaryKeywords.length > 6) problems.push("secondary keyword count");
  if (!article.imageAlt.trim()) problems.push("image alt text");

  const score = Math.max(0, 100 - problems.length * 15);
  return { valid: problems.length === 0, problems, wordCount, score };
}

export function sanitizeGeneratedHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object|embed|form)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function estimateReadTime(wordCount: number) {
  return `${Math.max(4, Math.ceil(wordCount / 220))} min read`;
}
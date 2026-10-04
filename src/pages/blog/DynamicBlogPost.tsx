import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogReturnLink from "@/components/navigation/BlogReturnLink";
import EnhancedBlogPost from "@/components/blog/EnhancedBlogPost";
import { getPublishedBlogPost } from "@/lib/blog";
import type { DynamicBlogPost as DynamicBlogPostRecord } from "@/types/blog";

const DynamicBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<DynamicBlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!slug) {
      setFailed(true);
      setLoading(false);
      return;
    }

    let active = true;
    getPublishedBlogPost(slug)
      .then((result) => {
        if (!active) return;
        setPost(result);
        setFailed(!result);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16" aria-busy="true">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="h-5 w-32 loading-skeleton rounded" />
            <div className="h-12 w-full loading-skeleton rounded" />
            <div className="h-6 w-2/3 loading-skeleton rounded" />
            <div className="aspect-[16/7] loading-skeleton rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (failed || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">This article may have moved or is not published yet.</p>
          <BlogReturnLink />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <BlogReturnLink variant="subtle" />
        </div>
        <EnhancedBlogPost
          title={post.title}
          excerpt={post.excerpt}
          content={post.content_html}
          author={post.author}
          publishedDate={post.published_at}
          modifiedDate={post.updated_at}
          category={post.category}
          tags={[post.primary_keyword, ...post.secondary_keywords]}
          readTime={post.read_time}
          imageUrl={post.image_url}
          slug={post.slug}
        />
      </main>
      <Footer />
    </div>
  );
};

export default DynamicBlogPost;
import React, { useEffect, useState } from 'react';
import { Clock, User, Calendar, Share2, BookOpen, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trackSEOInteraction, trackEngagement } from '@/lib/analytics';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import { SchemaGenerator } from '@/components/seo/SchemaGenerator';
import TableOfContents from '@/components/blog/TableOfContents';

interface BlogPostProps {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  category: string;
  tags: string[];
  readTime: string;
  imageUrl: string;
  slug: string;
}

const EnhancedBlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  excerpt,
  author,
  publishedDate,
  modifiedDate,
  category,
  tags,
  readTime,
  imageUrl,
  slug
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let scrollTimer: NodeJS.Timeout;

    const updateScrollProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setScrollProgress(progress);
      setShowBackToTop(scrolled > 300);
      setMaxScroll(Math.max(maxScroll, progress));
    };

    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateScrollProgress, 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Track engagement on page unload
    const handleBeforeUnload = () => {
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
      setTimeSpent(timeSpentSeconds);
      trackEngagement(timeSpentSeconds, Math.round(maxScroll), window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(scrollTimer);
    };
  }, [maxScroll]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url
        });
        trackSEOInteraction('Article_Share', 'Native', title);
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        trackSEOInteraction('Article_Share', 'Clipboard', title);
      }
    } else {
      navigator.clipboard.writeText(url);
      trackSEOInteraction('Article_Share', 'Clipboard', title);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackSEOInteraction('Navigation', 'Back_To_Top', title);
  };

  const generateTOC = () => {
    // Extract headings from content (this would be more sophisticated in real implementation)
    const headings = [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'key-strategies', title: 'Key Strategies', level: 1 },
      { id: 'implementation', title: 'Implementation Guide', level: 1 },
      { id: 'best-practices', title: 'Best Practices', level: 1 },
      { id: 'conclusion', title: 'Conclusion', level: 1 }
    ];
    return headings;
  };

  const canonicalUrl = `https://bndbox.com/blog/${slug}`;
  const schema = SchemaGenerator.generateBlogPostSchema(
    title,
    excerpt,
    canonicalUrl,
    publishedDate,
    modifiedDate || publishedDate,
    author,
    imageUrl,
    category,
    readTime
  );

  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema([
    { name: 'Home', url: 'https://bndbox.com/' },
    { name: 'Blog', url: 'https://bndbox.com/blog' },
    { name: title, url: canonicalUrl }
  ]);

  return (
    <>
      <AdvancedSEO
        title={title}
        description={excerpt}
        canonicalUrl={canonicalUrl}
        ogImage={imageUrl}
        publishedTime={new Date(publishedDate).toISOString()}
        modifiedTime={modifiedDate ? new Date(modifiedDate).toISOString() : undefined}
        author={author}
        category={category}
        readTime={readTime}
        schema={[schema, breadcrumbSchema]}
        keywords={`${tags.join(', ')}, amazon reseller, wholesale approval, brand protection`}
      />

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8" itemScope itemType="https://schema.org/BlogPosting">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              <span itemProp="articleSection">{category}</span>
            </Badge>
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" itemProp="headline">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{author}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={new Date(publishedDate).toISOString()} itemProp="datePublished">
                {new Date(publishedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {modifiedDate && (
            <p className="text-sm text-muted-foreground">
              Last updated: 
              <time dateTime={new Date(modifiedDate).toISOString()} itemProp="dateModified">
                {new Date(modifiedDate).toLocaleDateString()}
              </time>
            </p>
          )}
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
            itemProp="image"
            loading="eager"
          />
        </div>

        {/* Table of Contents */}
        <TableOfContents items={generateTOC()} />

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8" itemProp="articleBody">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        <Separator className="my-8" />

        {/* Article Footer */}
        <footer className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">About the Author</h3>
            <p className="text-muted-foreground">
              {author} is part of the BndBox team, specializing in Amazon marketplace strategies and brand protection.
            </p>
          </div>
        </footer>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg"
            onClick={handleBackToTop}
            size="icon"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        )}

        {/* Hidden metadata for SEO */}
        <meta itemProp="url" content={canonicalUrl} />
        <meta itemProp="wordCount" content={content.split(' ').length.toString()} />
        <meta itemProp="timeRequired" content={readTime} />
      </article>
    </>
  );
};

export default EnhancedBlogPost;
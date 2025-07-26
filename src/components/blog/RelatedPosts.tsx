import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { trackSEOInteraction } from '@/lib/analytics';

interface RelatedPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  readTime: string;
  image: string;
  alt: string;
  publishedDate: string;
}

interface RelatedPostsProps {
  currentPostId: number;
  category: string;
  tags: string[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, category, tags }) => {
  // This would typically fetch from an API or database
  const allPosts: RelatedPost[] = [
    {
      id: 1,
      title: "How to Enforce MAP Policy and Prevent Unauthorized Sellers on Amazon in 2025",
      excerpt: "Comprehensive guide to MAP policy enforcement and unauthorized seller prevention.",
      slug: "enforce-map-policy-prevent-unauthorized-sellers-amazon",
      category: "Brand Protection",
      readTime: "22 min read",
      image: "photo-1461749280684-dccba630e2f6",
      alt: "Amazon seller dashboard showing MAP policy enforcement",
      publishedDate: "2025-05-24"
    },
    {
      id: 2,
      title: "Complete Guide to Preventing Unauthorized Sellers on Amazon in 2025",
      excerpt: "Learn proven strategies to identify, remove, and prevent unauthorized sellers on Amazon.",
      slug: "prevent-unauthorized-sellers-amazon",
      category: "Brand Protection",
      readTime: "18 min read",
      image: "photo-1556742049-0cfed4f6a45d",
      alt: "Amazon seller dashboard showing unauthorized seller monitoring",
      publishedDate: "2025-05-24"
    },
    {
      id: 3,
      title: "Amazon Brand Registry Benefits: Complete Protection Guide for Brands",
      excerpt: "Discover how Amazon Brand Registry protects your brand and learn advanced strategies.",
      slug: "amazon-brand-registry-benefits",
      category: "Brand Protection",
      readTime: "16 min read",
      image: "photo-1551288049-bebda4e38f71",
      alt: "Amazon Brand Registry dashboard showing brand protection features",
      publishedDate: "2025-05-24"
    }
  ];

  // Filter related posts based on category and tags
  const getRelatedPosts = (): RelatedPost[] => {
    const filtered = allPosts
      .filter(post => post.id !== currentPostId)
      .map(post => ({
        ...post,
        relevanceScore: calculateRelevanceScore(post, category, tags)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    return filtered;
  };

  const calculateRelevanceScore = (post: RelatedPost, currentCategory: string, currentTags: string[]): number => {
    let score = 0;
    
    // Same category gets high score
    if (post.category === currentCategory) {
      score += 10;
    }
    
    // Matching keywords in title
    const titleWords = post.title.toLowerCase().split(' ');
    const tagWords = currentTags.map(tag => tag.toLowerCase());
    
    tagWords.forEach(tag => {
      if (titleWords.some(word => word.includes(tag) || tag.includes(word))) {
        score += 5;
      }
    });
    
    return score;
  };

  const handleRelatedPostClick = (postTitle: string) => {
    trackSEOInteraction('Related_Post_Click', 'Internal_Link', postTitle);
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={`https://images.unsplash.com/${post.image}?w=400&h=250&auto=format`}
                alt={post.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                <Link
                  to={`/blog/${post.slug}`}
                  onClick={() => handleRelatedPostClick(post.title)}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <time className="text-xs text-muted-foreground">
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
                <Link
                  to={`/blog/${post.slug}`}
                  onClick={() => handleRelatedPostClick(post.title)}
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                  Read more
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
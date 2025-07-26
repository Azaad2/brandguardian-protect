import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackSEOInteraction } from '@/lib/analytics';
import NewsletterSignup from './NewsletterSignup';

interface SidebarPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishedDate: string;
  views?: number;
}

interface BlogSidebarProps {
  recentPosts?: SidebarPost[];
  popularPosts?: SidebarPost[];
  categories?: Array<{ name: string; count: number; slug: string }>;
  tags?: Array<{ name: string; count: number; slug: string }>;
  className?: string;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  recentPosts = [],
  popularPosts = [],
  categories = [],
  tags = [],
  className = ''
}) => {
  const handlePostClick = (postTitle: string, type: 'recent' | 'popular') => {
    trackSEOInteraction(`Sidebar_${type}_Post_Click`, 'Internal_Link', postTitle);
  };

  const handleCategoryClick = (categoryName: string) => {
    trackSEOInteraction('Sidebar_Category_Click', 'Filter', categoryName);
  };

  const handleTagClick = (tagName: string) => {
    trackSEOInteraction('Sidebar_Tag_Click', 'Filter', tagName);
  };

  // Default data if none provided
  const defaultRecentPosts: SidebarPost[] = [
    {
      id: 1,
      title: "How to Enforce MAP Policy and Prevent Unauthorized Sellers",
      slug: "enforce-map-policy-prevent-unauthorized-sellers-amazon",
      category: "Brand Protection",
      readTime: "22 min read",
      publishedDate: "2025-05-24"
    },
    {
      id: 2,
      title: "Complete Guide to Preventing Unauthorized Sellers",
      slug: "prevent-unauthorized-sellers-amazon",
      category: "Brand Protection",
      readTime: "18 min read",
      publishedDate: "2025-05-24"
    },
    {
      id: 3,
      title: "Amazon Brand Registry Benefits Guide",
      slug: "amazon-brand-registry-benefits",
      category: "Brand Protection",
      readTime: "16 min read",
      publishedDate: "2025-05-24"
    }
  ];

  const defaultCategories = [
    { name: 'Brand Protection', count: 12, slug: 'brand-protection' },
    { name: 'Amazon Strategies', count: 8, slug: 'amazon-strategies' },
    { name: 'Reseller Guides', count: 6, slug: 'reseller-guides' },
    { name: 'Wholesale Tips', count: 4, slug: 'wholesale-tips' }
  ];

  const defaultTags = [
    { name: 'Amazon', count: 15, slug: 'amazon' },
    { name: 'MAP Policy', count: 8, slug: 'map-policy' },
    { name: 'Unauthorized Sellers', count: 6, slug: 'unauthorized-sellers' },
    { name: 'Brand Registry', count: 5, slug: 'brand-registry' },
    { name: 'Wholesale', count: 7, slug: 'wholesale' },
    { name: 'Reseller', count: 9, slug: 'reseller' }
  ];

  const displayRecentPosts = recentPosts.length > 0 ? recentPosts : defaultRecentPosts;
  const displayPopularPosts = popularPosts.length > 0 ? popularPosts : defaultRecentPosts;
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayTags = tags.length > 0 ? tags : defaultTags;

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Newsletter Signup */}
      <NewsletterSignup 
        variant="sidebar"
        title="Weekly Insights"
        description="Get expert Amazon and reseller tips delivered weekly."
      />

      {/* Recent Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayRecentPosts.slice(0, 5).map((post, index) => (
            <div key={post.id}>
              <article className="group">
                <Link
                  to={`/blog/${post.slug}`}
                  onClick={() => handlePostClick(post.title, 'recent')}
                  className="block"
                >
                  <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs py-0">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </Link>
              </article>
              {index < displayRecentPosts.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Popular Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayPopularPosts.slice(0, 5).map((post, index) => (
            <div key={post.id}>
              <article className="group">
                <Link
                  to={`/blog/${post.slug}`}
                  onClick={() => handlePostClick(post.title, 'popular')}
                  className="block"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg font-bold text-primary/60 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs py-0">
                          {post.category}
                        </Badge>
                        {post.views && (
                          <span>{post.views.toLocaleString()} views</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
              {index < displayPopularPosts.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/blog/category/${category.slug}`}
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Cloud */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <Button
                key={tag.slug}
                variant="outline"
                size="sm"
                onClick={() => handleTagClick(tag.name)}
                className="text-xs h-auto py-1 px-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <Link to={`/blog/tag/${tag.slug}`}>
                  {tag.name} ({tag.count})
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Need Brand Approval Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with authorized resellers and protect your brand on Amazon.
          </p>
          <Button asChild className="w-full">
            <Link to="/brand">Start Free Trial</Link>
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};

export default BlogSidebar;
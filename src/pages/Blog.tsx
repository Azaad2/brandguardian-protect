import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import { trackPageView, trackSEOInteraction, trackWebVitals } from "@/lib/analytics";
import { Link } from "react-router-dom";
import AdvancedSEO from "@/components/seo/AdvancedSEO";
import { SchemaGenerator } from "@/components/seo/SchemaGenerator";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import InternalLinks from "@/components/seo/InternalLinks";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to Outreach 1000 Brands in 10 Minutes for Your Amazon Wholesale Business?",
      excerpt: "Discover how to revolutionize your Amazon wholesale business by outreaching to thousands of brands in minutes instead of weeks. Learn the automated approach that transforms manual brand applications into a streamlined, efficient process using BndBox.",
      date: "January 4, 2025",
      author: "BndBox Team",
      slug: "outreach-thousand-brands-amazon-wholesale",
      image: "photo-1460925895917-afdab827c52f",
      alt: "Amazon wholesale reseller using BndBox dashboard to apply to multiple brands efficiently",
      readTime: "15 min read",
      category: "Amazon Wholesale"
    },
    {
      id: 2,
      title: "Amazon Wholesale vs. Private Label: Which Path is Right for Your E-commerce Journey?",
      excerpt: "Confused between Amazon Wholesale and Private Label? This in-depth guide breaks down the pros, cons, and key differences to help you choose the best e-commerce strategy for your business.",
      date: "August 3, 2025",
      author: "BndBox Team",
      slug: "amazon-wholesale-vs-private-label",
      image: "photo-1556742049-0cfed4f6a45d",
      alt: "Amazon FBA business comparison between wholesale and private label selling strategies",
      readTime: "12 min read",
      category: "E-commerce Strategy"
    },
    {
      id: 2,
      title: "How To Get UNGATED In ANY Brand On Amazon In 2025: Your Ultimate Guide",
      excerpt: "Master the complete ungating process on Amazon with proven strategies for 2025. Learn the invoice method, LOA process, distributor relationships, and automated solutions to unlock any brand and scale your FBA business.",
      date: "January 31, 2025",
      author: "BndBox Team",
      slug: "how-to-get-ungated-any-brand-amazon-2025-ultimate-guide",
      image: "photo-1486312338219-ce68d2c6f44d",
      alt: "Amazon seller dashboard showing ungating process and brand approval strategies for FBA resellers",
      readTime: "25 min read",
      category: "Amazon Ungating"
    },
    {
      id: 2,
      title: "Master Your Amazon Reseller Business: Strategies for Profitability, Sourcing, and Growth",
      excerpt: "Discover advanced strategies to maximize profitability, optimize sourcing, and scale your Amazon FBA reseller business with expert insights on inventory management, growth hacks, and essential tools for 2025.",
      date: "January 28, 2025",
      author: "BndBox Team",
      slug: "master-amazon-reseller-business-strategies-profitability-sourcing-growth",
      image: "photo-1560472354-b33ff0c44a43",
      alt: "Amazon FBA reseller workspace showing profit analysis, inventory management, and business growth strategies",
      readTime: "12 min read",
      category: "Amazon FBA"
    },
    {
      id: 3,
      title: "Unlock Amazon Wholesale Success: How BndBox Supercharges Your Brand Approvals",
      excerpt: "Discover how BndBox revolutionizes the Amazon wholesale reseller experience with access to 1 million brands and streamlined approval processes. Transform your brand outreach from manual headache to competitive advantage.",
      date: "December 26, 2024",
      author: "BndBox Team",
      slug: "unlock-amazon-wholesale-success-bndbox-brand-approvals",
      image: "photo-1556742049-0cfed4f6a45d",
      alt: "Amazon wholesale reseller dashboard showing BndBox brand approval system and directory access",
      readTime: "8 min read",
      category: "Wholesale Success"
    },
    {
      id: 4,
      title: "How to Enforce MAP Policy and Prevent Unauthorized Sellers on Amazon in 2025",
      excerpt: "Comprehensive guide to MAP policy enforcement and unauthorized seller prevention. Learn how leading brands protect their reputation and pricing with proven strategies and connect with authorized resellers.",
      date: "May 24, 2025",
      author: "BndBox Team",
      slug: "enforce-map-policy-prevent-unauthorized-sellers-amazon",
      image: "photo-1461749280684-dccba630e2f6",
      alt: "Amazon seller dashboard showing MAP policy enforcement and brand protection tools for preventing unauthorized sellers",
      readTime: "22 min read",
      category: "Brand Protection"
    },
    {
      id: 5,
      title: "Complete Guide to Preventing Unauthorized Sellers on Amazon in 2025",
      excerpt: "Learn proven strategies to identify, remove, and prevent unauthorized sellers on Amazon. Protect your brand integrity with our comprehensive 2025 guide.",
      date: "May 24, 2025",
      author: "BndBox Team",
      slug: "prevent-unauthorized-sellers-amazon",
      image: "photo-1556742049-0cfed4f6a45d",
      alt: "Amazon seller dashboard showing unauthorized seller monitoring and brand protection tools",
      readTime: "18 min read",
      category: "Brand Protection"
    },
    {
      id: 6,
      title: "Amazon Brand Registry Benefits: Complete Protection Guide for Brands",
      excerpt: "Discover how Amazon Brand Registry protects your brand and learn advanced strategies to maximize its effectiveness for comprehensive brand protection.",
      date: "May 24, 2025",
      author: "BndBox Team",
      slug: "amazon-brand-registry-benefits",
      image: "photo-1551288049-bebda4e38f71",
      alt: "Amazon Brand Registry dashboard showing brand protection features and benefits",
      readTime: "16 min read",
      category: "Brand Protection"
    },
    {
      id: 7,
      title: "How to Identify and Remove Counterfeit Products on Amazon",
      excerpt: "Complete guide to detecting, reporting, and removing counterfeit products on Amazon. Protect your brand with proven identification and removal strategies.",
      date: "May 24, 2025",
      author: "BndBox Team",
      slug: "identify-remove-counterfeit-products",
      image: "photo-1563013544-824ae1b704d3",
      alt: "Brand protection specialist examining counterfeit products and authentic items side by side",
      readTime: "14 min read",
      category: "Brand Protection"
    },
    {
      id: 8,
      title: "Brand Wholesale Approval: What Every Reseller Needs to Know",
      excerpt: "Essential insights into the brand approval process and how to position your reseller business for success.",
      date: "March 1, 2025",
      author: "Brand Relations Team",
      slug: "brand-wholesale-approval-guide",
      image: "photo-1519389950473-47ba0277781c",
      alt: "Business meeting between brand representatives and resellers",
      readTime: "12 min read",
      category: "Wholesale Success"
    },
  ];

  // Track page view with enhanced analytics and Core Web Vitals
  useEffect(() => {
    trackPageView(window.location.pathname);
    
    // Track Core Web Vitals
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(({ name, delta, value }) => trackWebVitals(name, delta, value));
      onFCP(({ name, delta, value }) => trackWebVitals(name, delta, value));
      onLCP(({ name, delta, value }) => trackWebVitals(name, delta, value));
      onTTFB(({ name, delta, value }) => trackWebVitals(name, delta, value));
    }).catch(() => {
      // Silently handle if web-vitals is not available
    });
  }, []);

  // Track blog post click for SEO analytics
  const handleBlogPostClick = (postTitle: string) => {
    trackSEOInteraction('BlogPost_Click', 'Article', postTitle);
  };

  // Generate blog schema structured data
  const generateBlogSchema = () => {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "headline": "BndBox Blog - Brand Wholesale Approval Resources",
      "description": "Expert articles and guides on brand wholesale approval, reseller applications, MAP policies, and e-commerce marketplace strategies.",
      "url": "https://bndbox.com/blog",
      "datePublished": "2025-05-12",
      "dateModified": "2025-05-12",
      "publisher": {
        "@type": "Organization",
        "name": "BndBox",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bndbox.com/logo.png",
          "width": 600,
          "height": 60
        }
      },
      "blogPost": blogPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "mainEntityOfPage": `https://bndbox.com/blog/${post.slug}`,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "BndBox",
          "logo": {
            "@type": "ImageObject",
            "url": "https://bndbox.com/logo.png",
            "width": 600,
            "height": 60
          }
        },
        "image": {
          "@type": "ImageObject",
          "url": `https://images.unsplash.com/${post.image}?w=800&auto=format`,
          "height": 800,
          "width": 1200
        },
        "url": `https://bndbox.com/blog/${post.slug}`
      }))
    };

    return JSON.stringify(blogSchema);
  };
  
  // Generate breadcrumb schema
  const generateBreadcrumbSchema = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://bndbox.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://bndbox.com/blog"
        }
      ]
    };
    
    return JSON.stringify(breadcrumbSchema);
  };

  const organizationSchema = SchemaGenerator.generateOrganizationSchema();
  const websiteSchema = SchemaGenerator.generateWebsiteSchema();
  const blogListingSchema = generateBlogSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <div className="min-h-screen flex flex-col">
      <AdvancedSEO
        title="Amazon Brand Approval Guide & Resources | BndBox Blog"
        description="Expert articles and guides on Amazon wholesale brand approval, reseller application process, MAP policies, and e-commerce marketplace strategies. Get insider tips from industry experts."
        canonicalUrl="https://bndbox.com/blog"
        keywords="amazon brand approval, wholesale approval guides, reseller application process, MAP policy enforcement, amazon reseller guides, brand protection, unauthorized sellers"
        schema={[organizationSchema, websiteSchema, blogListingSchema, breadcrumbSchema]}
        ogImage="https://bndbox.com/blog-og-image.jpg"
        additionalMeta={[
          { name: "author", content: "BndBox Team" },
          { property: "article:publisher", content: "https://www.facebook.com/bndbox" },
          { name: "twitter:site", content: "@BndBox" }
        ]}
      />
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbNav />
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Brand Wholesale Approval Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Expert insights, proven strategies, and comprehensive guides to help brands and resellers succeed on Amazon and other marketplaces.
          </p>
          
          {/* Blog Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{blogPosts.length} Expert Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Updated Weekly</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">15-25 min reads</span>
            </div>
          </div>
        </div>
        
        {/* Featured Post */}
        {blogPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="bg-primary">Featured</Badge>
              <span className="text-sm text-muted-foreground">Most Popular Guide</span>
            </div>
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6 lg:p-8">
              <div className="grid lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{blogPosts[0].category}</Badge>
                    <span className="text-sm text-muted-foreground">{blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">
                    <Link 
                      to={`/blog/${blogPosts[0].slug}`}
                      onClick={() => handleBlogPostClick(blogPosts[0].title)}
                      className="hover:text-primary transition-colors"
                    >
                      {blogPosts[0].title}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground mb-4 text-lg">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{blogPosts[0].author}</span>
                    <span>•</span>
                    <time>{blogPosts[0].date}</time>
                  </div>
                </div>
                <div className="aspect-video lg:aspect-square overflow-hidden rounded-lg">
                  <img
                    src={`https://images.unsplash.com/${blogPosts[0].image}?w=400&h=400&auto=format`}
                    alt={blogPosts[0].alt}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1" itemScope itemType="https://schema.org/BlogPosting">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${post.image}?w=600&h=400&auto=format`}
                  alt={post.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width="600"
                  height="400"
                  itemProp="image"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    <span itemProp="articleSection">{post.category}</span>
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors" itemProp="headline">
                  <Link 
                    to={`/blog/${post.slug}`}
                    onClick={() => handleBlogPostClick(post.title)}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3" itemProp="description">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{post.author}</span>
                  </span>
                  <time dateTime={new Date(post.date).toISOString()} itemProp="datePublished">{post.date}</time>
                </div>
                <meta itemProp="url" content={`https://bndbox.com/blog/${post.slug}`} />
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/blog?tag=amazon-approval" 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              onClick={() => trackSEOInteraction('Tag_Click', 'BlogTag', 'amazon-approval')}
            >
              Amazon Brand Approval
            </Link>
            <Link 
              to="/blog?tag=wholesale" 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              onClick={() => trackSEOInteraction('Tag_Click', 'BlogTag', 'wholesale')}
            >
              Wholesale Strategy
            </Link>
            <Link 
              to="/blog?tag=map-policy" 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              onClick={() => trackSEOInteraction('Tag_Click', 'BlogTag', 'map-policy')}
            >
              MAP Policies
            </Link>
            <Link 
              to="/blog?tag=reseller-tips" 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              onClick={() => trackSEOInteraction('Tag_Click', 'BlogTag', 'reseller-tips')}
            >
              Reseller Tips
            </Link>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of successful resellers who use BndBox to get approved by top brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/reseller-hub" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
            >
              Apply as Reseller
            </Link>
            <Link 
              to="/about" 
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Learn About BndBox
            </Link>
          </div>
        </div>
        
        <div className="mt-12">
          <InternalLinks currentPage="/blog" category="amazon" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

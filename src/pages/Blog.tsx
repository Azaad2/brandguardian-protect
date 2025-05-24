import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import { trackPageView, trackSEOInteraction } from "@/lib/analytics";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How to Enforce MAP Policy and Prevent Unauthorized Sellers on Amazon in 2025",
      excerpt: "Comprehensive guide to MAP policy enforcement and unauthorized seller prevention on Amazon. Learn proven strategies to protect your brand and pricing integrity in 2025.",
      date: "May 24, 2025",
      author: "BndBox Team",
      slug: "enforce-map-policy-prevent-unauthorized-sellers-amazon",
      image: "photo-1461749280684-dccba630e2f6",
      alt: "Amazon seller dashboard showing brand protection and MAP policy enforcement tools",
      readTime: "15 min read",
      category: "Brand Protection"
    },
    {
      id: 2,
      title: "The Complete Guide to Amazon Wholesale Brand Approval in 2025",
      excerpt: "Master the process of securing Amazon wholesale brand approvals with our comprehensive guide covering latest requirements, strategies, and success stories.",
      date: "April 22, 2025",
      author: "Brand Relations Team",
      slug: "amazon-wholesale-brand-approval-guide-2025",
      image: "photo-1661956602116-aa6865609028",
      alt: "Amazon seller dashboard showing brand approval status",
      readTime: "15 min read",
      category: "Brand Approval Guides"
    },
    {
      id: 3,
      title: "How to Get Approved by Brands as an Amazon Reseller",
      excerpt: "Discover proven strategies to secure brand wholesale approval for selling products on Amazon marketplace.",
      date: "March 28, 2025",
      author: "Legal Team",
      slug: "how-to-get-approved-by-brands",
      image: "photo-1461749280684-dccba630e2f6",
      alt: "Amazon marketplace seller dashboard on a computer screen"
    },
    {
      id: 4,
      title: "MAP Policy Enforcement: Best Practices for Brands and Resellers",
      excerpt: "Updated guide on implementing and maintaining effective Minimum Advertised Price policies to protect brand integrity.",
      date: "March 15, 2025",
      author: "Marketplace Specialists",
      slug: "map-policy-enforcement-best-practices",
      image: "photo-1581091226825-a6a2a5aee158",
      alt: "Business professional reviewing pricing documents"
    },
    {
      id: 5,
      title: "Brand Wholesale Approval: What Every Reseller Needs to Know",
      excerpt: "Essential insights into the brand approval process and how to position your reseller business for success.",
      date: "March 1, 2025",
      author: "Brand Relations Team",
      slug: "brand-wholesale-approval-guide",
      image: "photo-1519389950473-47ba0277781c",
      alt: "Business meeting between brand representatives and resellers"
    },
  ];

  // Track page view with enhanced analytics
  useEffect(() => {
    trackPageView(window.location.pathname);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Amazon Brand Approval Guide & Resources | BndBox Blog</title>
        <meta name="description" content="Expert articles and guides on Amazon wholesale brand approval, reseller application process, MAP policies, and e-commerce marketplace strategies." />
        <meta name="keywords" content="amazon brand approval, wholesale approval guides, reseller application process, MAP policy enforcement, amazon reseller guides" />
        <link rel="canonical" href="https://bndbox.com/blog" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Schema.org JSON-LD structured data */}
        <script type="application/ld+json">
          {generateBlogSchema()}
        </script>
        
        <script type="application/ld+json">
          {generateBreadcrumbSchema()}
        </script>
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbNav />
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Brand Wholesale Approval Resources</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/BlogPosting">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${post.image}?w=600&h=400&auto=format`}
                  alt={post.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width="600"
                  height="400"
                  itemProp="image"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500" itemProp="articleSection">{post.category}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 transition-colors" itemProp="headline">
                  <Link 
                    to={`/blog/${post.slug}`}
                    onClick={() => handleBlogPostClick(post.title)}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3" itemProp="description">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
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
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

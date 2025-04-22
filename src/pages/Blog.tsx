import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import { Helmet } from "react-helmet";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
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
      id: 2,
      title: "How to Get Approved by Brands as an Amazon Reseller",
      excerpt: "Discover proven strategies to secure brand wholesale approval for selling products on Amazon marketplace.",
      date: "March 28, 2025",
      author: "Legal Team",
      slug: "how-to-get-approved-by-brands",
      image: "photo-1461749280684-dccba630e2f6",
      alt: "Amazon marketplace seller dashboard on a computer screen"
    },
    {
      id: 3,
      title: "MAP Policy Enforcement: Best Practices for Brands and Resellers",
      excerpt: "Updated guide on implementing and maintaining effective Minimum Advertised Price policies to protect brand integrity.",
      date: "March 15, 2025",
      author: "Marketplace Specialists",
      slug: "map-policy-enforcement-best-practices",
      image: "photo-1581091226825-a6a2a5aee158",
      alt: "Business professional reviewing pricing documents"
    },
    {
      id: 4,
      title: "Brand Wholesale Approval: What Every Reseller Needs to Know",
      excerpt: "Essential insights into the brand approval process and how to position your reseller business for success.",
      date: "March 1, 2025",
      author: "Brand Relations Team",
      slug: "brand-wholesale-approval-guide",
      image: "photo-1519389950473-47ba0277781c",
      alt: "Business meeting between brand representatives and resellers"
    },
  ];

  // Generate blog schema structured data
  const generateBlogSchema = () => {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "headline": "BndBox Blog - Brand Wholesale Approval Resources",
      "description": "Expert articles and guides on brand wholesale approval, reseller applications, MAP policies, and e-commerce marketplace strategies.",
      "publisher": {
        "@type": "Organization",
        "name": "BndBox",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bndbox.com/logo.png"
        }
      },
      "blogPost": blogPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "BndBox",
          "logo": {
            "@type": "ImageObject",
            "url": "https://bndbox.com/logo.png"
          }
        },
        "image": `https://images.unsplash.com/${post.image}?w=800&auto=format`,
        "url": `https://bndbox.com/blog/${post.slug}`
      }))
    };

    return JSON.stringify(blogSchema);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Amazon Brand Approval Guide & Resources | BndBox Blog</title>
        <meta name="description" content="Expert articles and guides on Amazon wholesale brand approval, reseller application process, MAP policies, and e-commerce marketplace strategies." />
        <link rel="canonical" href="https://bndbox.com/blog" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbNav />
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Brand Wholesale Approval Resources</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${post.image}?w=600&h=400&auto=format`}
                  alt={post.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  width="600"
                  height="400"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500">{post.category}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={`/blog/${post.slug}`}>
                    {post.title}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{post.author}</span>
                  <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Blog structured data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateBlogSchema() }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

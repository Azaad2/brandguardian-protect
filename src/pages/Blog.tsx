
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import { Helmet } from "react-helmet";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to the Reseller Application Process",
      excerpt: "Learn how to navigate the brand wholesale approval process effectively with step-by-step instructions for reseller applications.",
      date: "April 5, 2025",
      author: "Marketing Team",
      slug: "reseller-application-process-guide",
      image: "photo-1488590528505-98d2b5aba04b",
      alt: "Person filling out application forms on a laptop"
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
        <title>Blog | Brand Wholesale Approval Resources | BndBox</title>
        <meta name="description" content="Expert articles and guides on brand wholesale approval, reseller application process, MAP policies, and e-commerce marketplace strategies." />
        <link rel="canonical" href="https://bndbox.com/blog" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbNav />
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Brand Wholesale Approval Resources</h1>
        
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
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{post.author}</span>
                  <time dateTime={post.date}>{post.date}</time>
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

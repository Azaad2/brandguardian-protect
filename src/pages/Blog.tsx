
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomeLink from "@/components/navigation/HomeLink";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How Verified Resellers Can Boost Your Brand's Reach",
      excerpt: "Learn how working with verified resellers can help expand your brand presence across multiple marketplaces.",
      date: "April 5, 2025",
      author: "Marketing Team",
    },
    {
      id: 2,
      title: "MAP Policies: Best Practices for E-Commerce Success",
      excerpt: "Discover effective strategies for implementing and maintaining Minimum Advertised Price policies.",
      date: "March 28, 2025",
      author: "Legal Team",
    },
    {
      id: 3,
      title: "Navigating Amazon's Brand Registry in 2025",
      excerpt: "Updated guide on protecting your brand and leveraging Amazon's tools for brand owners.",
      date: "March 15, 2025",
      author: "Marketplace Specialists",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <HomeLink variant="subtle" />
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100"></div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

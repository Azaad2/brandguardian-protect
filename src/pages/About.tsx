
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import { Helmet } from "react-helmet";
import InternalLinks from "@/components/seo/InternalLinks";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About BndBox | Brand Wholesale Approval Platform</title>
        <meta name="description" content="Learn about BndBox - a marketplace connecting brands with trusted resellers across Amazon, Walmart, and eBay. Streamlined brand wholesale approval process." />
        <link rel="canonical" href="https://bndbox.com/about" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbNav />
        </div>
        
        <h1 className="text-3xl font-bold mb-6">About BndBox</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            BndBox is a marketplace where brands meet resellers, creating trusted connections
            that respect brand integrity while maximizing sales potential across multiple e-commerce platforms.
            Our platform specializes in streamlining the brand wholesale approval process.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create a transparent ecosystem where brands can safely expand their e-commerce
            presence through verified resellers who are committed to maintaining brand standards and pricing policies.
            We simplify the wholesale approval process for both brands and resellers. Learn more about our{" "}
            <Link to="/reseller-hub" className="text-bndbox-600 hover:text-bndbox-700 underline">
              reseller application process
            </Link>{" "}
            and how we help brands{" "}
            <Link to="/blog/prevent-unauthorized-sellers-amazon" className="text-bndbox-600 hover:text-bndbox-700 underline">
              prevent unauthorized sellers
            </Link>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            Founded by e-commerce experts with over 15 years of experience across Amazon, Walmart, and
            eBay marketplaces, our team understands the challenges brands face with unauthorized resellers
            and the opportunities that trusted partnerships can bring.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">The Brand Wholesale Approval Process</h2>
          <p>
            Getting wholesale approval from brands can be complex and time-consuming. BndBox simplifies this process:
          </p>
          <ol className="list-decimal pl-6 my-4 space-y-2">
            <li>Resellers create a verified profile showcasing their marketplace performance</li>
            <li>Brands review applicants using our standardized verification process</li>
            <li>Approved resellers receive wholesale access and pricing</li>
            <li>Our platform monitors compliance with brand policies and MAP pricing</li>
          </ol>
          
          <p className="mt-6">
            Ready to get started? Check out our comprehensive guides on{" "}
            <Link to="/blog/amazon-wholesale-vs-private-label" className="text-bndbox-600 hover:text-bndbox-700 underline">
              Amazon wholesale vs private label
            </Link>{" "}
            or learn{" "}
            <Link to="/blog/how-to-get-ungated-any-brand-amazon-2025" className="text-bndbox-600 hover:text-bndbox-700 underline">
              how to get ungated on Amazon
            </Link>.
          </p>
        </div>
        
        <div className="mt-12">
          <InternalLinks currentPage="/about" category="company" />
        </div>
        
        {/* Company schema structured data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BndBox",
              "url": "https://bndbox.com",
              "logo": "https://bndbox.com/logo.png",
              "description": "BndBox is a platform that connects brands with trusted resellers across Amazon, Walmart, and eBay, streamlining the brand wholesale approval process.",
              "foundingDate": "2023",
              "founders": [
                {
                  "@type": "Person",
                  "name": "E-Commerce Experts"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/bndbox",
                "https://www.linkedin.com/company/bndbox",
                "https://twitter.com/bndbox"
              ]
            })
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default About;

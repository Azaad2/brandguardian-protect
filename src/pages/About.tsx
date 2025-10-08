
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreadcrumbNav from "@/components/navigation/BreadcrumbNav";
import InternalLinks from "@/components/seo/InternalLinks";
import { Link } from "react-router-dom";
import AdvancedSEO from "@/components/seo/AdvancedSEO";
import { SchemaGenerator } from "@/components/seo/SchemaGenerator";

const About = () => {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About BndBox",
    "description": "Learn about BndBox - a marketplace connecting brands with trusted resellers and retailers across Amazon, Walmart, and eBay. Streamlined brand wholesale approval process.",
    "url": "https://bndbox.com/about",
    "mainEntity": SchemaGenerator.generateOrganizationSchema()
  };

  const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema([
    { name: 'Home', url: 'https://bndbox.com' },
    { name: 'About', url: 'https://bndbox.com/about' }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <AdvancedSEO
        title="About BndBox | Brand Wholesale Approval & Reseller Verification Platform"
        description="BndBox is a B2B marketplace connecting premium brands with verified resellers and retailers. Founded by e-commerce experts with 15+ years of experience, we streamline wholesale approvals and ensure brand protection across Amazon, Walmart, and eBay marketplaces."
        keywords="about BndBox, brand wholesale platform, reseller marketplace, B2B wholesale, authorized distribution, brand protection company, e-commerce marketplace"
        canonicalUrl="https://bndbox.com/about"
        ogImage="https://bndbox.com/og-images/about.jpg"
        ogType="website"
        schema={[aboutPageSchema, breadcrumbSchema]}
      />
      
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
          <p className="mb-4">
            Our mission is to create a transparent ecosystem where brands can safely expand their e-commerce
            presence through verified resellers and traditional retailers who are committed to maintaining brand standards and pricing policies.
            We simplify the wholesale approval process for both brands and resellers, whether they sell on online marketplaces or through brick-and-mortar retail channels.
          </p>
          <p>
            BndBox bridges the gap between brands seeking authorized distribution partners and professional resellers/retailers looking for wholesale opportunities.
            Learn more about our{" "}
            <Link to="/reseller-hub" className="text-bndbox-600 hover:text-bndbox-700 underline">
              reseller application process
            </Link>{" "}
            and how we help brands{" "}
            <Link to="/blog/prevent-unauthorized-sellers-amazon" className="text-bndbox-600 hover:text-bndbox-700 underline">
              prevent unauthorized sellers
            </Link>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            Founded by e-commerce experts with over 15 years of experience across Amazon, Walmart, and
            eBay marketplaces, our team understands the challenges brands face with unauthorized resellers
            and the opportunities that trusted partnerships can bring.
          </p>
          <p>
            Our platform serves both online marketplace sellers and traditional retail buyers, providing brands 
            with a comprehensive solution for managing all types of wholesale relationships. Whether you're looking 
            to connect with Amazon resellers, retail store buyers, or B2B wholesale distributors, BndBox provides 
            the verification tools and marketplace infrastructure you need.
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
        
      </main>
      <Footer />
    </div>
  );
};

export default About;

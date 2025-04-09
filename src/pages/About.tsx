
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomeLink from "@/components/navigation/HomeLink";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <HomeLink variant="subtle" />
        </div>
        
        <h1 className="text-3xl font-bold mb-6">About BndBox</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            BndBox is a marketplace where brands meet resellers, creating trusted connections
            that respect brand integrity while maximizing sales potential across multiple e-commerce platforms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to create a transparent ecosystem where brands can safely expand their e-commerce
            presence through verified resellers who are committed to maintaining brand standards and pricing policies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            Founded by e-commerce experts with over 15 years of experience across Amazon, Walmart, and
            eBay marketplaces, our team understands the challenges brands face with unauthorized resellers
            and the opportunities that trusted partnerships can bring.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

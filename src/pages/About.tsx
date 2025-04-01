
import { ShieldCheck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About BndBox - Protecting Your Brand on Amazon</title>
        <meta name="description" content="Discover how BndBox helps brands protect their reputation and sales on Amazon by vetting resellers and enforcing compliance." />
      </Helmet>
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About BndBox</h1>
                <p className="text-xl text-gray-600 mb-8">Protecting Your Brand on Amazon</p>
                <Button asChild size="lg">
                  <a href="#contact">Get Started</a>
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" 
                  alt="Brand manager monitoring Amazon listings" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-8">
                At BndBox, we understand the challenges brands face on Amazon, from unauthorized sellers to counterfeit products. Our mission is to empower brands with the tools they need to maintain control over their online presence. By leveraging AI-driven technology, we vet resellers, monitor marketplaces, and enforce compliance with brand guidelines.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Story</h2>
              <p className="text-lg text-gray-700 mb-8">
                Founded by e-commerce experts who have seen firsthand the impact of unauthorized resellers, BndBox was created to bridge the gap between brands and trusted resellers. Our platform is designed to ensure that every product sold under your brand name meets your standards.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Our Vision</h2>
              <p className="text-lg text-gray-700 mb-8">
                To be the leading platform for brand protection on Amazon, helping brands grow their sales while safeguarding their reputation.
              </p>

              <div className="flex items-center justify-center mt-16 mb-8">
                <div className="h-16 w-16 rounded-full gradient-bg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to protect your brand?</h2>
                <Button asChild size="lg">
                  <a href="/#contact">Contact Us Today</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;

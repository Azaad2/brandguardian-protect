
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileWarning, 
  Users, 
  Shield 
} from "lucide-react";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>5 Ways Unauthorized Sellers Are Hurting Your Brand on Amazon | BndBox Blog</title>
        <meta name="description" content="Learn how unauthorized sellers impact your brand's reputation and sales on Amazon, and discover strategies to prevent these issues with BndBox." />
      </Helmet>
      <Header />
      <main className="pt-24">
        {/* Blog Header */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-4">Brand Protection</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                5 Ways Unauthorized Sellers Are Hurting Your Brand on Amazon (And How to Stop Them)
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Published on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=80" 
                alt="Risks of unauthorized sellers infographic" 
                className="rounded-lg shadow-md w-full h-auto mb-8"
              />
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-8">
                As a brand owner selling on Amazon, you're likely aware of the challenges posed by unauthorized sellers. These resellers can damage your brand's reputation, undercut prices, and even sell counterfeit products. Here are five ways unauthorized sellers can hurt your brand and how BndBox can help:
              </p>

              <div className="my-12 space-y-12">
                {/* Challenge 1 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16">
                    <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reputation Damage</h2>
                    <p className="text-gray-700">
                      Unauthorized sellers often provide poor customer service, leading to negative reviews that reflect poorly on your brand. When customers receive damaged goods, incorrect items, or experience shipping delays, they don't blame the seller – they blame your brand.
                    </p>
                  </div>
                </div>

                {/* Challenge 2 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16">
                    <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Price Erosion</h2>
                    <p className="text-gray-700">
                      They undercut prices, making it difficult for authorized resellers to compete and maintain profit margins. This race to the bottom ultimately devalues your products and can lead to authorized sellers dropping your line entirely.
                    </p>
                  </div>
                </div>

                {/* Challenge 3 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16">
                    <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                      <FileWarning className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Counterfeit Products</h2>
                    <p className="text-gray-700">
                      Unauthorized sellers may sell fake versions of your products, endangering customer safety and trust. These counterfeits not only steal your sales but can cause serious harm to consumers – and devastating damage to your brand's reputation.
                    </p>
                  </div>
                </div>

                {/* Challenge 4 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16">
                    <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Inconsistent Branding</h2>
                    <p className="text-gray-700">
                      Unauthorized listings often use outdated or incorrect product information, diluting your brand identity. Inconsistent messaging and visuals confuse customers and weaken your brand's positioning in the marketplace.
                    </p>
                  </div>
                </div>

                {/* Challenge 5 */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-16">
                    <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Channel Conflicts</h2>
                    <p className="text-gray-700">
                      Authorized resellers struggle with competition from unauthorized sellers, affecting their motivation to invest in your brand. When legitimate partners can't compete on price, they're less likely to promote your products or maintain adequate inventory.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-16">Solution</h2>
              <p className="text-lg text-gray-700 mb-8">
                BndBox offers a comprehensive solution to these challenges by vetting resellers, monitoring marketplaces for unauthorized activity, and enforcing compliance with your brand guidelines. Our platform ensures that only trusted resellers represent your brand, protecting your reputation and sales.
              </p>

              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 my-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to safeguard your brand on Amazon?</h3>
                <p className="text-gray-700 mb-6">Learn more about how BndBox can help you maintain control over your online presence.</p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <a href="/about">Learn About Our Mission</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/#features">Explore Our Features</a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                <Badge variant="secondary">Brand protection</Badge>
                <Badge variant="secondary">Unauthorized sellers</Badge>
                <Badge variant="secondary">Amazon resellers</Badge>
                <Badge variant="secondary">Counterfeit prevention</Badge>
                <Badge variant="secondary">MAP compliance</Badge>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;

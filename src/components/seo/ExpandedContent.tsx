import { motion } from 'framer-motion';
import { PremiumCard } from '@/components/ui/premium-card';
import { Store, Package, ShoppingCart, Globe, CheckCircle, ArrowRight, Shield, Zap, TrendingUp, Users } from 'lucide-react';

const ExpandedContent = () => {
  const partnershipTypes = [
    {
      icon: <Store className="w-6 h-6 text-white" />,
      title: "Brick & Mortar Retailers",
      description: "Traditional retail stores, boutiques, and specialty shops looking to add premium brands to their physical shelves."
    },
    {
      icon: <Package className="w-6 h-6 text-white" />,
      title: "Wholesale Distributors",
      description: "B2B distributors and wholesalers who supply products to multiple retail channels and business customers."
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      title: "Marketplace Resellers",
      description: "Authorized sellers on Amazon, Walmart, and eBay with proven track records and compliance standards."
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "E-Commerce Stores",
      description: "Online boutiques, Shopify stores, and digital retailers expanding their product catalogs with trusted brands."
    }
  ];

  const brandBenefits = [
    "Connect with verified retail partners across all channels",
    "Streamline approval workflows for faster partnership decisions",
    "Monitor brand compliance across physical and digital storefronts",
    "Protect MAP pricing and brand guidelines automatically",
    "Grow wholesale distribution while maintaining brand control"
  ];

  const partnerBenefits = [
    "Access premium brands actively seeking retail partners",
    "Get approved faster with verified business credentials",
    "Receive exclusive wholesale pricing and terms",
    "Access product catalogs and marketing materials",
    "Build long-term partnerships with leading brands"
  ];

  return (
    <section className="py-24 gradient-mesh px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10 space-y-24">
        {/* Partnership Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-4 h-4 mr-2" />
              Beyond Marketplaces
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              All Types of Retail Partners Welcome
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you operate physical stores, wholesale distribution, online marketplaces, or e-commerce sites — BndBox connects you with the right brand partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PremiumCard variant="glass" className="group p-6 h-full hover:border-primary/30 transition-all duration-300">
                  <motion.div
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    {type.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Brands Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6">
              <Shield className="w-4 h-4 mr-2" />
              For Brands
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Expand Your Distribution Network
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect with qualified retail partners across traditional retail, wholesale, and e-commerce channels. BndBox helps you grow distribution while maintaining complete brand control and compliance.
            </p>
            <div className="space-y-4 mb-8">
              {brandBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={() => window.location.href = '#contact'}
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                Register Your Brand
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <PremiumCard variant="glass" className="p-8">
              <div className="space-y-6">
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, label: "Average Sales Growth", value: "+127%" },
                  { icon: <Users className="w-5 h-5" />, label: "Active Retail Partners", value: "2,400+" },
                  { icon: <Shield className="w-5 h-5" />, label: "Brand Protection Rate", value: "99.7%" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 glass-morphism rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                        {stat.icon}
                      </div>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>
          </motion.div>
        </motion.div>

        {/* For Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <PremiumCard variant="glass" className="p-8">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Premium Brands Available</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {["Electronics", "Beauty", "Home & Garden", "Sports", "Fashion", "Health"].map((category, index) => (
                    <motion.div
                      key={index}
                      className="p-4 glass-morphism rounded-lg text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="font-semibold text-foreground text-sm">{category}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-medium text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              For Retailers & Distributors
            </div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Get Approved by Premium Brands
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you're a traditional retailer, wholesale distributor, or e-commerce seller — get fast-tracked approvals from brands actively seeking retail partners like you.
            </p>
            <div className="space-y-4 mb-8">
              {partnerBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={() => window.location.href = '/reseller-hub'}
              className="group px-8 py-4 bg-gradient-to-r from-accent to-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                Apply as Retail Partner
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-16 text-foreground">How BndBox Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Create Profile", desc: "Set up your brand or retail business profile with verification" },
              { step: "2", title: "Connect & Apply", desc: "Browse partners and submit applications with one click" },
              { step: "3", title: "Start Trading", desc: "Get approved and begin wholesale partnerships immediately" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PremiumCard variant="glass" className="p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 leading-none">
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpandedContent;

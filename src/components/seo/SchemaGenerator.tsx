export class SchemaGenerator {
  static generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BndBox",
      "alternateName": "BndBox - AI-Powered Wholesale Distribution Platform",
      "url": "https://bndbox.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bndbox.com/logo.png",
        "width": 600,
        "height": 60
      },
      "description": "AI-powered wholesale distribution network connecting brands, distributors, retailers, and online resellers worldwide.",
      "foundingDate": "2024",
      "sameAs": [
        "https://www.linkedin.com/company/bndbox"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-BNDBOX",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    };
  }

  static generateWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "BndBox",
      "url": "https://bndbox.com",
      "description": "Connect brands with authorized resellers for wholesale opportunities",
      "publisher": {
        "@type": "Organization",
        "name": "BndBox"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://bndbox.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  static generateBlogPostSchema(
    title: string,
    description: string,
    url: string,
    publishedDate: string,
    modifiedDate: string,
    author: string,
    imageUrl: string,
    category: string,
    readTime?: string
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://bndbox.com/team"
      },
      "publisher": this.generateOrganizationSchema(),
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630
      },
      "articleSection": category,
      ...(readTime && {
        "timeRequired": readTime,
        "wordCount": this.estimateWordCount(readTime)
      }),
      "inLanguage": "en-US",
      "genre": "Business",
      "keywords": this.generateKeywordsFromTitle(title)
    };
  }

  static generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  static generateHowToSchema(
    name: string,
    description: string,
    steps: Array<{ name: string; text: string; image?: string }>
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": description,
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        ...(step.image && {
          "image": {
            "@type": "ImageObject",
            "url": step.image
          }
        })
      }))
    };
  }

  static generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  static generateProductSchema(
    name: string,
    description: string,
    price: string,
    currency: string = "USD"
  ) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "brand": {
        "@type": "Brand",
        "name": "BndBox"
      },
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock",
        "seller": this.generateOrganizationSchema()
      }
    };
  }

  private static estimateWordCount(readTime: string): number {
    const minutes = parseInt(readTime.replace(/\D/g, ''));
    return minutes * 200; // Average reading speed of 200 words per minute
  }

  private static generateKeywordsFromTitle(title: string): string {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    const keywords = title
      .toLowerCase()
      .split(' ')
      .filter(word => !commonWords.includes(word) && word.length > 2)
      .join(', ');
    
    return `${keywords}, amazon, reseller, wholesale, brand approval`;
  }
}
export class SEOUtils {
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }

  static generateMetaDescription(content: string, maxLength: number = 160): string {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');
    
    // Truncate to maxLength
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    // Find the last complete sentence within the limit
    const truncated = textContent.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    
    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1);
    }
    
    // Fall back to word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  static extractKeywords(content: string, maxKeywords: number = 10): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    const words = content
      .toLowerCase()
      .replace(/<[^>]*>/g, '') // Remove HTML
      .replace(/[^a-z0-9\s]/g, ' ') // Replace special chars with spaces
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    // Count word frequency
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  static calculateReadingTime(content: string, wordsPerMinute: number = 200): string {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  static generateCanonicalUrl(path: string, baseUrl: string = 'https://bndbox.com'): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  static optimizeImageAlt(title: string, context?: string): string {
    const baseAlt = title.toLowerCase();
    const contextSuffix = context ? ` - ${context}` : '';
    return `${baseAlt}${contextSuffix}`.substring(0, 125); // Alt text should be under 125 chars
  }

  static generateOpenGraphImage(title: string, category?: string): string {
    const encodedTitle = encodeURIComponent(title);
    const encodedCategory = category ? encodeURIComponent(category) : '';
    
    // This would integrate with a service like Bannerbear, Placid, or custom image generation
    return `https://bndbox.com/api/og-image?title=${encodedTitle}&category=${encodedCategory}`;
  }

  static validateSEO(data: {
    title: string;
    description: string;
    content: string;
    keywords?: string[];
  }): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Title validation
    if (data.title.length < 30) {
      issues.push('Title is too short (minimum 30 characters)');
      score -= 10;
    }
    if (data.title.length > 60) {
      issues.push('Title is too long (maximum 60 characters)');
      score -= 10;
    }

    // Description validation
    if (data.description.length < 120) {
      issues.push('Meta description is too short (minimum 120 characters)');
      score -= 10;
    }
    if (data.description.length > 160) {
      issues.push('Meta description is too long (maximum 160 characters)');
      score -= 10;
    }

    // Content validation
    const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    if (wordCount < 300) {
      issues.push('Content is too short (minimum 300 words)');
      score -= 15;
    }

    // Keyword validation
    if (data.keywords && data.keywords.length > 0) {
      const titleLower = data.title.toLowerCase();
      const descriptionLower = data.description.toLowerCase();
      const contentLower = data.content.toLowerCase();
      
      const primaryKeyword = data.keywords[0].toLowerCase();
      
      if (!titleLower.includes(primaryKeyword)) {
        suggestions.push('Consider including the primary keyword in the title');
        score -= 5;
      }
      
      if (!descriptionLower.includes(primaryKeyword)) {
        suggestions.push('Consider including the primary keyword in the meta description');
        score -= 5;
      }

      // Check keyword density (should be 1-3%)
      const keywordMatches = (contentLower.match(new RegExp(primaryKeyword, 'g')) || []).length;
      const density = (keywordMatches / wordCount) * 100;
      
      if (density < 0.5) {
        suggestions.push('Consider increasing keyword density slightly');
        score -= 3;
      } else if (density > 3) {
        issues.push('Keyword density is too high (over 3%)');
        score -= 10;
      }
    }

    // Heading structure validation
    const headings = data.content.match(/<h[1-6][^>]*>/gi) || [];
    if (headings.length === 0) {
      issues.push('No headings found in content');
      score -= 15;
    }

    const h1Count = (data.content.match(/<h1[^>]*>/gi) || []).length;
    if (h1Count === 0) {
      issues.push('No H1 heading found');
      score -= 10;
    } else if (h1Count > 1) {
      issues.push('Multiple H1 headings found');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  static generateSitemap(pages: Array<{
    url: string;
    lastModified?: string;
    changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    const urls = pages.map(page => {
      const loc = `<loc>${page.url}</loc>`;
      const lastmod = page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : '';
      const changefreq = page.changeFreq ? `<changefreq>${page.changeFreq}</changefreq>` : '';
      const priority = page.priority ? `<priority>${page.priority}</priority>` : '';
      
      return `<url>${loc}${lastmod}${changefreq}${priority}</url>`;
    }).join('');

    return `${xmlHeader}\n${urlsetOpen}\n${urls}\n${urlsetClose}`;
  }

  static generateRobotsTxt(options: {
    userAgent?: string;
    disallow?: string[];
    allow?: string[];
    sitemapUrl?: string;
    crawlDelay?: number;
  } = {}): string {
    const {
      userAgent = '*',
      disallow = [],
      allow = [],
      sitemapUrl,
      crawlDelay
    } = options;

    let robots = `User-agent: ${userAgent}\n`;
    
    allow.forEach(path => {
      robots += `Allow: ${path}\n`;
    });
    
    disallow.forEach(path => {
      robots += `Disallow: ${path}\n`;
    });
    
    if (crawlDelay) {
      robots += `Crawl-delay: ${crawlDelay}\n`;
    }
    
    robots += '\n';
    
    if (sitemapUrl) {
      robots += `Sitemap: ${sitemapUrl}\n`;
    }
    
    return robots;
  }
}
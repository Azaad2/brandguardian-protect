#!/usr/bin/env node

/**
 * Dynamic sitemap generator for bndbox.com
 * Generates sitemap.xml with current dates and all routes
 * FAIL-SAFE: Always exits successfully to prevent build failures
 */

// Wrap entire script in fail-safe error handler
process.on('uncaughtException', (error) => {
  console.warn('⚠️  Sitemap generation failed:', error.message);
  console.log('Build will continue with existing sitemap...');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.warn('⚠️  Sitemap generation failed:', error.message);
  console.log('Build will continue with existing sitemap...');
  process.exit(0);
});

const fs = require('fs');
const path = require('path');

const baseUrl = 'https://bndbox.com';
const currentDate = new Date().toISOString().split('T')[0];

const routes = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0,
    image: '/og-images/homepage.jpg',
    lastmod: currentDate
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    image: '/og-images/about.jpg',
    lastmod: currentDate
  },
  {
    path: '/reseller-hub',
    changefreq: 'weekly',
    priority: 0.9,
    image: '/og-images/reseller-hub.jpg',
    lastmod: currentDate
  },
  {
    path: '/brand-portal',
    changefreq: 'weekly',
    priority: 0.9,
    image: '/og-images/brand-portal.jpg',
    lastmod: currentDate
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: currentDate
  },
  {
    path: '/blog/enforce-map-policy-prevent-unauthorized-sellers',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-15'
  },
  {
    path: '/blog/amazon-wholesale-vs-private-label',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-10'
  },
  {
    path: '/blog/amazon-brand-registry-benefits',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-05'
  },
  {
    path: '/blog/how-to-get-ungated-any-brand-amazon-2025',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-01-20'
  },
  {
    path: '/blog/master-amazon-reseller-business',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-08'
  },
  {
    path: '/blog/unlock-amazon-wholesale-success',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-12'
  },
  {
    path: '/blog/prevent-unauthorized-sellers-amazon',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-18'
  },
  {
    path: '/blog/identify-remove-counterfeit-products',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-14'
  },
  {
    path: '/blog/outreach-thousand-brands-amazon-wholesale',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-01-22'
  },
  {
    path: '/privacy-policy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: '2024-12-01'
  },
  {
    path: '/terms-of-service',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: '2024-12-01'
  },
  {
    path: '/cookie-policy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: '2024-12-01'
  },
  {
    path: '/cancellation-refund-policy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: '2024-12-01'
  },
  {
    path: '/shipping-delivery',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: '2024-12-01'
  }
];

function generateSitemap(dynamicRoutes = []) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n';

  [...routes, ...dynamicRoutes].forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    
    if (route.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${baseUrl}${route.image}</image:loc>\n`;
      xml += '    </image:image>\n';
    }
    
    xml += '  </url>\n\n';
  });

  xml += '</urlset>';

  return xml;
}

async function loadPublishedBlogRoutes() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  const response = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published&published_at=lte.${encodeURIComponent(new Date().toISOString())}&order=published_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  if (!response.ok) throw new Error(`Blog sitemap request returned ${response.status}`);
  const posts = await response.json();
  return posts.map(post => ({
    path: `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: post.updated_at.split('T')[0]
  }));
}

async function main() {
try {
  const publicDir = path.join(__dirname, 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const dynamicRoutes = await loadPublishedBlogRoutes();
  const sitemap = generateSitemap(dynamicRoutes);
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
  console.log(`📊 Total URLs: ${routes.length + dynamicRoutes.length}`);
  console.log(`📅 Generated on: ${currentDate}`);
} catch (error) {
  console.warn('⚠️  Sitemap generation failed:', error.message);
  console.log('Build will continue with existing sitemap...');
  process.exit(0); // Exit successfully to not block build
}
}

main();

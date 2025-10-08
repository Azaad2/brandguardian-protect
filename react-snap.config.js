module.exports = {
  // Puppeteer options
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  
  // Routes to prerender
  include: [
    '/',
    '/about',
    '/reseller-hub',
    '/brand-portal',
    '/blog',
    '/blog/enforce-map-policy-prevent-unauthorized-sellers',
    '/blog/amazon-wholesale-vs-private-label',
    '/blog/amazon-brand-registry-benefits',
    '/blog/how-to-get-ungated-any-brand-amazon-2025',
    '/blog/master-amazon-reseller-business',
    '/blog/unlock-amazon-wholesale-success',
    '/blog/prevent-unauthorized-sellers-amazon',
    '/blog/identify-remove-counterfeit-products',
    '/blog/outreach-thousand-brands-amazon-wholesale'
  ],
  
  // Skip routes that require authentication
  skipThirdPartyRequests: true,
  
  // Wait for network to be idle
  waitFor: 'networkidle0',
  
  // Viewport size
  viewport: {
    width: 1920,
    height: 1080
  },
  
  // Minify HTML
  minifyHtml: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    sortAttributes: true,
    sortClassName: true
  },
  
  // Cache bust
  cacheAjaxRequests: false,
  
  // Prerender timeout (increased for complex pages)
  timeout: 60000,
  
  // Fix external links to not be crawled
  externalServer: false,
  
  // User agent for crawling
  userAgent: "ReactSnap"
};

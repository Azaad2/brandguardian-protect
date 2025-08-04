// Enhanced preloader for better mobile performance
export const preloadCriticalResources = () => {
  // Preload key routes that users are likely to visit based on analytics
  const criticalRoutes = [
    '/about',
    '/blog', 
    '/reseller-hub',
    '/brand',
    '/reseller'
  ];

  // Use requestIdleCallback to preload without blocking main thread
  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  
  idleCallback(() => {
    // Preload route components with priority
    criticalRoutes.forEach((route, index) => {
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      }, index * 100); // Stagger preloading to avoid overwhelming the network
    });

    // Preload critical JavaScript chunks
    const criticalChunks = [
      '/src/components/LazyComponents.tsx',
      '/src/hooks/use-auth.tsx',
      '/src/components/ui/button.tsx'
    ];

    criticalChunks.forEach((chunk, index) => {
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = chunk;
        document.head.appendChild(link);
      }, (index * 50) + 200);
    });
  });

  // Preload critical images with WebP support detection
  preloadCriticalImages([
    '/src/assets/bndbox-logo.png'
  ]);
};

// Enhanced image preloading with WebP support and lazy loading
export const preloadImages = (images: string[]) => {
  const supportsWebP = checkWebPSupport();
  
  images.forEach((src, index) => {
    setTimeout(() => {
      const img = new Image();
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Use WebP if supported
      if (supportsWebP && src.includes('.png') || src.includes('.jpg')) {
        const webpSrc = src.replace(/\.(png|jpg|jpeg)$/, '.webp');
        img.src = webpSrc;
        img.onerror = () => {
          // Fallback to original format
          img.src = src;
        };
      } else {
        img.src = src;
      }
    }, index * 100);
  });
};

// Preload critical above-the-fold images immediately
export const preloadCriticalImages = (images: string[]) => {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// WebP support detection
const checkWebPSupport = (): boolean => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Preload critical CSS for faster rendering
export const preloadCriticalCSS = () => {
  const criticalCSS = [
    '/src/index.css'
  ];

  criticalCSS.forEach(css => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = css;
    link.as = 'style';
    link.onload = function() {
      (this as any).rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};

// Advanced resource hints for better performance
export const addAdvancedResourceHints = () => {
  const resourceHints = [
    // DNS prefetch for external domains
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//www.redditstatic.com' },
    { rel: 'dns-prefetch', href: '//checkout.razorpay.com' },
    
    // Preconnect for critical third-party resources
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://formspree.io', crossorigin: true },
    
    // Prefetch for likely navigation
    { rel: 'prefetch', href: '/about' },
    { rel: 'prefetch', href: '/blog' },
  ];

  resourceHints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Optimize viewport for mobile performance
export const optimizeViewport = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
    );
  }
};

// Performance-optimized initialization
export const initializePerformanceOptimizations = () => {
  // Run immediately for critical optimizations
  optimizeViewport();
  addAdvancedResourceHints();
  
  // Defer non-critical optimizations
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      preloadCriticalResources();
      preloadCriticalCSS();
    });
  } else {
    setTimeout(() => {
      preloadCriticalResources();
      preloadCriticalCSS();
    }, 100);
  }
};
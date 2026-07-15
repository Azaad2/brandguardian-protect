// Performance optimization utilities

// Resource preloading
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Prefetch resources for navigation
export const prefetchResource = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// Critical CSS extraction and inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// WebP support detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Image optimization
export const optimizeImageSrc = (src: string, width?: number, quality = 80) => {
  // For production, you would implement actual image optimization service
  // This is a placeholder for the optimization logic
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  // Return optimized URL (placeholder)
  return src.includes('?') ? `${src}&${params}` : `${src}?${params}`;
};

// Critical resource hints
export const addResourceHints = () => {
  const hints = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://formspree.io', crossorigin: true },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//www.redditstatic.com' },
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Performance budgets and monitoring
export const performanceBudget = {
  maxBundleSize: 500 * 1024, // 500KB
  maxImageSize: 200 * 1024, // 200KB
  maxFCP: 1800, // 1.8s
  maxLCP: 2500, // 2.5s
  maxCLS: 0.1,
};

export const checkPerformanceBudget = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstByte: navigation.responseStart - navigation.requestStart,
    };

    // Log budget violations in development
    if (import.meta.env.DEV) {
      console.group('Performance Budget Check');
      console.log('Metrics:', metrics);
      console.groupEnd();
    }

    return metrics;
  }
  return null;
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};
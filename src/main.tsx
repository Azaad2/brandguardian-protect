
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources } from './utils/preloader'
import { registerServiceWorker, addResourceHints, checkPerformanceBudget } from './utils/performance'

// Critical CSS for above-the-fold content
const criticalCSS = `
  body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
  .hero-section { min-height: 100vh; display: flex; align-items: center; }
  .header { position: fixed; top: 0; width: 100%; z-index: 50; }
`;

// Inline critical CSS immediately
const style = document.createElement('style');
style.textContent = criticalCSS;
style.setAttribute('data-critical', 'true');
document.head.appendChild(style);

// Lazy load analytics to prevent blocking
const loadAnalytics = () => import('./lib/analytics').then(m => m.initializeAnalytics());

// Enhanced Web Vitals reporting with Core Web Vitals
const reportWebVitals = () => {
  // Load web-vitals library dynamically
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS((metric) => {
      // Track CLS (Cumulative Layout Shift)
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000),
          custom_map: { metric_value: metric.value }
        });
      }
    });

    onFCP((metric) => {
      // Track FCP (First Contentful Paint)
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'FCP',
          value: Math.round(metric.value),
          custom_map: { metric_value: metric.value }
        });
      }
    });

    onLCP((metric) => {
      // Track LCP (Largest Contentful Paint)
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(metric.value),
          custom_map: { metric_value: metric.value }
        });
      }
    });

    onTTFB((metric) => {
      // Track TTFB (Time to First Byte)
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'TTFB',
          value: Math.round(metric.value),
          custom_map: { metric_value: metric.value }
        });
      }
    });

    onINP((metric) => {
      // Track INP (Interaction to Next Paint)
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'INP',
          value: Math.round(metric.value),
          custom_map: { metric_value: metric.value }
        });
      }
    });
  }).catch(() => {
    // Fallback if web-vitals fails to load
    console.log('Web Vitals library failed to load');
  });
};

// Use requestIdleCallback for non-critical initialization (falls back to setTimeout for older browsers)
const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Add resource hints immediately
addResourceHints();

// Render the app immediately for better performance
createRoot(document.getElementById("root")!).render(<App />);

// Performance optimizations after initial render
idleCallback(() => {
  // Register service worker for caching
  registerServiceWorker();
  
  // Load analytics after the app is rendered
  loadAnalytics();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Check performance budget in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(checkPerformanceBudget, 2000);
  }
  
  // Report web vitals after the app is rendered
  setTimeout(reportWebVitals, 1500);
});


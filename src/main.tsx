
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources } from './utils/preloader'

// Lazy load analytics to prevent blocking
const loadAnalytics = () => import('./lib/analytics').then(m => m.initializeAnalytics());

// Create a lightweight performance monitoring function for Core Web Vitals
const reportWebVitals = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    // Get LCP (Largest Contentful Paint)
    const paintEntries = window.performance.getEntriesByType('paint');
    const lcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (lcpEntry) {
      // In a production environment, you would send this to Google Analytics
      // ReactGA.event({
      //   category: 'Web Vitals',
      //   action: 'LCP',
      //   value: Math.round(lcpEntry.startTime),
      //   nonInteraction: true,
      // });
    }
  }
};

// Use requestIdleCallback for non-critical initialization (falls back to setTimeout for older browsers)
const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Render the app immediately for better performance
createRoot(document.getElementById("root")!).render(<App />);

idleCallback(() => {
  // Load analytics after the app is rendered
  loadAnalytics();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Report web vitals after the app is rendered
  setTimeout(reportWebVitals, 1000);
});


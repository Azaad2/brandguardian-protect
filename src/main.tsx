
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAnalytics } from './lib/analytics'

// Initialize Google Analytics immediately for improved tracking
initializeAnalytics();

// Create a lightweight performance monitoring function for Core Web Vitals
const reportWebVitals = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    // Get LCP (Largest Contentful Paint)
    const paintEntries = window.performance.getEntriesByType('paint');
    const lcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (lcpEntry) {
      console.log(`First Contentful Paint: ${lcpEntry.startTime}ms`);
      
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

idleCallback(() => {
  // Log initialization for debugging
  console.log('BndBox application initializing');
  
  // Render the app after initialization
  createRoot(document.getElementById("root")!).render(<App />);
  
  // Report web vitals after the app is rendered
  setTimeout(reportWebVitals, 1000);
});


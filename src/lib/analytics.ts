
import ReactGA from 'react-ga4';

export const initializeAnalytics = () => {
  // Using your actual GA4 Measurement ID
  ReactGA.initialize('G-020LLVRLDW', {
    gaOptions: {
      siteSpeedSampleRate: 100, // Measure site speed for 100% of users
    },
    // Configuration for improved SEO tracking
    testMode: process.env.NODE_ENV !== 'production',
  });
};

export const trackPageView = (path: string) => {
  // Track page views with full URL path
  console.log('Tracking page view:', path);
  ReactGA.send({
    hitType: 'pageview',
    page: path
  });
  
  // Track page load time as custom metric for SEO performance
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    if (pageLoadTime > 0) {
      ReactGA.event({
        category: 'Performance',
        action: 'Page Load Time',
        label: path,
        value: Math.round(pageLoadTime)
      });
    }
  }
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  console.log('Tracking event:', category, action, label);
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

// Track user engagement metrics relevant to SEO
export const trackEngagement = (timeOnPage: number, scrollDepth: number, path: string) => {
  ReactGA.event({
    category: 'Engagement',
    action: 'Time on Page',
    label: path,
    value: Math.round(timeOnPage)
  });
  
  ReactGA.event({
    category: 'Engagement',
    action: 'Scroll Depth',
    label: path,
    value: scrollDepth
  });
};

// Track SEO-relevant interactions
export const trackSEOInteraction = (interactionType: string, elementType: string, content: string) => {
  ReactGA.event({
    category: 'SEO',
    action: interactionType,
    label: `${elementType}: ${content}`
  });
};

// Track Core Web Vitals
export const trackWebVitals = (name: string, delta: number, value: number) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: name,
    value: Math.round(value),
    label: `delta: ${Math.round(delta)}`
  });
};

// Track search interactions
export const trackSearch = (query: string, results: number) => {
  ReactGA.event({
    category: 'Search',
    action: 'Query',
    label: query,
    value: results
  });
};

// Track content interactions
export const trackContentInteraction = (type: string, content: string, position?: number) => {
  ReactGA.event({
    category: 'Content',
    action: type,
    label: content,
    ...(position && { value: position })
  });
};

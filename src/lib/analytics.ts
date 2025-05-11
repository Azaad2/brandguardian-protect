
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
};

export const trackEvent = (category: string, action: string, label?: string) => {
  console.log('Tracking event:', category, action, label);
  ReactGA.event({
    category,
    action,
    label
  });
};

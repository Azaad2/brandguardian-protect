import ReactGA from 'react-ga4';

export const initializeAnalytics = () => {
  ReactGA.initialize('G-020LLVRLDW'); // Using your actual GA4 Measurement ID
};

export const trackPageView = (path: string) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path
  });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label
  });
};

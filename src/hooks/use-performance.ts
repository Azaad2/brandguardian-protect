import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

const sendToAnalytics = (name: string, value: number, delta: number) => {
  // Lazy load analytics to track web vitals
  import('../lib/analytics').then(({ trackWebVitals }) => {
    trackWebVitals(name, delta, value);
  });
};

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Only run in production for real metrics
    if (process.env.NODE_ENV === 'production') {
      onCLS(({ name, value, delta }) => sendToAnalytics(name, value, delta));
      onFCP(({ name, value, delta }) => sendToAnalytics(name, value, delta));
      onLCP(({ name, value, delta }) => sendToAnalytics(name, value, delta));
      onTTFB(({ name, value, delta }) => sendToAnalytics(name, value, delta));
    }
  }, []);
};
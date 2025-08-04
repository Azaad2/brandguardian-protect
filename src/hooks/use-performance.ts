import { useEffect, useCallback } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const sendToAnalytics = (name: string, value: number, delta: number) => {
  // Lazy load analytics to track web vitals
  import('../lib/analytics').then(({ trackWebVitals }) => {
    trackWebVitals(name, delta, value);
  }).catch(() => {
    // Fallback if analytics fails to load
    console.log(`Web Vital: ${name} = ${value}ms (delta: ${delta}ms)`);
  });
};

// Performance budget thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Good: 0-2.5s, Needs Improvement: 2.5-4s, Poor: >4s
  FCP: 1800, // Good: 0-1.8s, Needs Improvement: 1.8-3s, Poor: >3s
  CLS: 0.1,  // Good: 0-0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
  TTFB: 800, // Good: 0-800ms, Needs Improvement: 800-1.8s, Poor: >1.8s
  INP: 200,  // Good: 0-200ms, Needs Improvement: 200-500ms, Poor: >500ms
};

export const usePerformanceMonitoring = () => {
  const checkThreshold = useCallback((metric: string, value: number) => {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (threshold && value > threshold) {
      console.warn(`Performance Warning: ${metric} (${value}) exceeds threshold (${threshold})`);
      
      // Track performance budget violations
      sendToAnalytics(`${metric}_Budget_Violation`, value, value - threshold);
    }
  }, []);

  useEffect(() => {
    // Monitor Core Web Vitals in all environments for debugging
    onCLS(({ name, value, delta }) => {
      sendToAnalytics(name, value, delta);
      checkThreshold('CLS', value);
    });

    onFCP(({ name, value, delta }) => {
      sendToAnalytics(name, value, delta);
      checkThreshold('FCP', value);
    });

    onLCP(({ name, value, delta }) => {
      sendToAnalytics(name, value, delta);
      checkThreshold('LCP', value);
    });

    onTTFB(({ name, value, delta }) => {
      sendToAnalytics(name, value, delta);
      checkThreshold('TTFB', value);
    });

    onINP(({ name, value, delta }) => {
      sendToAnalytics(name, value, delta);
      checkThreshold('INP', value);
    });

    // Monitor additional performance metrics
    if ('performance' in window) {
      // Monitor long tasks (potential blocking)
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) { // Tasks longer than 50ms
                console.warn(`Long Task detected: ${entry.duration}ms`);
                sendToAnalytics('Long_Task', entry.duration, entry.duration - 50);
              }
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // PerformanceObserver not supported
        }
      }

      // Monitor resource loading performance
      const checkResourceTiming = () => {
        const resources = performance.getEntriesByType('resource');
        resources.forEach((resource: any) => {
          if (resource.duration > 1000) { // Resources taking longer than 1s
            console.warn(`Slow resource: ${resource.name} took ${resource.duration}ms`);
          }
        });
      };

      // Check resources after page load
      if (document.readyState === 'complete') {
        setTimeout(checkResourceTiming, 1000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(checkResourceTiming, 1000);
        });
      }
    }
  }, [checkThreshold]);
};

// Hook for monitoring specific component performance
export const useComponentPerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16.67) { // Longer than one frame (60fps)
        console.warn(`Slow component render: ${componentName} took ${renderTime}ms`);
        sendToAnalytics('Component_Render_Time', renderTime, renderTime - 16.67);
      }
    };
  }, [componentName]);
};
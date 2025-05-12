
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackEngagement } from '@/lib/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const maxScrollDepthRef = useRef(0);
  
  // Track scroll depth for SEO metrics
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollY = window.scrollY;
      
      // Calculate scroll depth as percentage
      if (scrollHeight > clientHeight) {
        const scrollDepth = Math.round((scrollY / (scrollHeight - clientHeight)) * 100);
        if (scrollDepth > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = scrollDepth;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Track page views and engagement metrics
  useEffect(() => {
    // Reset metrics for new page
    startTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    
    // Track page view
    trackPageView(location.pathname + location.search);
    
    // Send engagement metrics when user leaves the page
    return () => {
      const timeSpentSeconds = (Date.now() - startTimeRef.current) / 1000;
      trackEngagement(
        timeSpentSeconds,
        maxScrollDepthRef.current,
        location.pathname
      );
    };
  }, [location]);
};

// Export a function to track outbound links for SEO
export const useOutboundLinkTracking = () => {
  useEffect(() => {
    const trackOutboundLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && anchor.hostname !== window.location.hostname) {
        // This is an outbound link
        const url = anchor.href;
        const linkText = anchor.textContent || url;
        
        // Track the outbound link click using ReactGA instead of gtag
        import('@/lib/analytics').then(({ trackEvent }) => {
          trackEvent(
            'Outbound Links', 
            'click', 
            linkText, 
            undefined
          );
        });
      }
    };
    
    document.addEventListener('click', trackOutboundLink);
    
    return () => {
      document.removeEventListener('click', trackOutboundLink);
    };
  }, []);
};

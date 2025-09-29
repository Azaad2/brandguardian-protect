import { useState, useEffect, useCallback } from 'react';
import { trackSEOInteraction } from '@/lib/analytics';

interface LeadMagnetPopupOptions {
  delayMs?: number;
  scrollThreshold?: number;
  enableExitIntent?: boolean;
  sessionStorageKey?: string;
}

export const useLeadMagnetPopup = (options: LeadMagnetPopupOptions = {}) => {
  const {
    delayMs = 30000, // 30 seconds default
    scrollThreshold = 50, // 50% scroll
    enableExitIntent = true,
    sessionStorageKey = 'leadMagnetPopup'
  } = options;

  const [showPopup, setShowPopup] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Check if popup should be disabled (user dismissed or converted)
  useEffect(() => {
    const disabled = sessionStorage.getItem(`${sessionStorageKey}_disabled`);
    const converted = sessionStorage.getItem(`${sessionStorageKey}_converted`);
    const lastShown = sessionStorage.getItem(`${sessionStorageKey}_lastShown`);
    
    console.log('[LeadMagnet] Checking popup state:', { disabled, converted, lastShown });
    
    if (disabled === 'true' || converted === 'true') {
      console.log('[LeadMagnet] Popup disabled - user previously dismissed or converted');
      setIsDisabled(true);
    } else if (lastShown) {
      // Add session cooldown - don't show again for 30 minutes in same session
      const lastShownTime = parseInt(lastShown);
      const now = Date.now();
      const cooldownPeriod = 30 * 60 * 1000; // 30 minutes
      
      if (now - lastShownTime < cooldownPeriod) {
        console.log('[LeadMagnet] Popup in cooldown period');
        setIsDisabled(true);
      }
    }
  }, [sessionStorageKey]);

  // Time-based trigger
  useEffect(() => {
    if (isDisabled) return;

    const timer = setTimeout(() => {
      if (!showPopup) {
        console.log('[LeadMagnet] Showing popup via timer trigger');
        sessionStorage.setItem(`${sessionStorageKey}_lastShown`, Date.now().toString());
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Timer_Trigger');
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isDisabled, showPopup, sessionStorageKey]);

  // Scroll-based trigger
  useEffect(() => {
    if (isDisabled) return;

    const handleScroll = () => {
      if (showPopup) return;

      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercentage >= scrollThreshold) {
        console.log('[LeadMagnet] Showing popup via scroll trigger');
        sessionStorage.setItem(`${sessionStorageKey}_lastShown`, Date.now().toString());
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Scroll_Trigger');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold, isDisabled, showPopup, sessionStorageKey]);

  // Exit intent trigger
  useEffect(() => {
    if (isDisabled || !enableExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (showPopup) return;
      
      // Check if mouse is leaving at the top of the page (likely closing tab/window)
      if (e.clientY <= 0) {
        console.log('[LeadMagnet] Showing popup via exit intent');
        sessionStorage.setItem(`${sessionStorageKey}_lastShown`, Date.now().toString());
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Exit_Intent');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enableExitIntent, isDisabled, showPopup, sessionStorageKey]);

  // Handle popup dismissal (user not interested)
  const handleNotInterested = useCallback(() => {
    console.log('[LeadMagnet] User not interested - permanently disabling popup');
    sessionStorage.setItem(`${sessionStorageKey}_disabled`, 'true');
    setIsDisabled(true);
    setShowPopup(false);
    trackSEOInteraction('LeadMagnet_Popup', 'Dismiss', 'Not_Interested');
  }, [sessionStorageKey]);

  // Handle popup close (user just closed, might see again)
  const handleClose = useCallback(() => {
    console.log('[LeadMagnet] User closed popup - setting cooldown');
    sessionStorage.setItem(`${sessionStorageKey}_lastShown`, Date.now().toString());
    setShowPopup(false);
    trackSEOInteraction('LeadMagnet_Popup', 'Close', 'Maybe_Later');
  }, [sessionStorageKey]);

  // Handle successful conversion
  const handleConverted = useCallback(() => {
    console.log('[LeadMagnet] User converted - permanently disabling popup');
    sessionStorage.setItem(`${sessionStorageKey}_converted`, 'true');
    setIsDisabled(true);
    setShowPopup(false);
    trackSEOInteraction('LeadMagnet_Popup', 'Convert', 'Email_Submitted');
  }, [sessionStorageKey]);

  // Reset for testing purposes
  const resetPopup = useCallback(() => {
    console.log('[LeadMagnet] Resetting popup state');
    sessionStorage.removeItem(`${sessionStorageKey}_disabled`);
    sessionStorage.removeItem(`${sessionStorageKey}_converted`);
    sessionStorage.removeItem(`${sessionStorageKey}_lastShown`);
    setIsDisabled(false);
    setShowPopup(false);
  }, [sessionStorageKey]);

  return {
    showPopup,
    isDisabled,
    handleNotInterested,
    handleClose,
    handleConverted,
    resetPopup,
    setShowPopup
  };
};
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
    
    if (disabled === 'true' || converted === 'true') {
      setIsDisabled(true);
    }
  }, [sessionStorageKey]);

  // Time-based trigger
  useEffect(() => {
    if (isDisabled) return;

    const timer = setTimeout(() => {
      if (!showPopup) {
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Timer_Trigger');
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isDisabled, showPopup]);

  // Scroll-based trigger
  useEffect(() => {
    if (isDisabled) return;

    const handleScroll = () => {
      if (showPopup) return;

      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercentage >= scrollThreshold) {
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Scroll_Trigger');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold, isDisabled, showPopup]);

  // Exit intent trigger
  useEffect(() => {
    if (isDisabled || !enableExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (showPopup) return;
      
      // Check if mouse is leaving at the top of the page (likely closing tab/window)
      if (e.clientY <= 0) {
        setShowPopup(true);
        trackSEOInteraction('LeadMagnet_Popup', 'Show', 'Exit_Intent');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [enableExitIntent, isDisabled, showPopup]);

  // Handle popup dismissal (user not interested)
  const handleNotInterested = useCallback(() => {
    sessionStorage.setItem(`${sessionStorageKey}_disabled`, 'true');
    setIsDisabled(true);
    setShowPopup(false);
  }, [sessionStorageKey]);

  // Handle popup close (user just closed, might see again)
  const handleClose = useCallback(() => {
    setShowPopup(false);
  }, []);

  // Handle successful conversion
  const handleConverted = useCallback(() => {
    sessionStorage.setItem(`${sessionStorageKey}_converted`, 'true');
    setIsDisabled(true);
    setShowPopup(false);
  }, [sessionStorageKey]);

  // Reset for testing purposes
  const resetPopup = useCallback(() => {
    sessionStorage.removeItem(`${sessionStorageKey}_disabled`);
    sessionStorage.removeItem(`${sessionStorageKey}_converted`);
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
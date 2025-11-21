/**
 * Detects if an ad blocker or script blocker is active
 * This is useful for warning users before they attempt payment
 */
export const detectAdBlocker = async (): Promise<boolean> => {
  try {
    // Method 1: Try to fetch a known ad-related URL
    const testUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    const response = await fetch(testUrl, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    }).catch(() => null);

    if (!response) {
      return true; // Likely blocked
    }

    // Method 2: Check for common ad blocker properties
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '&nbsp;';
    testDiv.className = 'adsbox';
    testDiv.style.position = 'absolute';
    testDiv.style.top = '-1000px';
    document.body.appendChild(testDiv);

    const isHidden = testDiv.offsetHeight === 0;
    document.body.removeChild(testDiv);

    if (isHidden) {
      return true;
    }

    // Method 3: Check for Razorpay script blocking
    const razorpayScript = document.querySelector('script[src*="razorpay"]');
    if (razorpayScript && !(window as any).Razorpay) {
      return true; // Script loaded but Razorpay object not available
    }

    return false;
  } catch (error) {
    console.error('Error detecting ad blocker:', error);
    return false; // Assume no blocker if detection fails
  }
};

/**
 * Shows a warning if ad blocker is detected
 */
export const checkAndWarnAdBlocker = async (): Promise<boolean> => {
  const hasAdBlocker = await detectAdBlocker();
  
  if (hasAdBlocker) {
    console.warn('Ad blocker or script blocker detected. Payment processing may be affected.');
  }
  
  return hasAdBlocker;
};

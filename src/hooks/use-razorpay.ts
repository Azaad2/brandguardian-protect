
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { BillingAddress } from '@/components/reseller/subscription/BillingAddressForm';
import { detectAdBlocker } from '@/utils/adBlockDetector';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log('Razorpay already loaded');
        resolve(true);
        return;
      }

      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded');
        setTimeout(() => {
          const loaded = !!window.Razorpay;
          console.log('Razorpay available:', loaded);
          resolve(loaded);
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  };

  const createCheckoutSession = async (tier: string, billingAddress?: BillingAddress) => {
    setIsLoading(true);
    console.log('=== Starting Razorpay Checkout Process ===');
    
    try {
      // Check for ad blocker before proceeding
      const hasAdBlocker = await detectAdBlocker();
      if (hasAdBlocker) {
        toast({
          title: 'Ad Blocker Detected',
          description: 'Please disable your ad blocker to proceed with payment. This helps ensure a secure payment process.',
          variant: 'destructive',
        });
        // Show alternative payment method
        setTimeout(() => {
          toast({
            title: 'Need Help?',
            description: 'If you continue having issues, contact support@bndbox.com and we can process your payment via bank transfer.',
          });
        }, 3000);
      }

      console.log('Requested tier:', tier);
      
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Auth check result:', { user: !!user, userError });
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error(`Authentication failed: ${userError.message}`);
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('Please log in to continue with payment');
      }

      console.log('User authenticated:', user.id);

      // Load Razorpay script
      console.log('Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment system. Please refresh the page and try again.');
      }

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', { hasSession: !!session, hasAccessToken: !!session?.access_token });

      if (!session?.access_token) {
        throw new Error('No valid session found. Please log in again.');
      }

      // Create checkout session via edge function
      console.log('Calling create-razorpay-checkout function...');
      const functionPayload = { 
        tier, 
        user_id: user.id,
        billing_address: billingAddress
      };
      console.log('Function payload:', functionPayload);

      console.log('Making supabase.functions.invoke call...');
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('create-razorpay-checkout', {
        body: functionPayload
      });

      const endTime = Date.now();
      console.log(`Function call completed in ${endTime - startTime}ms`);
      console.log('Function response data:', data);
      console.log('Function error:', error);

      if (error) {
        console.error('Supabase function error details:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error code:', error.code);
        
        // Enhanced error handling with specific, actionable messages
        let errorMessage = 'Payment setup failed.';
        let supportMessage = '';
        
        if (error.message) {
          if (error.message.includes('Edge Function returned a non-2xx status code')) {
            errorMessage = 'Payment service is temporarily unavailable.';
            supportMessage = 'Our team has been notified. Please try again in a few minutes or contact support@bndbox.com';
          } else if (error.message.includes('Failed to send a request to the Edge Function')) {
            errorMessage = 'Unable to connect to payment service.';
            supportMessage = 'Please check your internet connection. If you\'re using a VPN, try disabling it.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out.';
            supportMessage = 'Please check your connection and try again.';
          } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
            errorMessage = 'Session expired.';
            supportMessage = 'Please refresh the page and log in again.';
          } else {
            errorMessage = error.message;
            supportMessage = 'If this persists, contact support@bndbox.com with error code: ' + (error.code || 'UNKNOWN');
          }
        }
        
        toast({
          title: errorMessage,
          description: supportMessage,
          variant: 'destructive',
        });
        
        console.error('Processed error message:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data) {
        console.error('No data received from function');
        throw new Error('Invalid response from payment service. Please try again.');
      }

      if (data.error) {
        console.error('Function returned error:', data.error);
        console.error('Debug info:', data.debug);
        throw new Error(data.error);
      }

      // Validate required Razorpay fields
      const requiredFields = ['order_id', 'amount', 'key_id'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields in response:', missingFields);
        console.error('Full response data:', data);
        throw new Error(`Invalid payment data received. Missing: ${missingFields.join(', ')}`);
      }

      console.log('Opening Razorpay checkout with data:', {
        key_id: data.key_id,
        order_id: data.order_id,
        amount: data.amount,
        currency: data.currency
      });

      // Create simplified Razorpay checkout options that forces billing address
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: 'BndBox',
        description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
        prefill: {
          name: data.user_name || 'User',
          email: data.user_email || user.email,
        },
        // This is the key setting for billing address
        "billing_address": {
          "required": true,
          "hide": false
        },
        handler: function (response: any) {
          console.log('Payment successful:', response);
          toast({
            title: 'Payment Successful!',
            description: 'Your subscription has been activated.',
          });
          // Reload to update subscription status
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed by user');
            toast({
              title: 'Payment Cancelled',
              description: 'You can try again anytime.',
            });
          },
          confirm_close: true,
          escape: true,
          backdropclose: false,
          animation: true
        },
        theme: {
          color: '#3B82F6',
          backdrop_color: 'rgba(0,0,0,0.6)'
        },
        // Ensure fresh session
        remember_customer: false
      };

      console.log('Creating Razorpay instance with billing address enforcement:', options);
      
      try {
        const razorpay = new window.Razorpay(options);
        
        // Add event listeners to handle different scenarios
        razorpay.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          toast({
            title: 'Payment Failed',
            description: response.error.description || 'Payment could not be processed. Please try again.',
            variant: 'destructive',
          });
        });

        console.log('Opening Razorpay checkout...');
        razorpay.open();
      } catch (razorpayError: any) {
        console.error('Razorpay initialization error:', razorpayError);
        
        // Check if it's a blocking issue
        if (razorpayError.message && (razorpayError.message.includes('blocked') || razorpayError.message.includes('blocker'))) {
          toast({
            title: 'Payment Window Blocked',
            description: 'Please disable your ad blocker for bndbox.com and refresh the page to complete payment.',
            variant: 'destructive',
          });
          
          // Show troubleshooting steps
          setTimeout(() => {
            toast({
              title: 'Troubleshooting Steps',
              description: '1. Disable ad blocker\n2. Refresh page\n3. Try payment again\n\nOr contact support@bndbox.com for manual payment processing',
            });
          }, 4000);
          
          throw new Error('Payment blocked by browser extension.');
        } else {
          throw razorpayError;
        }
      }

    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Don't show toast if already shown
      if (!error.message?.includes('blocked') && !error.message?.includes('blocker')) {
        let errorMessage = 'Payment setup failed.';
        let supportInfo = 'Please try again or contact support@bndbox.com';
        
        if (error.message) {
          errorMessage = error.message;
          
          // Add specific help based on error type
          if (error.message.includes('network') || error.message.includes('connection')) {
            supportInfo = 'Check your internet connection and try again.';
          } else if (error.message.includes('timeout')) {
            supportInfo = 'Request took too long. Please check your connection and retry.';
          } else if (error.message.includes('service')) {
            supportInfo = 'Our payment service is experiencing issues. Please try again in a few minutes.';
          }
        }
        
        toast({
          title: errorMessage,
          description: supportInfo,
          variant: 'destructive',
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('cancel-razorpay-subscription', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will remain active until the end of the current billing cycle.',
      });

      return data;
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel subscription',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    cancelSubscription,
    isLoading,
  };
};

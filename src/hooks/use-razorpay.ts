
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  const createCheckoutSession = async (tier: string) => {
    setIsLoading(true);
    console.log('=== Starting Razorpay Checkout Process ===');
    
    try {
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
        user_id: user.id 
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
        
        // Enhanced error handling with more specific messages
        let errorMessage = 'Payment setup failed. Please try again.';
        
        if (error.message) {
          if (error.message.includes('Edge Function returned a non-2xx status code')) {
            errorMessage = 'Payment service error. Please check the console logs and contact support if the issue persists.';
          } else if (error.message.includes('Failed to send a request to the Edge Function')) {
            errorMessage = 'Unable to connect to payment service. Please check your internet connection and try again.';
          } else {
            errorMessage = error.message;
          }
        }
        
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

      // Create Razorpay checkout options optimized for billing address collection
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: 'BndBox',
        description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
        image: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
        prefill: {
          name: data.user_name || 'User',
          email: data.user_email || user.email,
        },
        // Force billing address collection
        collect: {
          billing_address: true,
          shipping_address: false
        },
        // Payment method preferences to ensure billing address is collected
        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: true,
          paylater: true
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
        // Ensure fresh start on each attempt
        remember_customer: false,
        customer_id: undefined, // Force fresh customer data
        readonly: {
          email: false,
          contact: false,
          name: false
        },
        // Additional options to force billing address collection
        notes: {
          billing_address_required: 'true',
          subscription_type: tier
        }
      };

      console.log('Creating Razorpay instance with enhanced billing address collection:', options);
      
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
        
        // Check if it's a real blocking issue or just tracking
        if (razorpayError.message && razorpayError.message.includes('blocked')) {
          toast({
            title: 'Payment System Blocked',
            description: 'Your ad blocker is preventing the payment window from opening. Please disable your ad blocker for this site and try again.',
            variant: 'destructive',
          });
          
          // Provide alternative instructions
          setTimeout(() => {
            toast({
              title: 'Alternative Payment Method',
              description: 'If the issue persists, please contact support at support@bndbox.com with your subscription request.',
            });
          }, 3000);
          
          throw new Error('Payment system blocked by ad blocker.');
        } else {
          // For other errors, just re-throw
          throw razorpayError;
        }
      }

    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      let errorMessage = 'Payment setup failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Checkout Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error; // Re-throw to allow caller to handle if needed
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

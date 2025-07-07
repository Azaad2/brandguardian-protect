
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
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        console.log('Razorpay script already loaded');
        resolve(true);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          console.log('Existing Razorpay script loaded');
          resolve(!!window.Razorpay);
        });
        existingScript.addEventListener('error', () => {
          console.error('Existing Razorpay script failed to load');
          resolve(false);
        });
        return;
      }

      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(!!window.Razorpay);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Starting checkout for tier:', tier);

      // Load Razorpay script with better error handling
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay payment system. Please check your internet connection and try again.');
      }

      console.log('Razorpay script loaded, creating checkout session...');

      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-razorpay-checkout', {
        body: { tier, user_id: user.id }
      });

      if (error) {
        console.error('Checkout session creation error:', error);
        throw error;
      }

      console.log('Checkout session created:', data);

      if (!data.subscription_id && !data.order_id) {
        throw new Error('Invalid checkout session response - no order ID received');
      }

      // Get user profile for checkout
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      // Open Razorpay checkout with order details
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency || 'INR',
        order_id: data.order_id || data.subscription_id,
        name: 'BndBox',
        description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
        prefill: {
          name: profile?.full_name || 'User',
          email: profile?.email || user.email,
        },
        handler: function (response: any) {
          console.log('Payment successful:', response);
          toast({
            title: 'Payment Successful!',
            description: 'Your subscription has been activated.',
          });
          // Refresh the page or update subscription status
          window.location.reload();
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
            toast({
              title: 'Payment Cancelled',
              description: 'You can try again anytime.',
            });
          }
        },
        theme: {
          color: '#3B82F6'
        }
      };

      console.log('Opening Razorpay checkout with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to create checkout session',
        variant: 'destructive',
      });
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

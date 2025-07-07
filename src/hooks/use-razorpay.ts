
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
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(() => {
          resolve(!!window.Razorpay);
        }, 100);
      };
      
      script.onerror = () => {
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  };

  const createCheckoutSession = async (tier: string) => {
    setIsLoading(true);
    try {
      console.log('Starting checkout session for tier:', tier);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to continue with payment');
      }

      console.log('User authenticated:', user.id);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment system. Please refresh and try again.');
      }

      console.log('Razorpay script loaded successfully');

      // Create checkout session
      console.log('Calling create-razorpay-checkout function...');
      const { data, error } = await supabase.functions.invoke('create-razorpay-checkout', {
        body: { tier, user_id: user.id }
      });

      console.log('Function response:', data);
      console.log('Function error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (!data || data.error) {
        console.error('Function returned error:', data);
        throw new Error(data?.error || 'Invalid response from payment service');
      }

      console.log('Opening Razorpay checkout with data:', data);

      // Open Razorpay checkout
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency || 'INR',
        order_id: data.order_id,
        name: 'BndBox',
        description: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan Subscription`,
        prefill: {
          name: data.user_name || 'User',
          email: data.user_email || user.email,
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      
      let errorMessage = 'Payment setup failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Checkout Failed',
        description: errorMessage,
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's subscription
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('razorpay_subscription_id')
      .eq('user_id', user_id)
      .single()

    if (!subscriber?.razorpay_subscription_id) {
      throw new Error('No active subscription found')
    }

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Cancel subscription in Razorpay
    const response = await fetch(`https://api.razorpay.com/v1/subscriptions/${subscriber.razorpay_subscription_id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_at_cycle_end: 1 // Cancel at the end of current billing cycle
      }),
    })

    const cancelledSubscription = await response.json()

    if (!response.ok) {
      throw new Error(cancelledSubscription.error?.description || 'Failed to cancel subscription')
    }

    // Update local database
    await supabaseClient
      .from('subscribers')
      .update({
        subscribed: false,
        subscription_tier: 'free',
        brand_application_limit: 3,
      })
      .eq('user_id', user_id)

    return new Response(
      JSON.stringify({ success: true, subscription: cancelledSubscription }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

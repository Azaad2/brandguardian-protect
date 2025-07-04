
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
    const { tier, user_id } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Define pricing plans
    const plans = {
      basic: { amount: 2900, name: 'Basic Plan', limit: 99 },
      premium: { amount: 7900, name: 'Premium Plan', limit: 199 },
      enterprise: { amount: 0, name: 'Enterprise Plan', limit: 999 } // Custom pricing
    }

    const selectedPlan = plans[tier as keyof typeof plans]
    if (!selectedPlan) {
      throw new Error('Invalid subscription tier')
    }

    // Get or create customer
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user_id)
      .single()

    let customerId = subscriber?.razorpay_customer_id

    // Create Razorpay customer if doesn't exist
    if (!customerId) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('email, full_name')
        .eq('id', user_id)
        .single()

      const customerResponse = await fetch('https://api.razorpay.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile?.full_name || 'User',
          email: profile?.email,
        }),
      })

      const customer = await customerResponse.json()
      customerId = customer.id

      // Update subscriber with customer ID
      await supabaseClient
        .from('subscribers')
        .upsert({
          user_id,
          email: profile?.email,
          razorpay_customer_id: customerId,
          subscribed: false,
          subscription_tier: 'free',
          brand_application_limit: 3
        })
    }

    // Create Razorpay subscription
    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: `plan_${tier}`, // You'll need to create these in Razorpay dashboard
        customer_id: customerId,
        total_count: 12, // 12 months
        quantity: 1,
        notes: {
          user_id: user_id,
          tier: tier
        }
      }),
    })

    const subscription = await subscriptionResponse.json()

    if (!subscriptionResponse.ok) {
      throw new Error(subscription.error?.description || 'Failed to create subscription')
    }

    // Update subscriber with subscription details
    await supabaseClient
      .from('subscribers')
      .update({
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: `plan_${tier}`,
        subscription_tier: tier,
        brand_application_limit: selectedPlan.limit
      })
      .eq('user_id', user_id)

    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        short_url: subscription.short_url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating Razorpay checkout:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

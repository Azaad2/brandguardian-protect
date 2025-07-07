
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
    
    console.log('Creating checkout for tier:', tier, 'user:', user_id)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found')
      throw new Error('Razorpay credentials not configured')
    }

    console.log('Razorpay credentials found')

    // Define pricing plans (amounts in paise - Indian currency)
    const plans = {
      basic: { amount: 290000, name: 'Basic Plan', limit: 99 }, // ₹2900
      premium: { amount: 790000, name: 'Premium Plan', limit: 199 }, // ₹7900
      enterprise: { amount: 0, name: 'Enterprise Plan', limit: 999 } // Custom pricing
    }

    const selectedPlan = plans[tier as keyof typeof plans]
    if (!selectedPlan) {
      throw new Error('Invalid subscription tier')
    }

    console.log('Selected plan:', selectedPlan)

    // Get or create customer
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user_id)
      .single()

    let customerId = subscriber?.razorpay_customer_id

    // Create Razorpay customer if doesn't exist
    if (!customerId) {
      console.log('Creating new Razorpay customer')
      
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

      if (!customerResponse.ok) {
        const error = await customerResponse.json()
        console.error('Customer creation failed:', error)
        throw new Error(`Failed to create customer: ${error.error?.description || 'Unknown error'}`)
      }

      const customer = await customerResponse.json()
      customerId = customer.id
      console.log('Created customer:', customerId)

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

    console.log('Using customer ID:', customerId)

    // For now, create a simple payment instead of subscription for testing
    // This will help us verify the integration works
    const paymentResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: selectedPlan.amount,
        currency: 'INR',
        receipt: `receipt_${user_id}_${Date.now()}`,
        notes: {
          user_id: user_id,
          tier: tier,
          plan_name: selectedPlan.name
        }
      }),
    })

    if (!paymentResponse.ok) {
      const error = await paymentResponse.json()
      console.error('Payment creation failed:', error)
      throw new Error(`Failed to create payment: ${error.error?.description || 'Unknown error'}`)
    }

    const payment = await paymentResponse.json()
    console.log('Created payment order:', payment)

    // Update subscriber with plan details
    await supabaseClient
      .from('subscribers')
      .update({
        subscription_tier: tier,
        brand_application_limit: selectedPlan.limit
      })
      .eq('user_id', user_id)

    return new Response(
      JSON.stringify({
        subscription_id: payment.id, // Using order ID as subscription_id for now
        order_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        key_id: razorpayKeyId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating Razorpay checkout:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the edge function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

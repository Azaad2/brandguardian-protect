
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

    console.log('Razorpay Key ID exists:', !!razorpayKeyId)
    console.log('Razorpay Key Secret exists:', !!razorpayKeySecret)

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found')
      return new Response(
        JSON.stringify({ 
          error: 'Razorpay credentials not configured',
          details: 'Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the edge function secrets'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
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
      console.error('Invalid tier selected:', tier)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid subscription tier',
          details: `Available tiers: ${Object.keys(plans).join(', ')}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
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

      if (!profile) {
        console.error('Profile not found for user:', user_id)
        return new Response(
          JSON.stringify({ 
            error: 'User profile not found',
            details: 'Please ensure your profile is complete'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      console.log('Creating customer for profile:', profile.email)

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

      const customerResponseText = await customerResponse.text()
      console.log('Razorpay customer creation response status:', customerResponse.status)
      console.log('Razorpay customer creation response:', customerResponseText)

      if (!customerResponse.ok) {
        let error
        try {
          error = JSON.parse(customerResponseText)
        } catch {
          error = { description: customerResponseText }
        }
        console.error('Customer creation failed:', error)
        return new Response(
          JSON.stringify({ 
            error: `Failed to create customer: ${error.error?.description || 'Unknown error'}`,
            details: customerResponseText
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      const customer = JSON.parse(customerResponseText)
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

    // Create a Razorpay order for the payment
    const orderPayload = {
      amount: selectedPlan.amount,
      currency: 'INR',
      receipt: `receipt_${user_id}_${Date.now()}`,
      notes: {
        user_id: user_id,
        tier: tier,
        plan_name: selectedPlan.name
      }
    }

    console.log('Creating Razorpay order with payload:', orderPayload)

    const paymentResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    const paymentResponseText = await paymentResponse.text()
    console.log('Razorpay order creation response status:', paymentResponse.status)
    console.log('Razorpay order creation response:', paymentResponseText)

    if (!paymentResponse.ok) {
      let error
      try {
        error = JSON.parse(paymentResponseText)
      } catch {
        error = { description: paymentResponseText }
      }
      console.error('Payment creation failed:', error)
      return new Response(
        JSON.stringify({ 
          error: `Failed to create payment: ${error.error?.description || 'Unknown error'}`,
          details: paymentResponseText
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const payment = JSON.parse(paymentResponseText)
    console.log('Created payment order:', payment)

    // Update subscriber with plan details
    await supabaseClient
      .from('subscribers')
      .update({
        subscription_tier: tier,
        brand_application_limit: selectedPlan.limit
      })
      .eq('user_id', user_id)

    const response = {
      subscription_id: payment.id, // Using order ID as subscription_id for now
      order_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      key_id: razorpayKeyId
    }

    console.log('Returning successful response:', response)

    return new Response(
      JSON.stringify(response),
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
        status: 500,
      }
    )
  }
})

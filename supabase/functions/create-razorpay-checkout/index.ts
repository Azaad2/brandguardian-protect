
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Razorpay Checkout Function Started ===')
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    let requestBody
    try {
      requestBody = await req.json()
      console.log('Request body received:', requestBody)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const { tier, user_id } = requestBody
    
    if (!tier || !user_id) {
      console.error('Missing required fields:', { tier: !!tier, user_id: !!user_id })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: tier and user_id are required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
    
    console.log('Creating checkout for tier:', tier, 'user:', user_id)
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Supabase URL exists:', !!supabaseUrl)
    console.log('Supabase Service Key exists:', !!supabaseServiceKey)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Supabase credentials not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get Razorpay credentials
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Razorpay Key ID exists:', !!razorpayKeyId)
    console.log('Razorpay Key Secret exists:', !!razorpayKeySecret)

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found')
      return new Response(
        JSON.stringify({ 
          error: 'Payment system not configured',
          details: 'Razorpay credentials are missing. Please contact support.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log('All credentials verified successfully')

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

    // Get user profile first
    console.log('Fetching user profile...')
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return new Response(
        JSON.stringify({ 
          error: 'User profile not found',
          details: 'Please ensure your profile is complete and try again'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    if (!profile || !profile.email) {
      console.error('Profile missing or no email:', profile)
      return new Response(
        JSON.stringify({ 
          error: 'User profile incomplete',
          details: 'Profile is missing required email address'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Profile found:', { email: profile.email, name: profile.full_name })

    // Get or create subscriber
    console.log('Checking for existing subscriber...')
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user_id)
      .single()

    let customerId = subscriber?.razorpay_customer_id

    // Create Razorpay customer if doesn't exist
    if (!customerId) {
      console.log('Creating new Razorpay customer for:', profile.email)

      const customerPayload = {
        name: profile?.full_name || 'User',
        email: profile.email,
      }
      
      console.log('Customer payload:', customerPayload)
      
      const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
      console.log('Auth header created (first 20 chars):', authHeader.substring(0, 20) + '...')

      const customerResponse = await fetch('https://api.razorpay.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerPayload),
      })

      const customerResponseText = await customerResponse.text()
      console.log('Razorpay customer creation response status:', customerResponse.status)
      console.log('Razorpay customer creation response body:', customerResponseText)

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
            error: `Failed to create customer: ${error.error?.description || error.description || 'Unknown error'}`,
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
      console.log('Created customer with ID:', customerId)

      // Update subscriber with customer ID
      console.log('Updating subscriber record...')
      const { error: updateError } = await supabaseClient
        .from('subscribers')
        .upsert({
          user_id,
          email: profile.email,
          razorpay_customer_id: customerId,
          subscribed: false,
          subscription_tier: 'free',
          brand_application_limit: 3
        })
        
      if (updateError) {
        console.error('Failed to update subscriber:', updateError)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to update subscriber record',
            details: updateError.message
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }
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

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    const orderResponseText = await orderResponse.text()
    console.log('Razorpay order creation response status:', orderResponse.status)
    console.log('Razorpay order creation response body:', orderResponseText)

    if (!orderResponse.ok) {
      let error
      try {
        error = JSON.parse(orderResponseText)
      } catch {
        error = { description: orderResponseText }
      }
      console.error('Order creation failed:', error)
      return new Response(
        JSON.stringify({ 
          error: `Failed to create payment order: ${error.error?.description || error.description || 'Unknown error'}`,
          details: orderResponseText
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const order = JSON.parse(orderResponseText)
    console.log('Created order with ID:', order.id)

    // Update subscriber with plan details
    console.log('Updating subscriber plan details...')
    const { error: planUpdateError } = await supabaseClient
      .from('subscribers')
      .update({
        subscription_tier: tier,
        brand_application_limit: selectedPlan.limit
      })
      .eq('user_id', user_id)
      
    if (planUpdateError) {
      console.error('Failed to update plan details:', planUpdateError)
      // Don't fail the request for this, just log it
    }

    const response = {
      subscription_id: order.id,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: razorpayKeyId
    }

    console.log('Returning successful response:', response)
    console.log('=== Razorpay Checkout Function Completed Successfully ===')

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('=== END ERROR ===')
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        type: error.constructor.name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

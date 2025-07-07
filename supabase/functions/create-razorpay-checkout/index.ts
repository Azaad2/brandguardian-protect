
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
    
    const requestBody = await req.json()
    console.log('Request body received:', requestBody)

    const { tier, user_id } = requestBody
    
    console.log('Parsed request - tier:', tier, 'user_id:', user_id)
    
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

    // Get Razorpay credentials first
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Razorpay Key ID exists:', !!razorpayKeyId)
    console.log('Razorpay Key Secret exists:', !!razorpayKeySecret)

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found')
      return new Response(
        JSON.stringify({ 
          error: 'Payment system not configured. Please ensure Razorpay credentials are set up.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Define pricing plans (amounts in paise - Indian currency)
    const plans = {
      basic: { 
        amount: 290000, // ₹2900 in paise
        name: 'Basic Plan', 
        limit: 99,
        currency: 'INR'
      },
      premium: { 
        amount: 790000, // ₹7900 in paise
        name: 'Premium Plan', 
        limit: 199,
        currency: 'INR'
      },
      enterprise: { 
        amount: 0, 
        name: 'Enterprise Plan', 
        limit: 999,
        currency: 'INR'
      }
    }

    const selectedPlan = plans[tier as keyof typeof plans]
    if (!selectedPlan) {
      console.error('Invalid tier selected:', tier)
      return new Response(
        JSON.stringify({ 
          error: `Invalid subscription tier: ${tier}. Available tiers: ${Object.keys(plans).join(', ')}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Selected plan:', selectedPlan)

    // Handle enterprise tier differently
    if (tier === 'enterprise') {
      console.log('Enterprise tier requested - returning contact info')
      return new Response(
        JSON.stringify({ 
          error: 'Enterprise tier requires custom pricing. Please contact sales@bndbox.com for enterprise pricing'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get user profile
    console.log('Fetching user profile for user_id:', user_id)
    
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .maybeSingle()

    console.log('Profile query result:', { profile, profileError })

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch user profile: ' + profileError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    if (!profile?.email) {
      console.error('No profile or email found for user:', user_id)
      return new Response(
        JSON.stringify({ 
          error: 'User profile not found or missing email. Please complete your profile and try again.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Profile found successfully:', { email: profile.email, name: profile.full_name })

    // Create Razorpay order payload
    const orderPayload = {
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt: `receipt_${user_id}_${Date.now()}`,
      notes: {
        user_id: user_id,
        tier: tier,
        plan_name: selectedPlan.name,
        user_email: profile.email
      }
    }

    console.log('Creating Razorpay order with payload:', orderPayload)

    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
    
    try {
      const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      const orderResponseText = await orderResponse.text()
      console.log('Razorpay order creation response status:', orderResponse.status)
      console.log('Razorpay order creation response body:', orderResponseText)

      if (!orderResponse.ok) {
        console.error('Razorpay order creation failed:', {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          body: orderResponseText
        })
        
        let errorMessage = 'Failed to create payment order'
        try {
          const errorData = JSON.parse(orderResponseText)
          errorMessage = errorData.error?.description || errorData.error || errorMessage
        } catch (e) {
          console.log('Could not parse error response as JSON')
        }
        
        return new Response(
          JSON.stringify({ 
            error: `Payment order creation failed: ${errorMessage}`,
            razorpay_status: orderResponse.status
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      const order = JSON.parse(orderResponseText)
      console.log('Successfully created Razorpay order:', order.id)

      // Return the order details for frontend
      const response = {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: razorpayKeyId,
        user_email: profile.email,
        user_name: profile.full_name || 'User'
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

    } catch (fetchError) {
      console.error('Network error calling Razorpay API:', fetchError)
      return new Response(
        JSON.stringify({ 
          error: 'Network error connecting to payment service. Please try again.',
          details: fetchError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('=== END ERROR ===')
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error occurred. Please try again.',
        type: error.constructor.name,
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

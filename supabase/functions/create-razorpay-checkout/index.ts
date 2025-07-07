
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Create Razorpay Checkout Function Started ===')
  console.log('Request method:', req.method)
  console.log('Request URL:', req.url)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Environment check with detailed logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Environment variables check:')
    console.log('- SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING')
    console.log('- RAZORPAY_KEY_ID:', razorpayKeyId ? 'SET' : 'MISSING')
    console.log('- RAZORPAY_KEY_SECRET:', razorpayKeySecret ? 'SET' : 'MISSING')

    // Check if all required environment variables are present
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error - Supabase credentials missing',
          debug: {
            supabaseUrl: !!supabaseUrl,
            supabaseServiceKey: !!supabaseServiceKey
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Missing Razorpay environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Payment service not configured - Razorpay credentials missing',
          debug: {
            razorpayKeyId: !!razorpayKeyId,
            razorpayKeySecret: !!razorpayKeySecret
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Check authorization header
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header present:', !!authHeader)
    
    if (!authHeader) {
      console.error('No authorization header found')
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required',
          debug: 'No authorization header provided'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Parse request body with detailed error handling
    let requestBody;
    try {
      const bodyText = await req.text()
      console.log('Raw request body:', bodyText)
      
      if (!bodyText || bodyText.trim() === '') {
        console.error('Empty request body received')
        return new Response(
          JSON.stringify({ 
            error: 'Request body is required',
            debug: 'Empty or missing request body'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
      
      requestBody = JSON.parse(bodyText)
      console.log('Parsed request body:', requestBody)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          debug: parseError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const { tier, user_id } = requestBody
    
    // Validate required fields
    if (!tier || !user_id) {
      console.error('Missing required fields:', { tier: !!tier, user_id: !!user_id })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: tier and user_id are required',
          debug: { receivedTier: tier, receivedUserId: user_id }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Processing request for:', { tier, user_id })

    // Initialize Supabase client
    console.log('Initializing Supabase client...')
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Define pricing plans
    const plans = {
      basic: { 
        amount: 290000, // ₹2900 in paise
        name: 'Basic Plan', 
        currency: 'INR'
      },
      premium: { 
        amount: 790000, // ₹7900 in paise
        name: 'Premium Plan', 
        currency: 'INR'
      }
    }

    const selectedPlan = plans[tier as keyof typeof plans]
    if (!selectedPlan) {
      console.error('Invalid tier selected:', tier)
      return new Response(
        JSON.stringify({ 
          error: `Invalid subscription tier: ${tier}`,
          debug: { availableTiers: Object.keys(plans), requestedTier: tier }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('Selected plan:', selectedPlan)

    // Get user profile from Supabase
    console.log('Fetching user profile for:', user_id)
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    console.log('Profile query result:', { profile, profileError })

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return new Response(
        JSON.stringify({ 
          error: 'User profile not found',
          debug: {
            profileError: profileError.message,
            userId: user_id
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    if (!profile?.email) {
      console.error('No email found in profile:', profile)
      return new Response(
        JSON.stringify({ 
          error: 'Email not found in user profile',
          debug: { profile }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('User profile found:', { email: profile.email, name: profile.full_name })

    // Create Razorpay order
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

    // Create authorization header for Razorpay API
    const authString = `${razorpayKeyId}:${razorpayKeySecret}`
    const authHeaderValue = btoa(authString)
    
    console.log('Making request to Razorpay API...')
    console.log('Razorpay Key ID (first 10 chars):', razorpayKeyId.substring(0, 10))
    
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeaderValue}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    console.log('Razorpay API response status:', orderResponse.status)
    console.log('Razorpay API response headers:', Object.fromEntries(orderResponse.headers.entries()))

    const responseText = await orderResponse.text()
    console.log('Razorpay API response body:', responseText)

    if (!orderResponse.ok) {
      console.error('Razorpay order creation failed with status:', orderResponse.status)
      
      let errorMessage = 'Payment order creation failed'
      let errorDetails = null
      
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error?.description || errorData.message || errorMessage
        errorDetails = errorData
        console.error('Razorpay error details:', errorData)
      } catch (parseError) {
        console.error('Failed to parse Razorpay error response:', parseError)
        errorDetails = { rawResponse: responseText }
      }

      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          debug: {
            status: orderResponse.status,
            statusText: orderResponse.statusText,
            errorDetails,
            razorpayKeyId: razorpayKeyId.substring(0, 10) + '...'
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Parse successful response
    let order
    try {
      order = JSON.parse(responseText)
      console.log('Successfully created Razorpay order:', order.id)
    } catch (parseError) {
      console.error('Failed to parse Razorpay success response:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from payment gateway',
          debug: { parseError: parseError.message, rawResponse: responseText }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

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
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Unexpected error in create-razorpay-checkout:', error)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error occurred',
        debug: {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack?.substring(0, 500) // Limit stack trace length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

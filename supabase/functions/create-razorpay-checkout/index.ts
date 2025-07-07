
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== Create Razorpay Checkout Function Started ===')
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    let requestBody;
    try {
      const bodyText = await req.text()
      console.log('Raw request body:', bodyText)
      requestBody = JSON.parse(bodyText)
      console.log('Parsed request body:', requestBody)
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body. Please send valid JSON.',
          details: error.message
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
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Checking Razorpay credentials...')
    console.log('RAZORPAY_KEY_ID exists:', !!razorpayKeyId)
    console.log('RAZORPAY_KEY_SECRET exists:', !!razorpayKeySecret)

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Razorpay credentials not configured. Please contact support.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    console.log('Razorpay Key ID (first 10 chars):', razorpayKeyId.substring(0, 10))

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Supabase URL exists:', !!supabaseUrl)
    console.log('Supabase Service Key exists:', !!supabaseServiceKey)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing')
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error - Supabase not configured properly'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Define pricing plans (amounts in paise - multiply by 100 for Indian currency)
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
      }
    }

    const selectedPlan = plans[tier as keyof typeof plans]
    if (!selectedPlan) {
      console.error('Invalid tier selected:', tier)
      return new Response(
        JSON.stringify({ 
          error: `Invalid subscription tier: ${tier}. Available tiers: basic, premium`
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
          error: 'User profile not found. Please complete your profile and try again.',
          details: profileError.message
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
          error: 'Email not found in user profile. Please update your profile with an email address.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('User profile found for email:', profile.email)

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

    console.log('Creating Razorpay order with payload:', JSON.stringify(orderPayload, null, 2))

    // Create authorization header for Razorpay API
    const authString = `${razorpayKeyId}:${razorpayKeySecret}`
    const authHeader = btoa(authString)
    console.log('Auth string length:', authString.length)
    console.log('Authorization header created (length):', authHeader.length)
    
    try {
      console.log('Making request to Razorpay API...')
      const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      console.log('Razorpay API response status:', orderResponse.status)
      console.log('Razorpay API response statusText:', orderResponse.statusText)
      console.log('Razorpay API response headers:', Object.fromEntries(orderResponse.headers.entries()))

      const responseText = await orderResponse.text()
      console.log('Razorpay API response body:', responseText)

      if (!orderResponse.ok) {
        console.error('Razorpay order creation failed')
        console.error('Status:', orderResponse.status)
        console.error('StatusText:', orderResponse.statusText)
        console.error('Response body:', responseText)
        
        let errorMessage = 'Payment order creation failed'
        
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error?.description || errorData.message || errorMessage
          console.error('Razorpay error details:', errorData)
        } catch (parseError) {
          console.error('Failed to parse Razorpay error response:', parseError)
        }

        return new Response(
          JSON.stringify({ 
            error: `${errorMessage} (Status: ${orderResponse.status})`,
            razorpay_error: responseText,
            debug: {
              status: orderResponse.status,
              statusText: orderResponse.statusText,
              authHeaderLength: authHeader.length,
              keyIdLength: razorpayKeyId.length,
              keySecretLength: razorpayKeySecret.length
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      let order
      try {
        order = JSON.parse(responseText)
        console.log('Successfully parsed Razorpay order:', order.id)
      } catch (parseError) {
        console.error('Failed to parse Razorpay success response:', parseError)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response from payment gateway',
            details: 'Failed to parse payment gateway response'
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

      console.log('Returning success response:', JSON.stringify(response, null, 2))
      return new Response(
        JSON.stringify(response),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (fetchError) {
      console.error('Network error when calling Razorpay API:', fetchError)
      console.error('Error details:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack
      })
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to connect to payment gateway',
          details: fetchError.message,
          debug: {
            errorName: fetchError.name,
            errorMessage: fetchError.message
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

  } catch (error) {
    console.error('Unexpected error in create-razorpay-checkout:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error occurred. Please try again.',
        details: error.message,
        debug: {
          errorName: error.name,
          errorMessage: error.message
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

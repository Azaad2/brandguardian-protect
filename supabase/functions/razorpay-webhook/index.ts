
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    // Verify webhook signature
    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => 
      crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    ).then(signature => 
      Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    )

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature')
    }

    const event = JSON.parse(body)
    console.log('Received Razorpay webhook:', event.event)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(supabaseClient, event.payload.subscription.entity)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabaseClient, event.payload.subscription.entity)
        break
      
      case 'subscription.completed':
        await handleSubscriptionCompleted(supabaseClient, event.payload.subscription.entity)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabaseClient, event.payload.payment.entity)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return new Response('OK', { headers: corsHeaders, status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { headers: corsHeaders, status: 400 })
  }
})

async function handleSubscriptionActivated(supabase: any, subscription: any) {
  const userId = subscription.notes?.user_id
  const tier = subscription.notes?.tier

  if (!userId) return

  await supabase
    .from('subscribers')
    .update({
      subscribed: true,
      subscription_tier: tier,
      subscription_end: new Date(subscription.current_end * 1000).toISOString(),
    })
    .eq('razorpay_subscription_id', subscription.id)
}

async function handleSubscriptionCancelled(supabase: any, subscription: any) {
  await supabase
    .from('subscribers')
    .update({
      subscribed: false,
      subscription_tier: 'free',
      brand_application_limit: 3,
    })
    .eq('razorpay_subscription_id', subscription.id)
}

async function handleSubscriptionCompleted(supabase: any, subscription: any) {
  await supabase
    .from('subscribers')
    .update({
      subscribed: false,
      subscription_tier: 'free',
      brand_application_limit: 3,
    })
    .eq('razorpay_subscription_id', subscription.id)
}

async function handlePaymentFailed(supabase: any, payment: any) {
  // Handle payment failure - could send notification or take other action
  console.log('Payment failed for subscription:', payment.subscription_id)
}

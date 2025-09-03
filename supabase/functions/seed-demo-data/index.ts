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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get demo account IDs
    const { data: demoAccounts } = await supabaseClient
      .from('profiles')
      .select('id, email, user_role')
      .in('email', ['demo.admin@bndbox.com', 'demo.reseller@bndbox.com', 'demo.brand@bndbox.com'])

    if (!demoAccounts || demoAccounts.length < 3) {
      throw new Error('Demo accounts not found. Please create demo accounts first.')
    }

    const adminId = demoAccounts.find(a => a.user_role === 'admin')?.id
    const resellerId = demoAccounts.find(a => a.user_role === 'reseller')?.id  
    const brandId = demoAccounts.find(a => a.user_role === 'brand')?.id

    // 1. Create sample brands in directory
    const brands = [
      { name: '[DEMO] TechPro Electronics', website_url: 'https://demo-techpro.com', contact_email: 'demo@techpro.com', description: 'Premium electronics and accessories', categories: ['Electronics', 'Accessories'], department: 'Electronics', approval_rate: 85.5, response_time: 24 },
      { name: '[DEMO] StyleHome Furniture', website_url: 'https://demo-stylehome.com', contact_email: 'demo@stylehome.com', description: 'Modern furniture and home decor', categories: ['Home & Garden', 'Furniture'], department: 'Home', approval_rate: 92.0, response_time: 48 },
      { name: '[DEMO] FitLife Sports', website_url: 'https://demo-fitlife.com', contact_email: 'demo@fitlife.com', description: 'Sports equipment and fitness gear', categories: ['Sports', 'Fitness'], department: 'Sports', approval_rate: 78.3, response_time: 36 },
      { name: '[DEMO] PetCare Plus', website_url: 'https://demo-petcare.com', contact_email: 'demo@petcare.com', description: 'Premium pet supplies and accessories', categories: ['Pet Supplies'], department: 'Pets', approval_rate: 89.1, response_time: 12 },
      { name: '[DEMO] KitchenMaster', website_url: 'https://demo-kitchen.com', contact_email: 'demo@kitchen.com', description: 'Professional kitchen equipment', categories: ['Kitchen', 'Appliances'], department: 'Home', approval_rate: 91.7, response_time: 18 }
    ]

    const { data: createdBrands } = await supabaseClient
      .from('brands_directory')
      .upsert(brands, { onConflict: 'name' })
      .select('id, name')

    // 2. Create brand-reseller allocations
    if (createdBrands && resellerId) {
      const allocations = createdBrands.map(brand => ({
        brand_id: brand.id,
        reseller_id: resellerId,
        allocated_by: adminId,
        brand_profile_id: brandId // Map to the demo brand profile
      }))

      await supabaseClient
        .from('brand_reseller_allocations')
        .upsert(allocations, { onConflict: 'brand_id,reseller_id' })
    }

    // 3. Create products for the demo brand
    if (brandId && createdBrands) {
      const products = [
        { name: '[DEMO] Wireless Headphones Pro', sku: 'DEMO-WH-001', description: 'Premium wireless headphones with noise cancellation', price: 199.99, wholesale_price: 120.00, msrp: 249.99, stock: 45, brand_id: brandId, categories: ['Electronics', 'Audio'], approval_status: 'approved' },
        { name: '[DEMO] Smart Fitness Tracker', sku: 'DEMO-FT-002', description: 'Advanced fitness tracking with heart rate monitor', price: 149.99, wholesale_price: 89.99, msrp: 199.99, stock: 32, brand_id: brandId, categories: ['Electronics', 'Fitness'], approval_status: 'approved' },
        { name: '[DEMO] Premium Coffee Maker', sku: 'DEMO-CM-003', description: 'Professional grade coffee maker with programmable features', price: 299.99, wholesale_price: 180.00, msrp: 399.99, stock: 18, brand_id: brandId, categories: ['Kitchen', 'Appliances'], approval_status: 'approved' },
        { name: '[DEMO] Ergonomic Office Chair', sku: 'DEMO-OC-004', description: 'Luxury ergonomic office chair with lumbar support', price: 449.99, wholesale_price: 270.00, msrp: 599.99, stock: 12, brand_id: brandId, categories: ['Furniture', 'Office'], approval_status: 'pending' },
        { name: '[DEMO] Portable Bluetooth Speaker', sku: 'DEMO-BS-005', description: 'Waterproof portable speaker with 20-hour battery', price: 79.99, wholesale_price: 48.00, msrp: 99.99, stock: 67, brand_id: brandId, categories: ['Electronics', 'Audio'], approval_status: 'approved' }
      ]

      const { data: createdProducts } = await supabaseClient
        .from('products')
        .upsert(products, { onConflict: 'sku' })
        .select('id, name, wholesale_price')

      // 4. Create sample orders
      if (createdProducts && resellerId) {
        const orders = [
          { reseller_id: resellerId, brand_id: brandId, total_amount: 850.00, status: 'completed', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
          { reseller_id: resellerId, brand_id: brandId, total_amount: 1299.98, status: 'processing', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { reseller_id: resellerId, brand_id: brandId, total_amount: 679.97, status: 'pending', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
        ]

        const { data: createdOrders } = await supabaseClient
          .from('orders')
          .upsert(orders, { onConflict: 'reseller_id,brand_id,created_at' })
          .select('id')

        // 5. Create order items
        if (createdOrders) {
          const orderItems = [
            // Order 1 items
            { order_id: createdOrders[0].id, product_id: createdProducts[0].id, quantity: 2, unit_price: 199.99, total_price: 399.98 },
            { order_id: createdOrders[0].id, product_id: createdProducts[1].id, quantity: 3, unit_price: 149.99, total_price: 449.97 },
            // Order 2 items  
            { order_id: createdOrders[1].id, product_id: createdProducts[2].id, quantity: 2, unit_price: 299.99, total_price: 599.98 },
            { order_id: createdOrders[1].id, product_id: createdProducts[4].id, quantity: 5, unit_price: 79.99, total_price: 399.95 },
            { order_id: createdOrders[1].id, product_id: createdProducts[0].id, quantity: 1, unit_price: 199.99, total_price: 199.99 },
            // Order 3 items
            { order_id: createdOrders[2].id, product_id: createdProducts[1].id, quantity: 2, unit_price: 149.99, total_price: 299.98 },
            { order_id: createdOrders[2].id, product_id: createdProducts[4].id, quantity: 3, unit_price: 79.99, total_price: 239.97 }
          ]

          await supabaseClient
            .from('order_items')
            .upsert(orderItems, { onConflict: 'order_id,product_id' })
        }
      }
    }

    // 6. Create brand applications from reseller to brands
    if (resellerId && createdBrands) {
      const applications = createdBrands.slice(0, 4).map((brand, index) => ({
        reseller_id: resellerId,
        brand_id: brand.id,
        status: ['approved', 'pending', 'rejected', 'pending'][index],
        application_data: {
          message: `[DEMO] Application for wholesale partnership with ${brand.name}`,
          monthly_volume: ['$25,000', '$15,000', '$30,000', '$20,000'][index],
          experience_years: [5, 3, 7, 4][index]
        },
        created_at: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      }))

      await supabaseClient
        .from('brand_applications')
        .upsert(applications, { onConflict: 'reseller_id,brand_id' })
    }

    // 7. Create product uploads for brand
    if (brandId) {
      const uploads = [
        { name: '[DEMO] Electronics Catalog Q4 2024', brand_id: brandId, product_count: 247, status: 'approved', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        { name: '[DEMO] New Product Launch Catalog', brand_id: brandId, product_count: 35, status: 'pending', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { name: '[DEMO] Seasonal Products Update', brand_id: brandId, product_count: 89, status: 'approved', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
      ]

      await supabaseClient
        .from('product_uploads')
        .upsert(uploads, { onConflict: 'brand_id,name' })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo data seeded successfully',
        data: {
          brands_created: createdBrands?.length || 0,
          demo_accounts: demoAccounts.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error seeding demo data:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
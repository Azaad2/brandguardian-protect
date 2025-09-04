import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log('Seed demo data function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('Starting demo data seeding...');

    // Get demo account IDs
    const { data: demoProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, user_role')
      .in('email', ['demo.admin@bndbox.com', 'demo.reseller@bndbox.com', 'demo.brand@bndbox.com']);

    if (profilesError) {
      console.error('Error fetching demo profiles:', profilesError);
      throw profilesError;
    }

    const demoAdmin = demoProfiles?.find(p => p.email === 'demo.admin@bndbox.com');
    const demoReseller = demoProfiles?.find(p => p.email === 'demo.reseller@bndbox.com');
    const demoBrand = demoProfiles?.find(p => p.email === 'demo.brand@bndbox.com');

    console.log('Demo accounts found:', { demoAdmin: !!demoAdmin, demoReseller: !!demoReseller, demoBrand: !!demoBrand });

    // 1. Clean up existing demo data and create sample brands
    // Cleanup existing demo data first to avoid unique conflicts and duplicates
    const { data: existingDemoBrands, error: findDemoBrandsError } = await supabase
      .from('brands_directory')
      .select('id, name')
      .ilike('name', '[DEMO]%');

    if (findDemoBrandsError) {
      console.error('Error finding existing demo brands:', findDemoBrandsError);
    }

    const demoBrandIds = (existingDemoBrands || []).map((b: any) => b.id);

    try {
      // Delete orders and order items for demo reseller
      if (demoReseller) {
        const { data: existingOrders, error: findOrdersError } = await supabase
          .from('orders')
          .select('id')
          .eq('reseller_id', demoReseller.id);
        if (findOrdersError) console.error('Error finding demo orders:', findOrdersError);

        const orderIds = (existingOrders || []).map((o: any) => o.id);
        if (orderIds.length) {
          const { error: delItemsErr } = await supabase.from('order_items').delete().in('order_id', orderIds);
          if (delItemsErr) console.error('Error deleting order items:', delItemsErr);

          const { error: delOrdersErr } = await supabase.from('orders').delete().in('id', orderIds);
          if (delOrdersErr) console.error('Error deleting orders:', delOrdersErr);
        }

        // Delete allocations and applications tied to demo reseller and demo brands
        if (demoBrandIds.length) {
          const { error: delAllocErr } = await supabase
            .from('brand_reseller_allocations')
            .delete()
            .eq('reseller_id', demoReseller.id)
            .in('brand_id', demoBrandIds);
          if (delAllocErr) console.error('Error deleting allocations:', delAllocErr);

          const { error: delAppsErr } = await supabase
            .from('brand_applications')
            .delete()
            .eq('reseller_id', demoReseller.id)
            .in('brand_id', demoBrandIds);
          if (delAppsErr) console.error('Error deleting applications:', delAppsErr);
        }

        // Delete reseller application for demo reseller
        const { error: delResellerAppErr } = await supabase
          .from('reseller_applications')
          .delete()
          .eq('email', 'demo.reseller@bndbox.com');
        if (delResellerAppErr) console.error('Error deleting reseller application:', delResellerAppErr);
      }

      // Delete uploads, products, and brands for demo brands
      if (demoBrandIds.length) {
        const { error: delUploadsErr } = await supabase.from('product_uploads').delete().in('brand_id', demoBrandIds);
        if (delUploadsErr) console.error('Error deleting product uploads:', delUploadsErr);

        const { error: delProductsErr } = await supabase.from('products').delete().in('brand_id', demoBrandIds);
        if (delProductsErr) console.error('Error deleting products:', delProductsErr);

        const { error: delBrandsErr } = await supabase.from('brands_directory').delete().in('id', demoBrandIds);
        if (delBrandsErr) console.error('Error deleting brands:', delBrandsErr);
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }

    // Now create sample brands
    const sampleBrands = [
      {
        name: '[DEMO] Tech Innovations',
        website_url: 'https://demo-tech-innovations.com',
        description: 'Demo technology brand showcasing smart devices and accessories',
        contact_email: 'demo@tech-innovations.com',
        categories: ['Electronics', 'Technology'],
        department: 'Technology',
        approval_rate: 85.5,
        response_time: 24,
        is_active: true
      },
      {
        name: '[DEMO] Fashion Forward',
        website_url: 'https://demo-fashion-forward.com',
        description: 'Demo fashion brand offering trendy apparel and accessories',
        contact_email: 'demo@fashion-forward.com',
        categories: ['Fashion', 'Apparel'],
        department: 'Fashion',
        approval_rate: 78.2,
        response_time: 48,
        is_active: true
      },
      {
        name: '[DEMO] Home Essentials',
        website_url: 'https://demo-home-essentials.com',
        description: 'Demo home goods brand specializing in kitchen and living essentials',
        contact_email: 'demo@home-essentials.com',
        categories: ['Home & Garden', 'Kitchen'],
        department: 'Home Goods',
        approval_rate: 92.1,
        response_time: 12,
        is_active: true
      },
      {
        name: '[DEMO] Fitness Pro',
        website_url: 'https://demo-fitness-pro.com',
        description: 'Demo sports and fitness equipment brand',
        contact_email: 'demo@fitness-pro.com',
        categories: ['Sports', 'Fitness'],
        department: 'Sports',
        approval_rate: 88.7,
        response_time: 36,
        is_active: true
      },
      {
        name: '[DEMO] Beauty Bliss',
        website_url: 'https://demo-beauty-bliss.com',
        description: 'Demo beauty and skincare products brand',
        contact_email: 'demo@beauty-bliss.com',
        categories: ['Beauty', 'Skincare'],
        department: 'Beauty',
        approval_rate: 91.3,
        response_time: 18,
        is_active: true
      }
    ];

    const { data: createdBrands, error: brandsError } = await supabase
      .from('brands_directory')
      .insert(sampleBrands)
      .select();

    if (brandsError) {
      console.error('Error creating brands:', brandsError);
      throw brandsError;
    }

    console.log(`Created ${createdBrands?.length || 0} demo brands`);

    // 2. Create brand-reseller allocations
    if (demoReseller && createdBrands && createdBrands.length > 0) {
      const allocations = createdBrands.map((brand: any) => ({
        brand_id: brand.id,
        reseller_id: demoReseller.id,
        allocated_by: demoAdmin?.id || demoReseller.id,
        allocated_at: new Date().toISOString()
      }));

      const { error: allocationsError } = await supabase
        .from('brand_reseller_allocations')
        .insert(allocations);

      if (allocationsError) {
        console.error('Error creating allocations:', allocationsError);
      } else {
        console.log(`Created ${allocations.length} brand allocations`);
      }
    }

    // 3. Create sample products
    if (demoBrand && createdBrands && createdBrands.length > 0) {
      const firstBrandId = createdBrands[0].id;
      
      const sampleProducts = [
        {
          brand_id: firstBrandId,
          name: '[DEMO] Smart Wireless Charger',
          sku: 'DEMO-SWC-001',
          description: 'Fast wireless charging pad with LED indicator',
          price: 29.99,
          wholesale_price: 15.00,
          msrp: 39.99,
          stock: 150,
          categories: ['Electronics', 'Accessories'],
          approval_status: 'approved',
          asin: 'DEMO001SWC'
        },
        {
          brand_id: firstBrandId,
          name: '[DEMO] Premium Coffee Mug Set',
          sku: 'DEMO-MUG-002',
          description: 'Set of 4 ceramic coffee mugs with elegant design',
          price: 24.99,
          wholesale_price: 12.50,
          msrp: 34.99,
          stock: 75,
          categories: ['Home & Garden', 'Kitchen'],
          approval_status: 'approved',
          asin: 'DEMO002MUG'
        },
        {
          brand_id: firstBrandId,
          name: '[DEMO] Bluetooth Sports Headphones',
          sku: 'DEMO-BT-003',
          description: 'Wireless Bluetooth headphones perfect for workouts',
          price: 49.99,
          wholesale_price: 25.00,
          msrp: 79.99,
          stock: 200,
          categories: ['Electronics', 'Sports'],
          approval_status: 'approved',
          asin: 'DEMO003BT'
        },
        {
          brand_id: firstBrandId,
          name: '[DEMO] Organic Face Serum',
          sku: 'DEMO-SER-004',
          description: 'Natural anti-aging serum with vitamin C',
          price: 19.99,
          wholesale_price: 10.00,
          msrp: 29.99,
          stock: 120,
          categories: ['Beauty', 'Skincare'],
          approval_status: 'approved',
          asin: 'DEMO004SER'
        },
        {
          brand_id: firstBrandId,
          name: '[DEMO] Yoga Mat Premium',
          sku: 'DEMO-YOG-005',
          description: 'High-quality non-slip yoga mat with carrying strap',
          price: 34.99,
          wholesale_price: 18.00,
          msrp: 49.99,
          stock: 85,
          categories: ['Sports', 'Fitness'],
          approval_status: 'approved',
          asin: 'DEMO005YOG'
        }
      ];

      const { data: createdProducts, error: productsError } = await supabase
        .from('products')
        .insert(sampleProducts)
        .select();

      if (productsError) {
        console.error('Error creating products:', productsError);
      } else {
        console.log(`Created ${createdProducts?.length || 0} demo products`);

        // 4. Create sample orders
        if (demoReseller && createdProducts && createdProducts.length > 0) {
          const sampleOrders = [
            {
              reseller_id: demoReseller.id,
              brand_id: firstBrandId,
              total_amount: 299.95,
              status: 'delivered',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              reseller_id: demoReseller.id,
              brand_id: firstBrandId,
              total_amount: 149.95,
              status: 'shipped',
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              reseller_id: demoReseller.id,
              brand_id: firstBrandId,
              total_amount: 199.97,
              status: 'processing',
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];

          const { data: createdOrders, error: ordersError } = await supabase
            .from('orders')
            .insert(sampleOrders)
            .select();

          if (ordersError) {
            console.error('Error creating orders:', ordersError);
          } else {
            console.log(`Created ${createdOrders?.length || 0} demo orders`);

            // 5. Create order items
            if (createdOrders && createdOrders.length > 0) {
              const orderItems = [
                {
                  order_id: createdOrders[0].id,
                  product_id: createdProducts[0].id,
                  quantity: 5,
                  unit_price: 29.99,
                  total_price: 149.95
                },
                {
                  order_id: createdOrders[0].id,
                  product_id: createdProducts[1].id,
                  quantity: 6,
                  unit_price: 24.99,
                  total_price: 149.94
                },
                {
                  order_id: createdOrders[1].id,
                  product_id: createdProducts[2].id,
                  quantity: 3,
                  unit_price: 49.99,
                  total_price: 149.97
                },
                {
                  order_id: createdOrders[2].id,
                  product_id: createdProducts[3].id,
                  quantity: 10,
                  unit_price: 19.99,
                  total_price: 199.90
                }
              ];

              const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

              if (itemsError) {
                console.error('Error creating order items:', itemsError);
              } else {
                console.log(`Created ${orderItems.length} demo order items`);
              }
            }
          }
        }
      }
    }

    // 6. Create sample brand applications
    if (demoReseller && createdBrands && createdBrands.length > 0) {
      const sampleApplications = [
        {
          reseller_id: demoReseller.id,
          brand_id: createdBrands[0].id,
          status: 'approved',
          application_data: {
            message: 'We are interested in carrying your tech products. Our Amazon store has excellent ratings.',
            estimated_monthly_volume: '$5,000-$10,000'
          },
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          reseller_id: demoReseller.id,
          brand_id: createdBrands[1].id,
          status: 'pending',
          application_data: {
            message: 'We would love to showcase your fashion products to our customer base.',
            estimated_monthly_volume: '$3,000-$8,000'
          },
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          reseller_id: demoReseller.id,
          brand_id: createdBrands[2].id,
          status: 'approved',
          application_data: {
            message: 'Your home essentials line would be perfect for our marketplace presence.',
            estimated_monthly_volume: '$7,000-$12,000'
          },
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const { error: applicationsError } = await supabase
        .from('brand_applications')
        .insert(sampleApplications);

      if (applicationsError) {
        console.error('Error creating applications:', applicationsError);
      } else {
        console.log(`Created ${sampleApplications.length} demo applications`);
      }
    }

    // 7. Create demo reseller application
    if (demoReseller) {
      const demoResellerApplication = {
        user_id: demoReseller.id,
        email: 'demo.reseller@bndbox.com',
        company_name: '[DEMO] Premium Resellers Inc',
        business_type: 'LLC',
        ein_number: 'XX-XXXXXXX',
        phone: '+1-555-DEMO-001',
        sales_volume: '$100,000 - $500,000',
        wholesale_budget: '$50,000 - $100,000',
        product_categories: ['Electronics', 'Fashion', 'Home & Garden'],
        status: 'approved',
        amazon_seller_id: 'DEMO123456789',
        walmart_seller_id: 'DEMO-WALMART-ID',
        ebay_seller_id: 'demo_reseller_ebay',
        feedback_score: '98.5% (5000+ reviews)',
        linkedin: 'https://linkedin.com/company/demo-premium-resellers'
      };

      const { error: resellerError } = await supabase
        .from('reseller_applications')
        .insert(demoResellerApplication);

      if (resellerError) {
        console.error('Error creating reseller application:', resellerError);
      } else {
        console.log('Created demo reseller application');
      }
    }

    // 8. Create sample product uploads
    if (demoBrand && createdBrands && createdBrands.length > 0) {
      const sampleUploads = [
        {
          brand_id: createdBrands[0].id,
          name: '[DEMO] Electronics Catalog Q4 2024',
          status: 'approved',
          product_count: 25,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          brand_id: createdBrands[0].id,
          name: '[DEMO] Home Products Spring Collection',
          status: 'pending',
          product_count: 18,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const { error: uploadsError } = await supabase
        .from('product_uploads')
        .insert(sampleUploads);

      if (uploadsError) {
        console.error('Error creating uploads:', uploadsError);
      } else {
        console.log(`Created ${sampleUploads.length} demo uploads`);
      }
    }

    console.log('Demo data seeding completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo data seeded successfully',
        details: {
          brands: createdBrands?.length || 0,
          demoProfilesFound: { admin: !!demoAdmin, reseller: !!demoReseller, brand: !!demoBrand }
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in seed-demo-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as any)?.message || String(error),
        details: 'Check function logs for more information'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
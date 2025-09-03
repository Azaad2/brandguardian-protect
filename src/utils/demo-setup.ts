import { supabase } from '@/integrations/supabase/client';
import { createTestUser } from './auth-utils';

export interface DemoAccount {
  email: string;
  password: string;
  role: 'admin' | 'reseller' | 'brand';
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'demo.admin@bndbox.com',
    password: 'DemoAdmin2025!',
    role: 'admin',
    description: 'Full admin access to manage brands, resellers, and view all data'
  },
  {
    email: 'demo.reseller@bndbox.com',
    password: 'DemoReseller2025!',
    role: 'reseller',
    description: 'Approved reseller account with sample brand applications'
  },
  {
    email: 'demo.brand@bndbox.com',
    password: 'DemoBrand2025!',
    role: 'brand',
    description: 'Brand account with sample products and reseller connections'
  }
];

/**
 * Create all demo accounts
 */
export const createDemoAccounts = async (): Promise<{ success: boolean; results: any[] }> => {
  console.log('🚀 Starting demo account creation...');
  
  const results = [];
  
  for (const account of DEMO_ACCOUNTS) {
    try {
      console.log(`Creating ${account.role} demo account: ${account.email}`);
      
      const success = await createTestUser(account.email, account.password, account.role);
      
      results.push({
        account: account.email,
        role: account.role,
        success,
        password: account.password
      });
      
      if (success) {
        console.log(`✅ Created ${account.role} account: ${account.email}`);
      } else {
        console.log(`❌ Failed to create ${account.role} account: ${account.email}`);
      }
      
      // Add delay between account creation to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error creating ${account.role} account:`, error);
      results.push({
        account: account.email,
        role: account.role,
        success: false,
        error: error
      });
    }
  }
  
  const allSuccessful = results.every(r => r.success);
  
  return {
    success: allSuccessful,
    results
  };
};

/**
 * Add sample demo data to the database
 */
export const createDemoData = async (): Promise<boolean> => {
  try {
    console.log('🔧 Adding comprehensive demo data...');

    // Get demo user IDs
    const { data: demoReseller } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'demo.reseller@bndbox.com')
      .single();

    const { data: demoBrand } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'demo.brand@bndbox.com')
      .single();

    if (!demoReseller || !demoBrand) {
      console.log('⚠️ Demo accounts not found, creating basic data only...');
    }

    // 1. Add sample brands (clearly marked as demo)
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

    const createdBrands = [];
    for (const brand of sampleBrands) {
      const { data, error } = await supabase
        .from('brands_directory')
        .insert(brand)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating demo brand:', error);
      } else {
        console.log(`✅ Created demo brand: ${brand.name}`);
        createdBrands.push(data);
      }
    }

    // 2. Add demo reseller application
    const demoResellerApplication = {
      user_id: demoReseller?.id || null,
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
      console.error('Error creating demo reseller application:', resellerError);
    } else {
      console.log('✅ Created demo reseller application');
    }

    // 3. Create brand-reseller allocations (so brands appear in reseller's brands tab)
    if (demoReseller && createdBrands.length > 0) {
      const allocations = createdBrands.slice(0, 3).map((brand: any) => ({
        brand_id: brand.id,
        reseller_id: demoReseller.id,
        allocated_by: demoBrand?.id || demoReseller.id,
        allocated_at: new Date().toISOString()
      }));

      const { error: allocationError } = await supabase
        .from('brand_reseller_allocations')
        .insert(allocations);

      if (allocationError) {
        console.error('Error creating brand allocations:', allocationError);
      } else {
        console.log('✅ Created brand-reseller allocations');
      }
    }

    // 4. Create sample products for demo brand
    if (demoBrand && createdBrands.length > 0) {
      const sampleProducts = [
        {
          brand_id: demoBrand.id,
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
          brand_id: demoBrand.id,
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
          brand_id: demoBrand.id,
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
          brand_id: demoBrand.id,
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
          brand_id: demoBrand.id,
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
        console.error('Error creating demo products:', productsError);
      } else {
        console.log('✅ Created demo products');

        // 5. Create sample orders
        if (demoReseller && createdProducts) {
          const sampleOrders = [
            {
              reseller_id: demoReseller.id,
              brand_id: demoBrand.id,
              total_amount: 299.95,
              status: 'delivered',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              reseller_id: demoReseller.id,
              brand_id: demoBrand.id,
              total_amount: 149.95,
              status: 'shipped',
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              reseller_id: demoReseller.id,
              brand_id: demoBrand.id,
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
            console.error('Error creating demo orders:', ordersError);
          } else {
            console.log('✅ Created demo orders');

            // 6. Create order items
            if (createdOrders) {
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
                console.error('Error creating demo order items:', itemsError);
              } else {
                console.log('✅ Created demo order items');
              }
            }
          }
        }

        // 7. Create sample product uploads
        const sampleUploads = [
          {
            brand_id: demoBrand.id,
            name: '[DEMO] Electronics Catalog Q4 2024',
            status: 'approved',
            product_count: 25,
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            brand_id: demoBrand.id,
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
          console.error('Error creating demo uploads:', uploadsError);
        } else {
          console.log('✅ Created demo product uploads');
        }
      }
    }

    // 8. Create sample brand applications (for reseller's applications tab)
    if (demoReseller && createdBrands.length > 0) {
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
        console.error('Error creating demo applications:', applicationsError);
      } else {
        console.log('✅ Created demo brand applications');
      }
    }

    console.log('✅ Comprehensive demo data creation completed');
    return true;
    
  } catch (error) {
    console.error('Error creating demo data:', error);
    return false;
  }
};

/**
 * Complete demo setup function
 */
export const setupCompleteDemo = async (): Promise<{ success: boolean; message: string; accounts?: DemoAccount[] }> => {
  try {
    console.log('🎬 Starting complete demo setup...');
    
    // Step 1: Create demo accounts
    const accountResults = await createDemoAccounts();
    
    if (!accountResults.success) {
      return {
        success: false,
        message: 'Failed to create some demo accounts. Check console for details.'
      };
    }
    
    // Step 2: Add sample data
    const dataSuccess = await createDemoData();
    
    if (!dataSuccess) {
      return {
        success: false,
        message: 'Demo accounts created but failed to add sample data.'
      };
    }
    
    console.log('🎉 Complete demo setup finished successfully!');
    
    return {
      success: true,
      message: 'Complete demo setup created successfully!',
      accounts: DEMO_ACCOUNTS
    };
    
  } catch (error) {
    console.error('Error in complete demo setup:', error);
    return {
      success: false,
      message: 'Unexpected error during demo setup.'
    };
  }
};
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
    console.log('🔧 Adding sample demo data...');
    
    // Add sample brands (clearly marked as demo)
    const sampleBrands = [
      {
        name: '[DEMO] Tech Innovations',
        website_url: 'https://demo-tech-innovations.com',
        description: 'Demo technology brand for investor presentation',
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
        description: 'Demo fashion brand showcasing apparel wholesale',
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
        description: 'Demo home goods brand for platform demonstration',
        contact_email: 'demo@home-essentials.com',
        categories: ['Home & Garden', 'Kitchen'],
        department: 'Home Goods',
        approval_rate: 92.1,
        response_time: 12,
        is_active: true
      }
    ];

    for (const brand of sampleBrands) {
      const { error } = await supabase
        .from('brands_directory')
        .insert(brand);
      
      if (error) {
        console.error('Error creating demo brand:', error);
      } else {
        console.log(`✅ Created demo brand: ${brand.name}`);
      }
    }

    // Add sample reseller application (for demo reseller account)
    const demoResellerApplication = {
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

    console.log('✅ Demo data creation completed');
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
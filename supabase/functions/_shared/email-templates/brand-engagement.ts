// Shared email template for brand engagement emails
// Used by both send-brand-engagement-email and preview-brand-engagement-email functions

export function generateBrandEngagementEmail(brandName: string, resellerCompany: string, interactionType: string): string {
  const interactionText = 
    interactionType === 'approval' ? 'approved' :
    interactionType === 'rejection' ? 'responded to' :
    interactionType === 'email_open' ? 'viewed' :
    'engaged with';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Partner with BndBox</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">BndBox</h1>
      <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Connecting Brands with Growth Partners</p>
    </div>
    
    <!-- Thank You Section -->
    <div style="padding: 40px 30px; background: white;">
      <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Thank You for Engaging with ${resellerCompany}!</h2>
      <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">Dear ${brandName} Team,</p>
      <p style="color: #4a4a4a; line-height: 1.6; margin: 0; font-size: 16px;">We noticed you recently ${interactionText} a wholesale application from one of our verified resellers on BndBox. Thank you for taking the time to review their proposal!</p>
    </div>
    
    <!-- Value Proposition Section -->
    <div style="background: #f0f9ff; padding: 40px 30px; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 20px;">🚀 How BndBox Helps Brands Like Yours Scale Revenue</h3>
      <p style="color: #4a4a4a; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">BndBox isn't just about marketplace resellers - we connect you with <strong>ALL types of partnerships</strong> to maximize your brand's reach:</p>
      
      <!-- Partnership Types Grid -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;">
        <tr>
          <td style="padding: 0 8px 16px 0; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <div style="font-size: 32px; margin-bottom: 10px;">🏪</div>
              <strong style="color: #1a1a1a; font-size: 16px;">Traditional Retail Stores</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">Brick-and-mortar retailers looking for new brands to stock</p>
            </div>
          </td>
          <td style="padding: 0 0 16px 8px; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <div style="font-size: 32px; margin-bottom: 10px;">📦</div>
              <strong style="color: #1a1a1a; font-size: 16px;">Wholesale Distributors</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">B2B distributors with established networks nationwide</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 8px 16px 0; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #22c55e;">
              <div style="font-size: 32px; margin-bottom: 10px;">🌐</div>
              <strong style="color: #1a1a1a; font-size: 16px;">E-commerce Partners</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">Shopify, WooCommerce, and independent online stores</p>
            </div>
          </td>
          <td style="padding: 0 0 16px 8px; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #ec4899;">
              <div style="font-size: 32px; margin-bottom: 10px;">💼</div>
              <strong style="color: #1a1a1a; font-size: 16px;">B2B Buyers</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">Corporate buyers and procurement teams</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 8px 0 0; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6;">
              <div style="font-size: 32px; margin-bottom: 10px;">🛒</div>
              <strong style="color: #1a1a1a; font-size: 16px;">Marketplace Resellers</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">Amazon, Walmart, eBay sellers with proven track records</p>
            </div>
          </td>
          <td style="padding: 0 0 0 8px; width: 50%; vertical-align: top;">
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #06b6d4;">
              <div style="font-size: 32px; margin-bottom: 10px;">🌍</div>
              <strong style="color: #1a1a1a; font-size: 16px;">International Distributors</strong>
              <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0; line-height: 1.4;">Expand globally with pre-vetted international partners</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Benefits Section -->
    <div style="padding: 40px 30px; background: white;">
      <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 20px;">✨ Why Brands Choose BndBox:</h3>
      <ul style="color: #4a4a4a; line-height: 1.8; margin: 0; padding-left: 20px; font-size: 16px;">
        <li style="margin-bottom: 12px;"><strong>All Partners Are Pre-Verified</strong> - Save time and resources on screening buyers</li>
        <li style="margin-bottom: 12px;"><strong>One Platform, All Channels</strong> - Manage retail, wholesale, and online partnerships in one place</li>
        <li style="margin-bottom: 12px;"><strong>Secure Communication</strong> - Track all conversations and applications centrally</li>
        <li style="margin-bottom: 12px;"><strong>Scale at Your Pace</strong> - Accept only partnerships that align with your brand values</li>
        <li style="margin-bottom: 12px;"><strong>Increase Revenue Streams</strong> - Diversify beyond online-only sales</li>
        <li style="margin-bottom: 0;"><strong>No Upfront Costs</strong> - Start connecting with buyers risk-free</li>
      </ul>
    </div>
    
    <!-- CTA Section -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center;">
      <h2 style="color: white; margin: 0 0 15px 0; font-size: 26px;">Ready to Unlock More Partnerships?</h2>
      <p style="color: #e0e7ff; margin: 0 0 35px 0; font-size: 16px;">Join thousands of brands already growing their business through BndBox</p>
      
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;">
        <tr>
          <td style="padding: 0 10px 15px 10px;">
            <a href="https://bndbox.com/brand/signup" style="background: white; color: #667eea; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              🚀 Become a Brand Partner
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 10px;">
            <a href="https://bndbox.com/brand-portal" style="background: rgba(255,255,255,0.2); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid white;">
              📋 Browse Buyer Network
            </a>
          </td>
        </tr>
      </table>
      
      <p style="color: #e0e7ff; font-size: 14px; margin: 25px 0 0 0; font-style: italic;">
        🔥 Hundreds of buyers are actively searching for brands like yours right now
      </p>
    </div>
    
    <!-- Footer -->
    <div style="padding: 30px; background: #f8f9fa; text-align: center;">
      <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">© 2025 BndBox. All rights reserved.</p>
      <p style="color: #718096; font-size: 14px; margin: 0;">Questions? Contact us at <a href="mailto:partnerships@bndbox.com" style="color: #667eea; text-decoration: none;">partnerships@bndbox.com</a></p>
    </div>
    
  </div>
</body>
</html>
  `;
}

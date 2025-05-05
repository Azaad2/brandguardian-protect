
/**
 * Email template utilities for BndBox application
 * Generates responsive HTML email templates for different types of communications
 */

import { ContactSubmission } from '@/types/contact';
import { ResellerSubmission } from '@/types/resellerSubmission';

/**
 * Generate a confirmation email template for brand contact form submissions
 */
export const generateBrandConfirmationEmail = (submission: ContactSubmission): string => {
  const { name, company } = submission;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting BndBox</title>
  <style>
    /* Base styles for email client compatibility */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #2E4053;
    }
    .logo {
      color: #FF9900;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
      background-color: #ffffff;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666666;
      background-color: #f7f7f7;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      background-color: #FF9900;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    h1 {
      color: #2E4053;
      font-size: 22px;
    }
    h2 {
      color: #2E4053;
      font-size: 18px;
    }
    .highlight {
      color: #FF9900;
      font-weight: bold;
    }
    /* Responsive adjustments */
    @media screen and (max-width: 480px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .content {
        padding: 20px 15px !important;
      }
      h1 {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BndBox</div>
    </div>
    <div class="content">
      <h1>Thank You for Contacting BndBox!</h1>
      
      <p>Dear ${name},</p>
      
      <p>We've received your brand inquiry for <span class="highlight">${company}</span> and are excited to connect with you.</p>
      
      <h2>What happens next?</h2>
      
      <p>Our team will review your submission and reach out to you within 1-2 business days to discuss how BndBox can help you find trusted wholesale resellers for your brand.</p>
      
      <p>In the meantime, feel free to explore our <a href="https://bndbox.com/resources">brand resources</a> to learn more about optimizing your wholesale distribution strategy.</p>
      
      <div style="text-align: center;">
        <a href="https://bndbox.com/resources" class="button">Explore Resources</a>
      </div>
      
      <p>If you have any immediate questions, please don't hesitate to contact our support team at <a href="mailto:help@bndbox.com">help@bndbox.com</a>.</p>
      
      <p>Best regards,<br>The BndBox Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} BndBox. All rights reserved.</p>
      <p>
        <a href="https://bndbox.com/privacy">Privacy Policy</a> | 
        <a href="https://bndbox.com/terms">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate a confirmation email template for reseller application submissions
 */
export const generateResellerConfirmationEmail = (submission: ResellerSubmission): string => {
  const { companyName, email } = submission;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for your Reseller Application</title>
  <style>
    /* Base styles for email client compatibility */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #2E4053;
    }
    .logo {
      color: #FF9900;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
      background-color: #ffffff;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666666;
      background-color: #f7f7f7;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      background-color: #FF9900;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .steps {
      background-color: #f7f7f7;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    h1 {
      color: #2E4053;
      font-size: 22px;
    }
    h2 {
      color: #2E4053;
      font-size: 18px;
    }
    .highlight {
      color: #FF9900;
      font-weight: bold;
    }
    /* Responsive adjustments */
    @media screen and (max-width: 480px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .content {
        padding: 20px 15px !important;
      }
      h1 {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BndBox</div>
    </div>
    <div class="content">
      <h1>Thank You for Your Reseller Application!</h1>
      
      <p>Dear ${companyName} Team,</p>
      
      <p>We've received your application to become a verified reseller with BndBox. Thank you for your interest in joining our network!</p>
      
      <h2>What happens next?</h2>
      
      <div class="steps">
        <p><strong>Step 1:</strong> Our verification team will review your application within 1-3 business days.</p>
        <p><strong>Step 2:</strong> You may receive follow-up questions or requests for additional documentation via email (${email}).</p>
        <p><strong>Step 3:</strong> Upon approval, you'll receive access to our network of brand partners and wholesale opportunities.</p>
      </div>
      
      <p>While you wait, you can prepare by reviewing our <a href="https://bndbox.com/reseller-guidelines">Reseller Guidelines</a> to ensure a smooth onboarding process.</p>
      
      <div style="text-align: center;">
        <a href="https://bndbox.com/reseller-guidelines" class="button">View Reseller Guidelines</a>
      </div>
      
      <p>If you have any questions about your application, please contact us at <a href="mailto:reseller-support@bndbox.com">reseller-support@bndbox.com</a>.</p>
      
      <p>Best regards,<br>The BndBox Reseller Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} BndBox. All rights reserved.</p>
      <p>
        <a href="https://bndbox.com/privacy">Privacy Policy</a> | 
        <a href="https://bndbox.com/terms">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate admin notification email for new submissions
 */
export const generateAdminNotificationEmail = (
  submission: ContactSubmission | ResellerSubmission, 
  submissionType: 'brand' | 'reseller'
): string => {
  const isReseller = submissionType === 'reseller';
  const name = isReseller 
    ? (submission as ResellerSubmission).companyName 
    : (submission as ContactSubmission).name;
  const email = submission.email;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New ${isReseller ? 'Reseller Application' : 'Brand Inquiry'}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #2E4053;
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 3px;
    }
    .important {
      background-color: #ffecb3;
      padding: 10px;
      border-radius: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table td {
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    .label {
      font-weight: bold;
      width: 40%;
    }
    .view-button {
      display: inline-block;
      background-color: #FF9900;
      color: white;
      padding: 10px 15px;
      text-decoration: none;
      border-radius: 3px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New ${isReseller ? 'Reseller Application' : 'Brand Inquiry'} Received</h2>
    </div>
    
    <p>A new ${isReseller ? 'reseller application' : 'brand inquiry'} has been submitted:</p>
    
    <div class="important">
      <p><strong>Action required:</strong> Please review and respond within 24 business hours.</p>
    </div>
    
    <table>
      <tr>
        <td class="label">ID:</td>
        <td>${submission.id}</td>
      </tr>
      <tr>
        <td class="label">${isReseller ? 'Company Name' : 'Name'}:</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td class="label">Email:</td>
        <td>${email}</td>
      </tr>
      <tr>
        <td class="label">Submission Time:</td>
        <td>${new Date(submission.createdAt).toLocaleString()}</td>
      </tr>
    </table>
    
    <p>Full details of this submission can be viewed in the admin portal.</p>
    
    <a href="https://bndbox.com/admin" class="view-button">View in Admin Portal</a>
  </div>
</body>
</html>
  `;
};

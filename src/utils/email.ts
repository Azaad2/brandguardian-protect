
import { ContactSubmission } from '@/types/contact';
import { ResellerSubmission } from '@/types/resellerSubmission';

export const sendEmail = async (submission: ContactSubmission | ResellerSubmission): Promise<boolean> => {
  try {
    console.log('Sending email with submission data:', submission);
    
    // Create form data for email service
    let emailContent = '';
    let subject = '';
    
    // Format email content based on submission type
    if ('marketplaces' in submission) {
      // Contact submission
      emailContent = `
        New Contact Form Submission:
        
        Company Name: ${submission.company}
        Contact Person: ${submission.name}
        Email: ${submission.email}
        Marketplaces: ${submission.marketplaces}
        Amazon Link: ${submission.amazonLink || 'N/A'}
        Message: ${submission.message || 'N/A'}
        Timestamp: ${new Date(submission.createdAt).toLocaleString()}
      `;
      subject = `New Contact Form from ${submission.company}`;
    } else {
      // Reseller submission
      emailContent = `
        New Reseller Application:
        
        Business Information:
        Company Name: ${submission.companyName}
        Business Type: ${submission.businessType}
        Business License: ${submission.businessLicense}
        Tax ID: ${submission.taxId}
        
        Marketplace Profiles:
        Amazon Seller ID: ${submission.amazonSellerId || 'N/A'}
        Walmart Seller ID: ${submission.walmartSellerId || 'N/A'}
        eBay Seller ID: ${submission.ebaySellerId || 'N/A'}
        
        Product Categories: ${submission.productCategories.join(', ')}
        
        Sales Performance:
        Sales Volume: ${submission.salesVolume}
        Feedback Score: ${submission.feedbackScore || 'N/A'}
        
        Contact Information:
        Email: ${submission.email}
        Phone: ${submission.phone}
        LinkedIn: ${submission.linkedIn || 'N/A'}
        
        Status: ${submission.status}
        Timestamp: ${new Date(submission.createdAt).toLocaleString()}
      `;
      subject = `New Reseller Application from ${submission.companyName}`;
    }
    
    // Using formsubmit.co as a simple email service
    // To make this work, you need to first activate the email by sending a test submission to:
    // https://formsubmit.co/help@bndbox.com
    
    // Create a simple form data object
    const formData = new FormData();
    formData.append('name', 'companyName' in submission ? submission.companyName : submission.name);
    formData.append('email', submission.email);
    formData.append('message', emailContent);
    formData.append('_subject', subject);
    formData.append('_replyto', submission.email);
    
    const response = await fetch('https://formsubmit.co/ajax/help@bndbox.com', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      console.error('Form submission API error:', response.status, response.statusText);
      const responseText = await response.text();
      console.error('Error response:', responseText);
      return false;
    }
    
    const responseData = await response.json();
    console.log('Form submission API response:', responseData);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

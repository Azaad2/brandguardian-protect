
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
        Wholesale Budget: ${submission.wholesaleBudget}
        
        Contact Information:
        Email: ${submission.email}
        Phone: ${submission.phone}
        LinkedIn: ${submission.linkedIn || 'N/A'}
        
        Status: ${submission.status}
        Timestamp: ${new Date(submission.createdAt).toLocaleString()}
      `;
      subject = `New Reseller Application from ${submission.companyName}`;
    }
    
    // Using EmailJS API instead of formsubmit.co which may have blocked the domain
    const serviceID = 'default_service'; // Replace with actual EmailJS service ID
    const templateID = 'template_bndbox'; // Replace with actual EmailJS template ID
    const userID = 'user_bndboxId'; // Replace with actual EmailJS user ID
    
    const templateParams = {
      to_email: 'help@bndbox.com',
      from_name: 'companyName' in submission ? submission.companyName : submission.name,
      from_email: submission.email,
      subject: subject,
      message: emailContent,
    };
    
    // Alternatively, using a direct server endpoint with a POST request
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: templateParams
      }),
    });
    
    if (!response.ok) {
      console.error('Email API error:', response.status, response.statusText);
      const responseText = await response.text();
      console.error('Error response:', responseText);
      
      // Fallback to a different email service or method if needed
      return await sendEmailFallback(submission);
    }
    
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return await sendEmailFallback(submission);
  }
};

// Fallback email function using a different approach 
const sendEmailFallback = async (submission: ContactSubmission | ResellerSubmission): Promise<boolean> => {
  try {
    console.log('Using fallback email method');
    
    // Create form data
    const formData = new FormData();
    formData.append('_subject', 'companyName' in submission ? 
      `Contact Form: ${submission.company}` : 
      `Reseller Application: ${submission.companyName}`);
    
    formData.append('_replyto', submission.email);
    formData.append('email', submission.email);
    formData.append('message', JSON.stringify(submission, null, 2));
    
    // Using a different email form service (formspree as example)
    const response = await fetch('https://formspree.io/f/help@bndbox.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Fallback email service error:', response.status);
      return false;
    }
    
    console.log('Email sent through fallback method');
    return true;
  } catch (error) {
    console.error('Fallback email error:', error);
    return false;
  }
};

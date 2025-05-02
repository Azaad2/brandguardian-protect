
import { ContactSubmission } from '@/types/contact';
import { ResellerSubmission } from '@/types/resellerSubmission';
import emailjs from '@emailjs/browser';

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
    
    // EmailJS configuration
    const serviceID = 'service_pdxnk4u';
    const templateID = 'template_bndbox';
    const publicKey = 'NEJ-2t7dGMfGCAV_d';
    
    // Set recipient email
    const to_email = 'help@bndbox.com';
    
    // Template parameters for EmailJS
    const templateParams = {
      to_email: to_email,
      from_name: 'marketplaces' in submission ? submission.name : submission.companyName,
      from_email: submission.email,
      subject: subject,
      message: emailContent,
    };
    
    // Initialize EmailJS with public key
    emailjs.init(publicKey);
    
    console.log('EmailJS params:', {
      serviceID,
      templateID,
      params: {
        to_email: templateParams.to_email,
        from_name: templateParams.from_name,
        from_email: templateParams.from_email,
        subject: templateParams.subject,
        message_preview: templateParams.message.substring(0, 100) + '...'
      }
    });
    
    // Try multiple methods to ensure email delivery
    try {
      // Method 1: Direct send via EmailJS
      console.log('Attempting direct EmailJS send...');
      const response = await emailjs.send(serviceID, templateID, templateParams);
      console.log('EmailJS direct send response:', response);
      return true;
    } catch (error1) {
      console.error('EmailJS direct send failed:', error1);
      
      // Method 2: Try REST API approach
      try {
        console.log('Attempting EmailJS REST API method...');
        const restResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceID,
            template_id: templateID,
            user_id: publicKey,
            template_params: templateParams,
          }),
        });
        
        if (restResponse.ok) {
          console.log('EmailJS REST API success:', await restResponse.text());
          return true;
        } else {
          console.error('EmailJS REST API error:', restResponse.status, await restResponse.text());
          throw new Error(`EmailJS REST API error: ${restResponse.status}`);
        }
      } catch (error2) {
        console.error('EmailJS REST API method failed:', error2);
        
        // Method 3: Formspree fallback
        return await sendEmailFallback(submission, emailContent, subject);
      }
    }
  } catch (error) {
    console.error('Error in email sending process:', error);
    return await sendEmailFallback(submission);
  }
};

// Fallback email function using Formspree
const sendEmailFallback = async (
  submission: ContactSubmission | ResellerSubmission, 
  content?: string,
  subject?: string
): Promise<boolean> => {
  try {
    console.log('Using Formspree fallback method');
    
    // Create form data
    const formData = new FormData();
    
    // Add email subject
    const emailSubject = subject || ('marketplaces' in submission ? 
      `Contact Form: ${submission.company}` : 
      `Reseller Application: ${submission.companyName}`);
    
    formData.append('_subject', emailSubject);
    
    // Add reply-to address
    formData.append('_replyto', submission.email);
    formData.append('email', submission.email);
    
    // Add message content
    if (content) {
      formData.append('message', content);
    } else {
      formData.append('message', JSON.stringify(submission, null, 2));
    }
    
    // Include name information
    formData.append('name', 'marketplaces' in submission ? submission.name : submission.companyName);
    
    // Using Formspree with a direct email format
    const formspreeEndpoint = 'https://formspree.io/f/xaygdrqz'; // Using Formspree default endpoint
    
    console.log('Sending to Formspree:', formspreeEndpoint);
    
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Formspree error:', response.status, await response.text());
      return false;
    }
    
    console.log('Email sent through Formspree:', await response.json());
    return true;
  } catch (error) {
    console.error('Formspree fallback error:', error);
    return false;
  }
};

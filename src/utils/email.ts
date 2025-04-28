
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
    
    // EmailJS configuration - using your correct values
    const serviceID = 'service_pdxnk4u'; // Updated to likely default service ID format
    const templateID = 'template_bndbox'; 
    const publicKey = 'NEJ-2t7dGMfGCAV_d'; // Your provided public key
    
    // Properly format recipient email to ensure delivery
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
    
    console.log('Attempting to send email via EmailJS with params:', {
      serviceID,
      templateID,
      templateParams: {
        to_email: templateParams.to_email,
        from_name: templateParams.from_name,
        subject: templateParams.subject
      }
    });
    
    // Send email using EmailJS directly
    try {
      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      return true;
    } catch (emailError) {
      console.error('EmailJS error:', emailError);
      
      // If EmailJS direct method fails, try the REST API approach
      try {
        console.log('Trying EmailJS REST API as fallback');
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
            accessToken: null, // No private key needed for public facing forms
          }),
        });
        
        if (!restResponse.ok) {
          const errorText = await restResponse.text();
          console.error('EmailJS REST API error:', restResponse.status, errorText);
          throw new Error(`EmailJS REST API error: ${restResponse.status}`);
        }
        
        console.log('Email sent successfully via REST API');
        return true;
      } catch (restError) {
        console.error('EmailJS REST API fallback error:', restError);
        
        // If REST API also fails, try FormSpree fallback
        return await sendEmailFallback(submission);
      }
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return await sendEmailFallback(submission);
  }
};

// Fallback email function using Formspree
const sendEmailFallback = async (submission: ContactSubmission | ResellerSubmission): Promise<boolean> => {
  try {
    console.log('Using fallback email method (Formspree)');
    
    // Create form data
    const formData = new FormData();
    
    // Add important form identifier to ensure proper routing
    formData.append('_subject', 'marketplaces' in submission ? 
      `Contact Form: ${submission.company}` : 
      `Reseller Application: ${submission.companyName}`);
    
    formData.append('_replyto', submission.email);
    formData.append('email', submission.email);
    formData.append('message', JSON.stringify(submission, null, 2));
    
    // Using Formspree as a fallback with direct address format
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

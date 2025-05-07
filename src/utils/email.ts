import { ContactSubmission } from '@/types/contact';
import { ResellerSubmission } from '@/types/resellerSubmission';
import { 
  generateBrandConfirmationEmail, 
  generateResellerConfirmationEmail,
  generateAdminNotificationEmail 
} from './emailTemplates';

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
        EIN Number: ${submission.einNumber}
        
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
    
    // 1. Send notification to admin
    const adminNotificationSent = await sendEmailViaFormspree(
      { email: 'help@bndbox.com', name: 'BndBox Admin' },
      generateAdminNotificationEmail(
        submission, 
        'marketplaces' in submission ? 'brand' : 'reseller'
      ),
      subject
    );
    
    if (!adminNotificationSent) {
      console.warn('Failed to send admin notification email');
    }
    
    // 2. Send confirmation email to user
    let confirmationTemplate = '';
    let confirmationSubject = '';
    
    if ('marketplaces' in submission) {
      // Brand confirmation
      confirmationTemplate = generateBrandConfirmationEmail(submission);
      confirmationSubject = "Thank you for contacting BndBox – We've received your request!";
    } else {
      // Reseller confirmation
      confirmationTemplate = generateResellerConfirmationEmail(submission);
      confirmationSubject = "Thank you for your BndBox Reseller Application!";
    }
    
    const confirmationSent = await sendEmailViaFormspree(
      submission,
      confirmationTemplate,
      confirmationSubject,
      true
    );
    
    if (!confirmationSent) {
      console.warn('Failed to send confirmation email');
    }
    
    // 3. Send original notification (for backward compatibility)
    return await sendEmailViaFormspree(submission, emailContent, subject);
    
  } catch (error) {
    console.error('Error in email sending process:', error);
    return false;
  }
};

// Email function using Formspree
const sendEmailViaFormspree = async (
  submission: ContactSubmission | ResellerSubmission | { email: string, name: string }, 
  content?: string,
  subject?: string,
  isHtml: boolean = false
): Promise<boolean> => {
  try {
    console.log('Using Formspree to send email');
    
    // Create form data
    const formData = new FormData();
    
    // Add email subject
    let emailSubject = subject;
    
    // If no subject is provided, generate one based on submission type
    if (!emailSubject) {
      if ('marketplaces' in submission) {
        emailSubject = `Contact Form: ${(submission as ContactSubmission).company}`;
      } else if ('companyName' in submission) {
        emailSubject = `Reseller Application: ${submission.companyName}`;
      } else {
        emailSubject = 'New Submission from BndBox';
      }
    }
    
    formData.append('_subject', emailSubject);
    
    // Add reply-to address
    formData.append('_replyto', submission.email);
    formData.append('email', submission.email);
    
    // Add message content
    if (content) {
      if (isHtml) {
        formData.append('_html', content);
      } else {
        formData.append('message', content);
      }
    } else {
      formData.append('message', JSON.stringify(submission, null, 2));
    }
    
    // Include name information
    let name = '';
    if ('name' in submission) {
      name = submission.name;
    } else if ('companyName' in submission) {
      name = submission.companyName;
    }
    
    formData.append('name', name);
    
    // Using the new valid Formspree endpoint
    const formspreeEndpoint = 'https://formspree.io/f/xblogykb';
    
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
    console.error('Formspree error:', error);
    return false;
  }
};

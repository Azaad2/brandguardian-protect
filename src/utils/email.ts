
import { ContactSubmission } from '@/types/contact';

export const sendEmail = async (submission: ContactSubmission): Promise<boolean> => {
  try {
    console.log('Sending email with submission data:', submission);
    
    // Create form data for email service
    const emailContent = `
      New Contact Form Submission:
      
      Company Name: ${submission.company}
      Contact Person: ${submission.name}
      Email: ${submission.email}
      Marketplaces: ${submission.marketplaces}
      Amazon Link: ${submission.amazonLink || 'N/A'}
      Message: ${submission.message || 'N/A'}
      Timestamp: ${new Date(submission.createdAt).toLocaleString()}
    `;
    
    // Using formsubmit.co as a simple email service
    // To make this work, you need to first activate the email by sending a test submission to:
    // https://formsubmit.co/help@bndbox.com
    const response = await fetch(`https://formsubmit.co/help@bndbox.com`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email,
        message: emailContent,
        _subject: `New Contact Form from ${submission.company}`,
        _replyto: submission.email
      }),
    });
    
    if (!response.ok) {
      console.error('Form submission API error:', response.status, response.statusText);
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

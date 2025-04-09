
import { ContactSubmission } from '@/types/contact';

export const sendEmail = async (submission: ContactSubmission) => {
  try {
    // Create form data for email service
    const emailData = new FormData();
    
    // Email is sent to help@bndbox.com
    const emailContent = `
      New Contact Form Submission:
      
      Company Name: ${submission.company}
      Contact Person: ${submission.name}
      Email: ${submission.email}
      Marketplaces: ${submission.marketplaces}
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
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

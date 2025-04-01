
import { ContactSubmission } from '@/types/contact';

export const sendEmail = async (submission: ContactSubmission) => {
  try {
    // Create form data for email service
    const emailData = new FormData();
    
    // Email is sent to help@bndbox.com
    const emailContent = `
      New Contact Form Submission:
      
      Company Name: ${submission.companyName}
      Contact Person: ${submission.contactPerson}
      Email: ${submission.email}
      Phone: ${submission.phone}
      Product Count: ${submission.productCount}
      Primary Concern: ${submission.primaryConcern}
      Timestamp: ${new Date(submission.timestamp).toLocaleString()}
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
        name: submission.contactPerson,
        email: submission.email,
        message: emailContent,
        _subject: `New Contact Form from ${submission.companyName}`,
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

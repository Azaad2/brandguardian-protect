
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";

// Define a type for form submissions
export type ContactSubmission = {
  id: string;
  timestamp: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productCount: string;
  primaryConcern: string;
};

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productCount: '',
    primaryConcern: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, primaryConcern: value }));
  };
  
  const sendEmail = async (submission: ContactSubmission) => {
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new submission object
    const newSubmission: ContactSubmission = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...formData
    };
    
    // Get existing submissions from localStorage
    const existingSubmissionsJson = localStorage.getItem('contactSubmissions');
    const existingSubmissions: ContactSubmission[] = existingSubmissionsJson 
      ? JSON.parse(existingSubmissionsJson) 
      : [];
    
    // Add the new submission
    const updatedSubmissions = [newSubmission, ...existingSubmissions];
    
    // Save back to localStorage
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    
    // Send email
    const emailSent = await sendEmail(newSubmission);
    
    // Show success toast
    toast({
      title: "Request Submitted!",
      description: emailSent 
        ? "We'll be in touch shortly to discuss how we can protect your brand. A copy has been sent to our team."
        : "We'll be in touch shortly to discuss how we can protect your brand.",
      duration: 5000,
    });
    
    setIsSubmitting(false);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      productCount: '',
      primaryConcern: ''
    });
  };

  return (
    <section className="py-20 gradient-bg px-4" id="contact">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 bg-gray-50">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Protect Your Brand?</h2>
              <p className="text-gray-600 mb-8">
                Join our exclusive beta program and be among the first to experience comprehensive brand protection on Amazon.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Advanced AI Monitoring</h3>
                    <p className="text-sm text-gray-500">24/7 automated surveillance of your listings</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Comprehensive Dashboard</h3>
                    <p className="text-sm text-gray-500">Full visibility into your brand's Amazon presence</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Dedicated Support</h3>
                    <p className="text-sm text-gray-500">Expert guidance from our brand protection specialists</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  "We've seen a 40% reduction in unauthorized listings within the first month of using BrandGuardian."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-medium text-gray-900">Michael Roberts</p>
                    <p className="text-sm text-gray-500">E-commerce Director, TechGear</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName"
                    name="companyName"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input 
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="Full name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productCount">Number of Products on Amazon</Label>
                  <Input 
                    id="productCount"
                    name="productCount"
                    placeholder="Approximate number"
                    value={formData.productCount}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryConcern">Primary Concern</Label>
                  <Select 
                    onValueChange={handleSelectChange} 
                    value={formData.primaryConcern}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary concern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unauthorizedSellers">Unauthorized Sellers</SelectItem>
                      <SelectItem value="counterfeitProducts">Counterfeit Products</SelectItem>
                      <SelectItem value="mapViolations">MAP Violations</SelectItem>
                      <SelectItem value="brandInconsistency">Brand Inconsistency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Early Access"}
                  </Button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Limited spots available for our beta program. Join leading brands already seeing results.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

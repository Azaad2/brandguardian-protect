
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
import { ContactSubmission } from '@/types/contact';
import { sendEmail } from '@/utils/email';

interface ContactFormProps {
  onSubmit: (submission: ContactSubmission) => void;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
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
    
    onSubmit(newSubmission);
  };

  return (
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
  );
};

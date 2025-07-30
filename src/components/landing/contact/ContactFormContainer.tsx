
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { ContactSubmission } from "@/types/contact";
import { sendEmail } from "@/utils/email";
import { ContactFormFields } from "./ContactFormFields";
import { SuccessMessage } from "./SuccessMessage";
import { contactFormSchema, ContactFormValues } from "./FormValidationSchema";

interface ContactFormProps {
  onSubmit: (data: ContactSubmission) => Promise<boolean>;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      marketplaces: "",
      amazonLink: "",
      message: "",
    },
  });

  const handleFormReset = () => {
    setIsSuccess(false);
    form.reset();
  };

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const timestamp = new Date().toISOString();
      
      const submission: ContactSubmission = {
        id: `INQUIRY-${Date.now()}`,
        name: values.name,
        email: values.email,
        company: values.company,
        companyName: values.company, // For Admin.tsx compatibility
        marketplaces: values.marketplaces,
        amazonLink: values.amazonLink || "",
        message: values.message || "",
        createdAt: timestamp,
        timestamp: timestamp, // For Admin.tsx compatibility
        contactPerson: values.name, // For Admin.tsx compatibility
        primaryConcern: values.marketplaces, // Using marketplaces as primaryConcern
        productCount: "N/A" // Default value for Admin.tsx compatibility
      };
      
      // Send email directly 
      const success = await sendEmail(submission);
      
      if (success) {
        toast({
          title: "Thank you for your message!",
          description: "We'll be in touch with you shortly.",
        });
        setIsSuccess(true);
        form.reset();
        
        // Call the onSubmit prop to maintain compatibility
        await onSubmit(submission);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your form. Please try again or contact us directly at help@bndbox.com.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return <SuccessMessage onReset={handleFormReset} />;
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Get Started Free</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 flex-1 flex flex-col">
          <ContactFormFields form={form} isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

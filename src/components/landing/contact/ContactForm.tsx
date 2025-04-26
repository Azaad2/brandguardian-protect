
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ContactSubmission } from "@/types/contact";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCheck } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Please enter your company name.",
  }),
  marketplaces: z.string().min(1, {
    message: "Please select at least one marketplace.",
  }),
  amazonLink: z.string().url({
    message: "Please enter a valid Amazon URL.",
  }).optional().or(z.literal('')),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = ({ onSubmit }: { onSubmit: (data: ContactSubmission) => Promise<boolean> }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      marketplaces: "",
      amazonLink: "",
      message: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
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
      
      console.log("Submitting form data:", submission);
      const success = await onSubmit(submission);
      
      if (success) {
        console.log("Form submitted successfully");
        toast({
          title: "Thank you for your message!",
          description: "We'll be in touch with you shortly.",
        });
        setIsSuccess(true);
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <CheckCheck className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. One of our team members will contact you shortly.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6">Get Started Free</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 flex-1 flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@company.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Brand, Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="marketplaces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketplace(s) You Sell On</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marketplace(s)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="amazon">Amazon</SelectItem>
                    <SelectItem value="walmart">Walmart</SelectItem>
                    <SelectItem value="ebay">eBay</SelectItem>
                    <SelectItem value="amazon_walmart">Amazon & Walmart</SelectItem>
                    <SelectItem value="amazon_ebay">Amazon & eBay</SelectItem>
                    <SelectItem value="walmart_ebay">Walmart & eBay</SelectItem>
                    <SelectItem value="all">All Marketplaces</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amazonLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amazon Store Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.amazon.com/your-store" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us more about your reseller needs..."
                    className="resize-none flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Get Started Free"}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By submitting this form, you agree to our privacy policy and terms of service.
          </p>
        </form>
      </Form>
    </div>
  );
};

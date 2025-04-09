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
import { sendEmail } from "@/utils/email";

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
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = ({ onSubmit }: { onSubmit: (data: ContactSubmission) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      marketplaces: "",
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
        message: values.message,
        createdAt: timestamp,
        timestamp: timestamp, // For Admin.tsx compatibility
        contactPerson: values.name, // For Admin.tsx compatibility
        primaryConcern: values.marketplaces, // Using marketplaces as primaryConcern
        productCount: "N/A" // Default value for Admin.tsx compatibility
      };
      
      // Send email to help@bndbox.com
      await sendEmail(submission);
      
      onSubmit(submission);
      
      toast({
        title: "Form submitted!",
        description: "We'll be in touch with you shortly.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Your form was not submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Input placeholder="you@company.com" {...field} />
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

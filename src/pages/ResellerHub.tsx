import React, { useState } from 'react';
import { Check, ShoppingBag, ShoppingCart, Award, CheckCheck, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { ResellerFormData, BusinessType, ProductCategory, SalesVolume } from '@/types/reseller';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import BndBoxLogo from '@/components/branding/BndBoxLogo';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other'] as const),
  businessLicense: z.string().min(1, 'Business license is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  amazonSellerId: z.string().optional(),
  walmartSellerId: z.string().optional(),
  ebaySellerId: z.string().optional(),
  productCategories: z.array(
    z.enum([
      'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
      'sports', 'automotive', 'health', 'grocery', 'books', 'other'
    ] as const)
  ).min(1, 'Select at least one product category'),
  salesVolume: z.enum([
    'under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m'
  ] as const),
  feedbackScore: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  linkedIn: z.string().optional(),
  termsAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

const ResellerHub = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      businessType: 'individual' as BusinessType,
      businessLicense: '',
      taxId: '',
      amazonSellerId: '',
      walmartSellerId: '',
      ebaySellerId: '',
      productCategories: [] as ProductCategory[],
      salesVolume: 'under_10k' as SalesVolume,
      feedbackScore: '',
      email: '',
      phone: '',
      linkedIn: '',
      termsAgreement: false,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form submission: ', values);
      console.log('Document file:', documentFile);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application submitted!",
        description: "We'll review your information and contact you soon.",
      });
      
      form.reset();
      setSelectedCategories([]);
      setDocumentFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem with your submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      form.setValue('productCategories', newSelection);
      return newSelection;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocumentFile(file);
      toast({
        title: "Document attached",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const removeFile = () => {
    setDocumentFile(null);
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const productCategories: ProductCategory[] = [
    'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
    'sports', 'automotive', 'health', 'grocery', 'books', 'other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-block">
            <BndBoxLogo className="h-10" />
          </Link>
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Network of Trusted Resellers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with top brands and expand your sales channels across major marketplaces.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brandguardian-600" />
                Access to Top Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Partner with reputable brands looking for trusted resellers and gain access to exclusive product lines.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-brandguardian-600" />
                Compliance Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Get the tools and support you need to ensure MAP compliance and brand guideline adherence.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brandguardian-600" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Track your sales performance across multiple marketplaces and optimize your listings for better results.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Verified Reseller with BndBox</h2>
          <p className="text-gray-600 mb-8">
            Partner with top brands and expand your sales channels on Amazon, Walmart, and eBay.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Verification Documents</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {!documentFile ? (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Upload your EIN documents or Resale Certificate
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to 5MB</p>
                        <div className="mt-4">
                          <label
                            htmlFor="document-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandguardian-500"
                          >
                            Select file
                          </label>
                          <input
                            id="document-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{documentFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(documentFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="font-medium text-brandguardian-600 hover:text-brandguardian-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your documents are used to verify your business credentials and are stored securely.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Marketplace Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="amazonSellerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amazon Seller ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Amazon Seller ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="walmartSellerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Walmart Marketplace ID (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Walmart ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ebaySellerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>eBay Seller ID (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your eBay ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="productCategories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-lg font-semibold text-gray-900">
                          Product Categories
                        </FormLabel>
                        <p className="text-sm text-gray-500">
                          Select the categories you specialize in
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {productCategories.map((category) => {
                          const displayName = category
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                          
                          return (
                            <div 
                              key={category}
                              className={`
                                flex items-center p-3 border rounded-md cursor-pointer
                                ${selectedCategories.includes(category) 
                                  ? 'bg-brandguardian-50 border-brandguardian-300' 
                                  : 'border-gray-200 hover:bg-gray-50'
                                }
                              `}
                              onClick={() => toggleCategory(category)}
                            >
                              <div className={`
                                flex-shrink-0 h-5 w-5 border rounded-sm mr-2
                                ${selectedCategories.includes(category) 
                                  ? 'bg-brandguardian-600 border-brandguardian-600' 
                                  : 'border-gray-300'
                                }
                                flex items-center justify-center
                              `}>
                                {selectedCategories.includes(category) && (
                                  <CheckCheck className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm">{displayName}</span>
                            </div>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="salesVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Monthly Sales Volume</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sales volume" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under_10k">Under $10,000</SelectItem>
                            <SelectItem value="10k_50k">$10,000 - $50,000</SelectItem>
                            <SelectItem value="50k_100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k_500k">$100,000 - $500,000</SelectItem>
                            <SelectItem value="500k_1m">$500,000 - $1 million</SelectItem>
                            <SelectItem value="over_1m">Over $1 million</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="feedbackScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Feedback Score (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 98% positive" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkedIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="termsAgreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions, including compliance with brand guidelines
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="bg-gray-50 p-6 rounded-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Process</h3>
                <p className="text-gray-600 mb-0">
                  Once you submit your application, our team will review your credentials and verify your business. 
                  This process typically takes 3-5 business days. Upon approval, you will gain access to our network 
                  of brands seeking trusted resellers.
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Your Application Now"}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Join our network today and start growing your sales with trusted brands.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResellerHub;

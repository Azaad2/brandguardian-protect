
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Amazon, Store, Badge } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { BusinessType, ProductCategory, SalesVolume } from "@/types/reseller";

const formSchema = z.object({
  // Business Information
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  businessType: z.enum(["individual", "corporation", "partnership", "llc", "other"]),
  businessLicense: z.string().min(3, { message: "Business license number is required." }),
  taxId: z.string().min(3, { message: "Tax ID is required." }),
  
  // Marketplace Profiles
  amazonSellerId: z.string().optional(),
  walmartSellerId: z.string().optional(),
  ebaySellerId: z.string().optional(),
  
  // Product Categories
  productCategories: z.array(z.enum([
    "electronics", "beauty", "home_goods", "fashion", "toys", 
    "sports", "automotive", "health", "grocery", "books", "other"
  ])).min(1, { message: "Please select at least one product category." }),
  
  // Sales Performance
  salesVolume: z.enum([
    "under_10k", "10k_50k", "50k_100k", "100k_500k", "500k_1m", "over_1m"
  ]),
  feedbackScore: z.string().optional(),
  
  // Contact Information
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  linkedIn: z.string().optional(),
  
  // Agreement
  termsAgreement: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
});

const salesVolumeLabels: Record<SalesVolume, string> = {
  "under_10k": "Under $10,000",
  "10k_50k": "$10,000 - $50,000",
  "50k_100k": "$50,000 - $100,000",
  "100k_500k": "$100,000 - $500,000",
  "500k_1m": "$500,000 - $1,000,000",
  "over_1m": "Over $1,000,000"
};

const businessTypeLabels: Record<BusinessType, string> = {
  "individual": "Individual / Sole Proprietor",
  "corporation": "Corporation",
  "partnership": "Partnership",
  "llc": "Limited Liability Company (LLC)",
  "other": "Other"
};

const productCategoryLabels: Record<ProductCategory, string> = {
  "electronics": "Electronics",
  "beauty": "Beauty & Personal Care",
  "home_goods": "Home & Kitchen",
  "fashion": "Clothing & Accessories",
  "toys": "Toys & Games",
  "sports": "Sports & Outdoors",
  "automotive": "Automotive",
  "health": "Health & Wellness",
  "grocery": "Grocery & Gourmet Food",
  "books": "Books & Media",
  "other": "Other"
};

const ResellerHub = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "individual",
      productCategories: [],
      salesVolume: "under_10k",
      termsAgreement: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    
    toast.success("Application submitted successfully", {
      description: "We will review your application and get back to you within 3-5 business days.",
    });
    
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <section className="bg-gradient-to-b from-white to-gray-50 py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Reseller Hub</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join Our Network of Trusted Resellers
            </p>
          </div>
        </section>

        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Become a Verified Reseller with BndBox</CardTitle>
                  <CardDescription className="text-base">
                    Partner with top brands and expand your sales channels on Amazon, Walmart, and eBay.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium border-b pb-2">Business Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Your company name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="businessType"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Business Type</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    {Object.entries(businessTypeLabels).map(([value, label]) => (
                                      <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value={value} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{label}</FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="businessLicense"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business License Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Business license number" />
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
                                  <Input {...field} placeholder="Tax ID number" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <h3 className="text-lg font-medium border-b pb-2 pt-4">Marketplace Profiles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="amazonSellerId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amazon Seller ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Amazon seller ID" />
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
                                <FormLabel>Walmart Marketplace ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Walmart seller ID" />
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
                                <FormLabel>eBay Seller ID</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="eBay seller ID" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <h3 className="text-lg font-medium border-b pb-2 pt-4">Product Categories</h3>
                        <FormField
                          control={form.control}
                          name="productCategories"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Select categories you specialize in</FormLabel>
                                <FormDescription>
                                  Select all that apply
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(productCategoryLabels).map(([value, label]) => (
                                  <FormField
                                    key={value}
                                    control={form.control}
                                    name="productCategories"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={value}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(value as ProductCategory)}
                                              onCheckedChange={(checked) => {
                                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                                return checked
                                                  ? field.onChange([...currentValues, value as ProductCategory])
                                                  : field.onChange(
                                                      currentValues.filter((v) => v !== value)
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {label}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <h3 className="text-lg font-medium border-b pb-2 pt-4">Sales Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="salesVolume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Average Monthly Sales Volume</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    {Object.entries(salesVolumeLabels).map(([value, label]) => (
                                      <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value={value} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{label}</FormLabel>
                                      </FormItem>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="feedbackScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Feedback Score</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 98%" />
                                </FormControl>
                                <FormDescription>
                                  If applicable, provide your average feedback score
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <h3 className="text-lg font-medium border-b pb-2 pt-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="your@email.com" />
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
                                  <Input {...field} placeholder="Phone number" />
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
                                <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="LinkedIn URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <h3 className="text-lg font-medium border-b pb-2 pt-4">Agreement</h3>
                        <FormField
                          control={form.control}
                          name="termsAgreement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the terms and conditions, including compliance with brand guidelines.
                                </FormLabel>
                                <FormDescription>
                                  By checking this box, you agree to abide by our reseller policies and brand protection guidelines.
                                </FormDescription>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Verification Process</h4>
                        <p className="text-gray-600">
                          Once you submit your application, our team will review your credentials and verify your business. 
                          This process typically takes 3-5 business days. Upon approval, you will gain access to our 
                          network of brands seeking trusted resellers.
                        </p>
                      </div>

                      <Button type="submit" className="w-full">Submit Your Application Now</Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                  <p className="text-sm text-gray-500">
                    Join our network today and start growing your sales with trusted brands.
                  </p>
                </CardFooter>
              </Card>
            </div>

            <div className="col-span-1">
              <div className="sticky top-32">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-bndbox-600 to-bndbox-800 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Why Partner with Us?</h3>
                    <p className="text-sm opacity-90">
                      Join our network of trusted resellers and grow your business
                    </p>
                  </div>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Access to Top Brands</h4>
                          <p className="text-sm text-gray-600">Partner with reputable brands looking for trusted resellers</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Exclusive Product Access</h4>
                          <p className="text-sm text-gray-600">Get early access to new products and promotions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Compliance Support</h4>
                          <p className="text-sm text-gray-600">Tools to ensure MAP compliance and brand guideline adherence</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Performance Insights</h4>
                          <p className="text-sm text-gray-600">Track your sales performance across multiple marketplaces</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResellerHub;

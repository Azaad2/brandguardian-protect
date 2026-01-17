import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { partnerFormSchema, PartnerFormValues } from './PartnerFormSchema';
import { PartnerType } from './types';
import { CompanyInformationSection } from './sections/CompanyInformationSection';
import { ContactInformationSection } from './sections/ContactInformationSection';
import { AddressSection } from './sections/AddressSection';
import { BrandDetailsSection } from './sections/BrandDetailsSection';
import { RetailerMarketplaceSection } from './sections/RetailerMarketplaceSection';
import { DistributorDetailsSection } from './sections/DistributorDetailsSection';
import { ProductCategoriesSection } from './sections/ProductCategoriesSection';
import { TermsAndSubmitSection } from './sections/TermsAndSubmitSection';
import { usePartnerFormSubmission } from './hooks/usePartnerFormSubmission';

interface PartnerApplicationFormProps {
  partnerType: PartnerType;
  onSubmissionSuccess: (email: string) => void;
}

export function PartnerApplicationForm({ partnerType, onSubmissionSuccess }: PartnerApplicationFormProps) {
  const { isSubmitting, submissionError, submitForm } = usePartnerFormSubmission({
    onSubmissionSuccess,
  });

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      partnerType,
      companyName: '',
      businessType: 'llc',
      einNumber: '',
      websiteUrl: '',
      email: '',
      phone: '',
      contactName: '',
      linkedin: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      brandName: '',
      productCount: undefined,
      annualRevenue: undefined,
      distributionChannels: [],
      lookingFor: [],
      warehouseLocations: [],
      shippingRegions: [],
      minOrderValue: '',
      brandsCarried: [],
      certifications: [],
      storeCount: '',
      amazonStoreLink: '',
      walmartStoreLink: '',
      ebayStoreLink: '',
      monthlySalesVolume: undefined,
      productCategories: [],
      termsAgreement: false,
    },
  });

  const onSubmit = async (values: PartnerFormValues) => {
    await submitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submissionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}

        <CompanyInformationSection form={form} />
        <ContactInformationSection form={form} />
        <AddressSection form={form} />

        {/* Conditional sections based on partner type */}
        {partnerType === 'brand' && <BrandDetailsSection form={form} />}
        {partnerType === 'retailer' && <RetailerMarketplaceSection form={form} />}
        {(partnerType === 'distributor' || partnerType === 'wholesaler') && (
          <DistributorDetailsSection form={form} partnerType={partnerType} />
        )}

        <ProductCategoriesSection form={form} />
        <TermsAndSubmitSection form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}

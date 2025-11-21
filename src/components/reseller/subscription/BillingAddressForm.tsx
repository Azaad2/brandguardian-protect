import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Info, CheckCircle2, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BillingAddressFormProps {
  onSubmit: (address: BillingAddress) => void;
  onBack: () => void;
  isLoading: boolean;
  selectedTier: {
    name: string;
    price: string;
    period: string;
  };
}

export const BillingAddressForm = ({ onSubmit, onBack, isLoading, selectedTier }: BillingAddressFormProps) => {
  const { user } = useAuth();
  const [address, setAddress] = useState<BillingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN'
  });

  // Pre-fill form data from reseller application
  useEffect(() => {
    const prefillData = async () => {
      if (!user) return;

      try {
        // Get reseller application data
        const { data: resellerApp, error } = await supabase
          .from('reseller_applications')
          .select('email, company_name, phone')
          .eq('user_id', user.id)
          .single();

        if (!error && resellerApp) {
          setAddress(prev => ({
            ...prev,
            email: resellerApp.email || user.email || '',
            phone: resellerApp.phone || '',
          }));
        }
      } catch (error) {
        console.error('Error prefilling data:', error);
      }
    };

    prefillData();
  }, [user]);

  const [errors, setErrors] = useState<Partial<BillingAddress>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BillingAddress> = {};

    if (!address.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!address.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone is required';
    if (!address.address.trim()) newErrors.address = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!address.country) newErrors.country = 'Country is required';

    // Email validation
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(address);
    }
  };

  const handleInputChange = (field: keyof BillingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">Plan Selected</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <Circle className="h-5 w-5 text-primary fill-primary" />
          <span className="text-sm font-medium text-primary">Billing Info</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <Circle className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Payment</span>
        </div>
      </div>

      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
        
        <h2 className="text-2xl font-bold mb-2">Billing Information</h2>
        <p className="text-muted-foreground">
          Please provide your billing address for {selectedTier.name} plan ({selectedTier.price}{selectedTier.period})
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>
            This information will be used for billing and invoicing purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TooltipProvider>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This will appear on your invoice</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                <Input
                  id="firstName"
                  value={address.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName" className="mb-2 block">Last Name *</Label>
                <Input
                  id="lastName"
                  value={address.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <TooltipProvider>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>We'll send your invoices and receipts here</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Input
                id="email"
                type="email"
                value={address.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2 block">Phone Number *</Label>
              <Input
                id="phone"
                value={address.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                disabled={isLoading}
                placeholder="+1 234 567 8900"
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <TooltipProvider>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required for payment verification and invoicing</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Input
                id="address"
                value={address.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="mb-2 block">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <Label htmlFor="state" className="mb-2 block">State/Province *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <Label htmlFor="zipCode" className="mb-2 block">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={address.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="country" className="mb-2 block">Country *</Label>
              <Select
                value={address.country}
                onValueChange={(value) => handleInputChange('country', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Secure payment powered by Razorpay
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
